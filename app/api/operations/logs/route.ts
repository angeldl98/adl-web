import { NextRequest, NextResponse } from 'next/server';

const obsBase =
  process.env.CORE_OBSERVABILITY_URL || process.env.NEXT_PUBLIC_CORE_OBSERVABILITY_URL;

export async function GET(req: NextRequest) {
  if (!obsBase) {
    return NextResponse.json({ error: 'missing_observability_url' }, { status: 500 });
  }

  const search = req.nextUrl.searchParams.toString();
  const url = `${obsBase}/logs${search ? `?${search}` : ''}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    const body = await res.json().catch(() => ({}));
    return NextResponse.json(body, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'fetch_failed' }, { status: 500 });
  }
}


