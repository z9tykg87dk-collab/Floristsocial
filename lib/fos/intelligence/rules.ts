import type { FosBusinessSnapshot, FosRecommendation } from "./types";

export function runFosRules(snapshot: FosBusinessSnapshot): FosRecommendation[] {
  const recommendations: FosRecommendation[] = [];

  if (snapshot.ordersLast30Days >= 30) {
    recommendations.push({
      id: "growth-high-orders",
      title: "Försäljningen växer snabbt",
      description: "Du har många beställningar senaste 30 dagarna. FOS rekommenderar att du planerar kapacitet, leveranstider och extra personal.",
      level: "opportunity",
      module: "growth",
      score: 92,
      actionLabel: "Se tillväxtplan",
      actionHref: "/workspace/intelligence",
    });
  }

  if (snapshot.upcomingDeliveries >= 10) {
    recommendations.push({
      id: "calendar-heavy-delivery",
      title: "Många kommande leveranser",
      description: "Kalendern visar hög belastning. Kontrollera leveransfönster och blockera tider vid behov.",
      level: "warning",
      module: "calendar",
      score: 86,
      actionLabel: "Öppna kalender",
      actionHref: "/workspace/calendar",
    });
  }

  if (snapshot.averageRating >= 4.8 && snapshot.reviewCount >= 5) {
    recommendations.push({
      id: "trust-feature-florist",
      title: "Hög kundnöjdhet",
      description: "Din rating är stark. FOS rekommenderar att floristen lyfts fram mer i sök och profil.",
      level: "opportunity",
      module: "trust",
      score: 88,
      actionLabel: "Se Trust Score",
      actionHref: "/trust/rating",
    });
  }

  if (snapshot.unreadMessages >= 5) {
    recommendations.push({
      id: "notification-unread-messages",
      title: "Många obesvarade meddelanden",
      description: "Svarstiden kan påverka kundupplevelsen. FOS rekommenderar snabb hantering eller autosvar.",
      level: "warning",
      module: "notification",
      score: 76,
      actionLabel: "Öppna meddelanden",
      actionHref: "/florist-chat",
    });
  }

  if (snapshot.repeatCustomers >= 3) {
    recommendations.push({
      id: "crm-repeat-customers",
      title: "Återkommande kunder upptäckta",
      description: "FOS ser återkommande kunder. Skapa CRM-påminnelser, erbjudanden eller prenumerationer.",
      level: "opportunity",
      module: "crm",
      score: 84,
      actionLabel: "Öppna CRM",
      actionHref: "/superadmin/development/crm",
    });
  }

  if (snapshot.lateDeliveries >= 2) {
    recommendations.push({
      id: "order-late-deliveries",
      title: "Leveransprecision behöver förbättras",
      description: "Flera leveranser verkar vara sena. FOS rekommenderar bättre tidsfönster och kapacitetskontroll.",
      level: "critical",
      module: "order",
      score: 95,
      actionLabel: "Se orderflöde",
      actionHref: "/superadmin/development/order-workflow",
    });
  }

  return recommendations.sort((a, b) => b.score - a.score);
}
