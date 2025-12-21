"use client";

import { useState } from 'react';
import { CognitiveConsole } from './CognitiveConsole';
import { TraceViewer } from './TraceViewer';
import { MemoryViewer } from './MemoryViewer';
import { CatalogViewer } from './CatalogViewer';
import type { CatalogData, MemoryData } from '../types';

type Tab = 'console' | 'trace' | 'memory' | 'catalog';

export function CognitiveTabs({
  memory,
  catalog,
  memoryError,
  catalogError
}: {
  memory?: MemoryData;
  catalog?: CatalogData;
  memoryError?: string;
  catalogError?: string;
}) {
  const [tab, setTab] = useState<Tab>('console');

  return (
    <div className="stack gap-12">
      <div className="list-inline" style={{ gap: 8 }}>
        <button className={`btn ${tab === 'console' ? 'primary' : ''}`} onClick={() => setTab('console')}>Cognitive Console</button>
        <button className={`btn ${tab === 'trace' ? 'primary' : ''}`} onClick={() => setTab('trace')}>Trace Viewer</button>
        <button className={`btn ${tab === 'memory' ? 'primary' : ''}`} onClick={() => setTab('memory')}>Memory</button>
        <button className={`btn ${tab === 'catalog' ? 'primary' : ''}`} onClick={() => setTab('catalog')}>Catalog</button>
      </div>

      {tab === 'console' && <CognitiveConsole />}
      {tab === 'trace' && <TraceViewer />}
      {tab === 'memory' && <MemoryViewer data={memory} error={memoryError} />}
      {tab === 'catalog' && <CatalogViewer data={catalog} error={catalogError} />}
    </div>
  );
}


