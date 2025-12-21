import Link from "next/link";
import { Navigation } from "@/components/navigation";

type BoeItem = {
  id_sub: string | null;
  estado: string | null;
  descripcion: string | null;
  expediente: string | null;
  fecha_conclusion_prevista: string | null;
  provincia: string | null;
  municipio: string | null;
  url: string | null;
};

async function fetchBoe() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const resp = await fetch(`${apiBase}/api/boe`, { cache: "no-store" });
  if (!resp.ok) return null;
  return resp.json();
}

export default async function BoePage() {
  const data = await fetchBoe();
  const items = (data?.data as BoeItem[] | undefined) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Fábrica de Datos · BOE</h1>
        <p className="mt-2 text-muted-foreground">Listado simple desde el producto BOE.</p>

        <div className="mt-8 overflow-hidden rounded-lg border border-border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Estado</th>
                <th className="px-3 py-2 text-left">Descripción</th>
                <th className="px-3 py-2 text-left">Expediente</th>
                <th className="px-3 py-2 text-left">Provincia</th>
                <th className="px-3 py-2 text-left">Municipio</th>
                <th className="px-3 py-2 text-left">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m, idx) => (
                <tr key={`${m.id_sub || idx}`} className="border-t border-border">
                  <td className="px-3 py-2">{m.id_sub || "—"}</td>
                  <td className="px-3 py-2">{m.estado || "—"}</td>
                  <td className="px-3 py-2">{m.descripcion || "—"}</td>
                  <td className="px-3 py-2">{m.expediente || "—"}</td>
                  <td className="px-3 py-2">{m.provincia || "—"}</td>
                  <td className="px-3 py-2">{m.municipio || "—"}</td>
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
              {items.length === 0 && (
                <tr>
                  <td className="px-3 py-3 text-muted-foreground" colSpan={7}>
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

