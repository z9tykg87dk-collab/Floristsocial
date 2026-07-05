export type FosSnapshotSource = "demo" | "supabase" | "mixed";

export type FosCoreSnapshot = {
  source: FosSnapshotSource;
  generatedAt: string;
  orders: {
    last30Days: number;
    revenueLast30Days: number;
    upcomingDeliveries: number;
    lateDeliveries: number;
  };
  crm: {
    repeatCustomers: number;
    newCustomersLast30Days: number;
  };
  communication: {
    unreadMessages: number;
    averageResponseMinutes: number;
  };
  trust: {
    averageRating: number;
    reviewCount: number;
  };
};
