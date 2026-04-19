import { cache } from "react";

import type { Database } from "@/lib/database.types";
import { getCurrentUser } from "@/lib/auth";
import { hasRequiredEnv } from "@/lib/env";
import { getCurrentProfileBundle } from "@/lib/profile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type FloristProfileRow = Database["public"]["Tables"]["florist_profiles"]["Row"];
type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type PayoutRecordRow = Database["public"]["Tables"]["payout_records"]["Row"];

export const getAdminOverview = cache(async () => {
  if (!hasRequiredEnv()) {
    return null;
  }

  const user = await getCurrentUser();

  if (!user) {
    return {
      access: "signed_out" as const,
    };
  }

  const { profile } = await getCurrentProfileBundle(user.id);

  if (profile?.role !== "admin") {
    return {
      access: "forbidden" as const,
      profile,
    };
  }

  const supabase = createSupabaseAdminClient();

  const [profilesResult, floristsResult, ordersResult, payoutsResult] =
    await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase
        .from("florist_profiles")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase
        .from("payout_records")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

  return {
    access: "granted" as const,
    profile,
    profiles: (profilesResult.data ?? []) as ProfileRow[],
    florists: (floristsResult.data ?? []) as FloristProfileRow[],
    orders: (ordersResult.data ?? []) as OrderRow[],
    payouts: (payoutsResult.data ?? []) as PayoutRecordRow[],
  };
});
