import Stripe from "stripe";

import { getMissingStripeServerEnv } from "@/lib/env";

export function getStripeServerClient() {
  const missing = getMissingStripeServerEnv();

  if (missing.length > 0) {
    throw new Error(
      `Missing Stripe server environment variables: ${missing.join(", ")}`
    );
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2026-02-25.clover",
  });
}
