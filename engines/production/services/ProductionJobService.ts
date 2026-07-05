import type { ProductionJob, ProductionJobType } from "../types";
import {
  getDefaultPackingMinutes,
  getDefaultProductionMinutes,
} from "./ProductionTimeService";

export function createProductionJob(input: {
  orderId: string;
  floristId: string;
  type: ProductionJobType;
  title: string;
  productionStartsAt: string;
  deliveryDeadlineAt: string;
}): ProductionJob {
  return {
    id: crypto.randomUUID(),
    orderId: input.orderId,
    floristId: input.floristId,
    type: input.type,
    title: input.title,
    status: "planned",
    productionStartsAt: input.productionStartsAt,
    estimatedMinutes: getDefaultProductionMinutes(input.type),
    packingMinutes: getDefaultPackingMinutes(input.type),
    deliveryDeadlineAt: input.deliveryDeadlineAt,
    createdAt: new Date().toISOString(),
  };
}
