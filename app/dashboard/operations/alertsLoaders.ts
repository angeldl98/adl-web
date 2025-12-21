import { safeFetchJSON } from '../../../lib/fetcher';
import { AlertEntry } from './types/insights';

type AlertResp = { data?: AlertEntry[]; source?: string; error?: string };

export async function getAlerts(mock?: boolean): Promise<{ data: AlertEntry[]; source: 'live' | 'mock'; error?: string }> {
  const url = mock ? '/api/operations/alerts?mock=true' : '/api/operations/alerts';
  const res = await safeFetchJSON<AlertResp>(url, { defaultValue: {} as any });
  if (!res?.data) {
    return { data: [], source: 'mock', error: res?.error };
  }
  return { data: res.data, source: (res.source as any) || 'live', error: res.error };
}


