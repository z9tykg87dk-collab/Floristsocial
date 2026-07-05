export type FosHealthStatus = "healthy" | "warning" | "critical" | "offline";

export type FosEngineHealth = {
  id: string;
  name: string;
  status: FosHealthStatus;
  version: string;
  apiPath?: string;
  dashboardPath?: string;
  testPath?: string;
  lastCheckedAt: string;
  message: string;
};

export type FosSystemHealthReport = {
  status: FosHealthStatus;
  version: string;
  generatedAt: string;
  engines: FosEngineHealth[];
  summary: {
    healthy: number;
    warning: number;
    critical: number;
    offline: number;
    total: number;
  };
};
