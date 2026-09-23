// app/api/webhook/route.ts
//
// Flutterwave Webhook Relay
// --------------------------
// Your Flutterwave account is shared across multiple JustServicesPro
// products, and Flutterwave only allows ONE webhook URL per account. That
// URL is: https://justservices.pro/api/webhook
//
// This relay inspects every incoming Flutterwave event and forwards only the
// matching product's events to that product's own webhook, unmodified. It
// stays deliberately "dumb" — no database access, no email sending, no
// product-specific logic — it only routes by tx_ref prefix. Adding a new
// product later means adding one line to ROUTES below, nothing else.
//
// Setup (already done in Flutterwave Dashboard, do not change):
//   Webhook URL: https://justservices.pro/api/webhook
//   Secret Hash: set once, shared across all downstream products
//
// Each downstream product verifies the forwarded `verif-hash` header itself
// against its own copy of that same Secret Hash — this relay never needs to
// know the secret, it just forwards the header through untouched.

import { NextRequest, NextResponse } from "next/server";

// Add one entry per product sharing this Flutterwave account.
const ROUTES: { prefix: string; url: string }[] = [
  { prefix: "AAH-", url: "https://api.appaholic.justservices.pro/api/webhook" },
  // { prefix: "XYZ-", url: "https://api.otherproduct.justservices.pro/api/webhook" },
];

export async function POST(req: NextRequest) {
  // Read the body once, up front — Flutterwave retries aggressively if this
  // handler is slow, so we want to acknowledge quickly regardless of what
  // happens with the downstream forward.
  const bodyText = await req.text();
  const verifHash = req.headers.get("verif-hash") || "";

  let txRef: string | undefined;
  try {
    const parsed = JSON.parse(bodyText);
    txRef = parsed?.data?.tx_ref;
  } catch {
    console.error("Webhook relay: could not parse incoming body as JSON");
  }

  const match = ROUTES.find((r) => txRef && txRef.startsWith(r.prefix));

  if (!match) {
    console.log("Webhook relay: no matching product for tx_ref:", txRef);
    // Acknowledge anyway — this may just be a JustServicesPro-native
    // transaction (not prefixed for a sub-product), which is expected and
    // not an error.
    return NextResponse.json({ ok: true });
  }

  try {
    const forwardRes = await fetch(match.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "verif-hash": verifHash,
      },
      body: bodyText,
    });
    if (!forwardRes.ok) {
      console.error(
        `Webhook relay: downstream ${match.url} responded with ${forwardRes.status} for tx_ref ${txRef}`
      );
    } else {
      console.log(`Webhook relay: forwarded tx_ref ${txRef} to ${match.url}`);
    }
  } catch (err: any) {
    // A failed relay means a payment succeeded on Flutterwave's side but the
    // downstream product never found out — this is worth real monitoring,
    // not just a console log, if these start happening often.
    console.error(`Webhook relay: forwarding to ${match.url} failed:`, err?.message);
  }

  return NextResponse.json({ ok: true });
}
