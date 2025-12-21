import { safeFetchJSON } from '../../../lib/fetcher';
import { CatalogData, MemoryData, TraceData } from './types';

export async function getMemory(): Promise<{ data?: MemoryData; error?: string }> {
  const res = await safeFetchJSON<any>('/api/cognitive/memory', { defaultValue: {} });
  if (res?.error) return { error: res.error };
  return { data: res };
}

export async function getCatalog(): Promise<{ data?: CatalogData; error?: string }> {
  const res = await safeFetchJSON<any>('/api/cognitive/catalog', { defaultValue: {} });
  if (res?.error) return { error: res.error };
  return { data: res };
}

export async function getTrace(id: string): Promise<{ data?: TraceData; error?: string }> {
  const res = await safeFetchJSON<any>(`/api/cognitive/trace/${encodeURIComponent(id)}`, { defaultValue: {} });
  if (res?.error) return { error: res.error };
  return { data: res };
}


