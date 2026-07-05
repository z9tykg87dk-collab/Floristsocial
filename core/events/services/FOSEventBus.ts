import type { FOSEvent, FOSEventPriority } from "../types";

type FOSEventHandler = (event: FOSEvent) => Promise<void> | void;

const handlers: Record<string, FOSEventHandler[]> = {};

export function createFOSEvent(input: {
  type: string;
  source: string;
  priority?: FOSEventPriority;
  actorId?: string;
  actorRole?: string;
  payload?: Record<string, unknown>;
}): FOSEvent {
  return {
    id: crypto.randomUUID(),
    type: input.type,
    source: input.source,
    priority: input.priority || "normal",
    status: "created",
    actorId: input.actorId,
    actorRole: input.actorRole,
    payload: input.payload || {},
    createdAt: new Date().toISOString(),
  };
}

export function subscribeToFOSEvent(
  eventType: string,
  handler: FOSEventHandler,
) {
  if (!handlers[eventType]) {
    handlers[eventType] = [];
  }

  handlers[eventType].push(handler);
}

export async function publishFOSEvent(event: FOSEvent) {
  const eventHandlers = handlers[event.type] || [];

  const processingEvent: FOSEvent = {
    ...event,
    status: "processing",
  };

  for (const handler of eventHandlers) {
    await handler(processingEvent);
  }

  return {
    ...processingEvent,
    status: "completed" as const,
    processedAt: new Date().toISOString(),
  };
}

export function getFOSEventHandlers(eventType: string) {
  return handlers[eventType] || [];
}
