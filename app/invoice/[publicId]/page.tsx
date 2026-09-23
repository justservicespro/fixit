// app/invoice/[publicId]/page.tsx
// Public, unlisted invoice/receipt view. Reachable only by the random
// public_id link (not the sequential internal id), so it's safe to share
// with clients over email/WhatsApp without exposing other invoices.
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { sql, ensureInvoicesTable } from "@/lib/db";
import { C, CAC_NAME, CAC_RC, PHONE, EMAIL, SERVICES_LIST, PRODUCTS_DATA } from "@/lib/constants";
import PrintButton from "./PrintButton";

export const metadata: Metadata = { title: "Invoice — JustServicesPro", robots: { index: false, follow: false } };

type InvoiceRow = {
  id: number; invoice_no: string; public_id: string; status: string; is_receipt: boolean; issue_date: string; due_date: string;
  client_name: string; client_email: string; client_phone: string; client_company: string; client_address: string;
  category: string; items: { description: string; qty: number; unitPrice: number }[];
  additional_info: string; discount_type: string; discount_value: string; other_charges: { label: string; amount: number }[];
  tax_percent: string; currency: string; subtotal: string; total: string; amount_paid: string; notes: string; created_at: string;
};

async function getInvoice(publicId: string): Promise<InvoiceRow | null> {
  try {
    await ensureInvoicesTable();
    const rows = await sql`SELECT * FROM invoices WHERE public_id=${publicId}`;
    return (rows[0] as InvoiceRow) || null;
  } catch {
    return null;
  }
}

