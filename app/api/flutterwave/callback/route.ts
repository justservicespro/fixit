// app/api/flutterwave/callback/route.ts
// Flutterwave redirects the browser here after the hosted checkout completes.
// We verify the transaction server-side (never trust the redirect query params
// alone — they can be spoofed), then send the user to a friendly result page.
import { NextRequest, NextResponse } from "next/server";

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://justservices.pro";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get("status");
  const transactionId = searchParams.get("transaction_id");
  const txRef = searchParams.get("tx_ref");

  if (status === "cancelled" || !transactionId) {
    return NextResponse.redirect(`${APP_URL}/#payment-cancelled`);
  }

  try {
    const verifyRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      { headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` } }
    );
    const verifyData = await verifyRes.json();

    const isSuccessful =
      verifyData.status === "success" &&
      verifyData.data?.status === "successful" &&
      verifyData.data?.tx_ref === txRef;

    if (isSuccessful) {
      // Notify admin + customer via the existing notify route
      const amount = verifyData.data.amount;
      const email = verifyData.data.customer?.email;
      const name = verifyData.data.customer?.name;
      try {
        await fetch(`${APP_URL}/api/notify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: `💳 Payment Received — ${name} — ₦${amount?.toLocaleString()}`,
            body: `Flutterwave payment successful (redirect flow):\n\nName: ${name}\nEmail: ${email}\nAmount: ₦${amount?.toLocaleString()}\nRef: ${txRef}\nGateway: Flutterwave (Standard/redirect)`,
          }),
        });
        if (email) {
          await fetch(`${APP_URL}/api/notify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subject: "✅ Payment Confirmed — JustServicesPro",
              body: `Hi ${name},\n\nYour payment of ₦${amount?.toLocaleString()} has been received.\n\nRef: ${txRef}\n\nOur team will contact you within 2 hours.\n\nJustServicesPro Team`,
              to: email,
              sendToUser: true,
            }),
          });
        }
      } catch (e) {
        console.error("Notify after Flutterwave redirect payment failed:", e);
      }
      return NextResponse.redirect(`${APP_URL}/#payment-success`);
    }

    console.error("Flutterwave verify mismatch:", verifyData);
    return NextResponse.redirect(`${APP_URL}/#payment-failed`);
  } catch (e: any) {
    console.error("Flutterwave verify error:", e?.message);
    return NextResponse.redirect(`${APP_URL}/#payment-failed`);
  }
}
