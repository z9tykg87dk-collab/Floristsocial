import type { CRMActivityType } from "./Activity";

export type TimelineItem = {
  id: string;
  relationshipId: string;
  type: CRMActivityType;
  title: string;
  description?: string;
  linkedRecordType?: "order" | "invoice" | "payment" | "chat" | "media" | "document";
  linkedRecordId?: string;
  occurredAt: string;
  createdAt: string;
};
