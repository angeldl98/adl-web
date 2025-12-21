import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin';
const AUTH_COOKIE = 'adal_auth';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (body?.token !== ADMIN_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, ADMIN_TOKEN, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 12,
    path: '/'
  });
  return res;
}

