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
