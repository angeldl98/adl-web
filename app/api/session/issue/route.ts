import { NextResponse } from "next/server";
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

export async function GET() {
  const { token, exp } = issueToken();
  const res = NextResponse.json({ ok: true, expiresAt: exp });
  res.cookies.set({
    name: "adl_session",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(exp * 1000),
    path: "/"
  });
  return res;
}

