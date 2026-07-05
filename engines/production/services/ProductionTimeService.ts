import type { ProductionJobType } from "../types";

export function getDefaultProductionMinutes(type: ProductionJobType) {
  const minutes: Record<ProductionJobType, number> = {
    bouquet: 25,
    large_bouquet: 40,
    bridal_bouquet: 75,
    funeral_decoration: 90,
    wedding_decoration: 120,
    event_decoration: 120,
    company_flowers: 35,
    subscription_bouquet: 25,
    plant: 15,
    gift_box: 20,
  };

  return minutes[type] ?? 30;
}

export function getDefaultPackingMinutes(type: ProductionJobType) {
  const minutes: Record<ProductionJobType, number> = {
    bouquet: 10,
    large_bouquet: 12,
    bridal_bouquet: 20,
    funeral_decoration: 20,
    wedding_decoration: 25,
    event_decoration: 25,
    company_flowers: 12,
    subscription_bouquet: 10,
    plant: 8,
    gift_box: 10,
  };

  return minutes[type] ?? 10;
}
