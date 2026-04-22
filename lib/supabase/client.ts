import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";
import { getSupabaseEnv } from "@/lib/supabase/shared";

export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient<Database>(url, anonKey);
}