import Link from "next/link";
import { getDbPool } from "@/lib/db";

export const dynamic = "force-dynamic";

type FreeDetail = {
  identificador: string | null;
  estado: string | null;
  valor_subasta: string | null;
  tasacion: string | null;
  url: string | null;
  estado_detalle?: string | null;
};

async function fetchDetail(id: string): Promise<FreeDetail | null> {
  const pool = getDbPool();
  const res = await pool.query(
    `
      SELECT identificador, estado, estado_detalle, valor_subasta, tasacion, url
      FROM boe_subastas_public
      WHERE identificador = $1
      LIMIT 1
    `,
    [id]
  );
  return res.rows[0] || null;
}

export default async function FreeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await fetchDetail(id);
  const BUILD_MARKER = "BUILD_MARKER_2025-12-24_FREE_DETAIL";

  if (!detail) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-4">
        <div className="text-[10px] text-muted-foreground" data-build={BUILD_MARKER}>
          {BUILD_MARKER}
        </div>
        <h1 className="text-3xl font-semibold">Subasta {id}</h1>
        <p className="text-muted-foreground">No se encontró información pública para este identificador.</p>
        <Link href="/subastas" className="underline text-primary">
          Volver a subastas públicas
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-6">
      <div className="text-[10px] text-muted-foreground" data-build={BUILD_MARKER}>
        {BUILD_MARKER}
      </div>
      <header className="space-y-2">
        <p className="text-sm text-muted-foreground">Vista pública (FREE)</p>
        <h1 className="text-3xl font-semibold">Subasta {detail.identificador}</h1>
        <p className="text-sm text-muted-foreground">Estado: {detail.estado || "—"}</p>
        <div className="flex gap-3">
          {detail.url && (
            <Link href={detail.url} target="_blank" className="underline text-primary text-sm">
              Ver en BOE
            </Link>
          )}
          <Link href={`/subastas/pro/${encodeURIComponent(detail.identificador || "")}`} className="inline-flex items-center rounded border border-border px-3 py-2 text-sm">
            Ver información completa (Plan PRO)
          </Link>
        </div>
      </header>

      <section className="rounded-lg border border-border p-4 bg-muted/30 space-y-2">
        <div className="text-sm">
          <span className="font-medium">Valor subasta:</span> {detail.valor_subasta || "—"}
        </div>
        <div className="text-sm">
          <span className="font-medium">Tasación:</span> {detail.tasacion || "—"}
        </div>
        <div className="text-sm text-muted-foreground">
          {detail.estado_detalle ? `Estado legal: ${detail.estado_detalle}` : "Estado legal: —"}
        </div>
      </section>

      <section className="rounded-lg border border-dashed border-border p-4 bg-muted/10 text-sm space-y-2">
        <p className="font-medium text-foreground">¿Quieres el expediente completo?</p>
        <p className="text-muted-foreground">
          El Plan PRO incluye depósito, cargas, situación posesoria y textos extraídos del PDF oficial. Solo accesible en la vista PRO.
        </p>
        <Link
          href="/subastas/pro"
          className="inline-flex items-center rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Ir a vista PRO
        </Link>
      </section>
    </div>
  );
}

