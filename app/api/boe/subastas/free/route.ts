import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TABLE = "boe_subastas_public";

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

  try {
    const sql = `
      SELECT
        id,
        identificador AS referencia,
        tipo_subasta,
        valor_subasta AS valor_subasta,
        url AS enlace_boe,
        normalized_at
      FROM ${TABLE}
      ORDER BY normalized_at DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await pool.query(sql, [limit, offset]);
    return NextResponse.json({
      data: result.rows,
      meta: { limit, offset, count: result.rowCount },
    });
  } catch (err: any) {
    if (err?.code === "42P01") {
      return NextResponse.json(
        { error: "boe_subastas_public missing", hint: "Run migration and normalization pipeline" },
        { status: 503 }
      );
    }
    console.error("free endpoint error", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

