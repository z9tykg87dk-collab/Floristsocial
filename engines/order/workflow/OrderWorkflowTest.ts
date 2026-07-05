import { startOrderDeliveryWorkflow } from "./OrderWorkflowBridge";

export async function testOrderDeliveryWorkflow() {
  return startOrderDeliveryWorkflow({
    orderId: "demo-order-001",
    floristId: "demo-florist-001",
    customerId: "demo-customer-001",
    deliveryDeadlineAt: new Date("2026-07-08T13:00:00+02:00").toISOString(),
    deliveryAddressCity: "Stockholm",
    deliveryInsideCityLimit: true,
  });
}
