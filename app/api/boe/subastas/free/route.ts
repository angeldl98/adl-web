import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TABLE = "boe_subastas_public";

async function getColumns() {
  const pool = getDbPool();
  const res = await pool.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name = $1`,
    [TABLE]
  );
  return new Set(res.rows.map((r) => r.column_name as string));
}

function parseNumber(input: string | null, fallback: number, min: number, max: number) {
  const n = Number(input);
  if (Number.isFinite(n)) {
    return Math.min(max, Math.max(min, n));
  }
  return fallback;
}

export async function GET(req: NextRequest) {
  const pool = getDbPool();
  const { searchParams } = new URL(req.url);
  const limit = parseNumber(searchParams.get("limit"), 20, 1, 100);
  const offset = parseNumber(searchParams.get("offset"), 0, 0, 10_000);

  const cols = await getColumns();
  const col = (name: string, fallback: string) => (cols.has(name) ? name : fallback);
  const orderCol = cols.has("fecha_apertura") ? "fecha_apertura" : "normalized_at";
  const descripcionExpr = cols.has("descripcion") ? "descripcion" : "identificador";

  const sql = `
    SELECT
      id,
      identificador AS referencia,
      ${col("provincia", "NULL::text")} AS provincia,
      ${col("tipo_subasta", "NULL::text")} AS tipo_subasta,
      ${col("estado", "NULL::text")} AS estado,
      ${col("fecha_apertura", "normalized_at")} AS fecha_apertura,
      ${col("tipo_bien", "NULL::text")} AS tipo_bien,
      ${col("valor_subasta", "NULL::text")} AS valor_subasta,
      LEFT(${descripcionExpr}, 300) AS resumen
    FROM ${TABLE}
    ORDER BY ${orderCol} DESC
    LIMIT $1 OFFSET $2
  `;

  const result = await pool.query(sql, [limit, offset]);
  return NextResponse.json({
    data: result.rows,
    meta: { limit, offset, count: result.rowCount },
  });
}

