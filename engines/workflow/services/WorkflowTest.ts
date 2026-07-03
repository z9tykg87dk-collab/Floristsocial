import { dispatchWorkflowEvent } from "./WorkflowService";

export async function testOrderCreatedWorkflow() {
  return dispatchWorkflowEvent({
    id: crypto.randomUUID(),
    type: "ORDER_CREATED",
    priority: "high",
    sourceEngine: "order",
    actorId: "system",
    actorRole: "system",
    payload: {
      orderId: "demo-order-001",
      floristId: "demo-florist-001",
    },
    createdAt: new Date().toISOString(),
  });
}
