import { NextRequest, NextResponse } from 'next/server';

const insightsBase =
  process.env.CORE_INSIGHTS_URL || process.env.NEXT_PUBLIC_CORE_INSIGHTS_URL;

const mockRecommendations = [
  {
    id: 'mock-1',
    title: 'Optimizar engine-solvency',
    description: 'Reducir backlog aumentando instancias temporales.',
    impact: 'high',
    suggestedAction: 'scale_up',
    relatedEngines: ['engine-solvency'],
    trend: 'degrading'
  },
  {
    id: 'mock-2',
    title: 'Revisar latencia en engine-trading',
    description: 'Latencia estable pero con picos ocasionales.',
    impact: 'medium',
    suggestedAction: 'observe',
    relatedEngines: ['engine-trading'],
    trend: 'stable'
  }
];

export async function GET(req: NextRequest) {
  const forceMock = req.nextUrl.searchParams.get('mock') === 'true';

  if (!insightsBase || forceMock) {
    return NextResponse.json({ data: mockRecommendations, source: 'mock' });
  }
  try {
    const res = await fetch(`${insightsBase}/recommendations`, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ error: 'upstream_failed', status: res.status }, { status: res.status });
    }
    const body = await res.json().catch(() => ({}));
    return NextResponse.json({ data: body, source: 'live' });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'fetch_failed' }, { status: 500 });
  }
}


