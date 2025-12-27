import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const dynamic = "force-dynamic";

async function ensureTables() {
  const pool = getDbPool();
  await pool.query(`CREATE SCHEMA IF NOT EXISTS pharma_prod`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pharma_prod.medicamentos (
      raw_id INT PRIMARY KEY,
      codigo_nacional TEXT,
      nombre_medicamento TEXT,
      laboratorio TEXT,
      estado_aemps TEXT,
      fecha_estado TIMESTAMPTZ,
      estado_norm TEXT,
      checksum TEXT,
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `);
}

export async function GET() {
  try {
    await ensureTables();
    const pool = getDbPool();
    const res = await pool.query(
      `
        SELECT raw_id, codigo_nacional, nombre_medicamento, laboratorio, estado_aemps, fecha_estado, estado_norm, checksum, updated_at
        FROM pharma_prod.medicamentos
        ORDER BY updated_at DESC
      `
    );
    return NextResponse.json({ data: res.rows || [] });
  } catch (err: any) {
    console.error("pharma_list_error", err?.message || err);
    return NextResponse.json({ data: [] });
  }
}

