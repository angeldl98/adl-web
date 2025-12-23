import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TABLE = "boe_subastas_public";
const AUTH_COOKIE = "adal_auth";
const coreAuthUrl = process.env.CORE_AUTH_URL || process.env.NEXT_PUBLIC_API_URL || "http://core-auth:4205";

async function validateSession(token: string | undefined) {
  if (!token) return null;
  try {
    const res = await fetch(`${coreAuthUrl}/auth/verify`, {
      method: "GET",
      headers: { cookie: `${AUTH_COOKIE}=${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.valid ? data : null;
  } catch (err) {
    console.error("core-auth verify failed", err);
    return null;
  }
}

function parseNumber(input: string | null, fallback: number, min: number, max: number) {
  const n = Number(input);
  if (Number.isFinite(n)) {
    return Math.min(max, Math.max(min, n));
  }
  return fallback;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const session = await validateSession(token);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

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
        valor_subasta,
        importe_deposito,
        url AS enlace_boe,
        normalized_at,
        checksum
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
    console.error("pro endpoint error", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

