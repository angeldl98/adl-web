import { NextRequest, NextResponse } from 'next/server';

const insightsBase = process.env.CORE_INSIGHTS_URL || process.env.NEXT_PUBLIC_CORE_INSIGHTS_URL;

const mockPredict = {
  systemStatus: 'healthy',
  hotspots: ['engine-solvency'],
  predictions: [
    { engine: 'engine-solvency', backlogForecast: 30, cpuTrend: 'rising', scaleRecommendation: 'scale_up', riskLevel: 'medium' },
    { engine: 'engine-trading', backlogForecast: 5, cpuTrend: 'stable', scaleRecommendation: 'hold', riskLevel: 'low' }
  ]
};

export async function GET(req: NextRequest) {
  const forceMock = req.nextUrl.searchParams.get('mock') === 'true';

  if (!insightsBase || forceMock) {
    return NextResponse.json({ data: mockPredict, source: 'mock' });
  }

  try {
    const res = await fetch(`${insightsBase}/predict`, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ error: 'upstream_failed', status: res.status }, { status: res.status });
    }
    const body = await res.json().catch(() => ({}));
    return NextResponse.json({ data: body, source: 'live' });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'fetch_failed' }, { status: 500 });
  }
}


