import type { FosBusinessSnapshot } from "./types";

export async function getDemoFosSnapshot(): Promise<FosBusinessSnapshot> {
  return {
    ordersLast30Days: 34,
    revenueLast30Days: 68500,
    averageRating: 4.9,
    reviewCount: 18,
    lateDeliveries: 1,
    unreadMessages: 6,
    upcomingDeliveries: 12,
    repeatCustomers: 7,
  };
}
