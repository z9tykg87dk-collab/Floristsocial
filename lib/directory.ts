import { cache } from "react";

import type { Database } from "@/lib/database.types";
import { hasRequiredEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type FloristProfileRow = Database["public"]["Tables"]["florist_profiles"]["Row"];

export const getDirectoryFlorists = cache(async () => {
  if (!hasRequiredEnv()) {
    return [] as FloristProfileRow[];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("florist_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return [] as FloristProfileRow[];
  }

  return (data ?? []) as FloristProfileRow[];
});

export const getDirectoryFlorist = cache(async (floristProfileId: string) => {
  if (!hasRequiredEnv()) {
    return null as FloristProfileRow | null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("florist_profiles")
    .select("*")
    .eq("id", floristProfileId)
    .maybeSingle();

  if (error) {
    return null as FloristProfileRow | null;
  }

  return (data ?? null) as FloristProfileRow | null;
});