const fmt = (n: number | string, currency: string) => {
  const v = Number(n) || 0;
  return `${currency === "NGN" ? "₦" : currency + " "}${v.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default async function InvoicePublicPage({ params }: { params: { publicId: string } }) {
  const inv = await getInvoice(params.publicId);
  if (!inv) notFound();

  const items = inv.items || [];
  const currency = inv.currency || "NGN";
  const subtotal = Number(inv.subtotal) || 0;
  const discountValue = Number(inv.discount_value) || 0;
  const discountAmt = inv.discount_type === "percent" ? (subtotal * discountValue) / 100 : discountValue;
  const charges = inv.other_charges || [];
  const chargesTotal = charges.reduce((a, c) => a + (Number(c.amount) || 0), 0);
  const taxPercent = Number(inv.tax_percent) || 0;
  const taxAmt = ((subtotal - discountAmt) * taxPercent) / 100;
  const total = Number(inv.total) || 0;
  const amountPaid = Number(inv.amount_paid) || 0;
  const balance = total - amountPaid;
  const isPaid = inv.status === "paid";
  const isReceipt = !!inv.is_receipt;
  const docLabel = isReceipt ? "RECEIPT" : "INVOICE";

  return (
    <>
      <PrintButton />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print { .no-print{display:none!important} body{background:#fff!important} }
        body{background:${C.offWht}}
      `,
        }}
      />
      <div style={{ maxWidth: 820, margin: "32px auto", background: "#fff", borderRadius: 14, boxShadow: "0 10px 40px rgba(11,30,61,0.12)", padding: "clamp(24px,4vw,56px)", position: "relative", overflow: "hidden" }}>
        {isPaid && (
          <img
            src="/paid-stamp.png"
            alt="Paid"
            style={{ position: "absolute", top: 140, right: 40, width: 180, transform: "rotate(-14deg)", mixBlendMode: "multiply", opacity: 0.9, pointerEvents: "none" }}
          />
        )}

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 28, borderBottom: `2px solid ${C.border}`, paddingBottom: 24 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <img src="/icon.png" alt="JSP" style={{ width: 56, height: 56, objectFit: "contain" }} />
            <div>
              <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 800, fontSize: 18, color: C.dark }}>{CAC_NAME}</div>
              <div style={{ fontSize: 12, color: C.slate }}>RC: {CAC_RC} · Abuja, Nigeria</div>
              <div style={{ fontSize: 12, color: C.slate }}>{EMAIL} · {PHONE}</div>
            </div>
          </div>
          <div style={{ textAlign: "right" as const }}>
            <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 800, fontSize: 26, color: C.navy, letterSpacing: "0.04em" }}>{docLabel}</div>
            <div style={{ fontSize: 13, color: C.slate, marginTop: 4 }}>{inv.invoice_no}</div>
            <div
              style={{
                display: "inline-block", marginTop: 8, fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" as const,
                padding: "4px 12px", borderRadius: 20, color: "#fff",
                background: inv.status === "paid" ? C.success : inv.status === "overdue" ? C.danger : inv.status === "partial" ? C.warn : C.slate,
              }}
            >
              {inv.status}
            </div>
            {isReceipt && <div style={{ fontSize: 11, color: C.success, fontWeight: 700, marginTop: 6 }}>✓ Payment received in full</div>}
          </div>
        </div>

        {/* Meta + Bill To */}
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.slateL, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>Billed To</div>
            <div style={{ fontWeight: 700, color: C.dark, fontSize: 14 }}>{inv.client_name}</div>
            {inv.client_company && <div style={{ fontSize: 13, color: C.slate }}>{inv.client_company}</div>}
            <div style={{ fontSize: 13, color: C.slate }}>{inv.client_email}</div>
            {inv.client_phone && <div style={{ fontSize: 13, color: C.slate }}>{inv.client_phone}</div>}
            {inv.client_address && <div style={{ fontSize: 13, color: C.slate, maxWidth: 260 }}>{inv.client_address}</div>}
          </div>
          <div style={{ textAlign: "right" as const }}>
            <div style={{ fontSize: 13, color: C.slate, marginBottom: 4 }}><strong style={{ color: C.dark }}>Issue Date:</strong> {inv.issue_date || "—"}</div>
            <div style={{ fontSize: 13, color: C.slate, marginBottom: 4 }}><strong style={{ color: C.dark }}>Due Date:</strong> {inv.due_date || "—"}</div>
            {inv.category && <div style={{ fontSize: 13, color: C.slate }}><strong style={{ color: C.dark }}>For:</strong> {inv.category}</div>}
          </div>
        </div>

        {/* Items table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8 }}>
          <thead>
            <tr style={{ background: C.offWht }}>
              <th style={{ textAlign: "left", padding: "10px 8px", fontSize: 11, color: C.slate, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Description</th>
              <th style={{ padding: "10px 8px", fontSize: 11, color: C.slate, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Qty</th>
              <th style={{ textAlign: "right", padding: "10px 8px", fontSize: 11, color: C.slate, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Unit Price</th>
              <th style={{ textAlign: "right", padding: "10px 8px", fontSize: 11, color: C.slate, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "10px 8px", fontSize: 13, color: C.dark }}>{it.description}</td>
                <td style={{ padding: "10px 8px", fontSize: 13, color: C.dark, textAlign: "center" as const }}>{it.qty}</td>
                <td style={{ padding: "10px 8px", fontSize: 13, color: C.dark, textAlign: "right" as const }}>{fmt(it.unitPrice, currency)}</td>
                <td style={{ padding: "10px 8px", fontSize: 13, color: C.dark, textAlign: "right" as const }}>{fmt(it.qty * it.unitPrice, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
          <div style={{ width: 280 }}>
            <Row label="Subtotal" value={fmt(subtotal, currency)} />
            {discountAmt > 0 && <Row label={`Discount${inv.discount_type === "percent" ? ` (${discountValue}%)` : ""}`} value={`-${fmt(discountAmt, currency)}`} />}
            {charges.map((c, i) => (
              <Row key={i} label={c.label || "Other charge"} value={fmt(c.amount, currency)} />
            ))}
            {taxPercent > 0 && <Row label={`Tax (${taxPercent}%)`} value={fmt(taxAmt, currency)} />}
            <div style={{ borderTop: `2px solid ${C.dark}`, marginTop: 6, paddingTop: 8 }}>
              <Row label="Total" value={fmt(total, currency)} bold />
            </div>
            {amountPaid > 0 && (
              <>
                <Row label="Amount Paid" value={fmt(amountPaid, currency)} color={C.success} />
                <Row label="Balance Due" value={fmt(balance, currency)} bold />
              </>
            )}
          </div>
        </div>

        {(inv.additional_info || inv.notes) && (
          <div style={{ marginBottom: 28 }}>
            {inv.additional_info && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.slateL, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 4 }}>Additional Info</div>
                <div style={{ fontSize: 13, color: C.slate, lineHeight: 1.7, whiteSpace: "pre-wrap" as const }}>{inv.additional_info}</div>
              </div>
            )}
            {inv.notes && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.slateL, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 4 }}>Notes / Payment Terms</div>
                <div style={{ fontSize: 13, color: C.slate, lineHeight: 1.7, whiteSpace: "pre-wrap" as const }}>{inv.notes}</div>
              </div>
            )}
          </div>
        )}

        {/* Signature */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 40 }}>
          <div style={{ textAlign: "center" as const }}>
            <img src="/signature.png" alt="Authorized signature" style={{ height: 60, objectFit: "contain" }} />
            <div style={{ borderTop: `1px solid ${C.dark}`, paddingTop: 6, marginTop: 2, fontSize: 12, color: C.slate, minWidth: 180 }}>Authorized Signature — {CAC_NAME}</div>
          </div>
        </div>

        <div style={{ textAlign: "center" as const, marginTop: 32, fontSize: 11, color: C.slateL }}>
          Thank you for your business. Questions about this {isReceipt ? "receipt" : "invoice"}? Contact {EMAIL} or {PHONE}.
        </div>

        {/* Footer sitemap — main site first, then services & products */}
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
          <div style={{ textAlign: "center" as const, marginBottom: 16 }}>
            <a href="https://justservices.pro" style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 800, fontSize: 15, color: C.navy, textDecoration: "none" }}>justservices.pro</a>
            <div style={{ fontSize: 10, color: C.slateL, marginTop: 2 }}>Business Registration · Compliance · Consulting — Abuja, Nigeria</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.slateL, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 8, textAlign: "center" as const }}>Our Services</div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, justifyContent: "center", gap: "3px 10px" }}>
                {SERVICES_LIST.map((s: any, i: number) => (
                  <span key={i} style={{ fontSize: 10, color: C.slate }}>{s.title}{i < SERVICES_LIST.length - 1 ? " ·" : ""}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.slateL, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 8, textAlign: "center" as const }}>Our Products</div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, justifyContent: "center", gap: "3px 10px" }}>
                {PRODUCTS_DATA.map((p: any, i: number) => (
                  <a key={i} href={p.url} style={{ fontSize: 10, color: C.blueLt, textDecoration: "none" }}>{p.name}{i < PRODUCTS_DATA.length - 1 ? " ·" : ""}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const Row = ({ label, value, bold = false, color }: { label: string; value: string; bold?: boolean; color?: string }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: bold ? 15 : 13, fontWeight: bold ? 800 : 500, color: color || (bold ? C.dark : C.slate) }}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);
