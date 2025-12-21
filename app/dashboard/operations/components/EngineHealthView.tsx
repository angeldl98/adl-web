"use client";

type EngineStatus = {
  name?: string;
  key?: string;
  status?: string;
  cpu?: number;
  ram?: number;
  backlog?: number;
  lastAgentBeat?: string;
  trend?: 'improving' | 'stable' | 'degrading';
};

function trendLabel(trend?: EngineStatus['trend']) {
  if (!trend) return 'stable';
  return trend;
}

export function EngineHealthView({ engines, error }: { engines: EngineStatus[]; error?: string }) {
  if (error) {
    return (
      <div className="card">
        <h3>Engine Health</h3>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Engine Health</h3>
      {!engines.length && <p className="muted">Sin datos de engines</p>}
      <div className="grid cols-3">
        {engines.map((e, idx) => (
          <div key={e.key || idx} className="stack gap-8">
            <div className="flex gap-8" style={{ alignItems: 'center' }}>
              <span className={`pill ${e.status === 'healthy' ? 'ok' : 'danger'}`}>{e.status || 'unknown'}</span>
              <span className="muted">{e.name || e.key || 'engine'}</span>
            </div>
            <div className="muted">CPU: {e.cpu ?? 'N/D'} · RAM: {e.ram ?? 'N/D'}</div>
            <div className="muted">Backlog: {e.backlog ?? 'N/D'}</div>
            <div className="muted">Último beat: {e.lastAgentBeat || 'N/D'}</div>
            <div className="pill">{`Tendencia: ${trendLabel(e.trend)}`}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


