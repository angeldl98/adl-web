export type ServiceInfo = {
  name: string;
  key: string;
  type: 'core' | 'engine' | 'infra' | 'web' | 'control';
  port: number;
  description: string;
  baseUrl: string;
  healthPath?: string;
  metricsPath?: string;
  infoPath?: string;
};

export const services: ServiceInfo[] = [
  { name: 'adl-gateway', key: 'adl-gateway', type: 'control', port: 4000, description: 'Reverse proxy, rate limiting, auth, policy integration', baseUrl: 'http://adl-gateway:4000', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'adl-brain', key: 'adl-brain', type: 'control', port: 4001, description: 'Orquestación de tareas y agentes', baseUrl: 'http://adl-brain:4001', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'adl-executor', key: 'adl-executor', type: 'control', port: 4002, description: 'Ejecución sandbox', baseUrl: 'http://adl-executor:4002', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'adl-monitor', key: 'adl-monitor', type: 'control', port: 4003, description: 'Monitor de contenedores y auto-heal', baseUrl: 'http://adl-monitor:4003', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'adl-knowledge', key: 'adl-knowledge', type: 'control', port: 4004, description: 'RAG / pgvector', baseUrl: 'http://adl-knowledge:4004', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'adl-web', key: 'adl-web', type: 'web', port: 3000, description: 'Next.js dashboard', baseUrl: 'http://adl-web:3000', healthPath: '/api/health' },
  { name: 'core-scheduler', key: 'core-scheduler', type: 'core', port: 4201, description: 'Cron de tareas', baseUrl: 'http://core-scheduler:4201', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'core-secrets', key: 'core-secrets', type: 'core', port: 4202, description: 'Almacén cifrado', baseUrl: 'http://core-secrets:4202', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'core-pipeline', key: 'core-pipeline', type: 'core', port: 4203, description: 'Motor de pipelines', baseUrl: 'http://core-pipeline:4203', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'core-dag', key: 'core-dag', type: 'core', port: 4211, description: 'DAG Engine', baseUrl: 'http://core-dag:4211', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'core-eventbus', key: 'core-eventbus', type: 'core', port: 4212, description: 'Event Bus (Redis Streams)', baseUrl: 'http://core-eventbus:4212', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'core-adlscript', key: 'core-adlscript', type: 'core', port: 4213, description: 'ADL-SCRIPT runtime y registro', baseUrl: 'http://core-adlscript:4213', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'core-policy', key: 'core-policy', type: 'core', port: 4210, description: 'OPA-lite policy engine', baseUrl: 'http://core-policy:4210', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'engine-trading', key: 'engine-trading', type: 'engine', port: 4101, description: 'Engine trading', baseUrl: 'http://engine-trading:4101', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'engine-solvency', key: 'engine-solvency', type: 'engine', port: 4102, description: 'Engine solvency', baseUrl: 'http://engine-solvency:4102', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'engine-scraper', key: 'engine-scraper', type: 'engine', port: 4103, description: 'Engine scraper', baseUrl: 'http://engine-scraper:4103', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'engine-npl', key: 'engine-npl', type: 'engine', port: 4104, description: 'Engine NPL', baseUrl: 'http://engine-npl:4104', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'engine-commerce', key: 'engine-commerce', type: 'engine', port: 4105, description: 'Engine commerce', baseUrl: 'http://engine-commerce:4105', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'engine-startups', key: 'engine-startups', type: 'engine', port: 4106, description: 'Engine startups', baseUrl: 'http://engine-startups:4106', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'engine-daas', key: 'engine-daas', type: 'engine', port: 4107, description: 'Engine data-as-a-service', baseUrl: 'http://engine-daas:4107', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'engine-content', key: 'engine-content', type: 'engine', port: 4108, description: 'Engine content', baseUrl: 'http://engine-content:4108', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'engine-phonefarm', key: 'engine-phonefarm', type: 'engine', port: 4109, description: 'Engine phonefarm', baseUrl: 'http://engine-phonefarm:4109', healthPath: '/health', metricsPath: '/metrics', infoPath: '/info' },
  { name: 'adl-redis', key: 'adl-redis', type: 'infra', port: 6379, description: 'Redis', baseUrl: 'http://adl-redis:6379' },
  { name: 'adl-postgres', key: 'adl-postgres', type: 'infra', port: 5432, description: 'Postgres', baseUrl: 'http://adl-postgres:5432' }
];

export const engines = services.filter(s => s.type === 'engine');
export const coreServices = services.filter(s => s.type === 'core' || s.type === 'control');

