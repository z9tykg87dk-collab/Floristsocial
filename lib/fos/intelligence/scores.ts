import type { FosBusinessSnapshot } from "./types";

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateFosScores(snapshot: FosBusinessSnapshot) {
  const growthScore = clamp(snapshot.ordersLast30Days * 2 + snapshot.repeatCustomers * 6);
  const serviceScore = clamp(100 - snapshot.lateDeliveries * 15 - snapshot.unreadMessages * 3);
  const trustScore = clamp(snapshot.averageRating * 20 + Math.min(snapshot.reviewCount, 20));
  const businessScore = clamp(snapshot.revenueLast30Days / 1000 + snapshot.ordersLast30Days * 2);

  return {
    growthScore,
    serviceScore,
    trustScore,
    businessScore,
    totalScore: clamp((growthScore + serviceScore + trustScore + businessScore) / 4),
  };
}
