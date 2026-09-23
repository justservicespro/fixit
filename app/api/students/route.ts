import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
export async function GET(){
  const rows=await sql`SELECT * FROM students ORDER BY created_at DESC`;
  return NextResponse.json(rows.map((r:any)=>({id:r.id,studentId:r.student_id,name:r.name,email:r.email,phone:r.phone,courseId:r.course_id,courseTitle:r.course_title,status:r.status,paymentStatus:r.payment_status,amountPaid:r.amount_paid,enrollDate:r.enroll_date,completionDate:r.completion_date})));
}
export async function POST(req:NextRequest){
  const b=await req.json();
  if(b.id&&b.id<900000){
    await sql`UPDATE students SET name=${b.name},email=${b.email},phone=${b.phone||""},course_id=${b.courseId},course_title=${b.courseTitle},status=${b.status},payment_status=${b.paymentStatus},amount_paid=${b.amountPaid||0},completion_date=${b.completionDate||null} WHERE id=${b.id}`;
    return NextResponse.json({id:b.id});
  }
  const [row]=await sql`INSERT INTO students(student_id,name,email,phone,course_id,course_title,status,payment_status,amount_paid,enroll_date) VALUES(${b.studentId},${b.name},${b.email},${b.phone||""},${b.courseId},${b.courseTitle},'enrolled','pending',0,${b.enrollDate}) RETURNING id`;
  return NextResponse.json({id:row.id});
}
export async function DELETE(req:NextRequest){const {id}=await req.json();await sql`DELETE FROM students WHERE id=${id}`;return NextResponse.json({ok:true});}
