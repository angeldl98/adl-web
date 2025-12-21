import { NextResponse } from 'next/server';

const autoscalerBase =
  process.env.CORE_AUTOSCALER_URL || process.env.NEXT_PUBLIC_CORE_AUTOSCALER_URL;

export async function GET() {
  if (!autoscalerBase) {
    return NextResponse.json({ error: 'missing_autoscaler_url' }, { status: 500 });
  }
  try {
    const res = await fetch(`${autoscalerBase}/state`, { cache: 'no-store' });
    const body = await res.json().catch(() => ({}));
    return NextResponse.json(body, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'fetch_failed' }, { status: 500 });
  }
}


