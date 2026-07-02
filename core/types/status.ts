export const ORDER_STATUSES = [
  "draft",
  "pending",
  "confirmed",
  "paid",
  "in_production",
  "ready_for_delivery",
  "out_for_delivery",
  "delivered",
  "completed",
  "problem",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ACTIVITY_STATUSES = [
  "planned",
  "active",
  "waiting",
  "completed",
  "cancelled",
] as const;

export type ActivityStatus = (typeof ACTIVITY_STATUSES)[number];
