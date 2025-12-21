"use client";

import { PredictionGlobal } from '../types/insights';

export function PredictionsGlobal({
  data,
  source,
  error
}: {
  data: PredictionGlobal;
  source?: string;
  error?: string;
}) {
  return (
    <div className="card">
      <div className="flex gap-8" style={{ alignItems: 'center' }}>
        <h3>Predicciones (Global)</h3>
        <span className={`pill ${source === 'live' ? 'ok' : 'warn'}`}>{source === 'live' ? 'live data' : 'mock data'}</span>
      </div>
      {error && <p className="error">Prediction engine unavailable: {error}</p>}
      <p className="muted">Estado: {data.systemStatus || 'N/D'}</p>
      <div style={{ marginTop: 8 }}>
        <strong>Hotspots:</strong>
        <div className="list-inline" style={{ marginTop: 6 }}>
          {data.hotspots?.length
            ? data.hotspots.map(h => <span key={h} className="tag">{h}</span>)
            : <span className="muted">Sin hotspots.</span>}
        </div>
      </div>
      <div className="grid cols-3" style={{ marginTop: 12 }}>
        {data.predictions?.map(p => (
          <div key={p.engine} className="stack gap-4" style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 10 }}>
            <strong>{p.engine}</strong>
            <span className="muted">Backlog previsto: {p.backlogForecast ?? 'N/D'}</span>
            <span className="muted">CPU trend: {p.cpuTrend ?? 'N/D'}</span>
            <span className="muted">Escalado recomendado: {p.scaleRecommendation ?? 'N/D'}</span>
            <span className="muted">Riesgo: {p.riskLevel ?? 'N/D'}</span>
          </div>
        ))}
        {!data.predictions?.length && <p className="muted" style={{ gridColumn: '1 / -1' }}>Sin predicciones disponibles.</p>}
      </div>
    </div>
  );
}


