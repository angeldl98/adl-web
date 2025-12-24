import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Navigation } from "@/components/navigation";
import { authOptions } from "@/lib/auth-options";
import { hasProAccess } from "@/lib/access";
import { getDbPool } from "@/lib/db";

export const dynamic = "force-dynamic";

type ProListRow = {
  identificador: string | null;
  provincia: string | null;
  municipio: string | null;
  valor_subasta: string | null;
  tasacion: string | null;
  capital_minimo: string | null;
  fecha_fin: string | null;
  tipo_bien: string | null;
  descuento_pct?: string | null;
};

type SortKey = "fin" | "discount" | "valor" | "deposito";

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

async function fetchRows(searchParams: { [key: string]: string | string[] | undefined }): Promise<
  Array<
    ProListRow & {
      valor_num: number | null;
      tasacion_num: number | null;
      discountPct: number | null;
      badges: string[];
    }
  >
> {
  const pool = getDbPool();
  const filters: string[] = ["pro.estado_subasta = 'Activa'"];
  const values: any[] = [];

  if (searchParams?.provincia && typeof searchParams.provincia === "string") {
    values.push(searchParams.provincia);
    filters.push(`pro.provincia = $${values.length}`);
  }

  if (searchParams?.tipo_bien && typeof searchParams.tipo_bien === "string") {
    values.push(searchParams.tipo_bien);
    filters.push(`pro.tipo_bien = $${values.length}`);
  }

  if (searchParams?.closing_hours && typeof searchParams.closing_hours === "string") {
    const hours = Number(searchParams.closing_hours);
    if (Number.isFinite(hours) && hours > 0) {
      values.push(hours);
      filters.push(`pro.fecha_fin <= NOW() + ($${values.length} || ' hours')::interval`);
    }
  }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  let orderClause = "ORDER BY pro.fecha_fin ASC NULLS LAST, pro.updated_at DESC";
  const sort = (searchParams?.sort as SortKey | undefined) || "fin";
  if (sort === "valor") orderClause = "ORDER BY pro.precio_salida DESC NULLS LAST";
  if (sort === "deposito") orderClause = "ORDER BY pro.capital_minimo DESC NULLS LAST";
  // discount sorting will be done in memory after computing percentages

  const sql = `
    SELECT
      pro.identificador,
      pro.provincia,
      pro.municipio,
      pro.precio_salida::text AS valor_subasta,
      pro.valor_tasacion::text AS tasacion,
      pro.capital_minimo,
      pro.fecha_fin,
      pro.tipo_bien,
      pro.descuento_pct
    FROM boe_prod.subastas_pro pro
    ${where}
    ${orderClause}
  `;

  const res = await pool.query<ProListRow>(sql, values);
  const mapped = res.rows.map((row) => {
    const valor_num = parseNumber(row.valor_subasta);
    const tasacion_num = parseNumber(row.tasacion);
    const discountPct =
      row.tasacion && row.valor_subasta
        ? parseNumber(row.descuento_pct as any) ?? (valor_num !== null && tasacion_num && tasacion_num > 0 ? (1 - valor_num / tasacion_num) * 100 : null)
        : null;
    const badges: string[] = [];
    if (discountPct !== null && discountPct >= 30) badges.push("Alto descuento");
    if (row.fecha_fin) {
      const hoursLeft = (new Date(row.fecha_fin).getTime() - Date.now()) / 36e5;
      if (hoursLeft > 0 && hoursLeft <= 72) badges.push("Próxima a cierre");
    }
    return { ...row, valor_num, tasacion_num, discountPct, badges };
  });

  if (sort === "discount") {
    mapped.sort((a, b) => (b.discountPct ?? -Infinity) - (a.discountPct ?? -Infinity));
  }

  return mapped;
}

function UpgradeCTA() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="mx-auto max-w-3xl px-6 py-16 space-y-6">
        <h1 className="text-3xl font-semibold">Plan PRO requerido</h1>
        <p className="text-muted-foreground">
          Necesitas una suscripción activa al servicio BOE PRO para acceder a esta vista. Activa tu plan y vuelve a intentarlo.
        </p>
        <Link href="/subastas" className="inline-flex items-center rounded border border-border px-3 py-2 text-sm">
          Volver a vista FREE
        </Link>
      </div>
    </div>
  );
}

export default async function SubastasProPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/login?next=/subastas/pro`);
  }

  const allowed = await hasProAccess(session, "boe");
  if (!allowed) {
    return <UpgradeCTA />;
  }

  const rows = await fetchRows(params);
  const BUILD_MARKER = "BUILD_MARKER_2025-12-24_PRO_LIST";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-6">
        <div className="text-[10px] text-muted-foreground" data-build={BUILD_MARKER}>
          {BUILD_MARKER}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Subastas BOE (PRO)</h1>
          <p className="text-sm text-muted-foreground">Solo subastas activas, con datos económicos y legales.</p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <span className="text-muted-foreground">Orden:</span>
          <Link href="/subastas/pro?sort=fin" className="underline">Fin</Link>
          <Link href="/subastas/pro?sort=discount" className="underline">Descuento</Link>
          <Link href="/subastas/pro?sort=valor" className="underline">Valor</Link>
          <Link href="/subastas/pro?sort=deposito" className="underline">Depósito</Link>
        </div>

        <div className="overflow-auto rounded-lg border border-border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left">Identificador</th>
                <th className="px-3 py-2 text-left">Provincia</th>
                <th className="px-3 py-2 text-left">Municipio</th>
                <th className="px-3 py-2 text-left">Valor</th>
                <th className="px-3 py-2 text-left">Tasación</th>
                <th className="px-3 py-2 text-left">% desc.</th>
                <th className="px-3 py-2 text-left">Depósito</th>
                <th className="px-3 py-2 text-left">Fin subasta</th>
                <th className="px-3 py-2 text-left">Tipo bien</th>
                <th className="px-3 py-2 text-left">Indicadores</th>
              </tr>
            </thead>
            <tbody>
              {rows
                .filter((r) => r.identificador)
                .map((row) => (
                <tr key={row.identificador!} className="border-t border-border hover:bg-muted/40">
                  <td className="px-3 py-2">
                    <Link href={`/subastas/pro/${encodeURIComponent(row.identificador!)}`} className="text-primary underline">
                      {row.identificador}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{row.provincia || "—"}</td>
                  <td className="px-3 py-2">{row.municipio || "—"}</td>
                  <td className="px-3 py-2">{formatMoney(row.valor_num)}</td>
                  <td className="px-3 py-2">{formatMoney(row.tasacion_num)}</td>
                  <td className="px-3 py-2">{row.discountPct !== null ? `${row.discountPct.toFixed(1)}%` : "—"}</td>
                  <td className="px-3 py-2">{row.capital_minimo || "—"}</td>
                  <td className="px-3 py-2">
                    {row.fecha_fin
                      ? new Date(row.fecha_fin).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" })
                      : "—"}
                  </td>
                  <td className="px-3 py-2">{row.tipo_bien || "—"}</td>
                  <td className="px-3 py-2 space-x-2">
                    {row.badges.length === 0 && <span className="text-muted-foreground">—</span>}
                    {row.badges.map((b) => (
                      <span key={b} className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                        {b}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-3 py-3 text-muted-foreground" colSpan={11}>
                    No hay subastas activas disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

