import { NextResponse } from "next/server";

import { getDeploymentHealth } from "@/lib/health";

export async function GET() {
  const health = await getDeploymentHealth();
  const statusCode =
    health.overallStatus === "error"
      ? 503
      : health.overallStatus === "warning"
        ? 200
        : 200;

  return NextResponse.json(health, { status: statusCode });
}
