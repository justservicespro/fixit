// app/api/invoices/send/route.ts
// Emails an existing invoice to the client (and optionally CCs the admin).
// WhatsApp sending needs no server route — the admin UI opens a wa.me link
// with the invoice link pre-filled, same pattern already used for bookings.
import { NextRequest, NextResponse } from "next/server";
import { sql, ensureInvoicesTable } from "@/lib/db";
import { sendMail, renderInvoiceEmailHtml, ADMIN_NOTIFY_EMAIL, InvoiceForEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  await ensureInvoicesTable();
  const { id, to, cc } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing invoice id" }, { status: 400 });

  const [r] = await sql`SELECT * FROM invoices WHERE id=${Number(id)}`;
  if (!r) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  const inv: InvoiceForEmail = {
    invoiceNo: r.invoice_no,
    publicId: r.public_id,
    status: r.status,
    isReceipt: !!r.is_receipt,
    issueDate: r.issue_date,
    dueDate: r.due_date,
    clientName: r.client_name,
    clientEmail: r.client_email,
    clientPhone: r.client_phone,
    clientCompany: r.client_company,
    clientAddress: r.client_address,
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
    notes: r.notes,
  };

  const recipient = to || r.client_email;
  if (!recipient) return NextResponse.json({ error: "No recipient email on file" }, { status: 400 });

  try {
    await sendMail({
      to: recipient,
      cc: cc || undefined,
      subject: `Invoice ${inv.invoiceNo} from JustServicesPro`,
      html: renderInvoiceEmailHtml(inv),
    });
    return NextResponse.json({ success: true, sentTo: recipient });
  } catch (e: any) {
    console.error("Invoice send failed:", e?.message);
    return NextResponse.json({ success: false, error: e?.message || "Send failed" }, { status: 200 });
  }
}
