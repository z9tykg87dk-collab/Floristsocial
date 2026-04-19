import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database.types";
import { getSupabaseServiceRoleEnv } from "@/lib/supabase/shared";

export function createSupabaseAdminClient() {
  const { url, serviceRoleKey } = getSupabaseServiceRoleEnv();

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
