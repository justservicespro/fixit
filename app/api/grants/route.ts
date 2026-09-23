import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(){
  const rows=await sql`SELECT * FROM grants ORDER BY created_at DESC`;
  return NextResponse.json(rows.map((r:any)=>({id:r.id,name:r.name,org:r.org,amount:r.amount,deadline:r.deadline,eligibility:r.eligibility,link:r.link,category:r.category,active:r.active,imageUrl:r.image_url})));
}
export async function POST(req:NextRequest){
  const b=await req.json();
  if(b.id&&b.id<900000){
    await sql`UPDATE grants SET name=${b.name},org=${b.org},amount=${b.amount},deadline=${b.deadline},eligibility=${b.eligibility||""},link=${b.link||""},category=${b.category||"Government"},active=${b.active},image_url=${b.imageUrl||""} WHERE id=${b.id}`;
    return NextResponse.json({id:b.id});
  }
  const [row]=await sql`INSERT INTO grants(name,org,amount,deadline,eligibility,link,category,active,image_url) VALUES(${b.name},${b.org},${b.amount},${b.deadline},${b.eligibility||""},${b.link||""},${b.category||"Government"},${b.active!==false},${b.imageUrl||""}) RETURNING id`;
  return NextResponse.json({id:row.id});
}
export async function PATCH(req:NextRequest){
  const {id,active}=await req.json();
  await sql`UPDATE grants SET active=${active} WHERE id=${id}`;
  return NextResponse.json({ok:true});
}
export async function DELETE(req:NextRequest){const {id}=await req.json();await sql`DELETE FROM grants WHERE id=${id}`;return NextResponse.json({ok:true});}
