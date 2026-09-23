import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(){
  const rows=await sql`SELECT * FROM products ORDER BY created_at DESC`;
  return NextResponse.json(rows.map((r:any)=>({id:r.id,title:r.title,category:r.category,description:r.description,price:r.price,link:r.link,badge:r.badge,active:r.active,imageUrl:r.image_url})));
}
export async function POST(req:NextRequest){
  const b=await req.json();
  if(b.id&&b.id<900000){
    await sql`UPDATE products SET title=${b.title},category=${b.category},description=${b.description||""},price=${b.price},link=${b.link||""},badge=${b.badge||"Available"},active=${b.active},image_url=${b.imageUrl||""} WHERE id=${b.id}`;
    return NextResponse.json({id:b.id});
  }
  const [row]=await sql`INSERT INTO products(title,category,description,price,link,badge,active,image_url) VALUES(${b.title},${b.category},${b.description||""},${b.price},${b.link||""},${b.badge||"Available"},${b.active!==false},${b.imageUrl||""}) RETURNING id`;
  return NextResponse.json({id:row.id});
}
export async function PATCH(req:NextRequest){
  const {id,active}=await req.json();
  await sql`UPDATE products SET active=${active} WHERE id=${id}`;
  return NextResponse.json({ok:true});
}
export async function DELETE(req:NextRequest){const {id}=await req.json();await sql`DELETE FROM products WHERE id=${id}`;return NextResponse.json({ok:true});}
