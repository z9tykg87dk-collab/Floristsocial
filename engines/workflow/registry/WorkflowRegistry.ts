import type { WorkflowEventType } from "../types/WorkflowEvent";
import type { WorkflowAction } from "../types/WorkflowAction";

export const WORKFLOW_REGISTRY: Record<
  WorkflowEventType,
  WorkflowAction[]
> = {
  ORDER_CREATED: [
    { targetEngine: "calendar", handler: "OrderHandler" },
    { targetEngine: "crm", handler: "OrderHandler" },
    { targetEngine: "notification", handler: "OrderHandler" },
    { targetEngine: "economy", handler: "OrderHandler" },
    { targetEngine: "analytics", handler: "OrderHandler" },
    { targetEngine: "intelligence", handler: "OrderHandler" },
  ],

  ORDER_ACCEPTED: [],
  ORDER_DECLINED: [],
  ORDER_CANCELLED: [],

  PAYMENT_COMPLETED: [],
  PAYMENT_FAILED: [],

  DELIVERY_CREATED: [],
  DELIVERY_COMPLETED: [
    { targetEngine: "trust", handler: "DeliveryHandler" },
    { targetEngine: "notification", handler: "DeliveryHandler" },
  ],

  TRUST_RATING_REQUEST_SCHEDULED: [
    { targetEngine: "notification", handler: "TrustHandler" },
  ],

  TRUST_RATING_SUBMITTED: [
    { targetEngine: "trust", handler: "TrustHandler" },
    { targetEngine: "analytics", handler: "TrustHandler" },
    { targetEngine: "match", handler: "TrustHandler" },
    { targetEngine: "intelligence", handler: "TrustHandler" },
  ],

  CRM_ACTIVITY_CREATED: [],
  CALENDAR_ACTIVITY_CREATED: [],

  NOTIFICATION_CREATED: [],

  PROFILE_UPDATED: [],

  SUPPLIER_CAMPAIGN_CREATED: [],

  SYSTEM_EVENT: [],
  PRODUCTION_PLANNED: [
    {
      targetEngine: "production",
      handler: "CREATE_PRODUCTION_JOB",
    },
  ],
};
