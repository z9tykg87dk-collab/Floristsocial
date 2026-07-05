export type ProductionJobStatus =
  | "planned"
  | "ready_to_start"
  | "in_progress"
  | "quality_check"
  | "packing"
  | "ready_for_pickup"
  | "completed"
  | "blocked"
  | "cancelled";

export type ProductionJobType =
  | "bouquet"
  | "large_bouquet"
  | "bridal_bouquet"
  | "funeral_decoration"
  | "wedding_decoration"
  | "event_decoration"
  | "company_flowers"
  | "subscription_bouquet"
  | "plant"
  | "gift_box";

export type ProductionJob = {
  id: string;
  orderId: string;
  floristId: string;
  type: ProductionJobType;
  title: string;
  status: ProductionJobStatus;
  productionStartsAt: string;
  estimatedMinutes: number;
  packingMinutes: number;
  readyForPickupAt?: string;
  deliveryDeadlineAt: string;
  createdAt: string;
};
