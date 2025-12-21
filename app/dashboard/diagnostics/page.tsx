import { safeFetchJSON } from '../../../lib/fetcher';

export default async function DiagnosticsPage() {
  const data = await safeFetchJSON<any>('/api/diagnostics', { defaultValue: { diagnostics: {} } });
  const diag = data.diagnostics || {};
  return (
    <div className="stack gap-16">
      <div className="section-title">
        <h1 className="title">Diagnostics</h1>
        <p className="muted">Archivos clave en /opt/adl-suite/diagnostics.</p>
      </div>
      {Object.keys(diag).length === 0 && <p className="muted">No se encontraron archivos de diagnóstico.</p>}
      <div className="grid cols-2">
        {Object.entries(diag).map(([key, value]) => (
          <div key={key} className="card">
            <h3>{key}</h3>
            <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 360, overflow: 'auto' }}>{JSON.stringify(value, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

