import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(){
  const rows=await sql`SELECT * FROM projects ORDER BY created_at DESC`;
  return NextResponse.json(rows.map((r:any)=>({id:r.id,title:r.title,client:r.client,category:r.category,status:r.status,url:r.url,description:r.description,year:r.year,imageUrl:r.image_url,testimonial:r.testimonial})));
}
export async function POST(req:NextRequest){
  const b=await req.json();
  if(b.id&&b.id<900000){
    await sql`UPDATE projects SET title=${b.title},client=${b.client},category=${b.category},status=${b.status},url=${b.url||""},description=${b.description||""},year=${b.year},image_url=${b.imageUrl||""},testimonial=${b.testimonial||""} WHERE id=${b.id}`;
    return NextResponse.json({id:b.id});
  }
  const [row]=await sql`INSERT INTO projects(title,client,category,status,url,description,year,image_url,testimonial) VALUES(${b.title},${b.client},${b.category},${b.status||"completed"},${b.url||""},${b.description||""},${b.year},${b.imageUrl||""},${b.testimonial||""}) RETURNING id`;
  return NextResponse.json({id:row.id});
}
export async function DELETE(req:NextRequest){const {id}=await req.json();await sql`DELETE FROM projects WHERE id=${id}`;return NextResponse.json({ok:true});}
