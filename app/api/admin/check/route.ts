// app/api/admin/check/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_USER = process.env.ADMIN_USER || "";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("jsp_admin_session")?.value || "";
    if (!token || !SESSION_SECRET) return NextResponse.json({ authenticated: false });
    const lastDot = token.lastIndexOf(".");
    if (lastDot === -1) return NextResponse.json({ authenticated: false });
    const payload = token.slice(0, lastDot);
    const sig = token.slice(lastDot + 1);
    const expected = createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
    const sigBuf = Buffer.from(sig), expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf))
      return NextResponse.json({ authenticated: false });
    const [user, expiryStr] = payload.split(":");
    if (user !== ADMIN_USER || Date.now() > parseInt(expiryStr))
      return NextResponse.json({ authenticated: false });
    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
