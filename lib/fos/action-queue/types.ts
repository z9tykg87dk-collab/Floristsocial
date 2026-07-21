export type FosActionStatus = "queued" | "in_progress" | "completed" | "failed";
export type FosActionPriority = "low" | "medium" | "high" | "urgent";
export type FosActionCategory =
  | "order"
  | "delivery"
  | "customer"
  | "florist"
  | "calendar"
  | "notification"
  | "economy"
  | "trust"
  | "system"
  | "security"
  | "automation"
  | "other";
export type FosActionSource =
  | "manual"
  | "api"
  | "decision-engine"
  | "memory-engine"
  | "intelligence-engine"
  | "automation-engine"
  | "event-store"
  | "system-health"
  | "action-queue-test"
  | "other";
export type FosActionSeverity = "info" | "low" | "medium" | "high" | "critical";
export type FosOperationalActionStatus =
  | FosActionStatus
  | "open"
  | "assigned"
  | "waiting"
  | "resolved"
  | "verified";
export type FosIsoDateString = string;

export type FosQueuedAction = {
  id: string;
  title: string;
  description: string;
  targetModule: string;
  priority: FosActionPriority;
  status: FosActionStatus;
  source: string;
  payload: Record<string, any>;
  createdAt: FosIsoDateString;
  updatedAt: FosIsoDateString;
  category?: FosActionCategory;
  severity?: FosActionSeverity;
  ownerId?: string;
  ownerName?: string;
  slaDeadline?: FosIsoDateString;
  eta?: FosIsoDateString;
  impactScore?: number;
  relatedOrderId?: string;
  relatedFloristId?: string;
  runbookUrl?: string;
  resolvedAt?: FosIsoDateString;
  verifiedAt?: FosIsoDateString;
};
