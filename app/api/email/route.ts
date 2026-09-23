import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
const transporter=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT)||587,secure:false,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});
export async function POST(req:NextRequest){
  const {to,subject,html,cc}=await req.json();
  try{
    await transporter.sendMail({from:`"JustServicesPro" <${process.env.SMTP_USER}>`,to,cc,subject,html});
    // Also notify admin
    if(to!==process.env.SMTP_USER){
      await transporter.sendMail({from:`"JSP Bot" <${process.env.SMTP_USER}>`,to:process.env.SMTP_USER,subject:`[JSP Admin] ${subject}`,html:`<p>Sent to: ${to}</p>${html}`});
    }
    return NextResponse.json({ok:true});
  }catch(e:any){return NextResponse.json({error:e.message},{status:500});}
}
