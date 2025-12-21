import { safeFetchJSON } from '../../lib/fetcher';

async function fetchOverview() {
  const diagnostics = await safeFetchJSON<any>('/api/diagnostics', { defaultValue: {} });
  const services = await safeFetchJSON<any>('/api/services', { defaultValue: { services: [] } });
  const total = services.services?.length || 0;
  const healthy = services.services?.filter((s: any) => s.status === 'healthy').length || 0;
  const engines = services.services?.filter((s: any) => s.type === 'engine').length || 0;
  const lastScript = diagnostics?.diagnostics?.['adl-scripts-status.json']?.lastRun?.finishedAt;
  return { diagnostics: diagnostics.diagnostics || {}, services: services.services || [], total, healthy, engines, lastScript };
}

export default async function Dashboard() {
  const data = await fetchOverview();
  return (
    <div className="stack gap-16">
      <div className="section-title">
        <h1 className="title">Panel general</h1>
        <p className="muted">Estado resumido de la suite.</p>
      </div>
      <div className="grid cols-3">
        <div className="card">
          <h3>Servicios</h3>
          <p className="muted">{data.total} registrados</p>
          <div className="pill ok">Healthy: {data.healthy}</div>
        </div>
        <div className="card">
          <h3>Engines</h3>
          <p className="muted">{data.engines} activos (según mapa)</p>
        </div>
        <div className="card">
          <h3>Última ejecución ADL-SCRIPT</h3>
          <p className="muted">{data.lastScript ? data.lastScript : 'N/D'}</p>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <h3>Brain</h3>
          <p className="muted">Estado según agentes</p>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data.diagnostics['agents-status.json'] || {}, null, 2)}</pre>
        </div>
        <div className="card">
          <h3>Event Bus</h3>
          <p className="muted">eventbus-status.json</p>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data.diagnostics['eventbus-status.json'] || {}, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
