export type FosActionStatus = "queued" | "in_progress" | "completed" | "failed";
export type FosActionPriority = "low" | "medium" | "high" | "urgent";

export type FosQueuedAction = {
  id: string;
  title: string;
  description: string;
  targetModule: string;
  priority: FosActionPriority;
  status: FosActionStatus;
  source: string;
  payload: Record<string, any>;
  createdAt: string;
  updatedAt: string;
};
