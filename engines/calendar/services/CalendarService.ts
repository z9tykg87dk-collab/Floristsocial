import type { CalendarEvent } from "../types";

export async function createCalendarEvent(
  event: CalendarEvent,
): Promise<{ data: CalendarEvent; error: null }> {
  // TODO: Koppla till Supabase.
  return {
    data: event,
    error: null,
  };
}

export async function getCalendarEventsForOwner(
  ownerId: string,
): Promise<{ data: CalendarEvent[]; error: null }> {
  // TODO: Koppla till Supabase.
  return {
    data: [],
    error: null,
  };
}

export async function markCalendarEventCompleted(
  eventId: string,
): Promise<{ data: { eventId: string; status: "completed" }; error: null }> {
  // TODO: Koppla till Supabase + Workflow Engine.
  return {
    data: { eventId, status: "completed" },
    error: null,
  };
}
