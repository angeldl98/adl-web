"use client";

import { useMemo, useState } from 'react';
import { AlertEntry } from '../types/insights';

const severityClass: Record<string, string> = {
  critical: 'danger',
  warn: 'warn',
  info: 'ok'
};

export function AlertsPanel({ data, source, error }: { data: AlertEntry[]; source?: string; error?: string }) {
  const [engine, setEngine] = useState('');
  const [severity, setSeverity] = useState('');

  const engines = Array.from(new Set(data.map(a => a.engine).filter(Boolean)));

  const filtered = useMemo(() => {
    return data
      .filter(a => (engine ? a.engine === engine : true))
      .filter(a => (severity ? a.severity === severity : true))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [data, engine, severity]);

  return (
    <div className="card">
      <div className="flex gap-8" style={{ alignItems: 'center' }}>
        <h3>Alerts</h3>
        <span className={`pill ${source === 'live' ? 'ok' : 'warn'}`}>{source === 'live' ? 'live data' : 'mock data'}</span>
      </div>
      {error && <p className="error">Alerts service unavailable: {error}</p>}
      <div className="flex gap-8" style={{ alignItems: 'center', marginBottom: 12 }}>
        <select className="input" value={engine} onChange={e => setEngine(e.target.value)}>
          <option value="">Motor (todos)</option>
          {engines.map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <select className="input" value={severity} onChange={e => setSeverity(e.target.value)}>
          <option value="">Severidad (todas)</option>
          <option value="critical">Critical</option>
          <option value="warn">Warn</option>
          <option value="info">Info</option>
        </select>
      </div>
      {!filtered.length && <p className="muted">No hay alertas para los filtros seleccionados.</p>}
      <div className="stack gap-8" style={{ maxHeight: 360, overflow: 'auto' }}>
        {filtered.map(alert => (
          <div key={alert.id} className="stack gap-4" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 6 }}>
            <div className="flex gap-8" style={{ alignItems: 'center' }}>
              <span className={`pill ${severityClass[alert.severity] || 'warn'}`}>{alert.severity}</span>
              <span className="muted">{new Date(alert.timestamp).toLocaleString('es-ES')}</span>
              <strong>{alert.engine}</strong>
            </div>
            <div>{alert.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


