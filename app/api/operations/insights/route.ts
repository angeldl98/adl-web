import { NextRequest, NextResponse } from 'next/server';

const insightsBase =
  process.env.CORE_INSIGHTS_URL || process.env.NEXT_PUBLIC_CORE_INSIGHTS_URL;

const mockInsights = {
  generatedAt: new Date().toISOString(),
  summary: 'Insights simulados (mock).',
  overallTrend: 'stable',
  hotspots: ['engine-trading', 'engine-solvency'],
  engines: [
    { name: 'engine-trading', status: 'healthy', trend: 'stable', latencyMs: 120, errorRate: 0.1, backlog: 5 },
    { name: 'engine-solvency', status: 'unhealthy', trend: 'degrading', latencyMs: 320, errorRate: 1.8, backlog: 25 }
  ]
};

export async function GET(req: NextRequest) {
  const forceMock = req.nextUrl.searchParams.get('mock') === 'true';

  if (!insightsBase || forceMock) {
    return NextResponse.json({ data: mockInsights, source: 'mock' });
  }
  try {
    const res = await fetch(`${insightsBase}/insights`, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ error: 'upstream_failed', status: res.status }, { status: res.status });
    }
    const body = await res.json().catch(() => ({}));
    return NextResponse.json({ data: body, source: 'live' });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'fetch_failed' }, { status: 500 });
  }
}


