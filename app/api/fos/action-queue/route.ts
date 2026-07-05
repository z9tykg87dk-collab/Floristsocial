import { NextResponse } from "next/server";
import { createFosAction, listFosActions, seedDemoFosActions } from "@/lib/fos/action-queue";

export async function GET() {
  seedDemoFosActions();

  return NextResponse.json({
    ok: true,
    module: "fos-action-queue",
    actions: listFosActions(),
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const action = createFosAction({
    title: body.title,
    description: body.description,
    targetModule: body.targetModule,
    priority: body.priority || "medium",
    source: body.source || "api",
    payload: body.payload || {},
  });

  return NextResponse.json({
    ok: true,
    module: "fos-action-queue",
    action,
  });
}
