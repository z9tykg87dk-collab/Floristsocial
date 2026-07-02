export type CRMActivityType =
  | "call"
  | "email"
  | "chat"
  | "meeting"
  | "quote"
  | "order"
  | "delivery"
  | "follow_up"
  | "reminder"
  | "note"
  | "supplier_offer"
  | "invoice"
  | "payment";

export type CRMActivityStatus =
  | "planned"
  | "active"
  | "waiting"
  | "completed"
  | "cancelled";

export type CRMActivity = {
  id: string;
  relationshipId: string;
  type: CRMActivityType;
  status: CRMActivityStatus;
  title: string;
  description?: string;
  dueAt?: string;
  completedAt?: string;
  createdBy: string;
  createdAt: string;
};
