import { safeFetchJSON } from '../../../lib/fetcher';
import { EngineHealthView } from './components/EngineHealthView';
import { AutoscalerView } from './components/AutoscalerView';
import { LogsView } from './components/LogsView';
import { InsightsOverview } from './components/Insights/InsightsOverview';
import { Recommendations } from './components/Insights/Recommendations';
import { getInsights, getRecommendations } from './insightsLoaders';
import { Suspense } from 'react';
import { EngineDetailPanel } from './components/Insights/EngineDetailPanel';
import { getAlerts } from './alertsLoaders';
import { getPredictGlobal } from './predictLoaders';
import { AlertsPanel } from './components/AlertsPanel';
import { PredictionsGlobal } from './components/PredictionsGlobal';

type StatusResponse = {
  engines?: any[];
  error?: string;
};

type AutoscalerResponse = {
  instances?: Record<string, string[]>;
  events?: any[];
  error?: string;
};

type LogsResponse = {
  logs?: any[];
  error?: string;
};

async function getData() {
  const [status, autoscaler, logs, insights, recommendations, alerts, predictGlobal] = await Promise.all([
    safeFetchJSON<StatusResponse>('/api/operations/status', { defaultValue: { engines: [] } }),
    safeFetchJSON<AutoscalerResponse>('/api/operations/autoscaler', { defaultValue: {} }),
    safeFetchJSON<LogsResponse>('/api/operations/logs', { defaultValue: { logs: [] } }),
    getInsights(),
    getRecommendations(),
    getAlerts(),
    getPredictGlobal()
  ]);
  return { status, autoscaler, logs, insights, recommendations, alerts, predictGlobal };
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function Tabs({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}

export default async function OperationsPage() {
  const { status, autoscaler, logs, insights, recommendations, alerts, predictGlobal } = await getData();

  const defaultEngine = insights.data.engines?.[0]?.name || 'engine-solvency';
  const engineNames = (insights.data.engines || []).map(e => e.name);

  return (
    <main className="page">
      <div className="stack gap-16">
        <div className="section-title">
          <h1 className="title">Operations</h1>
          <p className="muted">Visibilidad de salud, escalado y observabilidad.</p>
        </div>

        <div className="card">
          <div className="list-inline" style={{ gap: 8 }}>
            <span className="pill ok">Engines</span>
            <span className="pill ok">Autoscaler</span>
            <span className="pill ok">Logs</span>
            <span className={`pill ${insights.source === 'live' ? 'ok' : 'warn'}`}>Insights</span>
            <span className={`pill ${alerts.source === 'live' ? 'ok' : 'warn'}`}>Alerts</span>
            <span className={`pill ${predictGlobal.source === 'live' ? 'ok' : 'warn'}`}>Predict</span>
          </div>
          <p className="muted">Datos provienen de core-insights; mock solo si falta URL o se fuerza con ?mock=true.</p>
        </div>

        <EngineHealthView engines={status.engines || []} error={status.error} />

        <AutoscalerView state={{ instances: autoscaler.instances, events: autoscaler.events }} error={autoscaler.error} />

        <LogsView logs={logs.logs || []} error={logs.error} />

        <Suspense fallback={<div className="card"><p className="muted">Cargando insights...</p></div>}>
          <InsightsOverview data={insights.data} source={insights.source} error={insights.error} />
          <EngineDetailPanel engines={engineNames} defaultEngine={defaultEngine} />
          <Recommendations data={recommendations.data} source={recommendations.source} error={recommendations.error} />
          <AlertsPanel data={alerts.data} source={alerts.source} error={alerts.error} />
          <PredictionsGlobal data={predictGlobal.data} source={predictGlobal.source} error={predictGlobal.error} />
        </Suspense>
      </div>
    </main>
  );
}


