import type { WorkflowEvent } from "../types/WorkflowEvent";
import { WORKFLOW_REGISTRY } from "../registry/WorkflowRegistry";
import { handleCalendarWorkflowEvent } from "../handlers/CalendarHandler";
import { createFOSEvent, publishFOSEvent } from "@/core/events/services/FOSEventBus";

async function runWorkflowHandler(targetEngine: string, event: WorkflowEvent) {
  if (targetEngine === "calendar") {
    return handleCalendarWorkflowEvent(event);
  }

  return null;
}

export async function dispatchWorkflowEvent(event: WorkflowEvent) {
  const handlers = WORKFLOW_REGISTRY[event.type] ?? [];
  const results = [];

  for (const handler of handlers) {
    console.log(
      "[Workflow]",
      event.type,
      "→",
      handler.targetEngine,
      "(" + handler.handler + ")",
    );

    const result = await runWorkflowHandler(handler.targetEngine, event);

    results.push({
      targetEngine: handler.targetEngine,
      handler: handler.handler,
      result,
    });
  }

  if (event.type === "ORDER_CREATED") {
    await publishFOSEvent(
      createFOSEvent({
        type: "PRODUCTION_PLANNED",
        source: "workflow",
        priority: "high",
        actorId: event.actorId,
        actorRole: event.actorRole,
        payload: event.payload,
      }),
    );
  }

  return {
    event,
    handledBy: results,
  };
}
