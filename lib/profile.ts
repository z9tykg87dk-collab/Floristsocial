import { cache } from "react";

import type { Database } from "@/lib/database.types";
import { hasRequiredEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type FloristProfileRow = Database["public"]["Tables"]["florist_profiles"]["Row"];

export const getCurrentProfileBundle = cache(async (userId: string) => {
  if (!hasRequiredEnv()) {
    return {
      profile: null,
      floristProfile: null,
    };
  }

  const supabase = await createSupabaseServerClient();

  const [{ data: profile }, { data: floristProfile }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase
      .from("florist_profiles")
      .select("*")
      .eq("profile_id", userId)
      .maybeSingle(),
  ]);

  return {
    profile: profile as ProfileRow | null,
    floristProfile: floristProfile as FloristProfileRow | null,
  };
});
