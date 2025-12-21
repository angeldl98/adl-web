# BOE Web UI Contract (adl-panel)

Fuente de datos: `api/subastas-proxy` (listado) y `api/subastas-proxy/[id]` (detalle). El frontend se renderiza con datos ya normalizados por el backend (adl-scraper + gateway).

## Listado `/subastas`
- Endpoint: `GET /api/subastas-proxy?provincia&estado&from&to&limit&offset`
- Campos consumidos en UI:
  - `id_sub` (requerido, enlace a detalle)
  - `estado` (opcional, muestra `—` si falta)
  - `provincia` (opcional)
  - `fecha_conclusion_prevista` (opcional; se formatea a fecha ES; si inválida se muestra literal)
  - `descripcion` (opcional)
- Orden: el endpoint define el orden; la UI no reordena. Paginación/offset si `meta` viene presente (mostrando límites).

## Detalle `/subastas/[idSub]`
- Endpoint: `GET /api/subastas-proxy/[id]`
- Campos consumidos:
  - Top-level: `id_sub` (requerido), `descripcion`, `estado`, `expediente`, `fecha_conclusion_prevista`, `provincia`, `municipio`, `direccion`, `url`.
  - `detail`: `juzgado`, `tipo_subasta`, `situacion_posesoria`, `valor_subasta`, `importe_deposito`, `direccion_completa`, `observaciones`.
  - `lots[]`: `id`, `num_lote`, `descripcion`, `tipo_bien`, `direccion`, `valor`, `cargas`.
  - `documents[]`: `id`, `doc_type`, `title`, `file_size`, `pages`, `has_text`; link de descarga: `/api/subastas-proxy/documents/{id}`.
  - `entities[]`: `name`, `entity_type`, `identifier_type`, `identifier_value`, `confidence`.
  - `amounts[]`: `amount_type` (esperado: `VALOR_SUBASTA`, `DEPOSITO`, `DEUDA`, `CARGA`), `amount_eur`, `raw_text`.
  - `explanation`: `summary_text`, `key_points[]`, `risks[]`, `checklist[]`, `generated_at`, `version`.
  - `url` (enlace BOE).
- Visibilidad: la UI muestra secciones aunque vengan vacías, usando “—” o textos de fallback. No hay pestañas ni gating premium actualmente.
- Datos no manejados por la UI: `detail_status` o códigos de error de detalle no se usan en el render (si llegan, la UI simplemente ignorará esos campos).

## Reglas de tolerancia actuales
- Si faltan campos, la UI muestra “—” o “No consta (BOE)” según la sección.
- No hay filtro en UI por `detail_status`; si el backend entrega registros, se renderizan aunque el detalle esté incompleto.

## Recomendaciones para backend/API
- Garantizar presencia de `id_sub` en resumen y detalle.
- Incluir `detail_status`/`detail_error_code` para permitir señales futuras (UI todavía no lo consume).
- Mantener arrays vacíos en lugar de `null` para `lots`, `documents`, `entities`, `amounts`, `explanation` para evitar huecos.

