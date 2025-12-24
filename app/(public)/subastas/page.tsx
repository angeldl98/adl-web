import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { getDbPool } from "@/lib/db";

export const dynamic = "force-dynamic";

type SubastaRow = {
  id: number;
  identificador: string | null;
  estado: string | null;
  valor_subasta: string | null;
  tasacion: string | null;
  url: string | null;
  organismo?: string | null;
};

type Stats = {
  total_subastas: number;
  subastas_activas: number;
  subastas_finalizadas: number;
  subastas_canceladas: number;
  valor_total_activas: string;
};

function formatEuro(value: number | null): string {
  if (value === null) return "0 €";
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

async function fetchStats(): Promise<Stats> {
  const pool = getDbPool();
  const sql = `
    WITH datos AS (
      SELECT
        estado,
        NULLIF(
          REPLACE(REPLACE(regexp_replace(valor_subasta, '[^0-9,\\.]', '', 'g'), '.', ''), ',', '.'),
          ''
        )::numeric AS valor_num
      FROM boe_subastas_public
    )
    SELECT
      COUNT(*) AS total_subastas,
      COUNT(*) FILTER (WHERE estado = 'Activa') AS subastas_activas,
      COUNT(*) FILTER (WHERE estado = 'Finalizada') AS subastas_finalizadas,
      COUNT(*) FILTER (WHERE estado = 'Cancelada') AS subastas_canceladas,
      COALESCE(SUM(valor_num) FILTER (WHERE estado = 'Activa'), 0) AS valor_total_activas
    FROM datos;
  `;
  const res = await pool.query(sql);
  const row = res.rows[0];
  return {
    total_subastas: Number(row.total_subastas || 0),
    subastas_activas: Number(row.subastas_activas || 0),
    subastas_finalizadas: Number(row.subastas_finalizadas || 0),
    subastas_canceladas: Number(row.subastas_canceladas || 0),
    valor_total_activas: formatEuro(row.valor_total_activas ? Number(row.valor_total_activas) : 0)
  };
}

async function fetchList(): Promise<SubastaRow[]> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/boe/subastas/free?limit=50&offset=0`, {
    cache: "no-store"
  });
  if (!res.ok) {
    return [];
  }
  const json = await res.json();
  return json?.data || [];
}

export default async function SubastasPage() {
  const [stats, list] = await Promise.all([fetchStats(), fetchList()]);
  const hasTarget = list.length > 0 && Boolean(list[0]?.identificador);
  const BUILD_MARKER = "BUILD_MARKER_2025-12-24_FREE";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="mx-auto max-w-6xl px-6 py-16 space-y-10">
        <div className="text-[10px] text-muted-foreground" data-build={BUILD_MARKER}>
          {BUILD_MARKER}
        </div>
        <header className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">Subastas BOE</h1>
              <p className="text-muted-foreground">Acceso público a subastas del BOE (vista gratuita).</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground">
            <span className="font-semibold">{stats.total_subastas}</span> subastas analizadas ·
            <span className="font-semibold">{stats.subastas_activas}</span> activas ·
            <span className="font-semibold">{stats.subastas_finalizadas}</span> finalizadas ·
            <span className="font-semibold">{stats.subastas_canceladas}</span> canceladas ·
            <span className="font-semibold">{stats.valor_total_activas}</span> en subastas activas
          </div>
          <div>
            <Link
              href="/subastas/pro"
              className="inline-flex items-center gap-2 rounded border border-border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-disabled={!hasTarget}
            >
              Ver información completa (Plan PRO)
            </Link>
          </div>
        </header>

        <section className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left">ID</th>
                  <th className="px-3 py-2 text-left">Identificador</th>
                  <th className="px-3 py-2 text-left">Organismo</th>
                  <th className="px-3 py-2 text-left">Estado</th>
                  <th className="px-3 py-2 text-left">Valor</th>
                  <th className="px-3 py-2 text-left">Tasación</th>
                  <th className="px-3 py-2 text-left">Enlace</th>
                </tr>
              </thead>
              <tbody>
                {list.map((s) => (
                  <tr key={s.id} className="border-t border-border align-top">
                    <td className="px-3 py-2">{s.id}</td>
                    <td className="px-3 py-2">
                      {s.identificador ? (
                        <Link href={`/subastas/${encodeURIComponent(s.identificador)}`} className="text-primary underline">
                          {s.identificador}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-medium">{s.organismo || "—"}</div>
                    </td>
                    <td className="px-3 py-2">{s.estado || "—"}</td>
                    <td className="px-3 py-2">{s.valor_subasta || "—"}</td>
                    <td className="px-3 py-2">{s.tasacion || "—"}</td>
                    <td className="px-3 py-2">
                      {s.url ? (
                        <Link href={s.url} className="text-primary underline" target="_blank">
                          Ver BOE
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-muted-foreground" colSpan={7}>
                      Sin datos en BOE (boe_subastas_public vacío o aún no sincronizado).
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>Esta vista es gratuita y limitada. Para ver depósitos, cargas y notas registrales, accede al Plan PRO.</p>
            {list.length === 0 && (
              <p>
                Si ves esta vista vacía, la tabla boe_subastas_public aún no tiene datos normalizados. Ejecuta el pipeline RAW→NORMALIZED
                o espera a la próxima corrida automática.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

