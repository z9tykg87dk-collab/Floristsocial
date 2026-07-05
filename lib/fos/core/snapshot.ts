import type { FosBusinessSnapshot } from "@/lib/fos/intelligence";
import type { FosCoreSnapshot } from "./types";

export async function getFosCoreSnapshot(): Promise<FosCoreSnapshot> {
  return {
    source: "demo",
    generatedAt: new Date().toISOString(),
    orders: {
      last30Days: 34,
      revenueLast30Days: 68500,
      upcomingDeliveries: 12,
      lateDeliveries: 1,
    },
    crm: {
      repeatCustomers: 7,
      newCustomersLast30Days: 18,
    },
    communication: {
      unreadMessages: 6,
      averageResponseMinutes: 24,
    },
    trust: {
      averageRating: 4.9,
      reviewCount: 18,
    },
  };
}

export function toIntelligenceSnapshot(snapshot: FosCoreSnapshot): FosBusinessSnapshot {
  return {
    ordersLast30Days: snapshot.orders.last30Days,
    revenueLast30Days: snapshot.orders.revenueLast30Days,
    averageRating: snapshot.trust.averageRating,
    reviewCount: snapshot.trust.reviewCount,
    lateDeliveries: snapshot.orders.lateDeliveries,
    unreadMessages: snapshot.communication.unreadMessages,
    upcomingDeliveries: snapshot.orders.upcomingDeliveries,
    repeatCustomers: snapshot.crm.repeatCustomers,
  };
}
