"use client";

import { useState } from 'react';

export default function ScriptRunner({ id }: { id: string }) {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch('/brain/script/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'run_failed');
      setStatus('OK');
    } catch (err: any) {
      setStatus(err?.message || 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stack gap-8">
      <button className="btn secondary" onClick={run} disabled={loading}>{loading ? 'Ejecutando...' : 'Run'}</button>
      {status && <span className={`pill ${status === 'OK' ? 'ok' : 'danger'}`}>{status}</span>}
    </div>
  );
}

