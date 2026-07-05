export type FosEventStatus = "created" | "processed" | "failed";

export type FosEventType =
  | "ORDER_CREATED"
  | "ORDER_PAID"
  | "ORDER_CANCELLED"
  | "MESSAGE_RECEIVED"
  | "REVIEW_CREATED"
  | "CUSTOMER_REGISTERED"
  | "FLORIST_REGISTERED"
  | "PAYMENT_FAILED"
  | "DELIVERY_RISK"
  | "CUSTOMER_RETURNED";

export type FosEvent = {
  id: string;
  type: FosEventType;
  sourceModule: string;
  status: FosEventStatus;
  payload: Record<string, any>;
  createdAt: string;
  processedAt?: string;
};
