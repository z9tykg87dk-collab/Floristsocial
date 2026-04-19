import { getMissingRequiredEnv } from "@/lib/env";

export function getSupabaseEnv() {
  const missing = getMissingRequiredEnv().filter(
    (key) =>
      key === "NEXT_PUBLIC_SUPABASE_URL" ||
      key === "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing Supabase environment variables: ${missing.join(", ")}`
    );
  }

  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  };
}

export function getSupabaseServiceRoleEnv() {
  const missing = getMissingRequiredEnv().filter(
    (key) =>
      key === "NEXT_PUBLIC_SUPABASE_URL" ||
      key === "SUPABASE_SERVICE_ROLE_KEY"
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing Supabase service role environment variables: ${missing.join(", ")}`
    );
  }

  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  };
}
