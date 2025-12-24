ALTER TABLE boe_prod.subastas_pro
  ADD COLUMN IF NOT EXISTS identificador TEXT,
  ADD COLUMN IF NOT EXISTS boe_uid TEXT,
  ADD COLUMN IF NOT EXISTS estado_detalle TEXT,
  ADD COLUMN IF NOT EXISTS riesgo_cargas TEXT,
  ADD COLUMN IF NOT EXISTS riesgo_posesion TEXT,
  ADD COLUMN IF NOT EXISTS capital_minimo TEXT,
  ADD COLUMN IF NOT EXISTS descripcion_bien TEXT,
  ADD COLUMN IF NOT EXISTS url_detalle TEXT;

-- Ensure defaults
ALTER TABLE boe_prod.subastas_pro ALTER COLUMN updated_at SET DEFAULT now();

