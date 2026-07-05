#!/bin/bash
set -e

mkdir -p lib/fos/decision
mkdir -p app/api/fos/decision

cat > lib/fos/decision/types.ts <<'TS'
export type FosDecisionPriority = "low" | "medium" | "high" | "urgent";

export type FosDecisionActionType =
  | "create_notification"
  | "create_calendar_task"
  | "create_crm_reminder"
  | "flag_risk"
  | "recommend_growth_action"
  | "open_workspace";

export type FosDecisionInput = {
  eventType: string;
  module: "order" | "calendar" | "crm" | "economy" | "notification" | "trust" | "intelligence";
  payload?: Record<string, any>;
};

export type FosDecisionAction = {
  id: string;
  title: string;
  description: string;
  type: FosDecisionActionType;
  priority: FosDecisionPriority;
  targetModule: string;
  href?: string;
  createdAt: string;
};
TS

cat > lib/fos/decision/rules.ts <<'TS'
import type { FosDecisionAction, FosDecisionInput } from "./types";

function now() {
  return new Date().toISOString();
}

export function runFosDecisionRules(input: FosDecisionInput): FosDecisionAction[] {
  const actions: FosDecisionAction[] = [];

  if (input.eventType === "ORDER_CREATED") {
    actions.push({
      id: "decision-order-calendar",
      title: "Lägg order i kalendern",
      description: "FOS rekommenderar att ordern kopplas till leveranskalendern.",
      type: "create_calendar_task",
      priority: "high",
      targetModule: "calendar",
      href: "/workspace/calendar",
      createdAt: now(),
    });

    actions.push({
      id: "decision-order-notification",
      title: "Skicka ordernotis",
      description: "Kund och florist bör få bekräftelse om den nya ordern.",
      type: "create_notification",
      priority: "medium",
      targetModule: "notification",
      href: "/superadmin/development/notifications",
      createdAt: now(),
    });
  }

  if (input.eventType === "CUSTOMER_RETURNED") {
    actions.push({
      id: "decision-crm-repeat-customer",
      title: "Skapa CRM-påminnelse",
      description: "Återkommande kund upptäckt. FOS föreslår personlig uppföljning.",
      type: "create_crm_reminder",
      priority: "medium",
      targetModule: "crm",
      href: "/superadmin/development/crm",
      createdAt: now(),
    });
  }

  if (input.eventType === "DELIVERY_RISK") {
    actions.push({
      id: "decision-delivery-risk",
      title: "Risk för sen leverans",
      description: "FOS flaggar leveransen som risk och föreslår kontroll av kapacitet.",
      type: "flag_risk",
      priority: "urgent",
      targetModule: "order",
      href: "/superadmin/development/order-workflow",
      createdAt: now(),
    });
  }

  if (input.eventType === "HIGH_RATING") {
    actions.push({
      id: "decision-trust-growth",
      title: "Lyft fram floristen",
      description: "Hög rating upptäckt. FOS föreslår bättre synlighet i sök och marknadsplats.",
      type: "recommend_growth_action",
      priority: "medium",
      targetModule: "trust",
      href: "/trust/rating",
      createdAt: now(),
    });
  }

  return actions;
}
TS

cat > lib/fos/decision/engine.ts <<'TS'
import { runFosDecisionRules } from "./rules";
import type { FosDecisionInput } from "./types";

export function runFosDecisionEngine(input: FosDecisionInput) {
  const actions = runFosDecisionRules(input);

  return {
    input,
    actions,
    actionCount: actions.length,
    generatedAt: new Date().toISOString(),
  };
}
TS

cat > lib/fos/decision/index.ts <<'TS'
export * from "./types";
export * from "./rules";
export * from "./engine";
TS

cat > app/api/fos/decision/route.ts <<'TS'
import { NextResponse } from "next/server";
import { runFosDecisionEngine } from "@/lib/fos/decision";

export async function GET() {
  const decision = runFosDecisionEngine({
    eventType: "ORDER_CREATED",
    module: "order",
    payload: {
      orderId: "demo-order",
      floristId: "demo-florist",
    },
  });

  return NextResponse.json({
    ok: true,
    module: "fos-decision-engine",
    ...decision,
  });
}
TS

npm run build
