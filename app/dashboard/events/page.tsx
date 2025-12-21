import { safeFetchJSON } from '../../../lib/fetcher';

async function fetchEventBus() {
  const diag = await safeFetchJSON<any>('/api/diagnostics', { defaultValue: { diagnostics: {} } });
  const status = diag?.diagnostics?.['eventbus-status.json'] || {};
  return status;
}

export default async function EventsPage() {
  const status = await fetchEventBus();
  const topics = status.topics || [];
  return (
    <div className="stack gap-16">
      <div className="section-title">
        <h1 className="title">Event Bus</h1>
        <p className="muted">Resumen de temas y grupos.</p>
      </div>
      <div className="card">
        <h3>Topics</h3>
        <div className="list-inline">
          {topics.map((t: any) => (
            <span className="tag" key={t.name || t.topic}>{t.name || t.topic}</span>
          ))}
          {!topics.length && <p className="muted">Sin datos de topics (ver diagnostics/eventbus-status.json)</p>}
        </div>
      </div>
      <div className="card">
        <h3>DLQ</h3>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(status.dlq || {}, null, 2)}</pre>
      </div>
    </div>
  );
}

