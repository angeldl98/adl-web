"use client";

import { RecommendationSummary } from '../../types/insights';

export function Recommendations({ data, source, error }: { data: RecommendationSummary[]; source?: string; error?: string }) {
  const systemMessage = !data.length
    ? 'Sin recomendaciones. Sistema estable o sin datos.'
    : data.some(r => r.impact === 'high')
      ? 'Sistema bajo presión'
      : 'Sistema estable';

  return (
    <div className="card">
      <div className="flex gap-8" style={{ alignItems: 'center' }}>
        <h3>Recommendations</h3>
        <span className={`pill ${source === 'live' ? 'ok' : 'warn'}`}>{source === 'live' ? 'live data' : 'mock data'}</span>
      </div>
      {error && <p className="error">{error}</p>}
      <p className="muted">{systemMessage}</p>
      <div className="grid cols-3">
        {data.map(rec => (
          <div key={rec.id} className="stack gap-6" style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 10 }}>
            <strong>{rec.title}</strong>
            <p className="muted">{rec.description}</p>
            <span className="pill">{rec.impact ? `Impacto: ${rec.impact}` : 'Impacto: N/D'}</span>
            <span className="muted">Trend: {rec.trend || 'N/D'}</span>
            <span className="muted">
              Motores: {rec.relatedEngines?.length ? rec.relatedEngines.join(', ') : 'N/D'}
            </span>
            <span className="muted">Acción: {rec.suggestedAction || 'N/D'}</span>
          </div>
        ))}
        {!data.length && <p className="muted" style={{ gridColumn: '1 / -1' }}>Sin recomendaciones disponibles.</p>}
      </div>
    </div>
  );
}


