import { safeFetchJSON } from '../../../lib/fetcher';
import { services as serviceMap } from '../../../lib/services';

async function getData() {
  const res = await safeFetchJSON<{ services: any[] }>('/api/services', { defaultValue: { services: [] } });
  return res.services;
}

function statusPill(status: string) {
  const cls = status === 'healthy' ? 'ok' : status === 'unhealthy' ? 'danger' : 'warn';
  const label = status === 'healthy' ? 'Healthy' : status === 'unhealthy' ? 'Unhealthy' : 'Unknown';
  return <span className={`pill ${cls}`}>{label}</span>;
}

export default async function ServicesPage() {
  const data = await getData();
  return (
    <div className="stack gap-16">
      <div className="section-title">
        <h1 className="title">Servicios</h1>
        <p className="muted">Salud y metadatos de la suite.</p>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Puerto</th>
              <th>Estado</th>
              <th>Descripción</th>
              <th>Links</th>
            </tr>
          </thead>
          <tbody>
            {data.map(s => (
              <tr key={s.key}>
                <td>{s.name}</td>
                <td>{s.type}</td>
                <td>{s.port}</td>
                <td>{statusPill(s.status)}</td>
                <td>{s.description}</td>
                <td className="list-inline">
                  {s.health && (
                    <a href={s.health} target="_blank">health</a>
                  )}
                  {s.metrics && (
                    <a href={s.metrics} target="_blank">metrics</a>
                  )}
                  {s.info && (
                    <a href={s.info} target="_blank">info</a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card">
        <h3>Mapa estático (fuente SERVICE_MAP)</h3>
        <div className="list-inline">
          {serviceMap.map(s => (
            <span key={s.key} className="tag">{s.name} · {s.port}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

