import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { getSupabaseEnv } from "@/lib/supabase/shared";

const { url, anonKey } = getSupabaseEnv();

if (!url || !anonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient<Database, "public">(url, anonKey);
