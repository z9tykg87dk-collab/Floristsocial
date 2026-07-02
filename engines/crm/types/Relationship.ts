export type RelationshipStatus =
  | "prospect"
  | "active"
  | "paused"
  | "at_risk"
  | "lost"
  | "vip";

export type RelationshipType =
  | "florist_private_customer"
  | "florist_business_customer"
  | "florist_supplier"
  | "florist_courier"
  | "florist_event_company"
  | "floristsocial_supplier";

export type Relationship = {
  id: string;
  ownerId: string;
  targetId: string;
  type: RelationshipType;
  status: RelationshipStatus;
  firstContactAt?: string;
  lastContactAt?: string;
  lastOrderAt?: string;
  totalOrders?: number;
  totalRevenueSek?: number;
  satisfactionScore?: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
};
