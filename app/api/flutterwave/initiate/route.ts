// app/api/flutterwave/initiate/route.ts
// Initiates a Flutterwave "Standard" hosted checkout (full-page redirect) instead
// of the inline modal. This avoids holding a live iframe connection open in-page,
// which is more resilient to unstable/slow networks that were resetting the
// inline checkout iframe.
import { NextRequest, NextResponse } from "next/server";

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://justservices.pro";

export async function POST(req: NextRequest) {
  try {
    if (!FLW_SECRET_KEY) {
      return NextResponse.json({ error: "Flutterwave is not configured (missing secret key)" }, { status: 500 });
    }
    const { amount, email, name, phone, title, tx_ref } = await req.json();
    if (!amount || !email || !name || !tx_ref) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref,
        amount,
        currency: "NGN",
        redirect_url: `${APP_URL}/api/flutterwave/callback`,
        customer: { email, name, phonenumber: phone || "" },
        customizations: {
          title: "JustServicesPro",
          description: title || "Payment",
        },
      }),
    });

    const data = await res.json();
    if (data.status !== "success" || !data.data?.link) {
      console.error("Flutterwave initiate failed:", data);
      return NextResponse.json({ error: data.message || "Failed to initiate payment" }, { status: 502 });
    }

    return NextResponse.json({ link: data.data.link });
  } catch (e: any) {
    console.error("Flutterwave initiate error:", e?.message);
    return NextResponse.json({ error: "Could not reach Flutterwave. Please try again." }, { status: 500 });
  }
}
