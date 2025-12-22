import Link from "next/link";
import { Navigation } from "@/components/navigation";

type BoeDetail = {
  subasta_id: number;
  titulo: string | null;
  provincia: string | null;
  tipo_bien: string | null;
  precio_salida: number | null;
  valor_tasacion: number | null;
  descuento_pct: number | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  estado_subasta: string | null;
  resumen_ejecutivo?: string | null;
};

async function fetchDetail(id: string): Promise<BoeDetail | null> {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const resp = await fetch(`${apiBase}/api/boe/${id}`, { cache: "no-store" });
  if (!resp.ok) return null;
  const json = await resp.json();
  return json?.data as BoeDetail;
}

function formatMoney(v: number | null | undefined) {
  if (v === null || v === undefined) return "—";
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);
}

function formatDate(s: string | null | undefined) {
  if (!s) return "—";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString("es-ES");
}

export default async function SubastaDetailPage({ params }: { params: Promise<{ subastaId: string }> }) {
  const { subastaId } = await params;
  const detail = await fetchDetail(subastaId);

  const avisos: string[] = [];
  if (!detail?.precio_salida) avisos.push("Precio de salida no informado");
  if (!detail?.fecha_fin) avisos.push("Fecha de cierre no informada");
  if (!detail?.provincia) avisos.push("Provincia no informada");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="mx-auto max-w-5xl px-6 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Detalle de subasta</h1>
            <p className="text-muted-foreground">Información interpretada desde el producto BOE (PRO).</p>
          </div>
          <Link href="/subastas" className="text-sm text-primary underline">
            ← Volver a subastas
          </Link>
        </div>

        {!detail && (
          <div className="rounded border border-border bg-muted/30 p-4 text-sm text-muted-foreground">No se encontró la subasta solicitada.</div>
        )}

        {detail && (
          <div className="space-y-6">
            <div className="rounded-lg border border-border p-4">
              <h2 className="text-lg font-semibold mb-2">Resumen ejecutivo</h2>
              <p className="text-sm text-foreground leading-relaxed">
                {detail.resumen_ejecutivo || "Subasta disponible en BOE. Revisa los datos principales antes de decidir."}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-base font-semibold mb-2">Datos principales</h3>
                <div className="space-y-2 text-sm">
                  <Row label="Título" value={detail.titulo || "—"} />
                  <Row label="Provincia" value={detail.provincia || "—"} />
                  <Row label="Tipo de bien" value={detail.tipo_bien || "—"} />
                  <Row label="Estado" value={detail.estado_subasta || "—"} />
                  <Row label="Inicio" value={formatDate(detail.fecha_inicio)} />
                  <Row label="Cierre" value={formatDate(detail.fecha_fin)} />
                </div>
              </div>

              <div className="rounded-lg border border-border p-4">
                <h3 className="text-base font-semibold mb-2">Números</h3>
                <div className="space-y-2 text-sm">
                  <Row label="Precio salida" value={formatMoney(detail.precio_salida)} />
                  <Row label="Valor tasación" value={formatMoney(detail.valor_tasacion)} />
                  <Row
                    label="Descuento"
                    value={detail.descuento_pct !== null && detail.descuento_pct !== undefined ? `${detail.descuento_pct.toFixed(1)}%` : "—"}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4">
              <h3 className="text-base font-semibold mb-2">Avisos</h3>
              {avisos.length === 0 ? (
                <div className="text-sm text-muted-foreground">Sin avisos. Datos suficientes para revisión.</div>
              ) : (
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {avisos.map((a, idx) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 text-xs text-muted-foreground text-center">APP=adl-web</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right ml-3">{value}</span>
    </div>
  );
}
