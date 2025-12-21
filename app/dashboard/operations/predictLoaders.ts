import { safeFetchJSON } from '../../../lib/fetcher';
import { PredictionGlobal, PredictionSummary } from './types/insights';

type PredictResp<T> = { data?: T; source?: string; error?: string };

function mockGlobal(): PredictionGlobal {
  return {
    systemStatus: 'healthy',
    hotspots: [],
    predictions: []
  };
}

function mockEngine(name: string): PredictionSummary {
  return {
    engine: name,
    backlogForecast: 0,
    cpuTrend: 'stable',
    scaleRecommendation: 'hold',
    riskLevel: 'low'
  };
}

export async function getPredictGlobal(mock?: boolean): Promise<{ data: PredictionGlobal; source: 'live' | 'mock'; error?: string }> {
  const url = mock ? '/api/operations/predict?mock=true' : '/api/operations/predict';
  const res = await safeFetchJSON<PredictResp<PredictionGlobal>>(url, { defaultValue: {} as any });
  if (!res?.data) {
    return { data: mockGlobal(), source: 'mock', error: res?.error };
  }
  return { data: res.data, source: (res.source as any) || 'live', error: res.error };
}

export async function getPredictEngine(name: string, mock?: boolean): Promise<{ data: PredictionSummary; source: 'live' | 'mock'; error?: string }> {
  const url = mock ? `/api/operations/engine/${encodeURIComponent(name)}/predict?mock=true` : `/api/operations/engine/${encodeURIComponent(name)}/predict`;
  const res = await safeFetchJSON<PredictResp<PredictionSummary>>(url, { defaultValue: {} as any });
  if (!res?.data) {
    return { data: mockEngine(name), source: 'mock', error: res?.error };
  }
  return { data: res.data, source: (res.source as any) || 'live', error: res.error };
}


