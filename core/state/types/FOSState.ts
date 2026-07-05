export type FOSStateStatus =
  | "created"
  | "planned"
  | "active"
  | "waiting"
  | "completed"
  | "blocked"
  | "cancelled";

export type FOSStateEntityType =
  | "order"
  | "production"
  | "calendar"
  | "workspace"
  | "trust"
  | "crm"
  | "payment"
  | "delivery"
  | "system";

export type FOSStateTimelineItem = {
  id: string;
  entityId: string;
  entityType: FOSStateEntityType;
  action: string;
  description?: string;
  actorId?: string;
  actorRole?: string;
  createdAt: string;
};

export type FOSStateRecord = {
  id: string;
  entityId: string;
  entityType: FOSStateEntityType;
  status: FOSStateStatus;
  currentStep?: string;
  nextStep?: string;
  previousStep?: string;
  ownerId?: string;
  ownerRole?: string;
  updatedAt: string;
};
