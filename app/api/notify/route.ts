// app/api/notify/route.ts
// Uses the same SMTP credentials already configured in Vercel for existing email route
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const ADMIN_EMAIL = "info@justservices.pro";
// Unified fallback chain so this route works with whichever var names are set in Vercel
const SMTP_USER = process.env.SMTP_USER || process.env.GMAIL_USER || process.env.EMAIL_USER || ADMIN_EMAIL;
const SMTP_PASS = process.env.SMTP_PASS || process.env.GMAIL_PASS || process.env.EMAIL_PASS || "";
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465", 10);
// Port 465 = implicit TLS (secure:true). Port 587/25 = STARTTLS (secure:false).
// Previously this was hardcoded to secure:true regardless of port, which breaks
// the handshake if Vercel's SMTP_PORT is set to 587 — likely why quote-form
// emails were silently failing to send.
const SMTP_SECURE = SMTP_PORT === 465;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  requireTLS: !SMTP_SECURE,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

const html = (subject: string, body: string) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#F8FAFF">
  <div style="background:linear-gradient(135deg,#071428,#1A4A8A);padding:24px 28px;border-radius:12px 12px 0 0;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:18px;font-weight:800">JustServicesPro</h1>
    <p style="color:rgba(255,255,255,0.5);margin:2px 0 0;font-size:11px">... connecting opportunities!</p>
  </div>
  <div style="background:#fff;padding:28px 32px;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 12px 12px">
    <h2 style="color:#0F172A;font-size:15px;margin:0 0 14px">${subject}</h2>
    <pre style="font-family:Arial,sans-serif;white-space:pre-wrap;color:#334155;font-size:13px;line-height:1.8;margin:0">${body}</pre>
  </div>
  <p style="text-align:center;color:#94A3B8;font-size:10px;padding:12px 0;margin:0">
    JustServicesPro Management and Consulting Ltd · RC: 7965265 · Abuja, Nigeria<br/>
    info@justservices.pro · +234 807 992 6755
  </p>
</div>`;

// GET /api/notify — diagnostic endpoint. Never returns secret values, only
// whether they're present and what host/port/secure combo will be used.
export async function GET() {
  return NextResponse.json({
    smtpHostSet: !!SMTP_HOST,
    smtpHost: SMTP_HOST,
    smtpPort: SMTP_PORT,
    smtpSecure: SMTP_SECURE,
    smtpUserSet: !!SMTP_USER,
    smtpUserMasked: SMTP_USER ? SMTP_USER.replace(/(.{2}).+(@.+)/, "$1***$2") : null,
    smtpPassSet: !!SMTP_PASS,
  });
}

export async function POST(req: NextRequest) {
  try {
    if (!SMTP_PASS) {
      console.error("Email error: SMTP_PASS is not set in environment");
      return NextResponse.json({ success: false, error: "SMTP not configured — SMTP_PASS missing" }, { status: 200 });
    }
    const { subject, body, replyTo, to, sendToUser } = await req.json();
    if (!subject || !body) return NextResponse.json({ error: "Missing subject or body" }, { status: 400 });

    const mail = sendToUser && to
      ? { from: `"JustServicesPro" <${SMTP_USER}>`, to, subject, text: body, html: html(subject, body), replyTo: ADMIN_EMAIL }
      : { from: `"JSP Notifications" <${SMTP_USER}>`, to: ADMIN_EMAIL, subject, text: body, html: html(subject, body), replyTo: replyTo || ADMIN_EMAIL };

    const info = await transporter.sendMail(mail);
    console.log("Email sent:", info.messageId, "->", mail.to);
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (e: any) {
    // Log full error server-side (visible in Vercel function logs) and surface
    // a useful message to the client instead of a silent generic failure.
    console.error("Email error:", e?.code, e?.responseCode, e?.message);
    return NextResponse.json(
      { success: false, error: e?.message || "Unknown email error", code: e?.code },
      { status: 200 }
    );
  }
}
