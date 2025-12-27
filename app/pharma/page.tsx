import { Navigation } from "@/components/navigation";

type PharmaItem = {
  raw_id: number;
  codigo_nacional: string | null;
  nombre_medicamento: string | null;
  laboratorio: string | null;
  estado_aemps: string | null;
  fecha_estado: string | null;
  estado_norm: string | null;
};

async function fetchPharmaList() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const resp = await fetch(`${apiBase}/api/pharma/list`, { cache: "no-store" });
  if (!resp.ok) return null;
  return resp.json();
}

function formatDate(d?: string | null) {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("es-ES");
}

export default async function PharmaPage() {
  const data = await fetchPharmaList();
  const rows = (data?.data as PharmaItem[] | undefined) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Fábrica de Datos · Pharma</h1>
        <p className="mt-2 text-muted-foreground">Listado simple de medicamentos activos (fuente AEMPS/CIMA).</p>

        <div className="mt-8 overflow-hidden rounded-lg border border-border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left">CN</th>
                <th className="px-3 py-2 text-left">Nombre</th>
                <th className="px-3 py-2 text-left">Laboratorio</th>
                <th className="px-3 py-2 text-left">Estado AEMPS</th>
                <th className="px-3 py-2 text-left">Fecha estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m, idx) => (
                <tr key={`${m.raw_id}-${idx}`} className="border-t border-border">
                  <td className="px-3 py-2">{m.codigo_nacional || "—"}</td>
                  <td className="px-3 py-2">{m.nombre_medicamento || "—"}</td>
                  <td className="px-3 py-2">{m.laboratorio || "—"}</td>
                  <td className="px-3 py-2">{m.estado_aemps || m.estado_norm || "—"}</td>
                  <td className="px-3 py-2">{formatDate(m.fecha_estado)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-3 py-3 text-muted-foreground" colSpan={5}>
                    No active pharmaceutical data available
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

