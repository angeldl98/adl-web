import { cookies } from "next/headers";

type ProSubasta = {
  id: number;
  referencia: string | null;
  provincia: string | null;
  tipo_subasta: string | null;
  estado: string | null;
  fecha_apertura: string | null;
  tipo_bien: string | null;
  valor_subasta: string | null;
  descripcion: string | null;
  importe_deposito: string | null;
  cargas: string | null;
  notas_registrales: string | null;
  enlace_boe: string | null;
};

async function fetchPro(): Promise<ProSubasta[]> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  const res = await fetch(`${base}/api/boe/subastas/pro?limit=50&offset=0`, {
    cache: "no-store",
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json?.data || [];
}

function formatDate(s: string | null | undefined) {
  if (!s) return "—";
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : d.toLocaleDateString("es-ES");
}

export default async function SubastasProPage() {
  const data = await fetchPro();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Subastas BOE (PRO)</h1>
        <p className="text-sm text-muted-foreground">Acceso completo a datos normalizados.</p>
      </div>
      <div className="overflow-auto rounded-lg border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Referencia</th>
              <th className="px-3 py-2 text-left">Provincia</th>
              <th className="px-3 py-2 text-left">Tipo</th>
              <th className="px-3 py-2 text-left">Estado</th>
              <th className="px-3 py-2 text-left">Apertura</th>
              <th className="px-3 py-2 text-left">Valor</th>
              <th className="px-3 py-2 text-left">Depósito</th>
              <th className="px-3 py-2 text-left">Descripción</th>
              <th className="px-3 py-2 text-left">Cargas / Notas</th>
              <th className="px-3 py-2 text-left">BOE</th>
            </tr>
          </thead>
          <tbody>
            {data.map((s) => (
              <tr key={s.id} className="border-t border-border align-top">
                <td className="px-3 py-2">{s.id}</td>
                <td className="px-3 py-2">{s.referencia || "—"}</td>
                <td className="px-3 py-2">{s.provincia || "—"}</td>
                <td className="px-3 py-2">{s.tipo_subasta || "—"}</td>
                <td className="px-3 py-2">{s.estado || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">{formatDate(s.fecha_apertura)}</td>
                <td className="px-3 py-2">{s.valor_subasta || "—"}</td>
                <td className="px-3 py-2">{s.importe_deposito || "—"}</td>
                <td className="px-3 py-2 max-w-xs whitespace-pre-wrap">{s.descripcion || "—"}</td>
                <td className="px-3 py-2 max-w-xs whitespace-pre-wrap">
                  {s.cargas || s.notas_registrales || "—"}
                </td>
                <td className="px-3 py-2">
                  {s.enlace_boe ? (
                    <a className="text-primary underline" href={s.enlace_boe} target="_blank" rel="noreferrer">
                      Ver BOE
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td className="px-3 py-3 text-muted-foreground" colSpan={11}>
                  Sin datos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
