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
