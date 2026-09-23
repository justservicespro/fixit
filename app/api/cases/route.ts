import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(){
  const rows=await sql`SELECT * FROM cases ORDER BY created_at DESC`;
  return NextResponse.json(rows.map((r:any)=>({id:r.id,client:r.client,title:r.title,challenge:r.challenge,solution:r.solution,result:r.result,services:r.services||[],url:r.url,imageUrl:r.image_url})));
}
export async function POST(req:NextRequest){
  const b=await req.json();
  if(b.id&&b.id<900000){
    await sql`UPDATE cases SET client=${b.client},title=${b.title},challenge=${b.challenge||""},solution=${b.solution||""},result=${b.result||""},services=${b.services||[]},url=${b.url||""},image_url=${b.imageUrl||""} WHERE id=${b.id}`;
    return NextResponse.json({id:b.id});
  }
  const [row]=await sql`INSERT INTO cases(client,title,challenge,solution,result,services,url,image_url) VALUES(${b.client},${b.title},${b.challenge||""},${b.solution||""},${b.result||""},${b.services||[]},${b.url||""},${b.imageUrl||""}) RETURNING id`;
  return NextResponse.json({id:row.id});
}
export async function DELETE(req:NextRequest){const {id}=await req.json();await sql`DELETE FROM cases WHERE id=${id}`;return NextResponse.json({ok:true});}
