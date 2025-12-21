"use client";

import { GlobalInsights } from '../../types/insights';

export function InsightsOverview({ data, source, error }: { data: GlobalInsights; source?: string; error?: string }) {
  const badge = source === 'live' ? 'live data' : 'mock data';
  return (
    <div className="card">
      <div className="flex gap-8" style={{ alignItems: 'center' }}>
        <h3>Insights (overview)</h3>
        <span className={`pill ${source === 'live' ? 'ok' : 'warn'}`}>{badge}</span>
      </div>
      {error && <p className="error">{error}</p>}
      <p className="muted">Fuente: {source || 'mock'}</p>
      <p>{data.summary || 'Sin resumen disponible.'}</p>
      <div className="list-inline">
        <span className={`pill ${data.overallTrend === 'degrading' ? 'danger' : data.overallTrend === 'improving' ? 'ok' : 'warn'}`}>
          Tendencia: {data.overallTrend}
        </span>
        <span className="muted">Generado: {new Date(data.generatedAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</span>
      </div>
      <div style={{ marginTop: 12 }}>
        <strong>Puntos calientes:</strong>
        <div className="list-inline" style={{ marginTop: 8 }}>
          {data.hotspots?.length
            ? data.hotspots.map(h => <span key={h} className="tag">{h}</span>)
            : <span className="muted">Sin hotspots detectados.</span>}
        </div>
      </div>
      <div className="grid cols-3" style={{ marginTop: 12 }}>
        {(data.engines || []).map(e => (
          <div key={e.name} className="stack gap-4" style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 10 }}>
            <strong>{e.name}</strong>
            <span className={`pill ${e.status === 'healthy' ? 'ok' : e.status === 'unhealthy' ? 'danger' : 'warn'}`}>
              {e.status}
            </span>
            <span className="muted">Tendencia: {e.trend}</span>
            <span className="muted">Latency: {e.latencyMs ?? 'N/D'} ms</span>
            <span className="muted">Error rate: {e.errorRate ?? 'N/D'}%</span>
            <span className="muted">Backlog: {e.backlog ?? 'N/D'}</span>
          </div>
        ))}
        {!data.engines?.length && <p className="muted" style={{ gridColumn: '1 / -1' }}>Sin engines en la vista.</p>}
      </div>
    </div>
  );
}


