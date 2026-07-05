import { NextResponse } from "next/server";
import {
  getFosSystemHealthReport,
  updateFosEngineStatus,
} from "@/lib/fos/system-health";

export async function GET() {
  return NextResponse.json({
    ok: true,
    module: "fos-system-health",
    report: getFosSystemHealthReport(),
  });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const engine = updateFosEngineStatus(
    body.id,
    body.status,
    body.message ?? "Status uppdaterad."
  );

  if (!engine) {
    return NextResponse.json(
      {
        ok: false,
        error: "Engine not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    engine,
  });
}
