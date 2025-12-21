import { safeFetchJSON, formatDate } from '../../../lib/fetcher';

async function fetchDags() {
  const list = await safeFetchJSON<any>('http://core-dag:4211/dag/list', { defaultValue: { dags: [] } });
  const firstId = list.dags?.[0]?.id;
  let detail: any = null;
  let runs: any[] = [];
  if (firstId) {
    detail = await safeFetchJSON<any>(`http://core-dag:4211/dag/detail/${firstId}`, { defaultValue: null });
    runs = await safeFetchJSON<any>(`http://core-dag:4211/dag/runs/${firstId}`, { defaultValue: [] });
  }
  return { list: list.dags || [], detail, runs };
}

export default async function DagsPage() {
  const data = await fetchDags();
  return (
    <div className="stack gap-16">
      <div className="section-title">
        <h1 className="title">DAGs & Pipelines</h1>
        <p className="muted">Listado de DAGs registrados en core-dag.</p>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Triggers</th>
            </tr>
          </thead>
          <tbody>
            {data.list.map((d: any) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.name}</td>
                <td>{d.description}</td>
                <td>{d.triggers ? JSON.stringify(d.triggers) : 'N/D'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.detail && (
        <div className="grid cols-2">
          <div className="card">
            <h3>Detalle: {data.detail.id}</h3>
            <p className="muted">{data.detail.description}</p>
            <div className="list-inline">
              {data.detail.nodes?.map((n: any) => (
                <span key={n.id} className="tag">{n.id} · {n.type}</span>
              ))}
            </div>
          </div>
          <div className="card">
            <h3>Últimas ejecuciones</h3>
            <table className="table">
              <thead>
                <tr><th>Run</th><th>Estado</th><th>Inicio</th><th>Fin</th></tr>
              </thead>
              <tbody>
                {data.runs.map((r: any) => (
                  <tr key={r.runId || r.id}>
                    <td>{r.runId || r.id}</td>
                    <td>{r.status}</td>
                    <td>{formatDate(r.startedAt)}</td>
                    <td>{formatDate(r.finishedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

