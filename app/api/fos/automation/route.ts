import { NextResponse } from "next/server";

import {
  listAutomationJobs,
  createAutomationJob,
  getAutomationJob,
  startAutomation,
  completeAutomation,
  failAutomation,
} from "@/lib/fos/automation";

export async function GET() {
  return NextResponse.json({
    ok: true,
    module: "fos-automation",
    version: "1.0.0",
    jobs: listAutomationJobs(),
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const job = createAutomationJob({
    title: body.title ?? "Ny automation",
    description: body.description ?? "",
    sourceEngine: body.sourceEngine ?? "API",
    targetModule: body.targetModule ?? "Unknown",
    priority: body.priority ?? "medium",
    payload: body.payload ?? {},
  });

  return NextResponse.json({
    ok: true,
    job,
  });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const job = getAutomationJob(body.id);

  if (!job) {
    return NextResponse.json(
      {
        ok: false,
        error: "Automation job not found",
      },
      { status: 404 }
    );
  }

  switch (body.action) {
    case "start":
      startAutomation(job);
      break;

    case "complete":
      completeAutomation(job);
      break;

    case "fail":
      failAutomation(job, body.error ?? "Unknown error");
      break;

    default:
      return NextResponse.json(
        {
          ok: false,
          error: "Unknown action",
        },
        { status: 400 }
      );
  }

  return NextResponse.json({
    ok: true,
    job,
  });
}
