import { NextResponse } from 'next/server';

const insightsBase =
  process.env.CORE_INSIGHTS_URL || process.env.NEXT_PUBLIC_CORE_INSIGHTS_URL;

const mockEngine = (name: string) => ({
  name,
  status: 'unknown',
  trend: 'stable',
  latencyMs: 0,
  errorRate: 0,
  backlog: 0,
  lastUpdate: new Date().toISOString(),
  notes: 'Datos simulados; conéctalo a core-insights.'
});

export async function GET(req: Request, { params }: any) {
  const name = params.name;
  if (!name) return NextResponse.json({ error: 'missing_engine' }, { status: 400 });

  const url = new URL(req.url);
  const forceMock = url.searchParams.get('mock') === 'true';

  if (!insightsBase || forceMock) {
    return NextResponse.json({ data: mockEngine(name), source: 'mock' });
  }

  try {
    const res = await fetch(`${insightsBase}/engine/${encodeURIComponent(name)}`, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ error: 'upstream_failed', status: res.status }, { status: res.status });
    }
    const body = await res.json().catch(() => ({}));
    return NextResponse.json({ data: body, source: 'live' });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'fetch_failed' }, { status: 500 });
  }
}


