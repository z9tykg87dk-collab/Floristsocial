import type { FosActionPriority, FosQueuedAction } from "./types";

const actions: FosQueuedAction[] = [];

function canSeedDemoActions() {
  if (actions.length > 0) return false;
  return process.env.NODE_ENV === "development";
}

function now() {
  return new Date().toISOString();
}

function createId() {
  return `fos_act_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createFosAction(input: {
  title: string;
  description: string;
  targetModule: string;
  priority?: FosActionPriority;
  source?: string;
  payload?: Record<string, any>;
}) {
  const action: FosQueuedAction = {
    id: createId(),
    title: input.title,
    description: input.description,
    targetModule: input.targetModule,
    priority: input.priority || "medium",
    status: "queued",
    source: input.source || "manual",
    payload: input.payload || {},
    createdAt: now(),
    updatedAt: now(),
  };

  actions.unshift(action);
  return action;
}

export function listFosActions() {
  return actions.map((action) => ({
    ...action,
    payload: { ...action.payload },
  }));
}

export function claimNextFosAction() {
  const action = actions.find((item) => item.status === "queued");

  if (!action) {
    return null;
  }

  action.status = "in_progress";
  action.updatedAt = now();

  return {
    ...action,
    payload: { ...action.payload },
  };
}

export function seedDemoFosActions() {
  if (!canSeedDemoActions()) return listFosActions();

  createFosAction({
    title: "Skapa kalenderpost",
    description: "Ny order behöver kopplas till leveranskalendern.",
    targetModule: "calendar",
    priority: "high",
    source: "decision-engine",
  });

  createFosAction({
    title: "Skicka ordernotis",
    description: "Kund och florist bör få bekräftelse.",
    targetModule: "notification",
    priority: "medium",
    source: "decision-engine",
  });

  createFosAction({
    title: "Skapa CRM-påminnelse",
    description: "Återkommande kund bör följas upp.",
    targetModule: "crm",
    priority: "medium",
    source: "memory-engine",
  });

  return listFosActions();
}
