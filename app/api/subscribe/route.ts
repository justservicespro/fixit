import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
export async function POST(req:NextRequest){
  const {email,name}=await req.json();
  if(!email)return NextResponse.json({error:"Email required"},{status:400});
  try{
    await sql`INSERT INTO subscribers(email,name) VALUES(${email},${name||""}) ON CONFLICT(email) DO UPDATE SET subscribed=true`;
    try{await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:email,subject:"Welcome to JustServicesPro Insights!",html:`<h2>You're subscribed! 🎉</h2><p>Thank you for subscribing to JustServicesPro business tips, grants updates, and regulatory insights.</p><p>We send updates every 2 weeks. No spam, ever.</p><br/><p>JustServicesPro Team</p>`})});}catch(e){}
    return NextResponse.json({ok:true});
  }catch(e:any){return NextResponse.json({error:e.message},{status:500});}
}
export async function GET(){
  const rows=await sql`SELECT * FROM subscribers ORDER BY created_at DESC`;
  return NextResponse.json(rows);
}
