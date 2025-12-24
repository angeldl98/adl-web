-- Migration: create boe_subastas_public (idempotent)
-- Target DB: adl_core (Postgres 15)

CREATE TABLE IF NOT EXISTS boe_subastas_public (
  id BIGSERIAL PRIMARY KEY,
  id_sub TEXT NOT NULL UNIQUE,
  url_detalle TEXT NOT NULL,
  tipo_subasta TEXT NULL,
  estado TEXT NULL,
  provincia TEXT NULL,
  municipio TEXT NULL,
  expediente TEXT NULL,
  organo_gestor TEXT NULL,
  valor_subasta_eur NUMERIC NULL,
  tasacion_eur NUMERIC NULL,
  importe_deposito_eur NUMERIC NULL,
  cantidad_reclamada_eur NUMERIC NULL,
  fecha_apertura TIMESTAMPTZ NULL,
  fecha_cierre TIMESTAMPTZ NULL,
  descripcion TEXT NULL,
  anuncio_boe TEXT NULL,
  normalized_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_raw_id BIGINT NULL REFERENCES boe_subastas_raw(id),
  visibility TEXT NOT NULL DEFAULT 'FREE'
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'boe_subastas_public' AND indexname = 'idx_boe_public_fecha_cierre'
  ) THEN
    CREATE INDEX idx_boe_public_fecha_cierre ON boe_subastas_public (fecha_cierre);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'boe_subastas_public' AND indexname = 'idx_boe_public_provincia'
  ) THEN
    CREATE INDEX idx_boe_public_provincia ON boe_subastas_public (provincia);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'boe_subastas_public' AND indexname = 'idx_boe_public_normalized_at'
  ) THEN
    CREATE INDEX idx_boe_public_normalized_at ON boe_subastas_public (normalized_at);
  END IF;
END$$;

