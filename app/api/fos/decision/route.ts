import { NextResponse } from "next/server";
import { runFosDecisionEngine } from "@/lib/fos/decision";

export async function GET() {
  const decision = runFosDecisionEngine({
    eventType: "ORDER_CREATED",
    module: "order",
    payload: {
      orderId: "demo-order",
      floristId: "demo-florist",
    },
  });

  return NextResponse.json({
    ok: true,
    module: "fos-decision-engine",
    ...decision,
  });
}
