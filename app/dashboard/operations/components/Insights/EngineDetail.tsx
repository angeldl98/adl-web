"use client";

import { EngineInsight, PredictionSummary } from '../../types/insights';

export function EngineDetail({
  data,
  prediction,
  source,
  predictionSource,
  error,
  predictionError
}: {
  data: EngineInsight;
  prediction?: PredictionSummary;
  source?: string;
  predictionSource?: string;
  error?: string;
  predictionError?: string;
}) {
  return (
    <div className="card">
      <h3>Engine Detail</h3>
      {error && <p className="error">{error}</p>}
      <p className="muted">Fuente: {source || 'mock'}</p>
      <div className="stack gap-8">
        <div className="flex gap-8" style={{ alignItems: 'center' }}>
          <strong>{data.name}</strong>
          <span className={`pill ${data.status === 'healthy' ? 'ok' : data.status === 'unhealthy' ? 'danger' : 'warn'}`}>
            {data.status}
          </span>
          <span className="muted">Trend: {data.trend}</span>
        </div>
        <div className="muted">Latency: {data.latencyMs ?? 'N/D'} ms</div>
        <div className="muted">Error rate: {data.errorRate ?? 'N/D'}%</div>
        <div className="muted">Backlog: {data.backlog ?? 'N/D'}</div>
        <div className="muted">Last update: {data.lastUpdate ? new Date(data.lastUpdate).toLocaleString('es-ES') : 'N/D'}</div>
        <div className="muted">Notas: {data.notes || 'Sin notas'}</div>
        {data.autoscaler && (
          <div className="stack gap-4">
            <strong>Autoscaler</strong>
            <div className="muted">Acción: {data.autoscaler.action || 'N/D'}</div>
            <div className="muted">Razón: {data.autoscaler.reason || 'N/D'}</div>
            <div className="muted">Score: {data.autoscaler.score ?? 'N/D'}</div>
            <div className="muted">Tamaño sugerido: {data.autoscaler.recommendedSize ?? 'N/D'}</div>
            <div className="muted">Fecha: {data.autoscaler.timestamp ? new Date(data.autoscaler.timestamp).toLocaleString('es-ES') : 'N/D'}</div>
          </div>
        )}
        {prediction && (
          <div className="stack gap-4">
            <div className="flex gap-8" style={{ alignItems: 'center' }}>
              <strong>Predicción</strong>
              <span className={`pill ${predictionSource === 'live' ? 'ok' : 'warn'}`}>{predictionSource || 'mock'}</span>
            </div>
            {predictionError && <p className="error">{predictionError}</p>}
            <div className="muted">Backlog previsto: {prediction.backlogForecast ?? 'N/D'}</div>
            <div className="muted">CPU trend: {prediction.cpuTrend ?? 'N/D'}</div>
            <div className="muted">Escalado recomendado: {prediction.scaleRecommendation ?? 'N/D'}</div>
            <div className="muted">Riesgo: {prediction.riskLevel ?? 'N/D'}</div>
          </div>
        )}
      </div>
    </div>
  );
}


