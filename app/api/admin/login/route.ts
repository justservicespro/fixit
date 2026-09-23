// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_USER = process.env.ADMIN_USER || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function signSession(payload: string): string {
  return `${payload}.${createHmac("sha256", SESSION_SECRET).update(payload).digest("hex")}`;
}

// Constant-time compare for strings of any (possibly different) length —
// pads the shorter one so timingSafeEqual never throws on a length mismatch,
// while still not leaking length via early-return timing.
function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  const len = Math.max(aBuf.length, bBuf.length, 1);
  const aPad = Buffer.alloc(len); aBuf.copy(aPad);
  const bPad = Buffer.alloc(len); bBuf.copy(bPad);
  return timingSafeEqual(aPad, bPad) && aBuf.length === bBuf.length;
}

// GET /api/admin/login — diagnostic endpoint. Never returns secret values,
// only whether each required env var is present, so you can tell "Admin auth
// not configured" apart from a genuine bad username/password without ever
// exposing ADMIN_PASSWORD or ADMIN_SESSION_SECRET.
export async function GET() {
  return NextResponse.json({
    adminUserSet: !!ADMIN_USER,
    adminUserLength: ADMIN_USER.length,
    adminPasswordSet: !!ADMIN_PASSWORD,
    adminSessionSecretSet: !!SESSION_SECRET,
    readyToLogin: !!(ADMIN_USER && ADMIN_PASSWORD && SESSION_SECRET),
  });
}

export async function POST(req: NextRequest) {
  try {
    if (!ADMIN_USER || !ADMIN_PASSWORD || !SESSION_SECRET)
      return NextResponse.json({ error: "Admin auth not configured" }, { status: 500 });

    const { username, password } = await req.json();
    if (!username || !password)
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });

    const usernameOk = safeEqual(username, ADMIN_USER);
    const passwordOk = safeEqual(password, ADMIN_PASSWORD);

    if (!usernameOk || !passwordOk)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const signed = signSession(`${ADMIN_USER}:${Date.now() + SESSION_MAX_AGE * 1000}`);
    const res = NextResponse.json({ success: true });
    res.cookies.set("jsp_admin_session", signed, {
      httpOnly: true, secure: true, sameSite: "strict", maxAge: SESSION_MAX_AGE, path: "/",
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("jsp_admin_session", "", { maxAge: 0, path: "/" });
  return res;
}
