import { subscribeToFOSEvent } from "@/core/events/services/FOSEventBus";
import { createProductionJob } from "@/engines/production/services/ProductionJobService";

export function registerProductionPlannedSubscriber() {
  subscribeToFOSEvent("PRODUCTION_PLANNED", async (event) => {
    const payload = event.payload as {
      orderId: string;
      floristId: string;
    };

    const productionJob = createProductionJob({
      orderId: payload.orderId,
      floristId: payload.floristId,
      type: "bouquet",
      title: "Automatiskt produktionsjobb",
      productionStartsAt: new Date().toISOString(),
      deliveryDeadlineAt: new Date().toISOString(),
    });

    console.log(
      "[ProductionSubscriber] Production Job created:",
      productionJob.id,
    );
  });
}
