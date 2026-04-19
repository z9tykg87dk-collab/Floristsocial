"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { hasRequiredEnv } from "@/lib/env";
import { getCurrentProfileBundle } from "@/lib/profile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type AdminPayoutState = {
  status: "idle" | "error" | "success";
  message?: string;
};

const allowedPayoutStatuses = new Set([
  "pending",
  "scheduled",
  "paid",
  "failed",
  "reversed",
]);

export async function updatePayoutStatusAction(
  _previousState: AdminPayoutState,
  formData: FormData
): Promise<AdminPayoutState> {
  if (!hasRequiredEnv()) {
    return {
      status: "error",
      message: "Configure environment variables before updating payouts.",
    };
  }

  const user = await getCurrentUser();

  if (!user) {
    return {
      status: "error",
      message: "You need to sign in before updating payouts.",
    };
  }

  const { profile } = await getCurrentProfileBundle(user.id);

  if (profile?.role !== "admin") {
    return {
      status: "error",
      message: "Only admins can update payout records.",
    };
  }

  const payoutId = String(formData.get("payoutId") ?? "").trim();
  const nextStatus = String(formData.get("status") ?? "").trim();

  if (!payoutId || !allowedPayoutStatuses.has(nextStatus)) {
    return {
      status: "error",
      message: "Select a valid payout status.",
    };
  }

  const supabase = createSupabaseAdminClient();

const updatePayload: Record<string, string | null> = {
  status: nextStatus,
  paid_at: nextStatus === "paid" ? new Date().toISOString() : null,
};

const { error } = await supabase
  .from("payout_records")
  .update(updatePayload as never)
  .eq("id", payoutId);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");

  return {
    status: "success",
    message: "Payout status updated.",
  };
}
