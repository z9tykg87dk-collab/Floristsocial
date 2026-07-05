import { NextResponse } from "next/server";
import { createFosMemory, listFosMemory, seedDemoFosMemory } from "@/lib/fos/memory";

export async function GET() {
  seedDemoFosMemory();

  return NextResponse.json({
    ok: true,
    module: "fos-memory-engine",
    memories: listFosMemory(),
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const memory = createFosMemory({
    type: body.type,
    subjectId: body.subjectId || "unknown",
    key: body.key,
    value: body.value,
    confidence: body.confidence || "medium",
    source: body.source || "api",
  });

  return NextResponse.json({
    ok: true,
    module: "fos-memory-engine",
    memory,
  });
}
