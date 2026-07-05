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
