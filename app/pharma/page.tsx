import Link from "next/link";
import { Navigation } from "@/components/navigation";

type PharmaItem = {
  raw_id: number;
  nombre: string | null;
  laboratorio: string | null;
  estado: string | null;
  fecha_publicacion: string | null;
  url: string | null;
};

async function fetchPharma(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) qs.set(k, v);
  });
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const resp = await fetch(`${apiBase}/api/pharma/search?${qs.toString()}`, { cache: "no-store" });
  if (!resp.ok) return null;
  return resp.json();
}

function formatDate(d?: string | null) {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("es-ES");
}

export default async function PharmaPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const q = params.q || "";
  const data = await fetchPharma({ q, limit: params.limit || "20" });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Fábrica de Datos · Pharma</h1>
        <p className="mt-2 text-muted-foreground">
          Búsqueda simple sobre el índice de producto pharma (fuente AEMPS/CIMA).
        </p>

        <form className="mt-8 flex gap-3" method="get">
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por nombre, laboratorio o código nacional"
            className="flex-1 rounded border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded border border-border bg-foreground px-4 py-2 text-background text-sm font-medium hover:opacity-90"
          >
            Buscar
          </button>
        </form>

        <div className="mt-8 overflow-hidden rounded-lg border border-border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left">Nombre</th>
                <th className="px-3 py-2 text-left">Laboratorio</th>
                <th className="px-3 py-2 text-left">Estado</th>
                <th className="px-3 py-2 text-left">Publicación</th>
                <th className="px-3 py-2 text-left">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {(data?.data as PharmaItem[] | undefined)?.map((m, idx) => (
                <tr key={`${m.raw_id}-${idx}`} className="border-t border-border">
                  <td className="px-3 py-2">{m.nombre || "—"}</td>
                  <td className="px-3 py-2">{m.laboratorio || "—"}</td>
                  <td className="px-3 py-2">{m.estado || "—"}</td>
                  <td className="px-3 py-2">{formatDate(m.fecha_publicacion)}</td>
                  <td className="px-3 py-2">
                    {m.url ? (
                      <Link href={m.url} className="text-primary underline">
                        Abrir
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
              {(!data?.data || (data?.data || []).length === 0) && (
                <tr>
                  <td className="px-3 py-3 text-muted-foreground" colSpan={5}>
                    Sin resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground">APP=adl-web</div>
    </div>
  );
}

