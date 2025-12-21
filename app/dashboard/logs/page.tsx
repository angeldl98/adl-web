"use client";

import { useEffect, useState } from 'react';

type LogFile = string;

export default function LogsPage() {
  const [files, setFiles] = useState<LogFile[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [tail, setTail] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/logs')
      .then(r => r.json())
      .then(data => setFiles(data.files || []))
      .catch(() => setFiles([]));
  }, []);

  const loadTail = async (file: string) => {
    setSelected(file);
    setLoading(true);
    try {
      const res = await fetch(`/api/logs?file=${encodeURIComponent(file)}&limit=200`);
      const data = await res.json();
      setTail(data.tail || []);
    } catch {
      setTail(['error al leer log']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stack gap-16">
      <div className="section-title">
        <h1 className="title">Logs & Métricas</h1>
        <p className="muted">Explora logs de servicios (últimas 200 líneas).</p>
      </div>
      <div className="card">
        <div className="list-inline">
          {files.map(f => (
            <button key={f} className="btn secondary" onClick={() => loadTail(f)} disabled={loading && selected === f}>
              {f}
            </button>
          ))}
          {files.length === 0 && <p className="muted">No hay logs listados.</p>}
        </div>
      </div>
      {selected && (
        <div className="card">
          <h3>{selected}</h3>
          {loading ? <p className="muted">Cargando...</p> : <pre style={{ whiteSpace: 'pre-wrap' }}>{tail.join('\n')}</pre>}
        </div>
      )}
    </div>
  );
}

