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
