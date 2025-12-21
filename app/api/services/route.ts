import { NextResponse } from 'next/server';
import { services } from '../../../lib/services';
import { safeFetchJSON } from '../../../lib/fetcher';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type ServiceStatus = {
  name: string;
  key: string;
  type: string;
  port: number;
  description: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  baseUrl: string;
  health?: string;
  metrics?: string;
  info?: string;
};

export async function GET() {
  const results: ServiceStatus[] = [];
  await Promise.all(
    services.map(async svc => {
      let status: ServiceStatus['status'] = 'unknown';
      if (svc.healthPath) {
        try {
          const data = await safeFetchJSON<any>(`${svc.baseUrl}${svc.healthPath}`, { timeoutMs: 2000 });
          status = data?.status === 'ok' || data?.status === 'healthy' ? 'healthy' : 'unknown';
        } catch {
          status = 'unhealthy';
        }
      }
      results.push({
        name: svc.name,
        key: svc.key,
        type: svc.type,
        port: svc.port,
        description: svc.description,
        status,
        baseUrl: svc.baseUrl,
        health: svc.healthPath ? `${svc.baseUrl}${svc.healthPath}` : undefined,
        metrics: svc.metricsPath ? `${svc.baseUrl}${svc.metricsPath}` : undefined,
        info: svc.infoPath ? `${svc.baseUrl}${svc.infoPath}` : undefined
      });
    })
  );

  return NextResponse.json({ services: results });
}

