#!/bin/bash
set -e

mkdir -p lib/fos/intelligence
mkdir -p app/workspace/intelligence

cat > lib/fos/intelligence/types.ts <<'TS'
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
TS

cat > lib/fos/intelligence/rules.ts <<'TS'
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
TS

cat > lib/fos/intelligence/scores.ts <<'TS'
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
TS

cat > lib/fos/intelligence/engine.ts <<'TS'
import { runFosRules } from "./rules";
import { calculateFosScores } from "./scores";
import type { FosBusinessSnapshot } from "./types";

export function runFosIntelligence(snapshot: FosBusinessSnapshot) {
  return {
    snapshot,
    scores: calculateFosScores(snapshot),
    recommendations: runFosRules(snapshot),
    generatedAt: new Date().toISOString(),
  };
}
TS

cat > lib/fos/intelligence/index.ts <<'TS'
export * from "./types";
export * from "./rules";
export * from "./scores";
export * from "./engine";
TS

cat > app/workspace/intelligence/page.tsx <<'TSX'
import Link from "next/link";
import { AlertTriangle, ArrowRight, Brain, CalendarDays, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import { runFosIntelligence } from "@/lib/fos/intelligence";

export default function WorkspaceIntelligencePage() {
  const intelligence = runFosIntelligence({
    ordersLast30Days: 34,
    revenueLast30Days: 68500,
    averageRating: 4.9,
    reviewCount: 18,
    lateDeliveries: 1,
    unreadMessages: 6,
    upcomingDeliveries: 12,
    repeatCustomers: 7,
  });

  const { scores, recommendations } = intelligence;

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-8 text-stone-950 md:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[36px] bg-gradient-to-br from-stone-950 via-stone-900 to-pink-950 p-6 text-white shadow-xl md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black ring-1 ring-white/15">
                <Brain size={17} />
                FOS Intelligence
              </div>
              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                FloristSocials intelligenta kontrollcenter
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 md:text-base">
                FOS analyserar order, kalender, CRM, ekonomi, meddelanden och trust-data för att ge konkreta rekommendationer.
              </p>
            </div>

            <Link
              href="/superadmin/development"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-stone-950"
            >
              Development Center
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <ScoreCard title="Growth Score" value={scores.growthScore} icon={<LineChart size={22} />} />
          <ScoreCard title="Service Score" value={scores.serviceScore} icon={<CalendarDays size={22} />} />
          <ScoreCard title="Trust Score" value={scores.trustScore} icon={<ShieldCheck size={22} />} />
          <ScoreCard title="Business Score" value={scores.businessScore} icon={<Sparkles size={22} />} />
        </div>

        <section className="mt-8 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-pink-600">
                Rekommendationer
              </p>
              <h2 className="text-3xl font-black tracking-tight">
                {recommendations.length} aktiva FOS-rekommendationer
              </h2>
            </div>
          </div>

          <div className="grid gap-4">
            {recommendations.map((item) => (
              <article
                key={item.id}
                className="rounded-[24px] bg-stone-50 p-5 ring-1 ring-stone-200"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-pink-600 shadow-sm ring-1 ring-stone-200">
                      <AlertTriangle size={22} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black">{item.title}</h3>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-stone-600 ring-1 ring-stone-200">
                          {item.module}
                        </span>
                        <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-black text-pink-700">
                          Score {item.score}
                        </span>
                      </div>
                      <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-600">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {item.actionHref && (
                    <Link
                      href={item.actionHref}
                      className="rounded-full bg-stone-950 px-5 py-3 text-sm font-black !text-white"
                    >
                      {item.actionLabel || "Öppna"}
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function ScoreCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70">
      <div className="mb-4 flex items-center justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-pink-50 text-pink-600">
          {icon}
        </div>
        <span className="text-3xl font-black">{value}</span>
      </div>
      <p className="text-sm font-black text-stone-700">{title}</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100">
        <div className="h-full rounded-full bg-pink-600" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
TSX

npm run build
