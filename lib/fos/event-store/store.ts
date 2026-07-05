import type { FosEvent, FosEventType } from "./types";

const memoryEvents: FosEvent[] = [];

function createId() {
  return `fos_evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createFosEvent(input: {
  type: FosEventType;
  sourceModule: string;
  payload?: Record<string, any>;
}): FosEvent {
  const event: FosEvent = {
    id: createId(),
    type: input.type,
    sourceModule: input.sourceModule,
    status: "created",
    payload: input.payload || {},
    createdAt: new Date().toISOString(),
  };

  memoryEvents.unshift(event);
  return event;
}

export function listFosEvents() {
  return memoryEvents;
}

export function seedDemoFosEvents() {
  if (memoryEvents.length > 0) return memoryEvents;

  createFosEvent({
    type: "ORDER_CREATED",
    sourceModule: "order",
    payload: { orderId: "demo-order-1", amount: 1250 },
  });

  createFosEvent({
    type: "MESSAGE_RECEIVED",
    sourceModule: "chat",
    payload: { conversationId: "demo-chat-1" },
  });

  createFosEvent({
    type: "REVIEW_CREATED",
    sourceModule: "trust",
    payload: { rating: 5 },
  });

  return memoryEvents;
}
