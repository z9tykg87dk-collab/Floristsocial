import { createFOSEvent, publishFOSEvent } from "@/core/events/services/FOSEventBus";
import { getFOSConfig } from "@/core/config/FOSConfig";
import {
  createFOSStateRecord,
  createFOSTimelineItem,
} from "@/core/state/services/FOSStateService";
import { dispatchWorkflowEvent } from "@/engines/workflow/services/WorkflowService";
import { createOrderDeliveryWorkflow } from "@/engines/order/services/OrderDeliveryWorkflowService";

export async function startOrderDeliveryWorkflow(input: {
  orderId: string;
  floristId: string;
  customerId?: string;
  deliveryDeadlineAt: string;
  deliveryAddressCity: string;
  deliveryInsideCityLimit: boolean;
}) {
  const workflow = createOrderDeliveryWorkflow(input);

  const state = createFOSStateRecord({
    entityId: input.orderId,
    entityType: "order",
    status: "planned",
    currentStep: "order_received",
    nextStep: "production_planned",
    ownerId: input.floristId,
    ownerRole: "florist",
  });

  const timeline = createFOSTimelineItem({
    entityId: input.orderId,
    entityType: "order",
    action: "ORDER_CREATED",
    description: "Orderflöde startades via Order Engine.",
    actorId: "system",
    actorRole: "system",
  });

  const config = getFOSConfig();

  const eventPayload = {
    orderId: input.orderId,
    floristId: input.floristId,
    customerId: input.customerId,
    deliveryDeadlineAt: input.deliveryDeadlineAt,
    deliveryAddressCity: input.deliveryAddressCity,
    deliveryInsideCityLimit: input.deliveryInsideCityLimit,
    workflowId: workflow.id,
    stateId: state.id,
  };

  const fosEvent = config.eventBusEnabled
    ? await publishFOSEvent(
        createFOSEvent({
          type: "ORDER_CREATED",
          source: "order",
          priority: "high",
          actorId: "system",
          actorRole: "system",
          payload: eventPayload,
        }),
      )
    : null;

  const workflowResult = config.directWorkflowFallbackEnabled
    ? await dispatchWorkflowEvent({
        id: crypto.randomUUID(),
        type: "ORDER_CREATED",
        priority: "high",
        sourceEngine: "order-direct-fallback",
        actorId: "system",
        actorRole: "system",
        payload: eventPayload,
        createdAt: new Date().toISOString(),
      })
    : null;

  return {
    workflow,
    state,
    timeline,
    fosEvent,
    config,
    workflowResult,
  };
}
