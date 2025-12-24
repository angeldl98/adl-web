import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { hasProAccess } from "@/lib/access";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function escapePdfText(input: string) {
  return input.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdf(lines: string[]): Uint8Array {
  const content = [
    "BT",
    "/F1 12 Tf",
    "50 760 Td",
    ...lines.map((l, idx) => `${idx === 0 ? "" : "T* "}${escapePdfText(l)} Tj`),
    "ET"
  ].join("\n");

  const stream = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  const pdf = [
    "%PDF-1.4",
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `5 0 obj ${stream} endobj`,
    "xref",
    "0 6",
    "0000000000 65535 f ",
    "0000000010 00000 n ",
    "0000000060 00000 n ",
    "0000000116 00000 n ",
    "0000000229 00000 n ",
    "0000000309 00000 n ",
    "trailer << /Size 6 /Root 1 0 R >>",
    "startxref",
    "400",
    "%%EOF"
  ].join("\n");

  return new TextEncoder().encode(pdf);
}

export async function GET(req: NextRequest, context: any) {
  const params = context?.params || {};
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const allowed = await hasProAccess(session, "boe");
  if (!allowed) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const identificador = decodeURIComponent(params.id);
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

  const [mainRes, docsRes] = await Promise.all([pool.query(mainSql, [identificador]), pool.query(docsSql, [identificador])]);
  const row = mainRes.rows?.[0];
  if (!row) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const lines: string[] = [];
  lines.push(`Informe PRO · ${row.identificador}`);
  lines.push(`Estado: ${row.estado_subasta || "-"} · ${row.estado_detalle || "-"}`);
  lines.push(`Inicio: ${row.fecha_inicio || "-"} · Fin: ${row.fecha_fin || "-"}`);
  lines.push(`Valor subasta: ${row.valor_subasta || "-"}`);
  lines.push(`Tasación: ${row.tasacion || "-"}`);
  lines.push(`Depósito: ${row.capital_minimo || "-"}`);
  lines.push(`Tipo de bien: ${row.tipo_bien || "-"}`);
  lines.push(`Provincia: ${row.provincia || "-"} · Municipio: ${row.municipio || "-"}`);
  lines.push(`Descripción: ${row.descripcion_bien || "-"}`);
  lines.push(`Riesgo posesión: ${row.riesgo_posesion || "-"}`);
  lines.push(`Cargas: ${row.riesgo_cargas || "-"}`);
  if (row.resumen) lines.push(`Resumen: ${row.resumen}`);
  if (row.completitud) lines.push(`Completitud: ${row.completitud}`);
  lines.push("Documentos:");
  docsRes.rows.forEach((d: any, idx: number) => {
    lines.push(`  ${idx + 1}. ${d.tipo_doc || "Documento"} -> ${d.url || d.local_path || "-"}`);
  });
  lines.push("—");
  lines.push("Informe generado desde ADL Suite");
  lines.push(`https://adlsuite.com/subastas/pro/${row.identificador}`);
  lines.push("Acceso protegido: requiere suscripción PRO activa.");

  const pdfBytes = buildPdf(lines);
  const body = Buffer.from(pdfBytes);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="adl-subasta-${row.identificador}.pdf"`,
      "Cache-Control": "no-store"
    }
  });
}

