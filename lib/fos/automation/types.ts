export type AutomationStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed";

export type AutomationPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface AutomationJob {
  id: string;

  title: string;

  description: string;

  sourceEngine: string;

  targetModule: string;

  priority: AutomationPriority;

  status: AutomationStatus;

  payload: Record<string, unknown>;

  createdAt: string;

  startedAt?: string;

  finishedAt?: string;

  error?: string;
}

export interface AutomationStatistics {
  queued: number;
  running: number;
  completed: number;
  failed: number;
}

export interface AutomationEngineState {
  version: string;
  status: "active" | "inactive";
  statistics: AutomationStatistics;
}
