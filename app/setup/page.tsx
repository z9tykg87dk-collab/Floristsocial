import Link from "next/link";

import { getDeploymentHealth } from "@/lib/health";

export default async function SetupPage() {
  const health = await getDeploymentHealth();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-6 border-b border-stone-300 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
            Setup and health
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
            Deployment readiness for FloristSocial.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600">
            Use this page before pushing to Vercel or after changing environment
            variables. It checks the minimum launch path: env, Supabase and
            Stripe server access.
          </p>
        </div>
        <div
          className={`rounded-[2rem] px-6 py-5 ${
            health.overallStatus === "ok"
              ? "bg-emerald-50 text-emerald-900"
              : health.overallStatus === "warning"
                ? "bg-amber-50 text-amber-900"
                : "bg-red-50 text-red-900"
          }`}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.24em]">
            Overall
          </p>
          <p className="mt-2 text-3xl font-semibold">{health.overallStatus}</p>
        </div>
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        {health.checks.map((check) => (
          <article
            key={check.name}
            className="rounded-[2rem] border border-stone-300 bg-white/85 p-6 shadow-[0_18px_50px_rgba(120,53,15,0.08)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
                  {check.name}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-stone-900">
                  {check.description}
                </h2>
              </div>
              <div
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  check.status === "ok"
                    ? "bg-emerald-100 text-emerald-900"
                    : check.status === "warning"
                      ? "bg-amber-100 text-amber-900"
                      : "bg-red-100 text-red-900"
                }`}
              >
                {check.status}
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-stone-600">
              {check.details}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-[2rem] border border-stone-300 bg-white/85 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
          Next steps
        </p>
        <div className="mt-4 grid gap-3 text-sm leading-6 text-stone-700">
          <p>1. Apply both Supabase migrations.</p>
          <p>2. Fill `.env.local` and mirror the same values in Vercel.</p>
          <p>3. Point Stripe webhooks to `/api/stripe/webhook` in test mode first.</p>
          <p>4. Run one florist onboarding, one direct order and one referral order end to end.</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/api/health"
            className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800"
          >
            Open API health
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-stone-900 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-900 hover:text-stone-50"
          >
            Open admin
          </Link>
        </div>
      </section>
    </main>
  );
}
