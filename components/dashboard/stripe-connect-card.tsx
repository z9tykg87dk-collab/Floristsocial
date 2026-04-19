"use client";

import { useActionState } from "react";

import {
  createStripeConnectOnboardingAction,
  type StripeConnectState,
} from "@/app/dashboard/actions";

type StripeConnectCardProps = {
  hasStripeAccount: boolean;
  isOnboardingComplete: boolean;
  accountId: string | null;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  hasStripeEnv: boolean;
};

const initialState: StripeConnectState = {
  status: "idle",
};

export function StripeConnectCard({
  hasStripeAccount,
  isOnboardingComplete,
  accountId,
  chargesEnabled,
  payoutsEnabled,
  detailsSubmitted,
  hasStripeEnv,
}: StripeConnectCardProps) {
  const [state, formAction, isPending] = useActionState(
    createStripeConnectOnboardingAction,
    initialState
  );

  return (
    <div className="rounded-[2rem] border border-stone-300 bg-white/80 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
        Stripe Connect
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-stone-900">
        {isOnboardingComplete ? "Connected" : "Onboarding required"}
      </h2>
      <p className="mt-3 text-sm leading-6 text-stone-600">
        This controls florist payouts. Create or resume the connected Stripe
        account before accepting live marketplace orders.
      </p>

      <dl className="mt-6 grid gap-3 text-sm text-stone-600">
        <StatusRow
          label="Stripe account"
          value={hasStripeAccount ? accountId ?? "Connected" : "Not created"}
        />
        <StatusRow
          label="Details submitted"
          value={detailsSubmitted ? "Yes" : "No"}
        />
        <StatusRow
          label="Charges enabled"
          value={chargesEnabled ? "Yes" : "No"}
        />
        <StatusRow
          label="Payouts enabled"
          value={payoutsEnabled ? "Yes" : "No"}
        />
      </dl>

      {!hasStripeEnv ? (
        <p className="mt-5 text-sm text-amber-800">
          Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_APP_URL` before starting
          Connect onboarding.
        </p>
      ) : null}

      {state.message ? (
        <p className="mt-5 text-sm text-red-700">{state.message}</p>
      ) : null}

      <form action={formAction} className="mt-6">
        <button
          type="submit"
          disabled={isPending || !hasStripeEnv}
          className="inline-flex rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
        >
          {isPending
            ? "Opening Stripe..."
            : hasStripeAccount
              ? "Resume Stripe onboarding"
              : "Start Stripe onboarding"}
        </button>
      </form>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-stone-50 px-4 py-3">
      <dt>{label}</dt>
      <dd className="font-medium text-stone-900">{value}</dd>
    </div>
  );
}
