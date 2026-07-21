import { NextResponse } from "next/server";
import { runFosDecisionEngine } from "@/lib/fos/decision";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const enqueueToActionQueue = searchParams.get("enqueue") === "true";

  const decision = runFosDecisionEngine({
    eventType: "ORDER_CREATED",
    module: "order",
    payload: {
      orderId: "demo-order",
      floristId: "demo-florist",
    },
    ...(enqueueToActionQueue ? { enqueueToActionQueue: true } : {}),
  });

  return NextResponse.json({
    ok: true,
    module: "fos-decision-engine",
    ...decision,
  });
}
