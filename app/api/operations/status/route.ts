import { NextResponse } from 'next/server';

const obsBase =
  process.env.CORE_OBSERVABILITY_URL || process.env.NEXT_PUBLIC_CORE_OBSERVABILITY_URL;

export async function GET() {
  if (!obsBase) {
    return NextResponse.json({ error: 'missing_observability_url' }, { status: 500 });
  }
  try {
    const res = await fetch(`${obsBase}/status`, { cache: 'no-store' });
    const body = await res.json().catch(() => ({}));
    return NextResponse.json(body, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'fetch_failed' }, { status: 500 });
  }
}


