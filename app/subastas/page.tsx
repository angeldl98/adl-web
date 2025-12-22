import Link from "next/link";
import { Navigation } from "@/components/navigation";

type FreeSubasta = {
  id: number;
  referencia: string | null;
  provincia: string | null;
  tipo_subasta: string | null;
  estado: string | null;
  fecha_apertura: string | null;
  tipo_bien: string | null;
  valor_subasta: string | null;
  resumen: string | null;
};

function formatDate(d?: string | null) {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("es-ES");
}

async function fetchFree(): Promise<FreeSubasta[]> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/boe/subastas/free?limit=25&offset=0`, { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json();
  return json?.data || [];
}

export default async function SubastasPage() {
  const list = await fetchFree();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="mx-auto max-w-6xl px-6 py-16 space-y-10">
        <header className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">Subastas BOE</h1>
          <p className="text-muted-foreground">Acceso público a subastas del BOE (vista gratuita).</p>
          <div>
            <Link
              href="/dashboard/subastas"
              className="inline-flex items-center gap-2 rounded border border-border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
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
                  <th className="px-3 py-2 text-left">Referencia</th>
                  <th className="px-3 py-2 text-left">Tipo / Resumen</th>
                  <th className="px-3 py-2 text-left">Provincia</th>
                  <th className="px-3 py-2 text-left">Estado</th>
                  <th className="px-3 py-2 text-left">Apertura</th>
                  <th className="px-3 py-2 text-left">Valor</th>
                </tr>
              </thead>
              <tbody>
                {list.map((s) => (
                  <tr key={s.id} className="border-t border-border align-top">
                    <td className="px-3 py-2">{s.id}</td>
                    <td className="px-3 py-2">{s.referencia || "—"}</td>
                    <td className="px-3 py-2">
                      <div className="font-medium">{s.tipo_subasta || "—"}</div>
                      <div className="text-xs text-muted-foreground">{s.resumen || "Sin descripción"}</div>
                    </td>
                    <td className="px-3 py-2">{s.provincia || "—"}</td>
                    <td className="px-3 py-2">{s.estado || "—"}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{formatDate(s.fecha_apertura)}</td>
                    <td className="px-3 py-2">{s.valor_subasta || "—"}</td>
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
                Si ves esta vista vacía, la tabla boe_subastas_public aún no tiene datos normalizados. Ejecuta el pipeline
                RAW→NORMALIZED o espera a la próxima corrida automática.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

