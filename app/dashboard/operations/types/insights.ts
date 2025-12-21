export type TrendScore = 'improving' | 'stable' | 'degrading';

export interface RecommendationSummary {
  id: string;
  title: string;
  description: string;
  impact?: 'low' | 'medium' | 'high';
  suggestedAction?: string;
  relatedEngines?: string[];
  trend?: TrendScore;
}

export interface EngineInsight {
  name: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  trend: TrendScore;
  latencyMs?: number;
  errorRate?: number;
  backlog?: number;
  lastUpdate?: string;
  notes?: string;
  autoscaler?: AutoscalerExplanation;
}

export interface GlobalInsights {
  generatedAt: string;
  summary: string;
  overallTrend: TrendScore;
  hotspots?: string[];
  engines?: EngineInsight[];
}

export interface AutoscalerExplanation {
  engine: string;
  action: 'scale_up' | 'scale_down' | 'none';
  reason: string;
  score?: number;
  recommendedSize?: number;
  timestamp: string;
}

export interface AlertEntry {
  id: string;
  engine: string;
  severity: 'info' | 'warn' | 'critical';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface PredictionSummary {
  engine: string;
  backlogForecast: number;
  cpuTrend: string;
  scaleRecommendation: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface PredictionGlobal {
  systemStatus: 'healthy' | 'under pressure' | 'overprovisioned';
  hotspots: string[];
  predictions: PredictionSummary[];
}


