import { Suspense } from 'react';
import { getCatalog, getMemory } from './loaders';
import { CognitiveTabs } from './components/CognitiveTabs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function CognitivePage() {
  const [memory, catalog] = await Promise.all([getMemory(), getCatalog()]);

  return (
    <main className="page">
      <div className="stack gap-16">
        <div className="section-title">
          <h1 className="title">Cognitive Dashboard</h1>
          <p className="muted">ADL Brain v2 — reasoning, traces, memory y catálogo.</p>
        </div>

        <Suspense fallback={<div className="card"><p className="muted">Cargando datos cognitivos...</p></div>}>
          <CognitiveTabs
            memory={memory.data}
            catalog={catalog.data}
            memoryError={memory.error}
            catalogError={catalog.error}
          />
        </Suspense>
      </div>
    </main>
  );
}


