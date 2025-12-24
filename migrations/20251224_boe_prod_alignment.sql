CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Recreate canonical NORM table
DROP TABLE IF EXISTS boe_subastas CASCADE;
CREATE TABLE boe_subastas (
  id SERIAL PRIMARY KEY,
  normalized_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  url TEXT NOT NULL,
  identificador TEXT NOT NULL UNIQUE,
  tipo_subasta TEXT NOT NULL,
  estado TEXT,
  estado_detalle TEXT,
  valor_subasta TEXT,
  tasacion TEXT,
  importe_deposito TEXT,
  organismo TEXT,
  provincia TEXT,
  municipio TEXT,
  checksum TEXT NOT NULL
);

-- Seed from existing public FREE data
INSERT INTO boe_subastas (url, identificador, tipo_subasta, estado, estado_detalle, valor_subasta, tasacion, importe_deposito, organismo, provincia, municipio, checksum)
SELECT url, identificador, tipo_subasta, estado, estado_detalle, valor_subasta, tasacion, importe_deposito, NULL, NULL, NULL, checksum
FROM boe_subastas_public
ON CONFLICT (identificador) DO NOTHING;

-- Canonical PRO schema (boe_prod)
CREATE SCHEMA IF NOT EXISTS boe_prod;

CREATE TABLE IF NOT EXISTS boe_prod.subastas_pro (
  subasta_id INT PRIMARY KEY,
  identificador TEXT,
  boe_uid TEXT,
  estado_subasta TEXT,
  fecha_inicio DATE,
  fecha_fin DATE,
  tipo_bien TEXT,
  es_vivienda BOOLEAN,
  es_comercial BOOLEAN,
  direccion_texto TEXT,
  municipio TEXT,
  provincia TEXT,
  codigo_postal TEXT,
  precio_salida NUMERIC,
  valor_tasacion NUMERIC,
  descuento_pct NUMERIC,
  riesgo_cargas TEXT,
  riesgo_posesion TEXT,
  capital_minimo TEXT,
  descripcion_bien TEXT,
  url_detalle TEXT,
  fuente TEXT DEFAULT 'BOE',
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS boe_prod.subastas_docs (
  identificador TEXT NOT NULL,
  url TEXT NOT NULL,
  tipo_doc TEXT,
  local_path TEXT,
  extracted_text TEXT,
  PRIMARY KEY (identificador, url)
);

CREATE TABLE IF NOT EXISTS boe_prod.subastas_risk (
  subasta_id INT PRIMARY KEY,
  riesgo_cargas TEXT,
  riesgo_posesion TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS boe_prod.subastas_summary (
  subasta_id INT PRIMARY KEY,
  resumen TEXT NOT NULL,
  completitud TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Migrate docs from legacy public table if present
INSERT INTO boe_prod.subastas_docs (identificador, url, tipo_doc, local_path, extracted_text)
SELECT identificador, url, tipo_doc, local_path, extracted_text
FROM boe_subastas_docs
ON CONFLICT DO NOTHING;

-- Drop legacy PRO table to avoid parallel pipelines
DROP TABLE IF EXISTS boe_subastas_pro;

