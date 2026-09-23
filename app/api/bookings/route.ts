import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
export async function GET(){
  const rows=await sql`SELECT * FROM bookings ORDER BY created_at DESC`;
  return NextResponse.json(rows.map((r:any)=>({id:r.id,name:r.name,email:r.email,phone:r.phone,service:r.service,date:r.date,time:r.time,notes:r.notes,status:r.status})));
}
export async function POST(req:NextRequest){
  const b=await req.json();
  const [row]=await sql`INSERT INTO bookings(name,email,phone,service,date,time,notes,status) VALUES(${b.name},${b.email},${b.phone||""},${b.service||""},${b.date},${b.time},${b.notes||""},'pending') RETURNING id`;
  try{await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:b.email,subject:"Booking Confirmed — JustServicesPro",html:`<h2>Hi ${b.name},</h2><p>Your consultation is confirmed for <strong>${b.date} at ${b.time}</strong>.</p><p>Service: ${b.service||"General Consultation"}</p><p>Our team will reach out within 2 hours.</p><p>Ref: JSP-BK-${row.id}</p><br/><p>JustServicesPro Team<br/>📞 +234 807 992 6755</p>`})});}catch(e){}
  return NextResponse.json({id:row.id});
}
export async function PATCH(req:NextRequest){const {id,status}=await req.json();await sql`UPDATE bookings SET status=${status} WHERE id=${id}`;return NextResponse.json({ok:true});}
export async function DELETE(req:NextRequest){const {id}=await req.json();await sql`DELETE FROM bookings WHERE id=${id}`;return NextResponse.json({ok:true});}
