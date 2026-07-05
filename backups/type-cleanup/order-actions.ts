"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { hasRequiredEnv } from "@/lib/env";
import { getCurrentProfileBundle } from "@/lib/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type OrderStatusState = {
  status: "idle" | "error" | "success";
  message?: string;
};

const allowedStatuses = new Set([
  "accepted",
  "in_production",
  "out_for_delivery",
  "completed",
  "cancelled",
]);

export async function updateFloristOrderStatusAction(
  _previousState: OrderStatusState,
  formData: FormData,
): Promise<OrderStatusState> {
  if (!hasRequiredEnv()) {
    return {
      status: "error",
      message:
        "Configure Supabase environment variables before updating orders.",
    };
  }

  const user = await getCurrentUser();

  if (!user) {
    return {
      status: "error",
      message: "You need to sign in before updating order status.",
    };
  }

  const { floristProfile } = await getCurrentProfileBundle(user.id);

  if (!floristProfile) {
    return {
      status: "error",
      message: "Complete florist onboarding before updating order status.",
    };
  }

  const orderId = String(formData.get("orderId") ?? "").trim();
  const nextStatus = String(formData.get("status") ?? "").trim();

  if (!orderId || !allowedStatuses.has(nextStatus)) {
    return {
      status: "error",
      message: "Select a valid order status.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: order, error: orderError } = await (supabase as any)
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("executor_florist_profile_id", floristProfile.id)
    .maybeSingle();

  if (orderError || !order) {
    return {
      status: "error",
      message: orderError?.message ?? "Order not found for this florist.",
    };
  }

  const { error: updateError } = await (supabase as any)
    .from("orders")
    .update({
      status: nextStatus,
    })
    .eq("id", order.id);

  if (updateError) {
    return {
      status: "error",
      message: updateError.message,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/orders/${order.id}`);

  return {
    status: "success",
    message: "Order status updated.",
  };
}
