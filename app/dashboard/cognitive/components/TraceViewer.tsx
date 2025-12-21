"use client";

import { useState } from 'react';
import { getTrace } from '../loaders';
import type { TraceData } from '../types';

export function TraceViewer() {
  const [traceId, setTraceId] = useState('');
  const [data, setData] = useState<TraceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    const res = await getTrace(traceId);
    if (res.error) {
      setError(res.error);
    } else {
      setData(res.data || null);
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h3>Trace Viewer</h3>
      <div className="flex gap-8" style={{ alignItems: 'center' }}>
        <input className="input" value={traceId} onChange={e => setTraceId(e.target.value)} placeholder="Trace ID" />
        <button className="btn" onClick={load} disabled={!traceId || loading}>{loading ? 'Cargando...' : 'Cargar'}</button>
        {error && <span className="error">{error}</span>}
      </div>
      {!data && !error && <p className="muted">Ingresa un Trace ID para ver el detalle.</p>}
      {data && (
        <div className="stack gap-12" style={{ marginTop: 12 }}>
          <section>
            <h4>Reasoning chain</h4>
            {data.reasoning?.length ? data.reasoning.map((r, idx) => (
              <div key={idx} className="stack gap-4" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 6 }}>
                <strong>{r.step || `Paso ${idx + 1}`}</strong>
                <p className="muted">{r.ts ? new Date(r.ts).toLocaleString('es-ES') : ''}</p>
                <p>{r.content}</p>
              </div>
            )) : <p className="muted">Sin reasoning.</p>}
          </section>

          <section>
            <h4>Taskgraph</h4>
            {data.taskgraph?.length ? (
              <div className="stack gap-6">
                {data.taskgraph.map(node => (
                  <div key={node.id} className="stack gap-4" style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 8 }}>
                    <strong>{node.title || node.id}</strong>
                    <span className="pill">{node.status || 'unknown'}</span>
                    <p className="muted">Depends on: {node.dependsOn?.length ? node.dependsOn.join(', ') : 'N/A'}</p>
                    <p className="muted">Inicio: {node.startedAt ? new Date(node.startedAt).toLocaleString('es-ES') : 'N/D'}</p>
                    <p className="muted">Fin: {node.finishedAt ? new Date(node.finishedAt).toLocaleString('es-ES') : 'N/D'}</p>
                  </div>
                ))}
              </div>
            ) : <p className="muted">Sin taskgraph.</p>}
          </section>

          <section>
            <h4>Policy decisions</h4>
            {data.policy
              ? <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data.policy, null, 2)}</pre>
              : <p className="muted">Sin decisiones de policy.</p>}
          </section>

          <section>
            <h4>Safety</h4>
            {data.safety
              ? <pre style={{ whiteSpace: 'pre-wrap', background: '#fff5f5', padding: 8 }}>{JSON.stringify(data.safety, null, 2)}</pre>
              : <p className="muted">Sin alertas de safety.</p>}
          </section>

          <section>
            <h4>Executor</h4>
            {data.executor
              ? <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data.executor, null, 2)}</pre>
              : <p className="muted">Sin datos de executor.</p>}
          </section>

          <section>
            <h4>Memory access</h4>
            {data.memory
              ? <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data.memory, null, 2)}</pre>
              : <p className="muted">Sin lecturas/escrituras.</p>}
          </section>

          <section>
            <h4>Reflection</h4>
            {data.reflection
              ? <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data.reflection, null, 2)}</pre>
              : <p className="muted">Sin reflexiones.</p>}
          </section>

          <section>
            <h4>Timeline</h4>
            {data.timeline?.length
              ? data.timeline.map((t, idx) => (
                <div key={idx} className="flex gap-8" style={{ alignItems: 'center' }}>
                  <span className="muted">{t.ts ? new Date(t.ts).toLocaleString('es-ES') : ''}</span>
                  <span>{t.label}</span>
                </div>
              ))
              : <p className="muted">Sin timeline.</p>}
          </section>
        </div>
      )}
    </div>
  );
}


