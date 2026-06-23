import Link from "next/link";

import { FloristOnboardingForm } from "@/components/onboarding/florist-onboarding-form";
import { getCurrentUser } from "@/lib/auth";
import { getMissingRequiredEnv } from "@/lib/env";
import { getCurrentProfileBundle } from "@/lib/profile";

export default async function FloristOnboardingPage() {
  const missingEnv = getMissingRequiredEnv();
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
          Florist onboarding
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
          Sign in before creating a florist profile.
        </h1>
        <Link
          href="/auth/sign-in?next=/onboarding/florist"
          className="mt-8 inline-flex w-fit rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800"
        >
          Go to sign in
        </Link>
      </main>
    );
  }

  const { profile, floristProfile } = await getCurrentProfileBundle(user.id);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
        Florist onboarding
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
        Create the public florist profile for your shop.
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600">
        This is the first operational step for Phase 1. It converts the
        signed-in user into a florist account and stores the marketplace-facing
        shop data.
      </p>

      {missingEnv.length > 0 ? (
        <div className="mt-8 rounded-3xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          Missing environment variables: {missingEnv.join(", ")}. Add them in
          `.env.local` before testing onboarding.
        </div>
      ) : null}

      <div className="mt-8 rounded-[2rem] border border-stone-300 bg-white/80 p-6 shadow-[0_18px_50px_rgba(120,53,15,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
              Account
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-900">
              {user.email}
            </h2>
          </div>
          <div className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-stone-50">
            {floristProfile ? "Profile exists" : "Profile not created yet"}
          </div>
        </div>
        <FloristOnboardingForm
          profile={profile}
          floristProfile={floristProfile}
        />
      </div>
    </main>
  );
}
