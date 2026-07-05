#!/bin/bash
set -e

mkdir -p app/api/fos/intelligence

cat > lib/fos/intelligence/snapshot.ts <<'TS'
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
TS

cat > app/api/fos/intelligence/route.ts <<'TS'
import { NextResponse } from "next/server";
import { runFosIntelligence } from "@/lib/fos/intelligence";
import { getDemoFosSnapshot } from "@/lib/fos/intelligence/snapshot";

export async function GET() {
  const snapshot = await getDemoFosSnapshot();
  const intelligence = runFosIntelligence(snapshot);

  return NextResponse.json({
    ok: true,
    module: "fos-intelligence",
    ...intelligence,
  });
}
TS

python3 <<'PY'
from pathlib import Path

p = Path("lib/fos/intelligence/index.ts")
s = p.read_text()

line = 'export * from "./snapshot";\n'
if line not in s:
    s += line

p.write_text(s)
PY

npm run build
