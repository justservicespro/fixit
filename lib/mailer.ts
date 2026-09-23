// lib/mailer.ts
// Shared SMTP transporter + invoice email template used by the /api/invoices*
// routes. Mirrors the same env-var fallback chain as app/api/notify/route.ts
// and app/api/email/route.ts so it works with whatever SMTP_* / GMAIL_* /
// EMAIL_* variables are already configured in Vercel — no new env vars needed.
import nodemailer from "nodemailer";

export const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || "info@justservices.pro";
const SMTP_USER = process.env.SMTP_USER || process.env.GMAIL_USER || process.env.EMAIL_USER || ADMIN_NOTIFY_EMAIL;
const SMTP_PASS = process.env.SMTP_PASS || process.env.GMAIL_PASS || process.env.EMAIL_PASS || "";
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465", 10);
const SMTP_SECURE = SMTP_PORT === 465;

let _transporter: nodemailer.Transporter | null = null;
function getTransporter() {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      requireTLS: !SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return _transporter;
}

export async function sendMail(opts: { to: string; cc?: string; subject: string; html: string; fromName?: string; replyTo?: string }) {
  if (!SMTP_PASS) throw new Error("SMTP not configured — SMTP_PASS missing");
  const transporter = getTransporter();
  return transporter.sendMail({
    from: `"${opts.fromName || "JustServicesPro"}" <${SMTP_USER}>`,
    to: opts.to,
    cc: opts.cc,
    subject: opts.subject,
    html: opts.html,
    replyTo: opts.replyTo || ADMIN_NOTIFY_EMAIL,
  });
}

export type InvoiceItem = { description: string; qty: number; unitPrice: number };
export type InvoiceCharge = { label: string; amount: number };

export type InvoiceForEmail = {
  invoiceNo: string;
  publicId: string;
  status: string;
  isReceipt?: boolean;
  issueDate: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany: string;
  clientAddress: string;
  category: string;
  items: InvoiceItem[];
  additionalInfo: string;
  discountType: string;
  discountValue: number;
  otherCharges: InvoiceCharge[];
  taxPercent: number;
  currency: string;
  subtotal: number;
  total: number;
  amountPaid: number;
  notes: string;
};

const fmt = (n: number, currency: string) =>
  `${currency === "NGN" ? "₦" : currency + " "}${(Number(n) || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function invoiceLink(publicId: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://justservices.pro";
  return `${base.replace(/\/$/, "")}/invoice/${publicId}`;
}

export function renderInvoiceEmailHtml(inv: InvoiceForEmail, opts?: { forAdmin?: boolean }) {
  const rows = inv.items
    .map(
      (it) =>
        `<tr><td style="padding:8px 6px;border-bottom:1px solid #E2E8F0">${it.description || ""}</td><td style="padding:8px 6px;border-bottom:1px solid #E2E8F0;text-align:center">${it.qty}</td><td style="padding:8px 6px;border-bottom:1px solid #E2E8F0;text-align:right">${fmt(it.unitPrice, inv.currency)}</td><td style="padding:8px 6px;border-bottom:1px solid #E2E8F0;text-align:right">${fmt(it.qty * it.unitPrice, inv.currency)}</td></tr>`
    )
    .join("");
  const chargesRows = (inv.otherCharges || [])
    .map(
      (c) =>
        `<tr><td colspan="3" style="padding:4px 6px;text-align:right;color:#64748B">${c.label}</td><td style="padding:4px 6px;text-align:right">${fmt(c.amount, inv.currency)}</td></tr>`
    )
    .join("");
  const discountAmt =
    inv.discountType === "percent" ? (inv.subtotal * (inv.discountValue || 0)) / 100 : inv.discountValue || 0;
  const link = invoiceLink(inv.publicId);
  const balance = inv.total - (inv.amountPaid || 0);
  return `
