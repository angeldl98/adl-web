import Link from "next/link";
import { Navigation } from "@/components/navigation";

type Stats = {
  total_count: number;
  added_today_count: number;
  counts_by_province: { provincia: string | null; total: number }[];
  counts_by_estado: { estado: string | null; total: number }[];
  counts_closing_7_days: number;
};

type Subasta = {
  id_sub: string;
  estado: string | null;
  descripcion: string | null;
  expediente: string | null;
  fecha_conclusion_prevista: string | null;
  provincia: string | null;
  municipio: string | null;
  direccion: string | null;
  url: string | null;
};

async function fetchStats(): Promise<Stats | null> {
  try {
    const r = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/subastas-proxy/stats`, {
      cache: "no-store",
    });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

async function fetchList(searchParams: Record<string, string | undefined>) {
  try {
    const qs = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v) qs.set(k, v);
    });
    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const url = `${base}/api/subastas-proxy?${qs.toString()}`;
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) return null;
    return r.json();
  } catch (err) {
    console.error("fetchList subastas error", err);
    return null;
  }
}

function formatDate(d?: string | null) {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("es-ES");
}

export default async function SubastasPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const stats = await fetchStats();
  
  // Baseline: allow full access (premium gating will be reintroduced later)
  let list: { data: Subasta[]; meta: any } | null = null;
  {
    const filters = {
      provincia: params.provincia,
      estado: params.estado,
      from: params.from,
      to: params.to,
      limit: params.limit || "25",
      offset: params.offset || "0",
    };
    list = await fetchList(filters);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Subastas BOE</h1>
        <p className="mt-3 text-muted-foreground">
          Busca y filtra subastas públicas del BOE
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <KpiCard title="Añadidas hoy" value={stats?.added_today_count ?? 0} />
          <KpiCard title="Totales" value={stats?.total_count ?? 0} />
          <KpiCard title="Cierran ≤7 días" value={stats?.counts_closing_7_days ?? 0} />
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-medium mb-3">Provincias con más subastas</h2>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 text-left">Provincia</th>
                  <th className="px-4 py-2 text-left">Subastas</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.counts_by_province || []).map((p, idx) => (
                  <tr key={`${p.provincia || "N/A"}-${idx}`} className="border-t border-border">
                    <td className="px-4 py-2">{p.provincia || "N/A"}</td>
                    <td className="px-4 py-2">{p.total}</td>
                  </tr>
                ))}
                {!stats && (
                  <tr>
                    <td className="px-4 py-3 text-muted-foreground" colSpan={2}>
                      Sin datos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {false && (
          <div className="mt-12 rounded-lg border border-border bg-muted/30 p-8 text-center">
            <h2 className="text-2xl font-semibold mb-2">Acceso Premium</h2>
            <p className="text-muted-foreground mb-6">
              Suscríbete para acceder a la herramienta de búsqueda y filtrado de subastas
            </p>
            <div className="flex gap-4 justify-center">
              {false && (
                <Link
                  href="/login"
                  className="rounded bg-foreground px-6 py-2 text-background text-sm font-medium hover:opacity-90"
                >
                  Iniciar sesión
                </Link>
              )}
              <Link
                href="/subscribe"
                className="rounded border border-border bg-background px-6 py-2 text-foreground text-sm font-medium hover:bg-muted"
              >
                Suscribirse
              </Link>
            </div>
          </div>
        )}

        {true && (
          <div className="mt-12 space-y-6">
            <FilterForm />
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left">ID</th>
                    <th className="px-3 py-2 text-left">Tipo / Descripción breve</th>
                    <th className="px-3 py-2 text-left">Estado</th>
                    <th className="px-3 py-2 text-left">Provincia</th>
                    <th className="px-3 py-2 text-left">Municipio</th>
                    <th className="px-3 py-2 text-left">Cierre</th>
                  </tr>
                </thead>
                <tbody>
                  {(list?.data || []).map((s) => (
                    <tr key={s.id_sub} className="border-t border-border hover:bg-muted/40">
                      <td className="px-3 py-2">
                        <Link href={`/subastas/${s.id_sub}`} className="text-primary underline">
                          {s.id_sub}
                        </Link>
                      </td>
                      <td className="px-3 py-2">{s.descripcion || "No disponible"}</td>
                      <td className="px-3 py-2">{s.estado || "—"}</td>
                      <td className="px-3 py-2">{s.provincia || "—"}</td>
                      <td className="px-3 py-2">{s.municipio || "—"}</td>
                      <td className="px-3 py-2">{formatDate(s.fecha_conclusion_prevista)}</td>
                    </tr>
                  ))}
                  {!list && (
                    <tr>
                      <td className="px-3 py-3 text-muted-foreground" colSpan={5}>
                        Sin datos
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {list?.meta && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  Mostrando {list.meta.limit} desde {list.meta.offset}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-background px-4 py-5">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </div>
  );
}

function FilterForm() {
  return (
    <form className="grid gap-4 md:grid-cols-5" method="get">
      <input
        name="provincia"
        placeholder="Provincia"
        className="rounded border border-border bg-background px-3 py-2 text-sm"
      />
      <input
        name="estado"
        placeholder="Estado (Celebrándose, Próxima apertura...)"
        className="rounded border border-border bg-background px-3 py-2 text-sm"
      />
      <input
        name="from"
        type="date"
        placeholder="Desde"
        className="rounded border border-border bg-background px-3 py-2 text-sm"
      />
      <input
        name="to"
        type="date"
        placeholder="Hasta"
        className="rounded border border-border bg-background px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="rounded border border-border bg-foreground px-4 py-2 text-background text-sm font-medium hover:opacity-90"
      >
        Buscar
      </button>
    </form>
  );
}

