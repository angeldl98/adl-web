import { safeFetchJSON } from '../../../lib/fetcher';
import {
  AutoscalerExplanation,
  EngineInsight,
  GlobalInsights,
  RecommendationSummary
} from './types/insights';

type InsightsResponse<T> = { data?: T; source?: string; error?: string };

function fallbackInsights(): GlobalInsights {
  return {
    generatedAt: new Date().toISOString(),
    summary: 'Sin datos de insights (mock).',
    overallTrend: 'stable',
    hotspots: [],
    engines: []
  };
}

function fallbackEngine(name: string): EngineInsight {
  return {
    name,
    status: 'unknown',
    trend: 'stable',
    latencyMs: 0,
    errorRate: 0,
    backlog: 0,
    lastUpdate: new Date().toISOString(),
    notes: 'Sin datos (mock).'
  };
}

export async function getInsights(mockParam?: boolean): Promise<{ data: GlobalInsights; source: 'live' | 'mock'; error?: string }> {
  const url = mockParam ? '/api/operations/insights?mock=true' : '/api/operations/insights';
  const res = await safeFetchJSON<InsightsResponse<GlobalInsights>>(url, { defaultValue: {} as any });
  if (!res?.data) {
    return { data: fallbackInsights(), source: 'mock', error: res?.error };
  }
  return { data: res.data, source: (res.source as any) || 'live', error: res.error };
}

export async function getEngineInsight(name: string, mockParam?: boolean): Promise<{ data: EngineInsight; source: 'live' | 'mock'; error?: string }> {
  const url = mockParam ? `/api/operations/engine/${encodeURIComponent(name)}?mock=true` : `/api/operations/engine/${encodeURIComponent(name)}`;
  const res = await safeFetchJSON<InsightsResponse<EngineInsight>>(url, { defaultValue: {} as any });
  if (!res?.data) {
    return { data: fallbackEngine(name), source: 'mock', error: res?.error };
  }
  return { data: res.data, source: (res.source as any) || 'live', error: res.error };
}

export async function getRecommendations(mockParam?: boolean): Promise<{ data: RecommendationSummary[]; source: 'live' | 'mock'; error?: string }> {
  const url = mockParam ? '/api/operations/recommendations?mock=true' : '/api/operations/recommendations';
  const res = await safeFetchJSON<InsightsResponse<RecommendationSummary[]>>(url, { defaultValue: {} as any });
  if (!res?.data) {
    return { data: [], source: 'mock', error: res?.error };
  }
  return { data: res.data, source: (res.source as any) || 'live', error: res.error };
}

export async function getAutoscalerExplanations(mockParam?: boolean): Promise<{
  data: AutoscalerExplanation[];
  source: 'live' | 'mock';
  error?: string;
}> {
  const recos = await getRecommendations(mockParam);
  const mapped: AutoscalerExplanation[] = recos.data.map(r => ({
    engine: r.relatedEngines?.[0] || 'unknown',
    action: r.suggestedAction === 'scale_up' ? 'scale_up' : r.suggestedAction === 'scale_down' ? 'scale_down' : 'none',
    reason: r.title,
    score: r.impact === 'high' ? 0.9 : r.impact === 'medium' ? 0.6 : 0.3,
    recommendedSize: undefined,
    timestamp: new Date().toISOString()
  }));
  return { data: mapped, source: recos.source, error: recos.error };
}


