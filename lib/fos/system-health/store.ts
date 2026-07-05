import type { FosEngineHealth, FosHealthStatus, FosSystemHealthReport } from "./types";

const engines: FosEngineHealth[] = [
  {
    id: "FOS-01",
    name: "Core Snapshot",
    status: "healthy",
    version: "1.0.0",
    apiPath: "/api/fos/snapshot",
    dashboardPath: "/workspace",
    lastCheckedAt: new Date().toISOString(),
    message: "Core Snapshot är aktiv.",
  },
  {
    id: "FOS-02",
    name: "Intelligence Engine",
    status: "healthy",
    version: "1.0.0",
    apiPath: "/api/fos/intelligence",
    dashboardPath: "/workspace/intelligence",
    lastCheckedAt: new Date().toISOString(),
    message: "Intelligence Engine analyserar korrekt.",
  },
  {
    id: "FOS-03",
    name: "Decision Engine",
    status: "healthy",
    version: "1.0.0",
    apiPath: "/api/fos/decision",
    dashboardPath: "/workspace/decision",
    lastCheckedAt: new Date().toISOString(),
    message: "Decision Engine är aktiv.",
  },
  {
    id: "FOS-04",
    name: "Event Store",
    status: "healthy",
    version: "1.0.0",
    apiPath: "/api/fos/events",
    dashboardPath: "/workspace/event-store",
    testPath: "/workspace/event-store/test",
    lastCheckedAt: new Date().toISOString(),
    message: "Event Store sparar händelser.",
  },
  {
    id: "FOS-05",
    name: "Memory Engine",
    status: "healthy",
    version: "1.0.0",
    apiPath: "/api/fos/memory",
    dashboardPath: "/workspace/memory",
    testPath: "/workspace/memory/test",
    lastCheckedAt: new Date().toISOString(),
    message: "Memory Engine sparar kunskap.",
  },
  {
    id: "FOS-06",
    name: "Action Queue",
    status: "healthy",
    version: "1.0.0",
    apiPath: "/api/fos/action-queue",
    dashboardPath: "/workspace/action-queue",
    testPath: "/workspace/action-queue/test",
    lastCheckedAt: new Date().toISOString(),
    message: "Action Queue hanterar åtgärder.",
  },
  {
    id: "FOS-07",
    name: "Automation Engine",
    status: "healthy",
    version: "1.0.0",
    apiPath: "/api/fos/automation",
    dashboardPath: "/workspace/automation",
    testPath: "/workspace/automation/test",
    lastCheckedAt: new Date().toISOString(),
    message: "Automation Engine är aktiv.",
  },
];

export function listFosEngineHealth(): FosEngineHealth[] {
  return engines;
}

export function updateFosEngineStatus(
  id: string,
  status: FosHealthStatus,
  message: string
): FosEngineHealth | null {
  const engine = engines.find((item) => item.id === id);

  if (!engine) return null;

  engine.status = status;
  engine.message = message;
  engine.lastCheckedAt = new Date().toISOString();

  return engine;
}

export function getFosSystemHealthReport(): FosSystemHealthReport {
  const summary = {
    healthy: engines.filter((item) => item.status === "healthy").length,
    warning: engines.filter((item) => item.status === "warning").length,
    critical: engines.filter((item) => item.status === "critical").length,
    offline: engines.filter((item) => item.status === "offline").length,
    total: engines.length,
  };

  const status: FosHealthStatus =
    summary.critical > 0
      ? "critical"
      : summary.warning > 0
        ? "warning"
        : summary.offline > 0
          ? "offline"
          : "healthy";

  return {
    status,
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    engines,
    summary,
  };
}
