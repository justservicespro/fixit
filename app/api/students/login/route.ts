import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
export async function POST(req:NextRequest){
  const {studentId,email}=await req.json();
  const rows=await sql`SELECT * FROM students WHERE UPPER(student_id)=UPPER(${studentId}) AND LOWER(email)=LOWER(${email})`;
  if(!rows.length)return NextResponse.json({error:"Not found"},{status:404});
  const r=rows[0];
  return NextResponse.json({student:{id:r.id,studentId:r.student_id,name:r.name,email:r.email,phone:r.phone,courseId:r.course_id,courseTitle:r.course_title,status:r.status,paymentStatus:r.payment_status,amountPaid:r.amount_paid,enrollDate:r.enroll_date,completionDate:r.completion_date}});
}
