import { NextResponse } from "next/server";
import Stripe from "stripe";

import {
  calculateDirectOrderSplit,
  calculateReferralOrderSplit,
} from "@/lib/payments";
import { getStripeServerClient } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

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
    const admin = createSupabaseAdminClient();

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

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          stripe,
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "account.updated":
        await handleAccountUpdated(event.data.object as Stripe.Account);
        break;

      default:
        break;
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
    const admin = createSupabaseAdminClient();

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
  const admin = createSupabaseAdminClient();
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
    throw new Error(orderError?.message ?? "Order not found for webhook.");
  }

  const { data: existingPayouts } = await admin
    .from("payout_records")
    .select("id")
    .eq("order_id", order.id);

  if (order.status === "paid" && (existingPayouts?.length ?? 0) > 0) {
    return;
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  let stripeFeeAmount = order.stripe_fee_amount;

  if (paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ["latest_charge.balance_transaction"],
    });

    const latestCharge = paymentIntent.latest_charge;

    if (latestCharge && typeof latestCharge !== "string") {
      const balanceTransaction = latestCharge.balance_transaction;

      if (balanceTransaction && typeof balanceTransaction !== "string") {
        stripeFeeAmount = balanceTransaction.fee;
      }
    }
  }

  const split =
    order.source === "referral"
      ? calculateReferralOrderSplit(order.total_amount, stripeFeeAmount)
      : calculateDirectOrderSplit(order.total_amount, stripeFeeAmount);

  const { data: executorFlorist } = await admin
    .from("florist_profiles")
    .select("profile_id, stripe_account_id")
    .eq("id", order.executor_florist_profile_id)
    .maybeSingle();

  const { data: sellerFlorist } = order.seller_florist_profile_id
    ? await admin
        .from("florist_profiles")
        .select("profile_id, stripe_account_id")
        .eq("id", order.seller_florist_profile_id)
        .maybeSingle()
    : { data: null };

  const executorTransferId = await createTransferIfPossible({
    stripe,
    amount: split.executorAmount,
    currency: order.currency,
    destination: executorFlorist?.stripe_account_id,
    transferGroup: `order_${order.id}`,
    idempotencyKey: `order_${order.id}_executor`,
  });

  const sellerTransferId =
    order.source === "referral" && order.seller_florist_profile_id
      ? await createTransferIfPossible({
          stripe,
          amount: split.sellerAmount,
          currency: order.currency,
          destination: sellerFlorist?.stripe_account_id,
          transferGroup: `order_${order.id}`,
          idempotencyKey: `order_${order.id}_seller`,
        })
      : null;

  const { error: updateOrderError } = await admin
    .from("orders")
    .update({
      status: "paid",
      stripe_payment_intent_id: paymentIntentId ?? order.stripe_payment_intent_id,
      stripe_fee_amount: stripeFeeAmount,
      executor_amount: split.executorAmount,
      seller_amount: split.sellerAmount,
      platform_amount: split.platformAmount,
    })
    .eq("id", order.id);

  if (updateOrderError) {
    throw new Error(updateOrderError.message);
  }

  if ((existingPayouts?.length ?? 0) === 0) {
    const payoutRows = [
      {
        order_id: order.id,
        recipient_profile_id: executorFlorist?.profile_id ?? null,
        recipient_florist_profile_id: order.executor_florist_profile_id,
        recipient_role: "florist" as const,
        amount: split.executorAmount,
        currency: order.currency,
        status: executorTransferId ? ("transferred" as const) : ("pending" as const),
        stripe_transfer_id: executorTransferId,
      },
    ];

    if (order.source === "referral" && order.seller_florist_profile_id) {
      payoutRows.push({
        order_id: order.id,
        recipient_profile_id: sellerFlorist?.profile_id ?? null,
        recipient_florist_profile_id: order.seller_florist_profile_id,
        recipient_role: "florist" as const,
        amount: split.sellerAmount,
        currency: order.currency,
        status: sellerTransferId ? ("transferred" as const) : ("pending" as const),
        stripe_transfer_id: sellerTransferId,
      });
    }

    payoutRows.push({
      order_id: order.id,
      recipient_profile_id: null,
      recipient_florist_profile_id: null,
      recipient_role: "admin" as const,
      amount: split.platformAmount,
      currency: order.currency,
      status: "pending" as const,
      stripe_transfer_id: null,
    });

    const { error: payoutError } = await admin
      .from("payout_records")
      .insert(payoutRows);

    if (payoutError) {
      throw new Error(payoutError.message);
    }
  }
}

async function createTransferIfPossible({
  stripe,
  amount,
  currency,
  destination,
  transferGroup,
  idempotencyKey,
}: {
  stripe: Stripe;
  amount: number;
  currency: string;
  destination?: string | null;
  transferGroup: string;
  idempotencyKey: string;
}) {
  if (!destination || amount <= 0) {
    return null;
  }

  const transfer = await stripe.transfers.create(
    {
      amount,
      currency,
      destination,
      transfer_group: transferGroup,
    },
    {
      idempotencyKey,
    }
  );

  return transfer.id;
}

async function handleAccountUpdated(account: Stripe.Account) {
  const admin = createSupabaseAdminClient();
  const isOnboardingComplete =
    account.details_submitted &&
    account.charges_enabled &&
    account.payouts_enabled;

  const { error } = await admin
    .from("florist_profiles")
    .update({
      stripe_onboarding_complete: isOnboardingComplete,
      onboarding_completed_at: isOnboardingComplete
        ? new Date().toISOString()
        : null,
    })
    .eq("stripe_account_id", account.id);

  if (error) {
    throw new Error(error.message);
  }
}
