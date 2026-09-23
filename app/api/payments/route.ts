import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
export async function POST(req:NextRequest){
  const b=await req.json();
  // Verify with Paystack
  const verify=await fetch(`https://api.paystack.co/transaction/verify/${b.reference}`,{headers:{Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`}});
  const vData=await verify.json();
  if(!vData.status||vData.data?.status!=="success")return NextResponse.json({error:"Payment verification failed"},{status:400});
  await sql`INSERT INTO payments(reference,email,name,phone,amount,service,pay_type,status) VALUES(${b.reference},${b.email},${b.name},${b.phone||""},${b.amount},${b.service},${b.payType||"Full Payment"},'success') ON CONFLICT(reference) DO NOTHING`;
  try{await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:b.email,subject:"Payment Received — JustServicesPro",html:`<h2>Payment Confirmed ✅</h2><p>Hi ${b.name}, we have received your payment of <strong>₦${Number(b.amount).toLocaleString()}</strong> for <strong>${b.service}</strong>.</p><p>Reference: ${b.reference}</p><p>Our team will contact you within 2 hours to begin your project.</p><br/><p>JustServicesPro Team</p>`})});}catch(e){}
  return NextResponse.json({ok:true});
}
export async function GET(){
  const rows=await sql`SELECT * FROM payments ORDER BY created_at DESC`;
  return NextResponse.json(rows);
}
