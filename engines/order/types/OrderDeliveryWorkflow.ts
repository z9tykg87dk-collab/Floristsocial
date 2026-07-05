export type OrderDeliveryStepStatus =
  | "planned"
  | "active"
  | "completed"
  | "blocked"
  | "cancelled";

export type OrderDeliveryStepType =
  | "order_received"
  | "production_planned"
  | "production_started"
  | "production_completed"
  | "packing"
  | "courier_pickup"
  | "customer_delivery"
  | "delivery_completed"
  | "trust_rating_scheduled";

export type OrderDeliveryWorkflowStep = {
  id: string;
  orderId: string;
  type: OrderDeliveryStepType;
  title: string;
  description?: string;
  status: OrderDeliveryStepStatus;
  startsAt?: string;
  completedAt?: string;
  assignedToRole?: "florist" | "courier" | "system";
};

export type OrderDeliveryWorkflow = {
  id: string;
  orderId: string;
  floristId: string;
  customerId?: string;
  deliveryDeadlineAt: string;
  steps: OrderDeliveryWorkflowStep[];
  createdAt: string;
};
