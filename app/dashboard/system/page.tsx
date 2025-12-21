export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function getStatus() {
  const res = await fetch('/api/system/status', { cache: 'no-store' });
  if (!res.ok) {
    return { error: `No se pudo obtener el estado (${res.status})` };
  }
  return res.json();
}

function Pill({ ok }: { ok: boolean }) {
  return <span className={`pill ${ok ? 'ok' : 'danger'}`}>{ok ? 'OK' : 'ERROR'}</span>;
}

export default async function SystemPage() {
  const status = await getStatus();

  if (status.error) {
    return (
      <main className="page">
        <div className="card w-640">
          <h1 className="title">Sistema</h1>
          <p className="error">{status.error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="stack gap-16">
        <div className="section-title">
          <h1 className="title">Sistema</h1>
          <p className="muted">Diagnóstico de ADL Web</p>
        </div>

        <div className="grid cols-3">
          <div className="card">
            <h3>Core Auth</h3>
            <Pill ok={status.coreAuth?.ok} />
            <p className="muted">Estado: {status.coreAuth?.status || status.coreAuth?.error || 'N/D'}</p>
          </div>
          <div className="card">
            <h3>Backend API</h3>
            <Pill ok={status.backend?.ok} />
            <p className="muted">Estado: {status.backend?.status || status.backend?.error || 'N/D'}</p>
          </div>
          <div className="card">
            <h3>Sesión</h3>
            <Pill ok={status.session?.ok && status.session?.body?.valid} />
            <p className="muted">
              {status.session?.body?.valid ? 'Válida' : status.session?.body?.reason || 'No válida'}
            </p>
          </div>
        </div>

        <div className="card">
          <h3>Variables de entorno (NEXT_PUBLIC_*)</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(status.env || {}, null, 2)}</pre>
        </div>
      </div>
    </main>
  );
}


