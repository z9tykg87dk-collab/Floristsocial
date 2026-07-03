import type { WorkflowEvent } from "../types/WorkflowEvent";
import { createCalendarEvent } from "@/engines/calendar/services/CalendarService";
import { createProductionPlan } from "@/engines/calendar/services/ProductionPlanningService";

export async function handleCalendarWorkflowEvent(event: WorkflowEvent) {
  if (event.type === "ORDER_CREATED") {
    const orderId = String(event.payload.orderId || "");
    const floristId = String(event.payload.floristId || "");
    const deliveryDeadlineAt = String(
      event.payload.deliveryDeadlineAt || new Date().toISOString(),
    );

    const deliveryAddressCity = String(
      event.payload.deliveryAddressCity || "Stockholm",
    );

    const deliveryInsideCityLimit =
      event.payload.deliveryInsideCityLimit !== false;

    const plan = createProductionPlan({
      orderId,
      floristId,
      deliveryAddressCity,
      deliveryInsideCityLimit,
      deliveryDeadlineAt,
    });

    const createdAt = new Date().toISOString();

    const events = [];

    events.push(
      await createCalendarEvent({
        id: crypto.randomUUID(),
        ownerId: floristId,
        ownerRole: "florist",
        title: "Produktion",
        description: plan.reason,
        source: "order",
        sourceRecordId: orderId,
        status: "planned",
        priority: plan.rule === "same_day" ? "normal" : "high",
        startsAt: plan.productionDate,
        createdBy: event.actorId || "system",
        createdAt,
      }),
    );

    if (plan.courierPickupAt) {
      events.push(
        await createCalendarEvent({
          id: crypto.randomUUID(),
          ownerId: floristId,
          ownerRole: "florist",
          title: "Budhämtning",
          description: "Budfirma hämtar ordern tidig morgon.",
          source: "delivery",
          sourceRecordId: orderId,
          status: "planned",
          priority: "high",
          startsAt: plan.courierPickupAt,
          createdBy: "system",
          createdAt,
        }),
      );
    }

    events.push(
      await createCalendarEvent({
        id: crypto.randomUUID(),
        ownerId: floristId,
        ownerRole: "florist",
        title: "Kundleverans",
        description: `Leverans till ${deliveryAddressCity}.`,
        source: "delivery",
        sourceRecordId: orderId,
        status: "planned",
        priority: "high",
        startsAt: deliveryDeadlineAt,
        createdBy: event.actorId || "system",
        createdAt,
      }),
    );

    return events;
  }

  if (event.type === "DELIVERY_COMPLETED") {
    return createCalendarEvent({
      id: crypto.randomUUID(),
      ownerId: String(event.payload.floristId || ""),
      ownerRole: "florist",
      title: "Ratingförfrågan planeras",
      description: "Trust Engine ska kontakta kunden 1–2 dagar efter leverans.",
      source: "trust",
      sourceRecordId: String(event.payload.orderId || ""),
      status: "planned",
      priority: "normal",
      startsAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      createdBy: "system",
      createdAt: new Date().toISOString(),
    });
  }

  return null;
}
