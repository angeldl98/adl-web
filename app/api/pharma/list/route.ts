import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

async function ensureTables() {
  const pool = getDbPool();
  await pool.query(`CREATE SCHEMA IF NOT EXISTS pharma_prod`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pharma_prod.farmacias (
      raw_id INT PRIMARY KEY,
      nombre TEXT,
      direccion TEXT,
      municipio TEXT,
      provincia TEXT,
      estado TEXT,
      checksum TEXT,
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `);
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureTables();
    const pool = getDbPool();
    const res = await pool.query(
      `
        SELECT raw_id, nombre, direccion, municipio, provincia, estado, checksum, updated_at
        FROM pharma_prod.farmacias
        ORDER BY updated_at DESC
      `
    );
    return NextResponse.json({ data: res.rows || [] });
  } catch (err: any) {
    console.error("pharma_list_error", err?.message || err);
    return NextResponse.json({ data: [] });
  }
}

