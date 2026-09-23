import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
export async function GET(){
  const rows=await sql`SELECT * FROM courses ORDER BY created_at DESC`;
  return NextResponse.json(rows.map((r:any)=>({id:r.id,title:r.title,category:r.category,description:r.description,duration:r.duration,schedule:r.schedule,regFee:r.reg_fee,courseFee:r.course_fee,active:r.active,imageUrl:r.image_url,instructor:r.instructor,level:r.level,seats:r.seats,enrolled:r.enrolled,startDate:r.start_date})));
}
export async function POST(req:NextRequest){
  const b=await req.json();
  if(b.id&&b.id<900000){
    await sql`UPDATE courses SET title=${b.title},category=${b.category},description=${b.description},duration=${b.duration},schedule=${b.schedule},reg_fee=${b.regFee},course_fee=${b.courseFee},active=${b.active},image_url=${b.imageUrl||""},instructor=${b.instructor},level=${b.level},seats=${b.seats},enrolled=${b.enrolled},start_date=${b.startDate} WHERE id=${b.id}`;
    return NextResponse.json({id:b.id});
  }
  const [row]=await sql`INSERT INTO courses(title,category,description,duration,schedule,reg_fee,course_fee,active,image_url,instructor,level,seats,enrolled,start_date) VALUES(${b.title},${b.category},${b.description},${b.duration},${b.schedule},${b.regFee},${b.courseFee},${b.active},${b.imageUrl||""},${b.instructor},${b.level},${b.seats},${b.enrolled||0},${b.startDate}) RETURNING id`;
  return NextResponse.json({id:row.id});
}
export async function DELETE(req:NextRequest){const {id}=await req.json();await sql`DELETE FROM courses WHERE id=${id}`;return NextResponse.json({ok:true});}
