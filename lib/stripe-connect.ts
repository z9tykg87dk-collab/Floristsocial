import { cache } from "react";

import { hasRequiredEnv } from "@/lib/env";
import { getStripeServerClient } from "@/lib/stripe";

type StripeConnectSummary = {
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
};

export const getStripeConnectSummary = cache(
  async (stripeAccountId: string): Promise<StripeConnectSummary | null> => {
    if (!hasRequiredEnv()) {
      return null;
    }

    try {
      const stripe = getStripeServerClient();
      const account = await stripe.accounts.retrieve(stripeAccountId);

      return {
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        detailsSubmitted: account.details_submitted,
      };
    } catch {
      return null;
    }
  }
);
