import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(){
  const rows=await sql`SELECT * FROM posts ORDER BY created_at DESC`;
  return NextResponse.json(rows.map((r:any)=>({id:r.id,title:r.title,category:r.category,content:r.content,excerpt:r.excerpt,date:r.date,author:r.author,published:r.published,image:r.image})));
}
export async function POST(req:NextRequest){
  const b=await req.json();
  if(b.id&&b.id<900000){
    await sql`UPDATE posts SET title=${b.title},category=${b.category},content=${b.content||""},excerpt=${b.excerpt||""},date=${b.date},author=${b.author},published=${b.published},image=${b.image||"default"},updated_at=NOW() WHERE id=${b.id}`;
    return NextResponse.json({id:b.id});
  }
  const [row]=await sql`INSERT INTO posts(title,category,content,excerpt,date,author,published,image) VALUES(${b.title},${b.category},${b.content||""},${b.excerpt||""},${b.date},${b.author},${b.published||false},${b.image||"default"}) RETURNING id`;
  return NextResponse.json({id:row.id});
}
export async function PATCH(req:NextRequest){
  const {id,published}=await req.json();
  await sql`UPDATE posts SET published=${published},updated_at=NOW() WHERE id=${id}`;
  return NextResponse.json({ok:true});
}
export async function DELETE(req:NextRequest){const {id}=await req.json();await sql`DELETE FROM posts WHERE id=${id}`;return NextResponse.json({ok:true});}
