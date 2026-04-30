import { cache } from "react";

import type { Database } from "@/lib/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasRequiredEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type FloristProfileRow =
  Database["public"]["Tables"]["florist_profiles"]["Row"];
type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type PayoutRecordRow =
  Database["public"]["Tables"]["payout_records"]["Row"];

export const getAdminOverview = cache(async () => {

  const supabaseAuth = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    return {
      access: "signed_out" as const,
    };
  }

  const supabase = createSupabaseAdminClient();

  const { data: florist } = await supabase
    .from("florists")
    .select("id, email, first_name, last_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (florist?.role !== "admin") {
    return {
      access: "forbidden" as const,
      profile: {
        role: florist?.role ?? "unknown",
        full_name: florist
          ? `${florist.first_name ?? ""} ${florist.last_name ?? ""}`.trim()
          : null,
      },
    };
  }

  const [profilesResult, floristsResult, ordersResult, payoutsResult] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("florist_profiles")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("payout_records")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

  return {
    access: "granted" as const,
    profile: {
      role: florist.role,
      full_name:
        `${florist.first_name ?? ""} ${florist.last_name ?? ""}`.trim() ||
        florist.email,
    },
    profiles: (profilesResult.data ?? []) as ProfileRow[],
    florists: (floristsResult.data ?? []) as FloristProfileRow[],
    orders: (ordersResult.data ?? []) as OrderRow[],
    payouts: (payoutsResult.data ?? []) as PayoutRecordRow[],
  };
});
