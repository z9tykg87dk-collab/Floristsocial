export type CalendarEventSource =
  | "order"
  | "crm"
  | "trust"
  | "delivery"
  | "payment"
  | "supplier"
  | "workflow"
  | "manual";

export type CalendarEventStatus =
  | "planned"
  | "active"
  | "waiting"
  | "completed"
  | "cancelled"
  | "problem";

export type CalendarEventPriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export type CalendarEvent = {
  id: string;
  ownerId: string;
  ownerRole: string;

  title: string;
  description?: string;

  source: CalendarEventSource;
  sourceRecordId?: string;

  status: CalendarEventStatus;
  priority: CalendarEventPriority;

  startsAt: string;
  endsAt?: string;

  createdBy: string;
  createdAt: string;
  updatedAt?: string;
};
