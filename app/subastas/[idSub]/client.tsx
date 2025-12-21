"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Detail } from "./types";

const NO_DATA = "No consta (BOE)";

type CalculatorInputs = {
  precioAdjudicacion: number;
  itpPercent: number;
  costesJuridicosMin: number;
  costesJuridicosMax: number;
  costesPosesionMin: number;
  costesPosesionMax: number;
  otrosMin: number;
  otrosMax: number;
  valorMercado: number;
  rentaMensual: number;
};

type CalculatorOutputs = {
  impuestos: number;
  impuestosLabel: string;
  totalMin: number;
  totalMax: number;
  totalLabel: string;
  margenVsMercadoMin: number | null;
  margenVsMercadoMax: number | null;
  roiMin: number | null;
  roiMax: number | null;
  rentYieldMin: number | null;
  rentYieldMax: number | null;
  escenarios: Array<{
    nombre: string;
    valorEscenario: number | null;
    roi: number | null;
    margen: number | null;
  }>;
};

function formatMoney(n?: number | null, opts?: { compact?: boolean }) {
  if (n === null || n === undefined || isNaN(n)) return NO_DATA;
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: opts?.compact ? 0 : 2,
    notation: opts?.compact ? "compact" : "standard",
  }).format(n);
}

function formatPercent(n?: number | null) {
  if (n === null || n === undefined || isNaN(n)) return NO_DATA;
  return `${n.toFixed(1)}%`;
}

function formatRange(min?: number | null, max?: number | null, opts?: { money?: boolean; percent?: boolean }) {
  const a = opts?.money ? formatMoney(min) : opts?.percent ? formatPercent(min) : min ?? NO_DATA;
  const b = opts?.money ? formatMoney(max) : opts?.percent ? formatPercent(max) : max ?? NO_DATA;
  if (a === b) return a as string;
  return `${a} – ${b}`;
}

function safeText(v?: string | null, fallback: string = NO_DATA) {
  if (v === undefined || v === null || v === "") return fallback;
  return v;
}

function pickAmount(amounts: Detail["amounts"], type: string) {
  return (amounts || []).find((a) => a.amount_type === type)?.amount_eur ?? null;
}

function guessItpPercent(province?: string | null) {
  if (!province) return 7.0;
  const p = province.toLowerCase();
  if (p.includes("cata")) return 10.0;
  if (p.includes("valenc")) return 10.0;
  if (p.includes("balear")) return 9.0;
  if (p.includes("madrid")) return 6.0;
  if (p.includes("andal")) return 7.0;
  if (p.includes("eusk") || p.includes("navarr")) return 7.0;
  return 7.0;
}

function derivePosesionCosts(status?: string | null): { min: number; max: number; nota: string } {
  if (!status) return { min: 500, max: 3000, nota: "Sin dato de posesión: reservar colchón para posibles ocupaciones o entregas demoradas." };
  const s = status.toLowerCase();
  if (s.includes("libre")) return { min: 0, max: 500, nota: "Declarada libre: bajo riesgo de entrega, prever solo gastos menores." };
  if (s.includes("ocup")) return { min: 2000, max: 6000, nota: "Posible ocupación: contemplar lanzamiento, cerrajero y demoras." };
  return { min: 1000, max: 4000, nota: "Posesión no clara: reservar margen para trámites y potencial desalojo." };
}

