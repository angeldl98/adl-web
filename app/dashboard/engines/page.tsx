import { safeFetchJSON } from '../../../lib/fetcher';
import { engines } from '../../../lib/services';

async function fetchStatuses() {
  const res = await safeFetchJSON<{ services: any[] }>('/api/services', { defaultValue: { services: [] } });
  const map = new Map(res.services.map(s => [s.key, s]));
  return engines.map(e => ({
    ...e,
    status: map.get(e.key)?.status || 'unknown'
  }));
}

export default async function EnginesPage() {
  const data = await fetchStatuses();
  return (
    <div className="stack gap-16">
      <div className="section-title">
        <h1 className="title">Engines</h1>
        <p className="muted">Estado resumido de cada engine.</p>
      </div>
      <div className="grid cols-3">
        {data.map(engine => (
          <div key={engine.key} className="card">
            <h3>{engine.name}</h3>
            <p className="muted">{engine.description}</p>
            <div className={`pill ${engine.status === 'healthy' ? 'ok' : engine.status === 'unhealthy' ? 'danger' : 'warn'}`}>
              {engine.status}
            </div>
            <p className="muted">Puerto {engine.port}</p>
            <div className="list-inline">
              <a href={`${engine.baseUrl}/health`} target="_blank">health</a>
              <a href={`${engine.baseUrl}/info`} target="_blank">info</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

