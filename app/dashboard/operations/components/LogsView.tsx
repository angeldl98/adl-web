"use client";

import { useMemo, useState } from 'react';

type LogEntry = {
  ts?: string;
  level?: string;
  engine?: string;
  source?: string;
  message?: string;
};

function formatTs(ts?: string) {
  if (!ts) return '';
  return new Date(ts).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'medium' });
}

const levels = ['error', 'warn', 'info', 'debug'];

export function LogsView({ logs, error }: { logs: LogEntry[]; error?: string }) {
  const [engine, setEngine] = useState('');
  const [level, setLevel] = useState('');
  const [source, setSource] = useState('');

  const filtered = useMemo(() => {
    return logs.filter(l => {
      if (engine && l.engine !== engine) return false;
      if (level && l.level !== level) return false;
      if (source && l.source !== source) return false;
      return true;
    });
  }, [logs, engine, level, source]);

  if (error) {
    return (
      <div className="card">
        <h3>Observability Logs</h3>
        <p className="error">{error}</p>
      </div>
    );
  }

  const engines = Array.from(new Set(logs.map(l => l.engine).filter(Boolean))) as string[];
  const sources = Array.from(new Set(logs.map(l => l.source).filter(Boolean))) as string[];

  return (
    <div className="card">
      <h3>Observability Logs</h3>
      <div className="flex gap-8" style={{ alignItems: 'center', marginBottom: 12 }}>
        <select className="input" value={engine} onChange={e => setEngine(e.target.value)}>
          <option value="">Motor (todos)</option>
          {engines.map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <select className="input" value={level} onChange={e => setLevel(e.target.value)}>
          <option value="">Nivel (todos)</option>
          {levels.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select className="input" value={source} onChange={e => setSource(e.target.value)}>
          <option value="">Fuente (todas)</option>
          {sources.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="stack gap-8" style={{ maxHeight: 360, overflow: 'auto' }}>
        {!filtered.length && <p className="muted">Sin logs con esos filtros.</p>}
        {filtered.map((log, idx) => (
          <div key={idx} className="stack gap-4" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 6 }}>
            <div className="flex gap-8" style={{ alignItems: 'center' }}>
              <span className={`pill ${log.level === 'error' ? 'danger' : log.level === 'warn' ? 'warn' : 'ok'}`}>
                {log.level || 'info'}
              </span>
              <span className="muted">{formatTs(log.ts)}</span>
              <span className="muted">{log.engine || '-'}</span>
              <span className="muted">{log.source || '-'}</span>
            </div>
            <div>{log.message || ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


