import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const secret = process.env.SESSION_TOKEN_SECRET || "dev-session-secret";
const ttlSeconds = Number(process.env.SESSION_TOKEN_TTL_SECONDS || 60 * 60 * 12);

function issueToken() {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + ttlSeconds;
  const payload = `${now}.${exp}.${crypto.randomBytes(16).toString("hex")}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return { token: `${payload}.${sig}`, exp };
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("adl_session")?.value;
  const res = NextResponse.next();
  if (!token) {
    const { token: t, exp } = issueToken();
    res.cookies.set({
      name: "adl_session",
      value: t,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(exp * 1000),
      path: "/"
    });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

