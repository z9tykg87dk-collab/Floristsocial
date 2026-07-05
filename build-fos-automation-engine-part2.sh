#!/bin/bash
set -e

echo "========================================="
echo "Building FOS-07 Automation API"
echo "========================================="

mkdir -p app/api/fos/automation

cat > app/api/fos/automation/route.ts <<'EOF'
import { NextResponse } from "next/server";

import {
  listAutomationJobs,
  createAutomationJob,
  getAutomationJob,
  startAutomation,
  completeAutomation,
  failAutomation,
  seedAutomationJobs,
} from "@/lib/fos/automation";

seedAutomationJobs();

export async function GET() {
  return NextResponse.json({
    ok: true,
    module: "fos-automation",
    version: "1.0.0",
    jobs: listAutomationJobs(),
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  const job = createAutomationJob({
    title: body.title || "Ny Automation",
    description: body.description || "",
    sourceEngine: body.sourceEngine || "API",
    targetModule: body.targetModule || "Unknown",
    priority: body.priority || "medium",
    payload: body.payload || {},
  });

  return NextResponse.json({
    ok: true,
    created: job,
  });
}

export async function PATCH(req: Request) {
  const body = await req.json();

  const job = getAutomationJob(body.id);

  if (!job) {
    return NextResponse.json(
      {
        ok: false,
        error: "Job not found",
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
      failAutomation(job, body.error || "Unknown error");
      break;
  }

  return NextResponse.json({
    ok: true,
    job,
  });
}
EOF

echo ""
echo "========================================="
echo "Automation API klar."
echo "========================================="

