import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Navigation } from "@/components/navigation";
import { authOptions } from "@/lib/auth-options";
import { hasProAccess } from "@/lib/access";
import { getDbPool } from "@/lib/db";

export const dynamic = "force-dynamic";

type ProDetail = {
  identificador: string | null;
  estado_subasta: string | null;
  estado_detalle: string | null;
  valor_subasta: string | null;
  tasacion: string | null;
  capital_minimo: string | null;
  url_detalle: string | null;
  tipo_bien: string | null;
  provincia: string | null;
  municipio: string | null;
  descripcion_bien: string | null;
  riesgo_cargas: string | null;
  riesgo_posesion: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  descuento_pct: string | null;
  resumen?: string | null;
  completitud?: string | null;
};

type ProDoc = {
  tipo_doc: string | null;
  url: string | null;
  local_path: string | null;
  extracted_text: string | null;
};

function parseNumber(input: string | null): number | null {
  if (!input) return null;
  const normalized = input.replace(/[^0-9,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
}

function formatMoney(num: number | null): string {
  if (num === null) return "—";
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(num);
}

async function fetchDetail(id: string): Promise<{ main: ProDetail | null; docs: ProDoc[] }> {
  const pool = getDbPool();
  const mainSql = `
    SELECT
      pro.identificador,
      pro.estado_subasta,
      pro.estado_detalle,
      pro.precio_salida::text AS valor_subasta,
      pro.valor_tasacion::text AS tasacion,
      pro.capital_minimo,
      pro.url_detalle,
      pro.tipo_bien,
      pro.provincia,
      pro.municipio,
      pro.descripcion_bien,
      pro.riesgo_cargas,
      pro.riesgo_posesion,
      pro.fecha_inicio::text,
      pro.fecha_fin::text,
      pro.descuento_pct::text,
      sum.resumen,
      sum.completitud
    FROM boe_prod.subastas_pro pro
    LEFT JOIN boe_prod.subastas_summary sum ON sum.subasta_id = pro.subasta_id
    WHERE pro.identificador = $1
    LIMIT 1;
  `;
  const docsSql = `
    SELECT tipo_doc, url, local_path, extracted_text
    FROM boe_prod.subastas_docs
    WHERE identificador = $1
    ORDER BY url;
  `;
  const [mainRes, docsRes] = await Promise.all([pool.query(mainSql, [id]), pool.query(docsSql, [id])]);
  return { main: mainRes.rows?.[0] || null, docs: docsRes.rows || [] };
}

function riskFlags(detail: ProDetail) {
  const flags: string[] = [];
  if (detail.riesgo_cargas) flags.push(detail.riesgo_cargas);
  if (detail.riesgo_posesion) flags.push(detail.riesgo_posesion);
  if (!detail.capital_minimo) flags.push("Depósito/garantía no informado");
  if (!detail.fecha_fin) flags.push("Fecha fin no disponible");
  return flags;
}

function UpgradeCTA({ id }: { id: string }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="mx-auto max-w-3xl px-6 py-16 space-y-6">
        <h1 className="text-3xl font-semibold">Plan PRO requerido</h1>
        <p className="text-muted-foreground">
          Necesitas una suscripción activa al servicio BOE PRO para acceder a la ficha completa de esta subasta.
        </p>
        <div className="flex gap-3">
          <Link href="/subastas" className="underline text-primary">
            Volver a vista FREE
          </Link>
          <Link href={`/subastas/${encodeURIComponent(id)}`} className="underline text-primary">
            Ver teaser FREE
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function SubastaProDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/login?next=/subastas/pro/${encodeURIComponent(id)}`);
  }

  const allowed = await hasProAccess(session, "boe");
  if (!allowed) {
    return <UpgradeCTA id={id} />;
  }

  const { main: detail, docs } = await fetchDetail(id);
  if (!detail) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="mx-auto max-w-3xl px-6 py-16 space-y-4">
          <h1 className="text-3xl font-semibold">Subasta no encontrada</h1>
          <p className="text-muted-foreground">No existe información PRO para {id}.</p>
          <Link href="/subastas/pro" className="underline text-primary">
            Volver a lista PRO
          </Link>
        </div>
      </div>
    );
  }

  const valorNum = parseNumber(detail.valor_subasta);
  const tasacionNum = parseNumber(detail.tasacion);
  const discountPct =
    detail.descuento_pct ? parseNumber(detail.descuento_pct) : valorNum !== null && tasacionNum && tasacionNum > 0 ? (1 - valorNum / tasacionNum) * 100 : null;
  const flags = riskFlags(detail);
  const BUILD_MARKER = "BUILD_MARKER_2025-12-24_PRO_DETAIL";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="mx-auto max-w-5xl px-6 py-12 space-y-8">
        <div className="text-[10px] text-muted-foreground" data-build={BUILD_MARKER}>
          {BUILD_MARKER}
        </div>
        <header className="space-y-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ficha PRO · BOE</p>
              <h1 className="text-3xl font-semibold">Subasta {detail.identificador}</h1>
              <p className="text-sm text-muted-foreground">Estado: {detail.estado_subasta || "—"}</p>
            </div>
            <div className="flex gap-3">
              {detail.url_detalle && (
                <Link href={detail.url_detalle} target="_blank" className="inline-flex items-center rounded border border-border px-3 py-2 text-sm underline">
                  Ver en BOE
                </Link>
              )}
              {detail.identificador && (
                <Link
                  href={`/api/subastas/pro/${encodeURIComponent(detail.identificador)}/pdf`}
                  className="inline-flex items-center rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Descargar informe PDF
                </Link>
              )}
            </div>
          </div>
          <div className="text-sm text-muted-foreground space-x-4">
            <span>Inicio: {detail.fecha_inicio ? new Date(detail.fecha_inicio).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" }) : "—"}</span>
            <span>Fin: {detail.fecha_fin ? new Date(detail.fecha_fin).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" }) : "—"}</span>
            <span>Estado legal: {detail.estado_detalle || "—"}</span>
          </div>
        </header>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Resumen ejecutivo</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-border p-4 bg-muted/30 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor subasta</span>
                <span className="font-medium">{formatMoney(valorNum)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tasación</span>
                <span className="font-medium">{formatMoney(tasacionNum)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">% descuento</span>
                <span className="font-medium">{discountPct !== null ? `${discountPct.toFixed(1)}%` : "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Depósito</span>
                <span className="font-medium">{detail.capital_minimo || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tipo de bien</span>
                <span className="font-medium">{detail.tipo_bien || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ubicación</span>
                <span className="font-medium">
                  {detail.provincia || "—"} · {detail.municipio || "—"}
                </span>
              </div>
            </div>
            <div className="rounded-lg border border-border p-4 bg-muted/30 space-y-2">
              <div className="text-sm font-medium">Indicadores de riesgo</div>
              {flags.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin riesgos destacados.</p>
              ) : (
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {flags.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Cronograma</h2>
          <div className="rounded-lg border border-border p-4 bg-muted/30 text-sm space-y-2">
            <div>Inicio: {detail.fecha_inicio ? new Date(detail.fecha_inicio).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" }) : "—"}</div>
            <div>Fin: {detail.fecha_fin ? new Date(detail.fecha_fin).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" }) : "—"}</div>
            <div>Estado legal: {detail.estado_detalle || "—"}</div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Descripción del bien</h2>
          <div className="rounded-lg border border-border p-4 bg-muted/30 text-sm whitespace-pre-wrap">
            {detail.descripcion_bien?.trim() || "Sin descripción disponible."}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Situación posesoria</h2>
          <div className="rounded-lg border border-border p-4 bg-muted/30 text-sm whitespace-pre-wrap">
            {detail.riesgo_posesion?.trim() || "No hay detalle de situación posesoria."}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Cargas y gravámenes</h2>
          <div className="rounded-lg border border-border p-4 bg-muted/30 text-sm whitespace-pre-wrap">
            {detail.riesgo_cargas?.trim() || "No hay cargas documentadas en el resumen."}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Documentación (PDF)</h2>
          <div className="space-y-3">
            {docs.length === 0 && <div className="text-sm text-muted-foreground">Sin documentos.</div>}
            {docs.map((doc, idx) => (
              <div key={`${doc.url || doc.local_path || idx}`} className="rounded-lg border border-border p-4 bg-muted/30 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">{doc.tipo_doc || "Documento"}</div>
                  {doc.url && (
                    <Link href={doc.url} target="_blank" className="text-primary underline text-xs">
                      Abrir PDF
                    </Link>
                  )}
                </div>
                {doc.extracted_text && (
                  <div className="whitespace-pre-wrap text-muted-foreground max-h-64 overflow-auto border border-border/50 rounded p-2">
                    {doc.extracted_text.trim()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border p-4 bg-muted/20 text-sm text-muted-foreground">
          La información procede de fuentes oficiales. ADL Suite no emite recomendaciones de inversión.
        </section>
      </div>
    </div>
  );
}

