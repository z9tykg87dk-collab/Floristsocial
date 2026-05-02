import { cache } from "react";

import type { Database } from "@/lib/database.types";
import { hasRequiredEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type FloristProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export const getProductsForFlorist = cache(async (floristProfileId: string) => {
  if (!hasRequiredEnv()) {
    return [] as ProductRow[];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("florist_id", floristProfileId) // 🔥 FIX
    .order("created_at", { ascending: false });

  if (error) {
    console.error("ERROR getProductsForFlorist:", error);
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
    console.error("ERROR getMarketplaceProducts:", error);
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
    console.error("PRODUCT NOT FOUND:", error);
    return {
      product: null,
      floristProfile: null,
    };
  }

  console.log("PRODUCT:", product);
  console.log("PRODUCT.florist_id:", product.florist_id);

  const { data: floristProfile, error: floristError } = await supabase
    .from("florist_profiles")
    .select("*")
    .eq("id", product.florist_profile_id)
    .maybeSingle();

  console.log("FLORIST PROFILE:", floristProfile);
  console.log("FLORIST ERROR:", floristError);

  return {
    product: product as ProductRow,
    floristProfile: (floristProfile ?? null) as FloristProfileRow | null,
  };
});
