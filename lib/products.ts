import { cache } from "react";

import type { Database } from "@/lib/database.types";
import { hasRequiredEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type FloristProfileRow = Database["public"]["Tables"]["florist_profiles"]["Row"];

export const getProductsForFlorist = cache(async (floristProfileId: string) => {
  if (!hasRequiredEnv()) {
    return [] as ProductRow[];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("florist_profile_id", floristProfileId)
    .order("created_at", { ascending: false });

  if (error) {
    return [] as ProductRow[];
  }

  return (data ?? []) as ProductRow[];
});

export const getMarketplaceProducts = cache(async () => {
  if (!hasRequiredEnv()) {
    return [] as ProductRow[];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    return [] as ProductRow[];
  }

  return (data ?? []) as ProductRow[];
});

export const getMarketplaceProduct = cache(async (productId: string) => {
  if (!hasRequiredEnv()) {
    return {
      product: null,
      floristProfile: null,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !product) {
    return {
      product: null,
      floristProfile: null,
    };
  }

  const { data: floristProfile } = await supabase
    .from("florist_profiles")
    .select("*")
    .eq("id", product.florist_profile_id)
    .maybeSingle();

  return {
    product: product as ProductRow,
    floristProfile: (floristProfile ?? null) as FloristProfileRow | null,
  };
});
