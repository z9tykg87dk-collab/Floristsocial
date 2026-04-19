"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getAppUrl, getMissingStripeConnectEnv, hasRequiredEnv } from "@/lib/env";
import { getCurrentProfileBundle } from "@/lib/profile";
import { getStripeServerClient } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ProductFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export type StripeConnectState = {
  status: "idle" | "error";
  message?: string;
};

export async function createProductAction(
  _previousState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  if (!hasRequiredEnv()) {
    return {
      status: "error",
      message: "Configure Supabase environment variables before creating products.",
    };
  }

  const user = await getCurrentUser();

  if (!user) {
    return {
      status: "error",
      message: "You need to sign in before creating products.",
    };
  }

  const { floristProfile } = await getCurrentProfileBundle(user.id);

  if (!floristProfile) {
    return {
      status: "error",
      message: "Complete florist onboarding before adding products.",
    };
  }

  const title = readText(formData, "title");
  const description = readText(formData, "description");
  const category = readText(formData, "category");
  const occasion = readText(formData, "occasion");
  const imageUrl = readText(formData, "imageUrl");
  const priceAmount = Number(String(formData.get("priceAmount") ?? "0").trim());
  const isActive = formData.get("isActive") === "on";

  if (!title || !Number.isFinite(priceAmount) || priceAmount <= 0) {
    return {
      status: "error",
      message: "Title and a valid positive price are required.",
    };
  }

  const slugInput = readText(formData, "slug") || title;
  const slug = normalizeSlug(slugInput);

  if (!slug) {
    return {
      status: "error",
      message: "Use a title or slug with letters and numbers.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").insert({
    florist_profile_id: floristProfile.id,
    title,
    slug,
    description: description || null,
    price_amount: Math.round(priceAmount),
    category: category || null,
    occasion: occasion || null,
    image_url: imageUrl || null,
    is_active: isActive,
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/marketplace");

  return {
    status: "success",
    message: "Product created.",
  };
}

export async function createStripeConnectOnboardingAction(
  _previousState: StripeConnectState
): Promise<StripeConnectState> {
  void _previousState;

  if (!hasRequiredEnv()) {
    return {
      status: "error",
      message:
        "Configure Supabase environment variables before starting Stripe Connect.",
    };
  }

  const missingStripeEnv = getMissingStripeConnectEnv();

  if (missingStripeEnv.length > 0) {
    return {
      status: "error",
      message: `Missing Stripe environment variables: ${missingStripeEnv.join(", ")}.`,
    };
  }

  const user = await getCurrentUser();

  if (!user) {
    return {
      status: "error",
      message: "You need to sign in before starting Stripe Connect onboarding.",
    };
  }

  const { floristProfile } = await getCurrentProfileBundle(user.id);

  if (!floristProfile) {
    return {
      status: "error",
      message: "Complete florist onboarding before starting Stripe Connect.",
    };
  }

  try {
    const stripe = getStripeServerClient();
    const supabase = await createSupabaseServerClient();

    let stripeAccountId = floristProfile.stripe_account_id;

    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: floristProfile.country_code,
        email: floristProfile.email ?? user.email ?? undefined,
        business_type: "individual",
        metadata: {
          florist_profile_id: floristProfile.id,
          profile_id: floristProfile.profile_id,
          shop_name: floristProfile.shop_name,
        },
      });

      stripeAccountId = account.id;

      await supabase
        .from("florist_profiles")
        .update({
          stripe_account_id: stripeAccountId,
          stripe_onboarding_complete: false,
        })
        .eq("id", floristProfile.id);
    }

    const appUrl = getAppUrl();
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${appUrl}/dashboard?stripe=refresh`,
      return_url: `${appUrl}/dashboard?stripe=return`,
      type: "account_onboarding",
    });

    revalidatePath("/dashboard");
    redirect(accountLink.url);
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Could not start Stripe Connect onboarding.",
    };
  }
}

function readText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
