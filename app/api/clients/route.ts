import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { createHash } from "crypto";
function hashPw(pw:string){return createHash("sha256").update(pw+process.env.JWT_SECRET).digest("hex");}
export async function GET(){
  const rows=await sql`SELECT id,name,email,phone,company,ref_code,project_status,stage,docs,join_date FROM clients ORDER BY created_at DESC`;
  return NextResponse.json(rows.map((r:any)=>({id:r.id,name:r.name,email:r.email,phone:r.phone,company:r.company,refCode:r.ref_code,projectStatus:r.project_status,stage:r.stage,docs:r.docs,joinDate:r.join_date})));
}
export async function POST(req:NextRequest){
  const b=await req.json();
  const today=new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
  if(b.id&&b.id<900000){
    await sql`UPDATE clients SET name=${b.name},email=${b.email},phone=${b.phone||""},company=${b.company||b.name},ref_code=${b.refCode},project_status=${b.projectStatus},stage=${b.stage},docs=${b.docs||[]} WHERE id=${b.id}`;
    return NextResponse.json({id:b.id});
  }
  const pw=b.password?hashPw(b.password):hashPw(b.refCode);
  const [row]=await sql`INSERT INTO clients(name,email,phone,company,ref_code,project_status,stage,docs,join_date,password_hash) VALUES(${b.name},${b.email},${b.phone||""},${b.company||b.name},${b.refCode},${b.projectStatus||"Awaiting Assignment"},${b.stage||0},${b.docs||[]},${today},${pw}) RETURNING id,ref_code`;
  try{await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:b.email,subject:"Your JustServicesPro Client Portal Access",html:`<h2>Welcome, ${b.name}!</h2><p>Your client portal account is ready.</p><p><strong>Reference Code: ${row.ref_code}</strong></p><p>Log in at <a href="${process.env.NEXT_PUBLIC_APP_URL}/#portal">justservices.pro/#portal</a> using your reference code and email.</p><br/><p>JustServicesPro Team</p>`})});}catch(e){}
  return NextResponse.json({id:row.id,refCode:row.ref_code});
}
export async function PATCH(req:NextRequest){
  const b=await req.json();
  if(b.stage!==undefined){await sql`UPDATE clients SET stage=${b.stage} WHERE id=${b.id}`;return NextResponse.json({ok:true});}
  await sql`UPDATE clients SET project_status=${b.projectStatus},stage=${b.stage},docs=${b.docs||[]} WHERE id=${b.id}`;
  return NextResponse.json({ok:true});
}
export async function DELETE(req:NextRequest){const {id}=await req.json();await sql`DELETE FROM clients WHERE id=${id}`;return NextResponse.json({ok:true});}
