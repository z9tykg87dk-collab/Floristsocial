"use client";

import { useActionState } from "react";

import {
  type SignInState,
  signInWithOtpAction,
} from "@/app/auth/actions";

const initialState: SignInState = {
  status: "idle",
};

type SignInFormProps = {
  next?: string;
  disabled?: boolean;
};

export function SignInForm({ next, disabled = false }: SignInFormProps) {
  const [state, formAction, isPending] = useActionState(
    signInWithOtpAction,
    initialState
  );

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input type="hidden" name="next" value={next ?? "/dashboard"} />
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-600"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@floristsocial.com"
          required
          disabled={disabled || isPending}
          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-amber-600"
        />
      </div>
      <button
        type="submit"
        disabled={disabled || isPending}
        className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        {isPending ? "Sending link..." : "Send magic link"}
      </button>
      {state.message ? (
        <p
          className={`text-sm ${
            state.status === "error" ? "text-red-700" : "text-emerald-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
