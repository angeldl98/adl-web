export type Detail = {
  id_sub: string;
  estado: string | null;
  descripcion: string | null;
  expediente: string | null;
  fecha_conclusion_prevista: string | null;
  provincia: string | null;
  municipio: string | null;
  direccion: string | null;
  url: string | null;
  raw_json?: any;
  detail?: {
    juzgado?: string | null;
    tipo_subasta?: string | null;
    situacion_posesoria?: string | null;
    valor_subasta?: number | null;
    importe_deposito?: number | null;
    direccion_completa?: string | null;
    observaciones?: string | null;
  } | null;
  lots?: Array<{
    id: number;
    num_lote: number | null;
    descripcion: string | null;
    tipo_bien: string | null;
    direccion: string | null;
    valor: number | null;
    cargas: string | null;
  }>;
  documents?: Array<{
    id: number;
    doc_type: string | null;
    title: string | null;
    file_size: number | null;
    pages: number | null;
    has_text: boolean | null;
  }>;
  explanation?: {
    summary_text?: string | null;
    key_points?: string[];
    risks?: string[];
    checklist?: string[];
    generated_at?: string | null;
    version?: string | null;
  } | null;
  entities?: Array<{
    id: number;
    entity_type: string | null;
    name: string | null;
    identifier_type: string | null;
    identifier_value: string | null;
    confidence: number | null;
  }>;
  amounts?: Array<{
    id: number;
    amount_type: string | null;
    amount_eur: number | null;
    raw_text: string | null;
  }>;
  detail_status?: string | null;
  detail_error_code?: string | null;
  detail_last_attempt_at?: string | null;
};

