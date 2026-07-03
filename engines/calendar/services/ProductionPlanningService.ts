import type { ProductionPlan, ProductionTimingRule } from "../types";

function isDeadlineBeforeOrAt13(deliveryDeadlineAt: string) {
  const date = new Date(deliveryDeadlineAt);
  return date.getHours() < 13 || (date.getHours() === 13 && date.getMinutes() === 0);
}

function previousDayISO(dateString: string) {
  const date = new Date(dateString);
  date.setDate(date.getDate() - 1);
  date.setHours(10, 0, 0, 0);
  return date.toISOString();
}

function earlyMorningPickupISO(dateString: string) {
  const date = new Date(dateString);
  date.setHours(7, 0, 0, 0);
  return date.toISOString();
}

export function createProductionPlan(input: {
  orderId: string;
  floristId: string;
  deliveryAddressCity: string;
  deliveryInsideCityLimit: boolean;
  deliveryDeadlineAt: string;
}): ProductionPlan {
  let rule: ProductionTimingRule = "same_day";
  let reason = "Leveransen kan produceras samma dag.";
  let productionDate = input.deliveryDeadlineAt;
  let courierPickupAt: string | undefined;

  if (isDeadlineBeforeOrAt13(input.deliveryDeadlineAt)) {
    rule = "day_before_delivery";
    reason = "Leverans senast 13:00 ska produceras dagen innan.";
    productionDate = previousDayISO(input.deliveryDeadlineAt);
  }

  if (!input.deliveryInsideCityLimit) {
    rule = "day_before_delivery_with_early_courier_pickup";
    reason =
      "Leverans utanför stadsgränsen ska produceras dagen innan och hämtas av budfirma tidig morgon.";
    productionDate = previousDayISO(input.deliveryDeadlineAt);
    courierPickupAt = earlyMorningPickupISO(input.deliveryDeadlineAt);
  }

  return {
    orderId: input.orderId,
    floristId: input.floristId,
    deliveryAddressCity: input.deliveryAddressCity,
    deliveryInsideCityLimit: input.deliveryInsideCityLimit,
    deliveryDeadlineAt: input.deliveryDeadlineAt,
    productionDate,
    courierPickupAt,
    rule,
    reason,
  };
}
