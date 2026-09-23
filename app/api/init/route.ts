import { NextResponse } from "next/server";
import { initSchema, extendSchema, ensureInvoicesTable } from "@/lib/db";
export async function GET(){
  try {
    const r1 = await initSchema();
    const r2 = await extendSchema();
    const r3 = await ensureInvoicesTable();
    return NextResponse.json({ ...r1, ...r2, ...r3, tables: "all created" });
  } catch(e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
