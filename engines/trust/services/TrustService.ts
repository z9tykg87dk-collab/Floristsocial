import type { TrustRating } from "../types";

export async function createTrustRatingRequest(orderId: string) {
  // TODO: Koppla till Supabase + Notification Engine.
  // Skickas 1-2 dagar efter leverans.
  return {
    orderId,
    status: "scheduled",
    sendAfterHours: 48,
  };
}

export async function saveTrustRating(rating: TrustRating) {
  // TODO: Koppla till Supabase.
  return {
    data: rating,
    error: null,
  };
}

export function calculateAverageTrustRating(rating: TrustRating) {
  return Number(
    (
      (rating.quality + rating.design + rating.color + rating.delivery) /
      4
    ).toFixed(1),
  );
}
