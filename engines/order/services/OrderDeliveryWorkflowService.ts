import type { OrderDeliveryWorkflow } from "../types";
import { createProductionPlan } from "@/engines/calendar/services/ProductionPlanningService";
import { createProductionJob } from "@/engines/production/services/ProductionJobService";
import { createDefaultChecklist } from "@/engines/production/services/ProductionChecklistService";

export function createOrderDeliveryWorkflow(input: {
  orderId: string;
  floristId: string;
  customerId?: string;
  deliveryDeadlineAt: string;
  deliveryAddressCity: string;
  deliveryInsideCityLimit: boolean;
}): OrderDeliveryWorkflow {
  const now = new Date().toISOString();

  const plan = createProductionPlan({
    orderId: input.orderId,
    floristId: input.floristId,
    deliveryDeadlineAt: input.deliveryDeadlineAt,
    deliveryAddressCity: input.deliveryAddressCity,
    deliveryInsideCityLimit: input.deliveryInsideCityLimit,
  });

  const productionJob = createProductionJob({
    orderId: input.orderId,
    floristId: input.floristId,
    type: "bouquet",
    title: "Bukettproduktion",
    productionStartsAt: plan.productionDate,
    deliveryDeadlineAt: input.deliveryDeadlineAt,
  });

  const productionChecklist = createDefaultChecklist(
    productionJob.id,
    productionJob.type,
  );

  return {
    id: crypto.randomUUID(),
    orderId: input.orderId,
    floristId: input.floristId,
    customerId: input.customerId,
    deliveryDeadlineAt: input.deliveryDeadlineAt,
    createdAt: now,
    // TODO: Spara productionJob och productionChecklist i Supabase senare.
    // Just nu skapas de som FOS-struktur för Order → Produktion → Leverans.
    steps: [
      {
        id: crypto.randomUUID(),
        orderId: input.orderId,
        type: "order_received",
        title: "Order mottagen",
        status: "completed",
        completedAt: now,
        assignedToRole: "system",
      },
      {
        id: crypto.randomUUID(),
        orderId: input.orderId,
        type: "production_planned",
        title: "Produktion planerad",
        description: `${plan.reason} Beräknad produktion: ${productionJob.estimatedMinutes} min + packning ${productionJob.packingMinutes} min. Checklista: ${productionChecklist.items.length} punkter.`,
        status: "planned",
        startsAt: plan.productionDate,
        assignedToRole: "florist",
      },
      {
        id: crypto.randomUUID(),
        orderId: input.orderId,
        type: "production_completed",
        title: "Produktion klar",
        status: "planned",
        startsAt: plan.productionDate,
        assignedToRole: "florist",
      },
      {
        id: crypto.randomUUID(),
        orderId: input.orderId,
        type: "packing",
        title: "Packning",
        status: "planned",
        assignedToRole: "florist",
      },
      ...(plan.courierPickupAt
        ? [
            {
              id: crypto.randomUUID(),
              orderId: input.orderId,
              type: "courier_pickup" as const,
              title: "Budhämtning",
              description: "Budfirma hämtar ordern tidig morgon.",
              status: "planned" as const,
              startsAt: plan.courierPickupAt,
              assignedToRole: "courier" as const,
            },
          ]
        : []),
      {
        id: crypto.randomUUID(),
        orderId: input.orderId,
        type: "customer_delivery",
        title: "Kundleverans",
        status: "planned",
        startsAt: input.deliveryDeadlineAt,
        assignedToRole: "courier",
      },
      {
        id: crypto.randomUUID(),
        orderId: input.orderId,
        type: "trust_rating_scheduled",
        title: "Trust Rating planeras",
        description: "Skickas 1–2 dagar efter leverans.",
        status: "planned",
        assignedToRole: "system",
      },
    ],
  };
}
