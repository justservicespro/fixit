import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { createHash } from "crypto";
import { SignJWT } from "jose";
function hashPw(pw:string){return createHash("sha256").update(pw+process.env.JWT_SECRET).digest("hex");}
export async function POST(req:NextRequest){
  const {refCode,email,password}=await req.json();
  const [client]=await sql`SELECT * FROM clients WHERE ref_code=UPPER(${refCode}) AND LOWER(email)=LOWER(${email})`;
  if(!client)return NextResponse.json({error:"Invalid credentials"},{ status:401});
  if(password){
    const ph=hashPw(password);
    if(client.password_hash&&client.password_hash!==ph&&client.password_hash!==hashPw(client.ref_code))
      return NextResponse.json({error:"Invalid password"},{status:401});
  }
  const token=await new SignJWT({id:client.id,email:client.email,refCode:client.ref_code}).setProtectedHeader({alg:"HS256"}).setExpirationTime("7d").sign(new TextEncoder().encode(process.env.JWT_SECRET));
  return NextResponse.json({token,client:{id:client.id,name:client.name,email:client.email,phone:client.phone,company:client.company,refCode:client.ref_code,projectStatus:client.project_status,stage:client.stage,docs:client.docs,joinDate:client.join_date}});
}
