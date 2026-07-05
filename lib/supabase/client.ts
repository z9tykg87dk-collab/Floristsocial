import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";
import { getSupabaseEnv } from "@/lib/supabase/shared";

export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseEnv();

  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createBrowserClient<Database, "public">(url, anonKey);
}
