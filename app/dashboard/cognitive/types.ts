export type OrchestrateResponse = {
  id?: string;
  traceId?: string;
  summary?: string;
  status?: string;
  timestamp?: string;
  message?: string;
  error?: string;
};

export type TraceReasoningStep = {
  step?: string;
  content?: string;
  ts?: string;
};

export type TraceTaskNode = {
  id: string;
  title?: string;
  status?: string;
  dependsOn?: string[];
  startedAt?: string;
  finishedAt?: string;
};

export type TraceData = {
  id: string;
  reasoning?: TraceReasoningStep[];
  taskgraph?: TraceTaskNode[];
  policy?: { decision?: string; reason?: string; rules?: any[] };
  safety?: { warnings?: string[]; severity?: string };
  executor?: { proposals?: any[]; commands?: any[]; diffs?: any[] };
  memory?: { reads?: any[]; writes?: any[] };
  reflection?: { summary?: string; actions?: string[] };
  timeline?: { label: string; ts: string }[];
};

export type MemoryReflection = {
  id: string;
  text: string;
  tags?: string[];
  timestamp?: string;
};

export type MemoryTrace = {
  id: string;
  summary?: string;
  tags?: string[];
  timestamp?: string;
};

export type MemoryData = {
  reflections?: MemoryReflection[];
  traces?: MemoryTrace[];
};

export type CatalogData = {
  tools?: any[];
  policies?: any[];
  safety?: any[];
  roles?: any[];
};


