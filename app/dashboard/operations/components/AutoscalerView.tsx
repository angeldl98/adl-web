"use client";

type AutoscalerEvent = {
  ts?: string;
  action?: 'scale_up' | 'scale_down' | string;
  reason?: string;
  engine?: string;
  details?: any;
};

type AutoscalerState = {
  instances?: Record<string, string[]>;
  events?: AutoscalerEvent[];
};

const reasonLabels: Record<string, string> = {
  high_cpu: 'Alta CPU',
  high_latency: 'Alta latencia',
  congestion: 'Congestión',
  'agent-event': 'Evento de agente'
};

function formatTs(ts?: string) {
  if (!ts) return 'N/D';
  return new Date(ts).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'medium' });
}

export function AutoscalerView({ state, error }: { state: AutoscalerState; error?: string }) {
  if (error) {
    return (
      <div className="card">
        <h3>Autoscaler</h3>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Autoscaler</h3>
      <div className="stack gap-12">
        <div>
          <h4>Instancias</h4>
          {!state.instances && <p className="muted">Sin datos</p>}
          {state.instances && (
            <div className="stack gap-8">
              {Object.entries(state.instances).map(([engine, instances]) => (
                <div key={engine} className="stack gap-4">
                  <strong>{engine}</strong>
                  <div className="list-inline">
                    {instances.map((inst, idx) => (
                      <span key={inst || idx} className="tag">{inst}</span>
                    ))}
                    {!instances.length && <span className="muted">Sin instancias</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4>Eventos recientes</h4>
          {!state.events?.length && <p className="muted">Sin eventos</p>}
          {state.events?.length && (
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Acción</th>
                  <th>Motor</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {state.events.map((ev, idx) => (
                  <tr key={idx}>
                    <td>{formatTs(ev.ts)}</td>
                    <td>{ev.action}</td>
                    <td>{ev.engine || 'N/D'}</td>
                    <td>{reasonLabels[ev.reason || ''] || ev.reason || 'N/D'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}


