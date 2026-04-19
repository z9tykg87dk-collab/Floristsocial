import { cache } from "react";

import type { Database } from "@/lib/database.types";
import { getCurrentUser } from "@/lib/auth";
import { hasRequiredEnv } from "@/lib/env";
import { getCurrentProfileBundle } from "@/lib/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];
type PayoutRecordRow = Database["public"]["Tables"]["payout_records"]["Row"];

export const getCustomerOrders = cache(async (profileId: string) => {
  if (!hasRequiredEnv()) {
    return [] as OrderRow[];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_profile_id", profileId)
    .order("created_at", { ascending: false });

  if (error) {
    return [] as OrderRow[];
  }

  return (data ?? []) as OrderRow[];
});

export const getFloristOrders = cache(async (floristProfileId: string) => {
  if (!hasRequiredEnv()) {
    return [] as OrderRow[];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("executor_florist_profile_id", floristProfileId)
    .order("created_at", { ascending: false });

  if (error) {
    return [] as OrderRow[];
  }

  return (data ?? []) as OrderRow[];
});

export const getFloristPayoutRecords = cache(async (floristProfileId: string) => {
  if (!hasRequiredEnv()) {
    return [] as PayoutRecordRow[];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("payout_records")
    .select("*")
    .eq("recipient_florist_profile_id", floristProfileId)
    .order("created_at", { ascending: false });

  if (error) {
    return [] as PayoutRecordRow[];
  }

  return (data ?? []) as PayoutRecordRow[];
});

export function formatSek(amount: number) {
  return `${amount} SEK`;
}

export const getOrderDetailsForCurrentUser = cache(async (orderId: string) => {
  if (!hasRequiredEnv()) {
    return null;
  }

  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { floristProfile } = await getCurrentProfileBundle(user.id);
  const supabase = await createSupabaseServerClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (orderError || !order) {
    return null;
  }

  const canView =
    order.customer_profile_id === user.id ||
    order.executor_florist_profile_id === floristProfile?.id ||
    order.seller_florist_profile_id === floristProfile?.id;

  if (!canView) {
    return null;
  }

  const [{ data: items }, { data: payouts }] = await Promise.all([
    supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("payout_records")
      .select("*")
      .eq("order_id", order.id)
      .order("created_at", { ascending: true }),
  ]);

  return {
    order: order as OrderRow,
    items: (items ?? []) as OrderItemRow[],
    payouts: (payouts ?? []) as PayoutRecordRow[],
    viewer: {
      userId: user.id,
      floristProfileId: floristProfile?.id ?? null,
    },
  };
});
