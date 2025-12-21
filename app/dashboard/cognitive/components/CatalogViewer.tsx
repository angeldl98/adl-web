"use client";

import type { CatalogData } from '../types';

export function CatalogViewer({ data, error }: { data?: CatalogData; error?: string }) {
  return (
    <div className="card">
      <h3>Catalog Viewer</h3>
      {error && <p className="error">{error}</p>}
      <div className="grid cols-2">
        <section>
          <h4>Tools</h4>
          {data?.tools?.length
            ? data.tools.map((t, idx) => <pre key={idx} style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(t, null, 2)}</pre>)
            : <p className="muted">Sin herramientas.</p>}
        </section>
        <section>
          <h4>Policies</h4>
          {data?.policies?.length
            ? data.policies.map((p, idx) => <pre key={idx} style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(p, null, 2)}</pre>)
            : <p className="muted">Sin políticas.</p>}
        </section>
        <section>
          <h4>Safety</h4>
          {data?.safety?.length
            ? data.safety.map((s, idx) => <pre key={idx} style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(s, null, 2)}</pre>)
            : <p className="muted">Sin reglas de safety.</p>}
        </section>
        <section>
          <h4>Roles</h4>
          {data?.roles?.length
            ? data.roles.map((r, idx) => <pre key={idx} style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(r, null, 2)}</pre>)
            : <p className="muted">Sin roles.</p>}
        </section>
      </div>
    </div>
  );
}


