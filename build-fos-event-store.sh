#!/bin/bash
set -e

mkdir -p lib/fos/event-store
mkdir -p app/api/fos/events

cat > lib/fos/event-store/types.ts <<'TS'
export type FosEventStatus = "created" | "processed" | "failed";

export type FosEventType =
  | "ORDER_CREATED"
  | "ORDER_PAID"
  | "ORDER_CANCELLED"
  | "MESSAGE_RECEIVED"
  | "REVIEW_CREATED"
  | "CUSTOMER_REGISTERED"
  | "FLORIST_REGISTERED"
  | "PAYMENT_FAILED"
  | "DELIVERY_RISK"
  | "CUSTOMER_RETURNED";

export type FosEvent = {
  id: string;
  type: FosEventType;
  sourceModule: string;
  status: FosEventStatus;
  payload: Record<string, any>;
  createdAt: string;
  processedAt?: string;
};
TS

cat > lib/fos/event-store/store.ts <<'TS'
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
TS

cat > lib/fos/event-store/index.ts <<'TS'
export * from "./types";
export * from "./store";
TS

cat > app/api/fos/events/route.ts <<'TS'
import { NextResponse } from "next/server";
import { createFosEvent, listFosEvents, seedDemoFosEvents } from "@/lib/fos/event-store";

export async function GET() {
  seedDemoFosEvents();

  return NextResponse.json({
    ok: true,
    module: "fos-event-store",
    events: listFosEvents(),
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const event = createFosEvent({
    type: body.type,
    sourceModule: body.sourceModule || "unknown",
    payload: body.payload || {},
  });

  return NextResponse.json({
    ok: true,
    module: "fos-event-store",
    event,
  });
}
TS

npm run build
