export type FOSEventPriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export type FOSEventStatus =
  | "created"
  | "processing"
  | "completed"
  | "failed";

export type FOSEvent = {
  id: string;
  type: string;
  source: string;
  priority: FOSEventPriority;
  status: FOSEventStatus;
  actorId?: string;
  actorRole?: string;
  payload: Record<string, unknown>;
  createdAt: string;
  processedAt?: string;
  error?: string;
};
