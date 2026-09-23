// app/api/invoices/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sql, ensureInvoicesTable } from "@/lib/db";

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

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await ensureInvoicesTable();
  const id = Number(params.id);
  const b = await req.json();

  // Lightweight status/payment-only update (used by the list view toggles).
  if (b.statusOnly) {
    await sql`UPDATE invoices SET status=${b.status}, amount_paid=${Number(b.amountPaid) || 0}, updated_at=NOW() WHERE id=${id}`;
    return NextResponse.json({ ok: true });
  }

  // Full edit — recompute totals server-side so stored numbers can never drift.
  const { subtotal, total, items, charges } = computeTotals(b);
  const isReceipt = !!b.isReceipt;
  const status = isReceipt ? "paid" : (b.status || "unpaid");
  const amountPaid = isReceipt ? total : (Number(b.amountPaid) || 0);
  await sql`
    UPDATE invoices SET
      status=${status}, issue_date=${b.issueDate || ""}, due_date=${b.dueDate || ""},
      client_name=${b.clientName}, client_email=${b.clientEmail}, client_phone=${b.clientPhone || ""},
      client_company=${b.clientCompany || ""}, client_address=${b.clientAddress || ""},
      source_type=${b.sourceType || "service"}, category=${b.category || ""},
      items=${JSON.stringify(items)}, additional_info=${b.additionalInfo || ""},
      discount_type=${b.discountType || "fixed"}, discount_value=${Number(b.discountValue) || 0},
      other_charges=${JSON.stringify(charges)}, tax_percent=${Number(b.taxPercent) || 0},
      currency=${b.currency || "NGN"}, subtotal=${subtotal}, total=${total},
      amount_paid=${amountPaid}, is_receipt=${isReceipt}, notes=${b.notes || ""}, updated_at=NOW()
    WHERE id=${id}`;
  return NextResponse.json({ ok: true, subtotal, total, status, amountPaid });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await ensureInvoicesTable();
  await sql`DELETE FROM invoices WHERE id=${Number(params.id)}`;
  return NextResponse.json({ ok: true });
}
