import { cache } from "react";

import {
  getMissingRequiredEnv,
  getMissingStripeConnectEnv,
  getMissingStripeServerEnv,
} from "@/lib/env";
import { getStripeServerClient } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type CheckStatus = "ok" | "warning" | "error";

type HealthCheck = {
  description: string;
  details?: string;
  name: string;
  status: CheckStatus;
};

export const getDeploymentHealth = cache(async () => {
  const checks: HealthCheck[] = [];

  const missingRequiredEnv = getMissingRequiredEnv();
  checks.push({
    name: "Required env",
    description: "Core app, Supabase and Stripe variables",
    status: missingRequiredEnv.length === 0 ? "ok" : "error",
    details:
      missingRequiredEnv.length > 0
        ? `Missing: ${missingRequiredEnv.join(", ")}`
        : "All required environment variables are present.",
  });

  const missingStripeConnectEnv = getMissingStripeConnectEnv();
  checks.push({
    name: "Stripe Connect env",
    description: "Variables needed to launch florist onboarding",
    status: missingStripeConnectEnv.length === 0 ? "ok" : "warning",
    details:
      missingStripeConnectEnv.length > 0
        ? `Missing: ${missingStripeConnectEnv.join(", ")}`
        : "Stripe Connect environment variables are present.",
  });

  let supabaseStatus: CheckStatus = "error";
  let supabaseDetails = "Supabase admin client could not be initialized.";

  try {
    const supabase = createSupabaseAdminClient();
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    if (!error) {
      supabaseStatus = "ok";
      supabaseDetails = `Connected successfully. Profiles count is ${count ?? 0}.`;
    } else {
      supabaseDetails = error.message;
    }
  } catch (error) {
    supabaseDetails =
      error instanceof Error ? error.message : "Supabase health check failed.";
  }

  checks.push({
    name: "Supabase connection",
    description: "Service role access and schema readiness",
    status: supabaseStatus,
    details: supabaseDetails,
  });

  const missingStripeServerEnv = getMissingStripeServerEnv();
  let stripeStatus: CheckStatus = missingStripeServerEnv.length === 0 ? "ok" : "warning";
  let stripeDetails =
    missingStripeServerEnv.length > 0
      ? `Missing: ${missingStripeServerEnv.join(", ")}`
      : "Stripe server key is present.";

  if (missingStripeServerEnv.length === 0) {
    try {
      const stripe = getStripeServerClient();
      const account = await stripe.accounts.retrieve();
      stripeDetails = `Stripe API reachable in ${account.country} account context.`;
    } catch (error) {
      stripeStatus = "error";
      stripeDetails =
        error instanceof Error ? error.message : "Stripe health check failed.";
    }
  }

  checks.push({
    name: "Stripe server access",
    description: "Server key can talk to Stripe API",
    status: stripeStatus,
    details: stripeDetails,
  });

  const overallStatus = checks.some((check) => check.status === "error")
    ? "error"
    : checks.some((check) => check.status === "warning")
      ? "warning"
      : "ok";

  return {
    checks,
    overallStatus,
  };
});
