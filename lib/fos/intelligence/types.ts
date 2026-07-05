export type FosRecommendationLevel = "info" | "opportunity" | "warning" | "critical";

export type FosRecommendation = {
  id: string;
  title: string;
  description: string;
  level: FosRecommendationLevel;
  module: "crm" | "calendar" | "economy" | "notification" | "trust" | "order" | "growth";
  score: number;
  actionLabel?: string;
  actionHref?: string;
};

export type FosBusinessSnapshot = {
  ordersLast30Days: number;
  revenueLast30Days: number;
  averageRating: number;
  reviewCount: number;
  lateDeliveries: number;
  unreadMessages: number;
  upcomingDeliveries: number;
  repeatCustomers: number;
};
