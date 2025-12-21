"use client";

import { useMemo, useState } from 'react';
import type { MemoryData } from '../types';

export function MemoryViewer({ data, error }: { data?: MemoryData; error?: string }) {
  const [tag, setTag] = useState('');

  const filteredReflections = useMemo(() => {
    if (!data?.reflections) return [];
    return data.reflections.filter(r => !tag || r.tags?.includes(tag));
  }, [data?.reflections, tag]);

  const filteredTraces = useMemo(() => {
    if (!data?.traces) return [];
    return data.traces.filter(t => !tag || t.tags?.includes(tag));
  }, [data?.traces, tag]);

  return (
    <div className="card">
      <h3>Memory Viewer</h3>
      {error && <p className="error">{error}</p>}
      <div className="flex gap-8" style={{ alignItems: 'center' }}>
        <input className="input" placeholder="Filtrar por tag" value={tag} onChange={e => setTag(e.target.value)} />
      </div>

      <section style={{ marginTop: 12 }}>
        <h4>Reflections</h4>
        {!filteredReflections.length && <p className="muted">Sin reflexiones.</p>}
        <div className="stack gap-8">
          {filteredReflections.map(r => (
            <div key={r.id} className="stack gap-4" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 6 }}>
              <strong>{r.id}</strong>
              <p>{r.text}</p>
              <p className="muted">{r.timestamp ? new Date(r.timestamp).toLocaleString('es-ES') : 'N/D'}</p>
              <div className="list-inline">
                {r.tags?.length ? r.tags.map(t => <span key={t} className="tag">{t}</span>) : <span className="muted">Sin tags</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 12 }}>
        <h4>Traces</h4>
        {!filteredTraces.length && <p className="muted">Sin trazas almacenadas.</p>}
        <div className="stack gap-8">
          {filteredTraces.map(t => (
            <div key={t.id} className="stack gap-4" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 6 }}>
              <strong>{t.id}</strong>
              <p className="muted">{t.summary || 'Sin resumen'}</p>
              <p className="muted">{t.timestamp ? new Date(t.timestamp).toLocaleString('es-ES') : 'N/D'}</p>
              <div className="list-inline">
                {t.tags?.length ? t.tags.map(tag => <span key={tag} className="tag">{tag}</span>) : <span className="muted">Sin tags</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


