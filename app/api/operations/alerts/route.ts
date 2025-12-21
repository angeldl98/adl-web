import { NextRequest, NextResponse } from 'next/server';

const insightsBase = process.env.CORE_INSIGHTS_URL || process.env.NEXT_PUBLIC_CORE_INSIGHTS_URL;

const mockAlerts = [
  { id: 'mock-1', engine: 'engine-solvency', severity: 'critical', message: 'Backlog alto', timestamp: new Date().toISOString() },
  { id: 'mock-2', engine: 'engine-trading', severity: 'warn', message: 'Latencia elevada', timestamp: new Date().toISOString() }
];

export async function GET(req: NextRequest) {
  const forceMock = req.nextUrl.searchParams.get('mock') === 'true';

  if (!insightsBase || forceMock) {
    return NextResponse.json({ data: mockAlerts, source: 'mock' });
  }

  try {
    const res = await fetch(`${insightsBase}/alerts`, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ error: 'upstream_failed', status: res.status }, { status: res.status });
    }
    const body = await res.json().catch(() => ({}));
    return NextResponse.json({ data: body, source: 'live' });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'fetch_failed' }, { status: 500 });
  }
}


