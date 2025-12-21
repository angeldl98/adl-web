"use client";

import { useState } from 'react';
import type { OrchestrateResponse } from '../types';

export function CognitiveConsole() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<OrchestrateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/cognitive/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body?.error || 'Orchestration failed');
      } else {
        setResult(body);
      }
      if (res.status === 403) {
        setError('Orchestración bloqueada (apply forbidden).');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Cognitive Console</h3>
      <p className="muted">Ejecuta una orquestación cognitiva (solo propuesta, sin aplicar).</p>
      <textarea
        className="input"
        rows={4}
        placeholder="Describe la tarea cognitiva..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <div className="flex gap-8" style={{ alignItems: 'center' }}>
        <button className="btn primary" onClick={run} disabled={loading || !input.trim()}>
          {loading ? 'Orquestando...' : 'Run Cognitive Orchestration'}
        </button>
        {error && <span className="error">{error}</span>}
      </div>
      {result && (
        <div className="stack gap-4" style={{ marginTop: 12 }}>
          <strong>ID:</strong> <span className="muted">{result.id || result.traceId || 'N/D'}</span>
          <strong>Resumen:</strong> <span className="muted">{result.summary || result.message || 'N/D'}</span>
          <strong>Timestamp:</strong> <span className="muted">{result.timestamp || 'N/D'}</span>
          <details>
            <summary>Ver JSON</summary>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
}


