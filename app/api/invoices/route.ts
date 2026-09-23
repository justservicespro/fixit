// app/api/invoices/route.ts
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { sql, ensureInvoicesTable } from "@/lib/db";
import { sendMail, renderInvoiceEmailHtml, ADMIN_NOTIFY_EMAIL, invoiceLink } from "@/lib/mailer";

const row2obj = (r: any) => ({
  id: r.id,
  invoiceNo: r.invoice_no,
  publicId: r.public_id,
  status: r.status,
  issueDate: r.issue_date,
  dueDate: r.due_date,
  clientName: r.client_name,
  clientEmail: r.client_email,
  clientPhone: r.client_phone,
  clientCompany: r.client_company,
  clientAddress: r.client_address,
  sourceType: r.source_type,
  category: r.category,
  items: r.items || [],
  additionalInfo: r.additional_info,
  discountType: r.discount_type,
  discountValue: Number(r.discount_value) || 0,
  otherCharges: r.other_charges || [],
  taxPercent: Number(r.tax_percent) || 0,
  currency: r.currency,
  subtotal: Number(r.subtotal) || 0,
  total: Number(r.total) || 0,
  amountPaid: Number(r.amount_paid) || 0,
  isReceipt: !!r.is_receipt,
  notes: r.notes,
  createdAt: r.created_at,
});

function computeTotals(b: any) {
  const items = Array.isArray(b.items) ? b.items : [];
  const subtotal = items.reduce((a: number, it: any) => a + (Number(it.qty) || 0) * (Number(it.unitPrice) || 0), 0);
  const discountValue = Number(b.discountValue) || 0;
  const discountAmt = b.discountType === "percent" ? (subtotal * discountValue) / 100 : discountValue;
  const charges = Array.isArray(b.otherCharges) ? b.otherCharges : [];
  const chargesTotal = charges.reduce((a: number, c: any) => a + (Number(c.amount) || 0), 0);
  const taxPercent = Number(b.taxPercent) || 0;
  const taxable = Math.max(0, subtotal - discountAmt);
  const taxAmt = (taxable * taxPercent) / 100;
  const total = Math.max(0, taxable + taxAmt + chargesTotal);
  return { subtotal, total, items, charges };
}

export async function GET() {
  await ensureInvoicesTable();
  const rows = await sql`SELECT * FROM invoices ORDER BY created_at DESC`;
  return NextResponse.json(rows.map(row2obj));
}

export async function POST(req: NextRequest) {
  await ensureInvoicesTable();
  const b = await req.json();
  if (!b.clientName || !b.clientEmail) {
    return NextResponse.json({ error: "Client name and email are required" }, { status: 400 });
  }
  const { subtotal, total, items, charges } = computeTotals(b);
  const isReceipt = !!b.isReceipt;
  const status = isReceipt ? "paid" : (b.status || "unpaid");
  const amountPaid = isReceipt ? total : (Number(b.amountPaid) || 0);
  const publicId = randomBytes(12).toString("hex");

  const [row] = await sql`
    INSERT INTO invoices(
      invoice_no, public_id, status, issue_date, due_date,
      client_name, client_email, client_phone, client_company, client_address,
      source_type, category, items, additional_info,
      discount_type, discount_value, other_charges, tax_percent,
      currency, subtotal, total, amount_paid, is_receipt, notes
    ) VALUES (
      '', ${publicId}, ${status}, ${b.issueDate || ""}, ${b.dueDate || ""},
      ${b.clientName}, ${b.clientEmail}, ${b.clientPhone || ""}, ${b.clientCompany || ""}, ${b.clientAddress || ""},
      ${b.sourceType || "service"}, ${b.category || ""}, ${JSON.stringify(items)}, ${b.additionalInfo || ""},
      ${b.discountType || "fixed"}, ${Number(b.discountValue) || 0}, ${JSON.stringify(charges)}, ${Number(b.taxPercent) || 0},
      ${b.currency || "NGN"}, ${subtotal}, ${total}, ${amountPaid}, ${isReceipt}, ${b.notes || ""}
    ) RETURNING id, public_id, created_at`;

  const invoiceNo = `JSP-INV-${String(row.id).padStart(5, "0")}`;
  await sql`UPDATE invoices SET invoice_no=${invoiceNo} WHERE id=${row.id}`;

  const forEmail = {
    invoiceNo,
    publicId: row.public_id,
    status,
    isReceipt,
    issueDate: b.issueDate || "",
    dueDate: b.dueDate || "",
    clientName: b.clientName,
    clientEmail: b.clientEmail,
    clientPhone: b.clientPhone || "",
    clientCompany: b.clientCompany || "",
    clientAddress: b.clientAddress || "",
    category: b.category || "",
    items,
    additionalInfo: b.additionalInfo || "",
    discountType: b.discountType || "fixed",
    discountValue: Number(b.discountValue) || 0,
    otherCharges: charges,
    taxPercent: Number(b.taxPercent) || 0,
    currency: b.currency || "NGN",
    subtotal,
    total,
    amountPaid,
    notes: b.notes || "",
  };

  // Always auto-notify the admin inbox on creation. Never blocks the response.
  try {
    await sendMail({
      to: ADMIN_NOTIFY_EMAIL,
      subject: `New Invoice Created — ${invoiceNo} (${forEmail.clientName})`,
      html: renderInvoiceEmailHtml(forEmail, { forAdmin: true }),
      fromName: "JSP Invoices",
    });
  } catch (e: any) {
    console.error("Admin invoice notify failed:", e?.message);
  }

  return NextResponse.json({ id: row.id, invoiceNo, publicId: row.public_id, link: invoiceLink(row.public_id) });
}
