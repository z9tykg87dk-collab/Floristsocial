import { NextResponse } from "next/server";
import Stripe from "stripe";

import {
  calculateDirectOrderSplit,
  calculateReferralOrderSplit,
} from "@/lib/payments";
import { getStripeServerClient } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type AnyRow = Record<string, any>;
type AnyAdmin = any;

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing Stripe webhook configuration." },
      { status: 400 }
    );
  }

  const payload = await request.text();
  const stripe = getStripeServerClient();
  const admin = createSupabaseAdminClient() as AnyAdmin;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid webhook signature." },
      { status: 400 }
    );
  }

  try {
    const { data: existingEvent } = await admin
      .from("stripe_webhook_events")
      .select("processed_at")
      .eq("id", event.id)
      .maybeSingle();

    if (existingEvent?.processed_at) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    if (!existingEvent) {
      const { error } = await admin.from("stripe_webhook_events").insert({
        id: event.id,
        type: event.type,
      });
      if (error) throw new Error(error.message);
    }

    if (event.type === "checkout.session.completed") {
      await handleCheckoutSessionCompleted(
        stripe,
        event.data.object as Stripe.Checkout.Session
      );
    }

    if (event.type === "account.updated") {
      await handleAccountUpdated(event.data.object as Stripe.Account);
    }

    const { error: finalizeError } = await admin
      .from("stripe_webhook_events")
      .update({
        processed_at: new Date().toISOString(),
        processing_error: null,
      })
      .eq("id", event.id);

    if (finalizeError) throw new Error(finalizeError.message);

    return NextResponse.json({ received: true });
  } catch (error) {
    await admin.from("stripe_webhook_events").upsert({
      id: event.id,
      type: event.type,
      processing_error:
        error instanceof Error ? error.message : "Stripe webhook processing failed.",
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Stripe webhook processing failed." },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  stripe: Stripe,
  session: Stripe.Checkout.Session
) {
  const admin = createSupabaseAdminClient() as AnyAdmin;
  const orderId = session.metadata?.order_id;

  if (!orderId) {
    throw new Error("Missing order_id in Stripe Checkout metadata.");
  }

  const { data: order, error: orderError } = await admin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (orderError || !order) {
    throw new Error(orderError?.message ?? "Order not found.");
  }

  const typedOrder = order as AnyRow;

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  let stripeFeeAmount = typedOrder.stripe_fee_amount ?? 0;

  if (paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ["latest_charge.balance_transaction"],
    });

    const charge = paymentIntent.latest_charge;

    if (charge && typeof charge !== "string") {
      const tx = charge.balance_transaction;
      if (tx && typeof tx !== "string") {
        stripeFeeAmount = tx.fee;
      }
    }
  }

  const split =
    typedOrder.source === "referral"
      ? calculateReferralOrderSplit(typedOrder.total_amount, stripeFeeAmount)
      : calculateDirectOrderSplit(typedOrder.total_amount, stripeFeeAmount);

  const { error: updateError } = await admin
    .from("orders")
    .update({
      status: "paid",
      stripe_payment_intent_id: paymentIntentId ?? typedOrder.stripe_payment_intent_id,
      stripe_fee_amount: stripeFeeAmount,
      executor_amount: split.executorAmount,
      seller_amount: split.sellerAmount,
      platform_amount: split.platformAmount,
    })
    .eq("id", typedOrder.id);

  if (updateError) throw new Error(updateError.message);
}

async function handleAccountUpdated(account: Stripe.Account) {
  const admin = createSupabaseAdminClient() as AnyAdmin;

  const isComplete =
    account.details_submitted &&
    account.charges_enabled &&
    account.payouts_enabled;

  const { error } = await admin
    .from("florist_profiles")
    .update({
      stripe_onboarding_complete: isComplete,
      onboarding_completed_at: isComplete ? new Date().toISOString() : null,
    })
    .eq("stripe_account_id", account.id);

  if (error) throw new Error(error.message);
}
