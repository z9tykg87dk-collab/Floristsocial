export type ProductionTimingRule =
  | "same_day"
  | "day_before_delivery"
  | "day_before_delivery_with_early_courier_pickup";

export type ProductionPlan = {
  orderId: string;
  floristId: string;

  deliveryAddressCity: string;
  deliveryInsideCityLimit: boolean;

  deliveryStartsAt?: string;
  deliveryDeadlineAt: string;

  productionDate: string;
  courierPickupAt?: string;

  rule: ProductionTimingRule;
  reason: string;
};
