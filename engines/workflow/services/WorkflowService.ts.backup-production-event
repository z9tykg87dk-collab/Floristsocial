import type { WorkflowEvent } from "../types/WorkflowEvent";
import { WORKFLOW_REGISTRY } from "../registry/WorkflowRegistry";
import { handleCalendarWorkflowEvent } from "../handlers/CalendarHandler";

async function runWorkflowHandler(targetEngine: string, event: WorkflowEvent) {
  if (targetEngine === "calendar") {
    return handleCalendarWorkflowEvent(event);
  }

  // TODO: Koppla fler handlers:
  // crm, notification, economy, analytics, intelligence, trust
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

  return {
    event,
    handledBy: results,
  };
}
