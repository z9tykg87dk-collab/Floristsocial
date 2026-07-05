import { subscribeToFOSEvent } from "@/core/events/services/FOSEventBus";
import { createCalendarEvent } from "@/engines/calendar/services/CalendarService";

export function registerCalendarProductionPlannedSubscriber() {
  subscribeToFOSEvent("PRODUCTION_PLANNED", async (event) => {
    const payload = event.payload as {
      orderId: string;
      floristId: string;
    };

    const now = new Date().toISOString();

    const result = await createCalendarEvent({
      id: crypto.randomUUID(),
      ownerId: payload.floristId,
      ownerRole: "florist",
      title: "Planerad produktion",
      description: "Automatiskt kalenderblock från produktionsplanering.",
      source: "workflow",
      sourceRecordId: payload.orderId,
      status: "planned",
      priority: "high",
      startsAt: now,
      createdBy: event.actorId || "system",
      createdAt: now,
    });

    console.log(
      "[CalendarSubscriber] Calendar Event created:",
      result.data.id,
    );
  });
}
