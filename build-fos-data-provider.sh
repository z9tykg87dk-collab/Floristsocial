#!/bin/bash
set -e

mkdir -p lib/fos/core
mkdir -p app/api/fos/snapshot

cat > lib/fos/core/types.ts <<'TS'
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
TS

cat > lib/fos/core/snapshot.ts <<'TS'
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
TS

cat > lib/fos/core/index.ts <<'TS'
export * from "./types";
export * from "./snapshot";
TS

cat > app/api/fos/snapshot/route.ts <<'TS'
import { NextResponse } from "next/server";
import { getFosCoreSnapshot, toIntelligenceSnapshot } from "@/lib/fos/core";
import { runFosIntelligence } from "@/lib/fos/intelligence";

export async function GET() {
  const snapshot = await getFosCoreSnapshot();
  const intelligence = runFosIntelligence(toIntelligenceSnapshot(snapshot));

  return NextResponse.json({
    ok: true,
    module: "fos-core-snapshot",
    snapshot,
    intelligence,
  });
}
TS

python3 <<'PY'
from pathlib import Path

p = Path("app/workspace/intelligence/page.tsx")
s = p.read_text(encoding="utf-8")

s = s.replace(
  'import { runFosIntelligence } from "@/lib/fos/intelligence";',
  'import { runFosIntelligence } from "@/lib/fos/intelligence";\nimport { getFosCoreSnapshot, toIntelligenceSnapshot } from "@/lib/fos/core";'
)

s = s.replace(
'''export default function WorkspaceIntelligencePage() {
  const intelligence = runFosIntelligence({
    ordersLast30Days: 34,
    revenueLast30Days: 68500,
    averageRating: 4.9,
    reviewCount: 18,
    lateDeliveries: 1,
    unreadMessages: 6,
    upcomingDeliveries: 12,
    repeatCustomers: 7,
  });''',
'''export default async function WorkspaceIntelligencePage() {
  const coreSnapshot = await getFosCoreSnapshot();
  const intelligence = runFosIntelligence(toIntelligenceSnapshot(coreSnapshot));'''
)

p.write_text(s, encoding="utf-8")
print("Klart! Intelligence-sidan använder nu FOS Core Snapshot.")
PY

npm run build