function Countdown({ target }: { target?: string | null }) {
  const [remaining, setRemaining] = useState<string>(() => buildCountdown(target));

  useEffect(() => {
    const id = setInterval(() => setRemaining(buildCountdown(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return <span className="text-sm font-medium">{remaining}</span>;
}

function buildCountdown(target?: string | null) {
  if (!target) return NO_DATA;
  const end = new Date(target);
  if (isNaN(end.getTime())) return NO_DATA;
  const diff = end.getTime() - Date.now();
  if (diff <= 0) return "Finalizada";
  const totalSec = Math.floor(diff / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${d}d ${h}h ${m}m ${s}s`;
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-background p-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="mt-3 space-y-3 text-sm">{children}</div>
    </section>
  );
}

function KeyNumber({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 px-4 py-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {helper ? <div className="text-xs text-muted-foreground mt-1">{helper}</div> : null}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function mapRiskCopy(status?: string | null) {
  if (!status) return "Sin dato posesión; confirmar si está libre y tiempos de entrega.";
  const s = status.toLowerCase();
  if (s.includes("libre")) return "Declarada libre. Verificar entrega efectiva y llaves.";
  if (s.includes("ocup")) return "Posible ocupación: prever lanzamiento, cerrajería y demora.";
  return "Posesión no clara: pedir certificación y acta de ocupación si existe.";
}

function mapDetailStatus(status?: string | null) {
  const norm = (status || "").toUpperCase();
  if (norm === "OK") return { label: "Información completa disponible", tone: "success" };
  if (norm === "FAILED_TEMP")
    return { label: "Información en procesamiento. Puede faltar detalle.", tone: "warn" };
  if (norm === "FAILED_PERM")
    return { label: "Información adicional no disponible. Consulte el BOE oficial.", tone: "error" };
  return { label: "Estado de detalle no indicado", tone: "warn" };
}

function extractDescriptionHighlights(detail: Detail) {
  const textSources = [detail.descripcion, detail.detail?.observaciones].filter(Boolean).join(" ");
  const text = textSources.trim();
  const lower = text.toLowerCase();
  const items: string[] = [];

  const lotCount = detail.lots?.length ?? 0;
  if (lotCount > 0) {
    items.push(`Número de lotes: ${lotCount} según el listado del BOE.`);
  } else if (text) {
    const lotRefs = text.match(/lote\s+\d+/gi);
    if (lotRefs && lotRefs.length > 0) {
      items.push(`Se mencionan ${lotRefs.length} referencias a "lote" en la descripción.`);
    }
  }

  const lotTypes = Array.from(new Set((detail.lots || []).map((l) => l.tipo_bien).filter(Boolean)));
  if (lotTypes.length > 0) {
    items.push(`Tipos de activos por lote: ${lotTypes.join(", ")}.`);
  } else {
    const keywordTypes = ["vivienda", "garaje", "trastero", "local", "solar", "oficina", "nave"];
    const found = keywordTypes.filter((k) => lower.includes(k));
    if (found.length > 0) {
      items.push(`En la descripción se citan activos como: ${found.join(", ")}.`);
    }
  }

  const chargesFree = ["libre de cargas", "sin cargas", "sin carga"];
  if (chargesFree.some((k) => lower.includes(k))) {
    items.push("El texto indica que se menciona \"libre de cargas\" o similar. Verifica en certificación registral.");
  }
  const mortgagesCancelled = ["hipoteca cancelada", "cancelada la hipoteca", "cancelación de hipoteca"];
  if (mortgagesCancelled.some((k) => lower.includes(k))) {
    items.push("La descripción menciona cancelación de hipoteca. Confirmar en la nota registral.");
  }

  return { text, items };
}

function buildAnalysis(detail: Detail, valorSubasta: number | null) {
  if (detail.explanation) {
    return {
      bueno: detail.explanation.key_points && detail.explanation.key_points.length > 0 ? detail.explanation.key_points : null,
      riesgos: detail.explanation.risks && detail.explanation.risks.length > 0 ? detail.explanation.risks : null,
      paraQuien: detail.explanation.checklist && detail.explanation.checklist.length > 0 ? detail.explanation.checklist : null,
      resumen: detail.explanation.summary_text,
    };
  }

  const bueno: string[] = [];
  const riesgos: string[] = [];
  const paraQuien: string[] = [];

  if (detail.provincia) bueno.push(`Ubicación: ${detail.provincia}${detail.municipio ? `, ${detail.municipio}` : ""}`);
  if (valorSubasta) bueno.push(`Importe de salida visible: ${formatMoney(valorSubasta)}`);
  bueno.push("Datos públicos del BOE consolidados en una sola ficha.");

  riesgos.push("Validar cargas y certificación registral antes de pujar.");
  riesgos.push(mapRiskCopy(detail.detail?.situacion_posesoria));
  riesgos.push("Verificar impuestos aplicables (ITP/IVA/AJD) con un profesional.");

  paraQuien.push("Inversor paciente que asuma trámites y revisión documental.");
  paraQuien.push("Perfil que valore activos públicos con descuento potencial frente a mercado.");

  return { bueno, riesgos, paraQuien, resumen: null };
}

function computeOutputs(inputs: CalculatorInputs): CalculatorOutputs {
  const impuestos = inputs.precioAdjudicacion * (inputs.itpPercent / 100);
  const totalMin =
    inputs.precioAdjudicacion +
    impuestos +
    inputs.costesJuridicosMin +
    inputs.costesPosesionMin +
    inputs.otrosMin;
  const totalMax =
    inputs.precioAdjudicacion +
    impuestos +
    inputs.costesJuridicosMax +
    inputs.costesPosesionMax +
    inputs.otrosMax;
  const margenVsMercadoMin = inputs.valorMercado ? inputs.valorMercado - totalMax : null;
  const margenVsMercadoMax = inputs.valorMercado ? inputs.valorMercado - totalMin : null;
  const roiMin = inputs.valorMercado && totalMax > 0 ? ((inputs.valorMercado - totalMax) / totalMax) * 100 : null;
  const roiMax = inputs.valorMercado && totalMin > 0 ? ((inputs.valorMercado - totalMin) / totalMin) * 100 : null;
  const rentYieldMin =
    inputs.rentaMensual > 0 && totalMax > 0 ? ((inputs.rentaMensual * 12) / totalMax) * 100 : null;
  const rentYieldMax =
    inputs.rentaMensual > 0 && totalMin > 0 ? ((inputs.rentaMensual * 12) / totalMin) * 100 : null;

  const escenarios = ["Conservador", "Medio", "Optimista"].map((nombre, idx) => {
    if (!inputs.valorMercado) return { nombre, valorEscenario: null, roi: null, margen: null };
    const factor = idx === 0 ? 0.9 : idx === 1 ? 1.0 : 1.1;
    const valorEscenario = inputs.valorMercado * factor;
    const base = idx === 0 ? totalMax : idx === 1 ? (totalMin + totalMax) / 2 : totalMin;
    const margen = valorEscenario - base;
    const roi = base > 0 ? (margen / base) * 100 : null;
    return { nombre, valorEscenario, roi, margen };
  });

  return {
    impuestos,
    impuestosLabel: formatMoney(impuestos),
    totalMin,
    totalMax,
    totalLabel: formatRange(totalMin, totalMax, { money: true }),
    margenVsMercadoMin,
    margenVsMercadoMax,
    roiMin,
    roiMax,
    rentYieldMin,
    rentYieldMax,
    escenarios,
  };
}

function DocumentsSection({ documents }: { documents?: Detail["documents"] }) {
  return (
    <Section
      title="Documentos (BOE)"
      subtitle="Metadatos públicos de los PDFs. Si falta alguno, seguirá apareciendo este bloque."
    >
      {documents && documents.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left">Título</th>
                <th className="px-3 py-2 text-left">Tipo</th>
                <th className="px-3 py-2 text-left">Tamaño</th>
                <th className="px-3 py-2 text-left">Páginas</th>
                <th className="px-3 py-2 text-left">Acción</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-t border-border">
                  <td className="px-3 py-2">{safeText(doc.title, "Documento")}</td>
                  <td className="px-3 py-2">{safeText(doc.doc_type)}</td>
                  <td className="px-3 py-2">
                    {doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : NO_DATA}
                  </td>
                  <td className="px-3 py-2">{doc.pages ?? NO_DATA}</td>
                  <td className="px-3 py-2">
                    <a
                      className="text-primary underline"
                      href={`/api/subastas-proxy/documents/${doc.id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Descargar
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
    <p className="text-sm text-muted-foreground">No hay documentos públicos del BOE disponibles.</p>
      )}
      <p className="text-xs text-muted-foreground">Consejo: revisa siempre la certificación registral completa.</p>
    </Section>
  );
}

function CargasSection({ detail }: { detail: Detail }) {
  const cargas = useMemo(() => (detail.amounts || []).filter((a) => a.amount_type === "CARGA" || a.amount_type === "DEUDA"), [detail.amounts]);
  return (
    <Section
      title="Cargas y gravámenes"
      subtitle="Importa porque reduce tu margen: son deudas o gravámenes que podrían subsistir. Valida siempre en registro."
    >
      {cargas.length > 0 ? (
        <div className="space-y-2">
          {cargas.map((c, idx) => (
            <div key={`${c.id}-${idx}`} className="rounded border border-border/60 bg-muted/30 px-3 py-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{c.amount_type || "Carga"}</span>
                <span className="text-sm font-semibold">{formatMoney(c.amount_eur)}</span>
              </div>
              {c.raw_text ? <p className="text-xs text-muted-foreground mt-1">Fuente: {c.raw_text}</p> : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No consta (BOE). Pide nota simple o certificación registral para confirmar si hay cargas vigentes.
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Aviso: este bloque es orientativo. Revisar certificación registral y nota simple antes de pujar.
      </p>
    </Section>
  );
}

function FiscalidadSection({ province, itpPercent }: { province: string; itpPercent: number }) {
  return (
    <Section
      title="Fiscalidad estimada (orientativa)"
      subtitle="Impuestos habituales en adjudicaciones. Confirma con un asesor fiscal de tu comunidad."
    >
      <ul className="list-disc pl-5 space-y-1">
        <li>
          ITP estimado: {formatPercent(itpPercent)}. El tipo exacto depende de la comunidad autónoma (rango habitual 6%-11%).
          Provincia detectada: {province || NO_DATA}.
        </li>
        <li>
          IVA/AJD: solo aplica en supuestos concretos (obra nueva u operaciones sujetas). Si no tienes certeza, asume ITP y valida
          con un asesor.
        </li>
        <li>
          Plusvalía municipal: posible si es suelo urbano. Pregunta en el ayuntamiento tras la adjudicación.
        </li>
      </ul>
      <p className="text-xs text-muted-foreground">
        Estimación orientativa. No vinculante. Consulta siempre con un profesional fiscal antes de pujar.
      </p>
    </Section>
  );
}

function CostesPostSection({ defaults, posesionNota }: { defaults: CalculatorInputs; posesionNota: string }) {
  return (
    <Section
      title="Costes post-adjudicación (orientativos)"
      subtitle="Gastos probables tras ganar: ayudan a no infraestimar el desembolso real."
    >
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded border border-border/60 bg-muted/20 p-3">
          <div className="font-medium">Costes jurídicos</div>
          <p className="text-sm text-muted-foreground">
            {formatRange(defaults.costesJuridicosMin, defaults.costesJuridicosMax, { money: true })} (abogado, procurador,
            notaría/registro). Surgen al preparar escritos, inscribir y formalizar el título.
          </p>
        </div>
        <div className="rounded border border-border/60 bg-muted/20 p-3">
          <div className="font-medium">Costes de posesión</div>
          <p className="text-sm text-muted-foreground">
            {formatRange(defaults.costesPosesionMin, defaults.costesPosesionMax, { money: true })}. {posesionNota} Cubren
            entrega, posibles lanzamientos y cerrajería.
          </p>
        </div>
        <div className="rounded border border-border/60 bg-muted/20 p-3">
          <div className="font-medium">Otros gastos</div>
          <p className="text-sm text-muted-foreground">
            {formatRange(defaults.otrosMin, defaults.otrosMax, { money: true })} (gestoría, suministros pendientes,
            comunidad/IBI si aplica). Suelen aparecer tras recibir la posesión.
          </p>
        </div>
        <div className="rounded border border-border/60 bg-muted/20 p-3">
          <div className="font-medium">Tiempo</div>
          <p className="text-sm text-muted-foreground">
            Reserva semanas/meses para inscripción, entrega y saneamiento de cargas; el calendario depende de juzgado y ocupación.
          </p>
        </div>
      </div>
    </Section>
  );
}

function ComparablesInputs({
  inputs,
  onChange,
}: {
  inputs: CalculatorInputs;
  onChange: (field: keyof CalculatorInputs, value: number) => void;
}) {
  return (
    <Section
      title="Comparables de mercado (MVP manual)"
      subtitle="Aún sin estimación automática. Introduce tu hipótesis de valor y renta para calibrar margen."
    >
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Valor de mercado estimado (€)</span>
          <input
            type="number"
            className="rounded border border-border bg-background px-3 py-2"
            value={inputs.valorMercado || ""}
            onChange={(e) => onChange("valorMercado", Number(e.target.value) || 0)}
            min={0}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Alquiler mensual estimado (€)</span>
          <input
            type="number"
            className="rounded border border-border bg-background px-3 py-2"
            value={inputs.rentaMensual || ""}
            onChange={(e) => onChange("rentaMensual", Number(e.target.value) || 0)}
            min={0}
          />
        </label>
      </div>
      <p className="text-xs text-muted-foreground">MVP manual: introduce tus comparables o tasación interna.</p>
      <p className="text-xs text-muted-foreground">
        Estimación orientativa basada en tus inputs. No es tasación oficial ni recomendación de inversión.
      </p>
    </Section>
  );
}

function RentabilidadSection({ outputs }: { outputs: CalculatorOutputs }) {
  return (
    <Section
      title="Rentabilidad y escenarios"
      subtitle="Cálculo orientativo a partir de tus hipótesis. No sustituye un estudio financiero completo."
    >
      <div className="grid gap-3 md:grid-cols-3">
        <KeyNumber
          label="ROI estimado"
          value={outputs.roiMin !== null || outputs.roiMax !== null ? formatRange(outputs.roiMin, outputs.roiMax, { percent: true }) : NO_DATA}
          helper="Flip: margen vs coste total."
        />
        <KeyNumber
          label="Margen vs mercado"
          value={
            outputs.margenVsMercadoMin !== null || outputs.margenVsMercadoMax !== null
              ? formatRange(outputs.margenVsMercadoMin, outputs.margenVsMercadoMax, { money: true })
              : NO_DATA
          }
          helper="Diferencia entre tu hipótesis de valor y el coste total."
        />
        <KeyNumber
          label="Yield alquiler"
          value={
            outputs.rentYieldMin !== null || outputs.rentYieldMax !== null
              ? formatRange(outputs.rentYieldMin, outputs.rentYieldMax, { percent: true })
              : NO_DATA
          }
          helper="Solo si indicas renta mensual."
        />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {outputs.escenarios.map((esc) => (
          <div key={esc.nombre} className="rounded border border-border/60 bg-muted/20 p-3">
            <div className="text-sm font-semibold">{esc.nombre}</div>
            <div className="text-sm text-muted-foreground">
              Valor: {esc.valorEscenario ? formatMoney(esc.valorEscenario) : NO_DATA}
            </div>
            <div className="text-sm text-muted-foreground">
              ROI: {esc.roi !== null ? formatPercent(esc.roi) : NO_DATA}
            </div>
            <div className="text-sm text-muted-foreground">
              Margen: {esc.margen !== null ? formatMoney(esc.margen) : NO_DATA}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Siempre orientativo. Ajusta inputs para tus hipótesis.</p>
      <p className="text-xs text-muted-foreground">
        No vinculante. No es recomendación de inversión. Verifica con tu equipo financiero.
      </p>
    </Section>
  );
}

function CosteTotalSection({
  inputs,
  outputs,
  onChange,
}: {
  inputs: CalculatorInputs;
  outputs: CalculatorOutputs;
  onChange: (field: keyof CalculatorInputs, value: number) => void;
}) {
  return (
    <Section
      title="Coste total estimado"
      subtitle="Calculadora editable. Incluye impuestos y costes orientativos según tus inputs."
    >
      <div className="grid gap-3 md:grid-cols-3">
        <KeyNumber
          label="Coste total"
          value={outputs.totalLabel}
          helper="Incluye impuestos y costes que indiques. Estimación orientativa. No vinculante."
        />
        <KeyNumber
          label="Impuestos (ITP)"
          value={outputs.impuestosLabel}
          helper={`${inputs.itpPercent.toFixed(1)}% aplicado sobre el precio de adjudicación que configures.`}
        />
        <KeyNumber label="Precio adjudicación" value={formatMoney(inputs.precioAdjudicacion)} />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Precio adjudicación (€)</span>
          <input
            type="number"
            className="rounded border border-border bg-background px-3 py-2"
            value={inputs.precioAdjudicacion || ""}
            onChange={(e) => onChange("precioAdjudicacion", Number(e.target.value) || 0)}
            min={0}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">% ITP</span>
          <input
            type="number"
            step="0.1"
            className="rounded border border-border bg-background px-3 py-2"
            value={inputs.itpPercent || ""}
            onChange={(e) => onChange("itpPercent", Number(e.target.value) || 0)}
            min={0}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Costes jurídicos (€ rango)</span>
          <div className="flex gap-2">
            <input
              type="number"
              className="w-1/2 rounded border border-border bg-background px-3 py-2"
              value={inputs.costesJuridicosMin || ""}
              onChange={(e) => onChange("costesJuridicosMin", Number(e.target.value) || 0)}
              min={0}
            />
            <input
              type="number"
              className="w-1/2 rounded border border-border bg-background px-3 py-2"
              value={inputs.costesJuridicosMax || ""}
              onChange={(e) => onChange("costesJuridicosMax", Number(e.target.value) || 0)}
              min={0}
            />
          </div>
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Costes posesión (€ rango)</span>
          <div className="flex gap-2">
            <input
              type="number"
              className="w-1/2 rounded border border-border bg-background px-3 py-2"
              value={inputs.costesPosesionMin || ""}
              onChange={(e) => onChange("costesPosesionMin", Number(e.target.value) || 0)}
              min={0}
            />
            <input
              type="number"
              className="w-1/2 rounded border border-border bg-background px-3 py-2"
              value={inputs.costesPosesionMax || ""}
              onChange={(e) => onChange("costesPosesionMax", Number(e.target.value) || 0)}
              min={0}
            />
          </div>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Otros (€ rango)</span>
          <div className="flex gap-2">
            <input
              type="number"
              className="w-1/2 rounded border border-border bg-background px-3 py-2"
              value={inputs.otrosMin || ""}
              onChange={(e) => onChange("otrosMin", Number(e.target.value) || 0)}
              min={0}
            />
            <input
              type="number"
              className="w-1/2 rounded border border-border bg-background px-3 py-2"
              value={inputs.otrosMax || ""}
              onChange={(e) => onChange("otrosMax", Number(e.target.value) || 0)}
              min={0}
            />
          </div>
        </label>
      </div>

      <p className="text-xs text-muted-foreground">
        Estimación orientativa. No vinculante. No modifica los datos oficiales de la subasta. Ajusta los rangos según tu criterio.
      </p>
    </Section>
  );
}

function InvestorPanels({
  detail,
  valorSubasta,
  deposito,
  posesionNota,
}: {
  detail: Detail;
  valorSubasta: number | null;
  deposito: number | null;
  posesionNota: string;
}) {
  const defaultPosesion = derivePosesionCosts(detail.detail?.situacion_posesoria);
  const [inputs, setInputs] = useState<CalculatorInputs>({
    precioAdjudicacion: valorSubasta ?? 0,
    itpPercent: guessItpPercent(detail.provincia),
    costesJuridicosMin: 1500,
    costesJuridicosMax: 3000,
    costesPosesionMin: defaultPosesion.min,
    costesPosesionMax: defaultPosesion.max,
    otrosMin: 500,
    otrosMax: 1200,
    valorMercado: valorSubasta ? valorSubasta * 1.15 : 0,
    rentaMensual: 0,
  });

  const outputs = useMemo(() => computeOutputs(inputs), [inputs]);

  const handleChange = (field: keyof CalculatorInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Section
        title="Números clave para decidir"
        subtitle="Importes básicos que condicionan la puja y el desembolso total."
      >
        <div className="grid gap-3 md:grid-cols-4">
          <KeyNumber
            label="Valor de subasta (tipo de salida)"
            value={valorSubasta ? formatMoney(valorSubasta) : NO_DATA}
            helper="Importe de referencia fijado en la subasta. No es tasación de mercado."
          />
          <KeyNumber
            label="Depósito para pujar"
            value={deposito ? formatMoney(deposito) : NO_DATA}
            helper="Se exige para participar. Se devuelve si no resultas adjudicatario."
          />
          <KeyNumber
            label="Coste total estimado"
            value={outputs.totalLabel}
            helper="Incluye impuestos y costes que configuras. Estimación orientativa. No vinculante."
          />
          <KeyNumber
            label="Rentabilidad estimada"
            value={
              outputs.roiMin !== null || outputs.roiMax !== null
                ? formatRange(outputs.roiMin, outputs.roiMax, { percent: true })
                : NO_DATA
            }
            helper="Basada en tu hipótesis de valor. No es promesa ni garantía."
          />
        </div>
      </Section>

      <CosteTotalSection inputs={inputs} outputs={outputs} onChange={handleChange} />

      <ComparablesInputs inputs={inputs} onChange={handleChange} />

      <RentabilidadSection outputs={outputs} />
    </div>
  );
}

export function SubastaDetailClient({ detail }: { detail: Detail }) {
  const valorSubasta = detail.detail?.valor_subasta ?? pickAmount(detail.amounts, "VALOR_SUBASTA");
  const deposito = detail.detail?.importe_deposito ?? pickAmount(detail.amounts, "DEPOSITO");
  const deuda = pickAmount(detail.amounts, "DEUDA");
  const posesion = detail.detail?.situacion_posesoria;
  const posesionNota = mapRiskCopy(posesion);

  const analysis = useMemo(() => buildAnalysis(detail, valorSubasta), [detail, valorSubasta]);
  const detailStatus = mapDetailStatus(detail.detail_status);
  const riskWarnings = useMemo(() => {
    const warnings: string[] = [];
    if (!posesion) warnings.push("Posesión no informada: puede haber entrega demorada u ocupación.");
    if (!detail.detail?.observaciones && !(detail.lots || []).some((l) => l.cargas)) {
      warnings.push("Cargas no confirmadas: revisa certificación registral antes de pujar.");
    }
    if (detailStatus.tone !== "success") {
      warnings.push("Información de detalle pendiente o incompleta. Consulta el BOE para contrastar.");
    }
    return warnings;
  }, [posesion, detail.detail?.observaciones, detail.lots, detailStatus.tone]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Link href="/subastas" className="text-sm text-primary underline">
            ← Volver a subastas
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">{detail.id_sub}</h1>
            <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium">
              {safeText(detail.estado, "Estado no indicado")}
            </span>
          </div>
          <p className="text-muted-foreground max-w-3xl">{safeText(detail.descripcion, "Sin descripción visible")}</p>
          <div className="inline-flex items-center gap-2 rounded border border-border bg-muted/30 px-3 py-1 text-xs">
            <span className="font-semibold">Detalle:</span>
            <span
              className={
                detailStatus.tone === "success"
                  ? "text-green-700 dark:text-green-400"
                  : detailStatus.tone === "warn"
                    ? "text-amber-700 dark:text-amber-300"
                    : "text-red-700 dark:text-red-400"
              }
            >
              {detailStatus.label}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span>Tipo de procedimiento: {safeText(detail.detail?.tipo_subasta)}</span>
            <span>Juzgado / notaría: {safeText(detail.detail?.juzgado)}</span>
            <span>N.º de expediente: {safeText(detail.expediente)}</span>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 flex flex-col gap-1 min-w-[240px]">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Fecha límite para pujar</span>
          <span className="text-sm font-medium">
            {detail.fecha_conclusion_prevista
              ? new Date(detail.fecha_conclusion_prevista).toLocaleString("es-ES")
              : NO_DATA}
          </span>
          <div className="text-primary">
            <span className="text-xs text-muted-foreground mr-1">Tiempo restante para presentar pujas:</span>
            <Countdown target={detail.fecha_conclusion_prevista} />
          </div>
          <span className="text-xs text-muted-foreground">
            Estado según BOE. Verifica la última actualización antes de decidir.
          </span>
        </div>
      </div>

      <Section
        title="Resumen rápido"
        subtitle="Vista ejecutiva para cualquier perfil: qué se subasta, dónde y bajo qué estado."
      >
        <div className="grid gap-3 md:grid-cols-3">
          <InfoRow label="Tipo de bien" value={safeText(detail.lots?.[0]?.tipo_bien || detail.detail?.tipo_subasta || detail.descripcion)} />
          <InfoRow label="Estado del procedimiento" value={safeText(detail.estado)} />
          <InfoRow label="Provincia" value={safeText(detail.provincia)} />
          <InfoRow label="Municipio" value={safeText(detail.municipio)} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <InfoRow label="Fecha de cierre" value={detail.fecha_conclusion_prevista ? new Date(detail.fecha_conclusion_prevista).toLocaleString("es-ES") : NO_DATA} />
          <InfoRow label="Valor de subasta" value={valorSubasta ? formatMoney(valorSubasta) : NO_DATA} />
          <InfoRow label="Depósito requerido" value={deposito ? formatMoney(deposito) : NO_DATA} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <InfoRow label="Juzgado / Autoridad" value={safeText(detail.detail?.juzgado)} />
          <InfoRow label="Expediente" value={safeText(detail.expediente)} />
          <InfoRow label="Enlace BOE" value={detail.url ? "Disponible (ver botón al final)" : NO_DATA} />
        </div>
      </Section>

      <Section
        title="Información financiera básica"
        subtitle="Datos numéricos esenciales para valorar la puja. Siempre visibles aunque falten valores."
      >
        <div className="grid gap-3 md:grid-cols-3">
          <InfoRow label="Valor de subasta" value={valorSubasta ? formatMoney(valorSubasta) : NO_DATA} />
          <InfoRow label="Depósito exigido" value={deposito ? formatMoney(deposito) : NO_DATA} />
          <InfoRow label="Deuda conocida" value={deuda ? formatMoney(deuda) : NO_DATA} />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <InfoRow
            label="Depósito sobre valor"
            value={
              valorSubasta && deposito
                ? formatPercent((deposito / valorSubasta) * 100)
                : "No se puede calcular sin valor y depósito"
            }
          />
          <InfoRow
            label="Aviso de riesgo"
            value={
              valorSubasta && deposito
                ? "Comprueba cargas y posesión antes de pujar."
                : "Faltan importes clave; revisa BOE y certificaciones antes de pujar."
            }
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Estos datos son orientativos. No constituyen recomendación de inversión ni asesoramiento legal o fiscal.
        </p>
      </Section>

      <InvestorPanels detail={detail} valorSubasta={valorSubasta} deposito={deposito} posesionNota={posesionNota} />

      <Section title="Bien subastado y ubicación" subtitle="Qué se subasta y dónde está. Útil para valorar demanda y logística.">
        <div className="grid gap-3 md:grid-cols-3">
          <InfoRow label="Provincia" value={safeText(detail.provincia)} />
          <InfoRow label="Municipio" value={safeText(detail.municipio)} />
          <InfoRow label="Dirección" value={safeText(detail.detail?.direccion_completa || detail.direccion)} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <InfoRow label="Tipo de bien" value={safeText(detail.lots?.[0]?.tipo_bien || detail.detail?.tipo_subasta || detail.descripcion)} />
          <InfoRow label="Referencia catastral" value={NO_DATA} />
          <InfoRow label="Uso declarado" value={safeText(detail.lots?.[0]?.descripcion)} />
        </div>
        <p className="text-xs text-muted-foreground">Si faltan datos, consúltalos en el BOE o certificación registral.</p>
      </Section>

      <Section title="Información legal" subtitle="Datos jurídicos clave. Si falta alguno, revisa el BOE o solicita certificación.">
        <div className="grid gap-3 md:grid-cols-3">
          <InfoRow label="Juzgado / autoridad" value={safeText(detail.detail?.juzgado)} />
          <InfoRow label="Procedimiento / expediente" value={safeText(detail.expediente)} />
          <InfoRow label="Tipo de subasta" value={safeText(detail.detail?.tipo_subasta)} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <InfoRow label="Situación posesoria declarada" value={safeText(posesion)} />
          <InfoRow label="Cargas conocidas (texto)" value={safeText(detail.detail?.observaciones)} />
          <InfoRow label="Estado de detalle" value={detailStatus.label} />
        </div>
        <p className="text-xs text-muted-foreground">
          Esta sección no sustituye a la revisión registral ni al asesoramiento legal.
        </p>
      </Section>

      <Section title="Riesgos y avisos" subtitle="Alertas automáticas para inversores y asesores. Revisa siempre el BOE.">
        {riskWarnings.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {riskWarnings.map((w, idx) => (
              <li key={`warn-${idx}`}>{w}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Sin avisos adicionales detectados. Aun así, verifica cargas, posesión y plazos antes de pujar.
          </p>
        )}
      </Section>

      <Section
        title="Posesión y riesgos"
        subtitle="Afecta tiempos y costes de entrega. Confirma la situación real antes de pujar."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <InfoRow label="Situación posesoria" value={safeText(posesion)} />
          <InfoRow label="Nota de riesgo" value={posesionNota} />
        </div>
        <p className="text-xs text-muted-foreground">
          Confirmar ocupación real con acta o diligencia; ajustar la puja al riesgo de demora.
        </p>
      </Section>

      <CargasSection detail={detail} />

      <DocumentsSection documents={detail.documents} />

      <Section
        title="Información clave detectada en la descripción del BOE"
        subtitle="Solo usa el texto disponible. No se infiere ni se promete nada que no esté escrito."
      >
        {(() => {
          const { text, items } = extractDescriptionHighlights(detail);
          if (!text) {
            return <p className="text-sm text-muted-foreground">No consta (BOE) una descripción larga para analizar.</p>;
          }
          if (items.length === 0) {
            return (
              <>
                <p className="text-sm text-muted-foreground">
                  No se han identificado datos adicionales en el texto. Revisa la documentación oficial.
                </p>
                <p className="text-xs text-muted-foreground">
                  Información extraída del texto descriptivo del BOE. Se recomienda revisar documentación oficial.
                </p>
              </>
            );
          }
          return (
            <>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {items.map((item, idx) => (
                  <li key={`desc-${idx}`}>{item}</li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">
                Información extraída del texto descriptivo del BOE. Se recomienda revisar documentación oficial.
              </p>
            </>
          );
        })()}
      </Section>

      <FiscalidadSection province={detail.provincia || ""} itpPercent={guessItpPercent(detail.provincia)} />

      <CostesPostSection
        defaults={{
          precioAdjudicacion: valorSubasta ?? 0,
          itpPercent: guessItpPercent(detail.provincia),
          costesJuridicosMin: 1500,
          costesJuridicosMax: 3000,
          costesPosesionMin: derivePosesionCosts(detail.detail?.situacion_posesoria).min,
          costesPosesionMax: derivePosesionCosts(detail.detail?.situacion_posesoria).max,
          otrosMin: 500,
          otrosMax: 1200,
          valorMercado: valorSubasta ?? 0,
          rentaMensual: 0,
        }}
        posesionNota={posesionNota}
      />

      <Section
        title="Análisis ADL"
        subtitle="Resumen en lenguaje claro. Si no hay generación, mostramos uno heurístico con los datos públicos."
      >
        {analysis.resumen ? <p className="text-sm leading-relaxed">{analysis.resumen}</p> : null}
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded border border-border/60 bg-muted/20 p-3">
            <div className="text-sm font-semibold">Lo bueno</div>
            <ul className="mt-1 list-disc pl-4 space-y-1 text-sm text-muted-foreground">
              {(analysis.bueno || [NO_DATA]).map((item, idx) => (
                <li key={`b-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded border border-border/60 bg-muted/20 p-3">
            <div className="text-sm font-semibold">Riesgos</div>
            <ul className="mt-1 list-disc pl-4 space-y-1 text-sm text-muted-foreground">
              {(analysis.riesgos || [NO_DATA]).map((item, idx) => (
                <li key={`r-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded border border-border/60 bg-muted/20 p-3">
            <div className="text-sm font-semibold">Para quién encaja</div>
            <ul className="mt-1 list-disc pl-4 space-y-1 text-sm text-muted-foreground">
              {(analysis.paraQuien || [NO_DATA]).map((item, idx) => (
                <li key={`p-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Análisis generado a partir de datos públicos. No es asesoramiento legal, fiscal ni de inversión.
        </p>
      </Section>

      <Section
        title="Qué significa participar en esta subasta"
        subtitle="Guía rápida para perfiles inversor, jurídico y generalista. No es asesoramiento."
      >
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>Necesitarás depósito y cumplir los plazos BOE; si no eres adjudicatario, se devuelve.</li>
          <li>Verifica cargas y posesión: condicionan el coste total y el tiempo de entrega.</li>
          <li>Consulta a un abogado si hay dudas sobre procedimiento, cargas o ocupación.</li>
          <li>Calcula impuestos (ITP/IVA/AJD) y costes post-adjudicación antes de fijar tu puja máxima.</li>
        </ul>
        <p className="text-xs text-muted-foreground">
          ADL no presta asesoramiento legal ni garantiza rentabilidades. Usa esta ficha como apoyo, no como sustituto de due diligence.
        </p>
      </Section>

      <div className="flex gap-4">
        {detail.url && (
          <Link
            href={detail.url}
            target="_blank"
            className="rounded border border-border bg-foreground px-4 py-2 text-background text-sm font-medium"
          >
            Abrir página oficial BOE
          </Link>
        )}
      </div>
    </div>
  );
}

