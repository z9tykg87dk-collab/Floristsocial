import { getFOSConfig } from "@/core/config/FOSConfig";
import { registerOrderCreatedSubscriber } from "@/engines/workflow/subscribers/OrderCreatedSubscriber";
import { getFOSEngines } from "./EngineRegistry";
import { getFOSSubscribers } from "./SubscriberRegistry";
import { registerProductionPlannedSubscriber } from "@/engines/production/subscribers/ProductionPlannedSubscriber";
import { registerCalendarProductionPlannedSubscriber } from "@/engines/calendar/subscribers/CalendarProductionPlannedSubscriber";

export type FOSBootstrapStatus = {
  version: string;
  mode: string;
  eventBusEnabled: boolean;
  directWorkflowFallbackEnabled: boolean;
  debugEnabled: boolean;
  auditEnabled: boolean;
  status: "running" | "warning" | "error";
  enginesTotal: number;
  enginesActive: number;
  subscribersTotal: number;
  subscribersActive: number;
  startedAt: string;
};

export function bootstrapFOS(): FOSBootstrapStatus {
  registerOrderCreatedSubscriber();
  registerProductionPlannedSubscriber();
  registerCalendarProductionPlannedSubscriber();
  const engines = getFOSEngines();
  const subscribers = getFOSSubscribers();
  const config = getFOSConfig();

  return {
    version: "FOS 0.2 Integration",
    mode: config.mode,
    eventBusEnabled: config.eventBusEnabled,
    directWorkflowFallbackEnabled: config.directWorkflowFallbackEnabled,
    debugEnabled: config.debugEnabled,
    auditEnabled: config.auditEnabled,
    status: "running",
    enginesTotal: engines.length,
    enginesActive: engines.filter((engine) => engine.status === "active").length,
    subscribersTotal: subscribers.length,
    subscribersActive: subscribers.filter((subscriber) => subscriber.status === "active").length,
    startedAt: new Date().toISOString(),
  };
}
