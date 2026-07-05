export type FOSMode =
  | "safe"
  | "event_bus_only";

export type FOSConfig = {
  mode: FOSMode;
  eventBusEnabled: boolean;
  directWorkflowFallbackEnabled: boolean;
  debugEnabled: boolean;
  auditEnabled: boolean;
};

export const FOS_CONFIG: FOSConfig = {
  mode: "safe",
  eventBusEnabled: true,
  directWorkflowFallbackEnabled: true,
  debugEnabled: true,
  auditEnabled: true,
};

export function getFOSConfig() {
  return FOS_CONFIG;
}

export function isEventBusOnlyMode() {
  return FOS_CONFIG.mode === "event_bus_only";
}

export function isSafeMode() {
  return FOS_CONFIG.mode === "safe";
}
