"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { hasRequiredEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type FloristOnboardingState = {
  status: "idle" | "error";
  message?: string;
};

export async function saveFloristOnboardingAction(
  _previousState: FloristOnboardingState,
  formData: FormData
): Promise<FloristOnboardingState> {
  if (!hasRequiredEnv()) {
    return {
      status: "error",
      message: "Configure Supabase environment variables before onboarding.",
    };
  }

  const user = await getCurrentUser();

  if (!user) {
    return {
      status: "error",
      message: "You need to sign in before creating a florist profile.",
    };
  }

  const shopName = readText(formData, "shopName");
  const fullName = readText(formData, "fullName");
  const phone = readText(formData, "phone");
  const city = readText(formData, "city");
  const postalCode = readText(formData, "postalCode");
  const streetAddress = readText(formData, "streetAddress");
  const bio = readText(formData, "bio");
  const instagramHandle = readText(formData, "instagramHandle");
  const websiteUrl = readText(formData, "websiteUrl");
  const deliveryRadiusKm = readNumber(formData, "deliveryRadiusKm");
  const acceptsReferrals = formData.get("acceptsReferrals") === "on";
  const fulfillsOrders = formData.get("fulfillsOrders") === "on";

  if (!shopName || !fullName || !city) {
    return {
      status: "error",
      message: "Shop name, contact name and city are required.",
    };
  }

  const slugInput = readText(formData, "slug") || shopName;
  const slug = normalizeSlug(slugInput);

  if (!slug) {
    return {
      status: "error",
      message: "Use a shop name or slug with letters and numbers.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    role: "florist",
    full_name: fullName,
    phone: phone || null,
    city,
  });

  if (profileError) {
    return {
      status: "error",
      message: profileError.message,
    };
  }

  const { error: floristError } = await supabase.from("florist_profiles").upsert(
    {
      profile_id: user.id,
      slug,
      shop_name: shopName,
      bio: bio || null,
      email: user.email ?? null,
      phone: phone || null,
      website_url: websiteUrl || null,
      instagram_handle: instagramHandle || null,
      street_address: streetAddress || null,
      postal_code: postalCode || null,
      city,
      delivery_radius_km: deliveryRadiusKm,
      accepts_referrals: acceptsReferrals,
      fulfills_orders: fulfillsOrders,
    },
    {
      onConflict: "profile_id",
    }
  );

  if (floristError) {
    return {
      status: "error",
      message: floristError.message,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/onboarding/florist");
  revalidatePath("/directory");
  redirect("/dashboard");
}

function readText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function readNumber(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").trim();

  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
