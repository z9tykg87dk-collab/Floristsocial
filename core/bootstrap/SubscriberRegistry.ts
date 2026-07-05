export type FOSSubscriberDefinition = {
  id: string;
  eventType: string;
  engineId: string;
  handler: string;
  status: "active" | "planned";
};

export const FOS_SUBSCRIBERS: FOSSubscriberDefinition[] = [
  {
    id: "workflow-order-created",
    eventType: "ORDER_CREATED",
    engineId: "workflow",
    handler: "OrderCreatedSubscriber",
    status: "active",
  },
  {
    id: "trust-delivery-completed",
    eventType: "DELIVERY_COMPLETED",
    engineId: "trust",
    handler: "DeliveryCompletedSubscriber",
    status: "planned",
  },
];

export function getFOSSubscribers() {
  return FOS_SUBSCRIBERS;
}
