import { NextRequest, NextResponse } from 'next/server';

const coreAuthUrl =
  process.env.CORE_AUTH_URL || process.env.NEXT_PUBLIC_API_URL || 'http://core-auth:4205';
const backendUrl = process.env.NEXT_PUBLIC_API_URL;

type CheckResult = {
  ok: boolean;
  status?: number;
  error?: string;
  body?: any;
};

async function probe(url: string, init?: RequestInit): Promise<CheckResult> {
  try {
    const res = await fetch(url, { cache: 'no-store', ...init });
    const body = await res.json().catch(() => undefined);
    return { ok: res.ok, status: res.status, body };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

export async function GET(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie') || '';
  const session = await probe(`${coreAuthUrl}/auth/verify`, {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined
  });

  const coreAuth = await probe(`${coreAuthUrl}/health`);
  const backend = backendUrl ? await probe(`${backendUrl}/health`) : { ok: false, error: 'missing_backend_url' };

  const env = Object.fromEntries(
    Object.entries(process.env).filter(([k]) => k.startsWith('NEXT_PUBLIC_'))
  );

  return NextResponse.json({
    coreAuth,
    backend,
    session,
    env
  });
}


