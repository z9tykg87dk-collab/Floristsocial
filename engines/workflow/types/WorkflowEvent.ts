export type WorkflowPriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export type WorkflowEventType =
  | "ORDER_CREATED"
  | "ORDER_ACCEPTED"
  | "ORDER_DECLINED"
  | "ORDER_CANCELLED"
  | "PAYMENT_COMPLETED"
  | "PAYMENT_FAILED"
  | "DELIVERY_CREATED"
  | "DELIVERY_COMPLETED"
  | "TRUST_RATING_REQUEST_SCHEDULED"
  | "TRUST_RATING_SUBMITTED"
  | "CRM_ACTIVITY_CREATED"
  | "CALENDAR_ACTIVITY_CREATED"
  | "NOTIFICATION_CREATED"
  | "PROFILE_UPDATED"
  | "SUPPLIER_CAMPAIGN_CREATED"
  | "SYSTEM_EVENT";

export type WorkflowEvent = {
  id: string;
  type: WorkflowEventType;
  priority: WorkflowPriority;
  sourceEngine: string;
  actorId?: string;
  actorRole?: string;
  payload: Record<string, unknown>;
  createdAt: string;
};
