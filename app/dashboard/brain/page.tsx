import { safeFetchJSON, formatDate } from '../../../lib/fetcher';

async function fetchBrain() {
  const diag = await safeFetchJSON<any>('/api/diagnostics', { defaultValue: { diagnostics: {} } });
  const agents = diag?.diagnostics?.['agents-status.json']?.agents || [];
  const lastTask = diag?.diagnostics?.['agents-status.json']?.lastTaskId;
  return { agents, lastTask };
}

export default async function BrainPage() {
  const data = await fetchBrain();
  return (
    <div className="stack gap-16">
      <div className="section-title">
        <h1 className="title">Brain & Agents</h1>
        <p className="muted">Actividad y salud de agentes.</p>
      </div>
      <div className="card">
        <h3>Última tarea</h3>
        <p className="muted">{data.lastTask || 'N/D'}</p>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Agente</th>
              <th>Última actividad</th>
              <th>Estado</th>
              <th>Errores</th>
            </tr>
          </thead>
          <tbody>
            {data.agents.map((a: any) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{formatDate(a.lastRunAt)}</td>
                <td>{a.lastStatus || 'N/D'}</td>
                <td>{a.errors || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

