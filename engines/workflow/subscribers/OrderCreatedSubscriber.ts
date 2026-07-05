import { subscribeToFOSEvent } from "@/core/events/services/FOSEventBus";
import { dispatchWorkflowEvent } from "@/engines/workflow/services/WorkflowService";

export function registerOrderCreatedSubscriber() {
  subscribeToFOSEvent("ORDER_CREATED", async (event) => {
    await dispatchWorkflowEvent({
      id: crypto.randomUUID(),
      type: "ORDER_CREATED",
      priority: "high",
      sourceEngine: "event-bus",
      actorId: event.actorId ?? "system",
      actorRole: event.actorRole ?? "system",
      payload: event.payload,
      createdAt: new Date().toISOString(),
    });
  });
}
