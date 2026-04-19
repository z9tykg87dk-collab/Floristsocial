"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getDirectoryFlorist } from "@/lib/directory";
import { getAppUrl, getMissingStripeConnectEnv, hasRequiredEnv } from "@/lib/env";
import { getMarketplaceProduct } from "@/lib/products";
import { getStripeServerClient } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CheckoutState = {
  status: "idle" | "error";
  message?: string;
};

export async function startDirectCheckoutAction(
  _previousState: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  if (!hasRequiredEnv()) {
    return {
      status: "error",
      message: "Configure Supabase environment variables before checkout.",
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
      message: "You need to sign in before placing an order.",
    };
  }

  const productId = String(formData.get("productId") ?? "");
  const sellerFloristProfileId = readText(formData, "sellerFloristProfileId");
  const recipientName = readText(formData, "recipientName");
  const recipientPhone = readText(formData, "recipientPhone");
  const deliveryAddress = readText(formData, "deliveryAddress");
  const deliveryPostalCode = readText(formData, "deliveryPostalCode");
  const deliveryCity = readText(formData, "deliveryCity");
  const deliveryDate = readText(formData, "deliveryDate");
  const cardMessage = readText(formData, "cardMessage");
  const notes = readText(formData, "notes");

  if (!productId || !recipientName || !deliveryAddress || !deliveryCity) {
    return {
      status: "error",
      message: "Recipient name, delivery address and city are required.",
    };
  }

  const { product, floristProfile } = await getMarketplaceProduct(productId);
  const sellerFlorist = sellerFloristProfileId
    ? await getDirectoryFlorist(sellerFloristProfileId)
    : null;

  if (!product || !floristProfile) {
    return {
      status: "error",
      message: "The selected product is no longer available.",
    };
  }

  if (sellerFlorist) {
    if (!sellerFlorist.accepts_referrals) {
      return {
        status: "error",
        message: "The selected seller florist is not accepting referrals.",
      };
    }

    if (sellerFlorist.id === floristProfile.id) {
      return {
        status: "error",
        message: "Seller florist and executor florist cannot be the same.",
      };
    }
  }

  const supabase = await createSupabaseServerClient();
  const subtotalAmount = product.price_amount;
  const deliveryFeeAmount = 0;
  const totalAmount = subtotalAmount + deliveryFeeAmount;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_profile_id: user.id,
      executor_florist_profile_id: floristProfile.id,
      seller_florist_profile_id: sellerFlorist?.id ?? null,
      source: sellerFlorist ? "referral" : "direct",
      status: "pending_payment",
      currency: product.currency,
      subtotal_amount: subtotalAmount,
      delivery_fee_amount: deliveryFeeAmount,
      total_amount: totalAmount,
      stripe_fee_amount: 0,
      executor_amount: 0,
      seller_amount: 0,
      platform_amount: 0,
      recipient_name: recipientName,
      recipient_phone: recipientPhone || null,
      card_message: cardMessage || null,
      delivery_address: deliveryAddress,
      delivery_postal_code: deliveryPostalCode || null,
      delivery_city: deliveryCity,
      delivery_date: deliveryDate || null,
      notes: notes || null,
    })
    .select("*")
    .single();

  if (orderError || !order) {
    return {
      status: "error",
      message: orderError?.message ?? "Could not create the order.",
    };
  }

  const { error: orderItemError } = await supabase.from("order_items").insert({
    order_id: order.id,
    product_id: product.id,
    product_title: product.title,
    quantity: 1,
    unit_price_amount: product.price_amount,
    line_total_amount: product.price_amount,
  });

  if (orderItemError) {
    return {
      status: "error",
      message: orderItemError.message,
    };
  }

  const stripe = getStripeServerClient();
  const appUrl = getAppUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${appUrl}/checkout/success?order=${order.id}`,
    cancel_url: `${appUrl}/checkout/cancel?order=${order.id}`,
    customer_email: user.email ?? undefined,
    metadata: {
      order_id: order.id,
      product_id: product.id,
      order_source: sellerFlorist ? "referral" : "direct",
      executor_florist_profile_id: floristProfile.id,
      seller_florist_profile_id: sellerFlorist?.id ?? "",
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: product.currency,
          unit_amount: product.price_amount,
          product_data: {
            name: product.title,
            description: product.description ?? undefined,
          },
        },
      },
    ],
  });

  const { error: sessionUpdateError } = await supabase
    .from("orders")
    .update({
      stripe_checkout_session_id: session.id,
    })
    .eq("id", order.id);

  if (sessionUpdateError) {
    return {
      status: "error",
      message: sessionUpdateError.message,
    };
  }

  redirect(session.url);
}

function readText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}