<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;background:#F8FAFF">
  <div style="background:linear-gradient(135deg,#071428,#1A4A8A);padding:24px 28px;border-radius:12px 12px 0 0;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:18px;font-weight:800">JustServicesPro</h1>
    <p style="color:rgba(255,255,255,0.55);margin:2px 0 0;font-size:11px">... connecting opportunities!</p>
  </div>
  <div style="background:#fff;padding:28px 32px;border:1px solid #E2E8F0;border-top:none">
    <h2 style="color:#0F172A;font-size:16px;margin:0 0 4px">${opts?.forAdmin ? "New " + (inv.isReceipt ? "Receipt" : "Invoice") + " Created" : (inv.isReceipt ? "Receipt" : "Invoice")} ${inv.invoiceNo}</h2>
    <p style="color:#64748B;font-size:12px;margin:0 0 18px">Issue date: ${inv.issueDate || "—"} &nbsp;·&nbsp; Due: ${inv.dueDate || "—"} &nbsp;·&nbsp; Status: <strong style="text-transform:uppercase">${inv.status}</strong></p>
    <table style="width:100%;font-size:12px;color:#334155;margin-bottom:16px">
      <tr><td style="vertical-align:top;width:50%"><strong>Billed to</strong><br/>${inv.clientName}${inv.clientCompany ? "<br/>" + inv.clientCompany : ""}<br/>${inv.clientEmail}${inv.clientPhone ? "<br/>" + inv.clientPhone : ""}${inv.clientAddress ? "<br/>" + inv.clientAddress : ""}</td>
      <td style="vertical-align:top"><strong>For</strong><br/>${inv.category || "—"}</td></tr>
    </table>
    <table style="width:100%;border-collapse:collapse;font-size:12px;color:#334155">
      <thead><tr style="background:#F1F5F9"><th style="padding:8px 6px;text-align:left">Description</th><th style="padding:8px 6px">Qty</th><th style="padding:8px 6px;text-align:right">Unit Price</th><th style="padding:8px 6px;text-align:right">Amount</th></tr></thead>
      <tbody>${rows}
        <tr><td colspan="3" style="padding:8px 6px;text-align:right;color:#64748B">Subtotal</td><td style="padding:8px 6px;text-align:right">${fmt(inv.subtotal, inv.currency)}</td></tr>
        ${discountAmt ? `<tr><td colspan="3" style="padding:4px 6px;text-align:right;color:#64748B">Discount</td><td style="padding:4px 6px;text-align:right">-${fmt(discountAmt, inv.currency)}</td></tr>` : ""}
        ${chargesRows}
        ${inv.taxPercent ? `<tr><td colspan="3" style="padding:4px 6px;text-align:right;color:#64748B">Tax (${inv.taxPercent}%)</td><td style="padding:4px 6px;text-align:right">${fmt(((inv.subtotal - discountAmt) * inv.taxPercent) / 100, inv.currency)}</td></tr>` : ""}
        <tr><td colspan="3" style="padding:10px 6px;text-align:right;font-weight:800;color:#0F172A;border-top:2px solid #0F172A">Total</td><td style="padding:10px 6px;text-align:right;font-weight:800;color:#0F172A;border-top:2px solid #0F172A">${fmt(inv.total, inv.currency)}</td></tr>
        ${inv.amountPaid ? `<tr><td colspan="3" style="padding:4px 6px;text-align:right;color:#10B981">Amount Paid</td><td style="padding:4px 6px;text-align:right;color:#10B981">${fmt(inv.amountPaid, inv.currency)}</td></tr><tr><td colspan="3" style="padding:4px 6px;text-align:right;font-weight:700">Balance Due</td><td style="padding:4px 6px;text-align:right;font-weight:700">${fmt(balance, inv.currency)}</td></tr>` : ""}
      </tbody>
    </table>
    ${inv.additionalInfo ? `<p style="font-size:12px;color:#334155;margin:16px 0 0"><strong>Additional info:</strong> ${inv.additionalInfo}</p>` : ""}
    ${inv.notes ? `<p style="font-size:12px;color:#334155;margin:8px 0 0"><strong>Notes:</strong> ${inv.notes}</p>` : ""}
    <div style="text-align:center;margin:26px 0 4px">
      <a href="${link}" style="background:linear-gradient(135deg,#2563EB,#1A4A8A);color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:12px 26px;border-radius:8px;display:inline-block">View / Print ${inv.isReceipt ? "Receipt" : "Invoice"}</a>
    </div>
  </div>
  <p style="text-align:center;color:#94A3B8;font-size:10px;padding:12px 0;margin:0">
    JustServicesPro Management and Consulting Ltd · RC: 7965265 · Abuja, Nigeria<br/>
    info@justservices.pro · +234 807 992 6755
  </p>
</div>`;
}
