import Link from "next/link";

import { getMissingRequiredEnv } from "@/lib/env";
import { getDirectoryFlorists } from "@/lib/directory";

export default async function DirectoryPage() {
  const missingEnv = getMissingRequiredEnv().filter(
    (key) =>
      key === "NEXT_PUBLIC_SUPABASE_URL" ||
      key === "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
  const florists = await getDirectoryFlorists();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-6 border-b border-stone-300 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
            Florist directory
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
            Browse florist profiles that are ready for marketplace discovery.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600">
            This is the first public marketplace surface. It reads real florist
            onboarding data from Supabase and gives you a clear next build step:
            filters, profile pages and product browsing.
          </p>
        </div>
        <div className="rounded-[2rem] border border-stone-300 bg-white/80 px-6 py-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
            Active profiles
          </p>
          <p className="mt-2 text-4xl font-semibold text-stone-900">
            {florists.length}
          </p>
        </div>
      </div>

      {missingEnv.length > 0 ? (
        <div className="mt-8 rounded-3xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          Missing environment variables: {missingEnv.join(", ")}. Add them in
          `.env.local` before testing directory data from Supabase.
        </div>
      ) : null}

      {florists.length > 0 ? (
        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {florists.map((florist) => (
            <article
              key={florist.id}
              className="rounded-[2rem] border border-stone-300 bg-white/85 p-6 shadow-[0_18px_50px_rgba(120,53,15,0.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
                    {florist.city}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-stone-900">
                    {florist.shop_name}
                  </h2>
                </div>
                <div className="rounded-full bg-stone-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-50">
                  {florist.accepts_referrals ? "Referral ready" : "Direct only"}
                </div>
              </div>

              <p className="mt-4 line-clamp-4 min-h-24 text-sm leading-6 text-stone-600">
                {florist.bio || "No bio yet. This florist profile is live and ready for enrichment."}
              </p>

              <dl className="mt-6 grid gap-3 text-sm text-stone-600">
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-stone-50 px-4 py-3">
                  <dt>Slug</dt>
                  <dd className="font-medium text-stone-900">{florist.slug}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-stone-50 px-4 py-3">
                  <dt>Delivery radius</dt>
                  <dd className="font-medium text-stone-900">
                    {florist.delivery_radius_km
                      ? `${florist.delivery_radius_km} km`
                      : "Not set"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-stone-50 px-4 py-3">
                  <dt>Executor status</dt>
                  <dd className="font-medium text-stone-900">
                    {florist.fulfills_orders ? "Can execute orders" : "Paused"}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-3">
                {florist.accepts_referrals ? (
                  <Link
                    href={`/marketplace?seller=${florist.id}`}
                    className="rounded-full bg-stone-950 px-3 py-2 text-xs font-semibold text-stone-50 transition hover:bg-stone-800"
                  >
                    Shop via this florist
                  </Link>
                ) : null}
                {florist.instagram_handle ? (
                  <span className="rounded-full border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700">
                    @{florist.instagram_handle}
                  </span>
                ) : null}
                {florist.website_url ? (
                  <a
                    href={florist.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-stone-900 hover:text-stone-900"
                  >
                    Website
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="mt-10 rounded-[2.5rem] border border-dashed border-stone-300 bg-white/60 p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
            No florist profiles yet
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-stone-900">
            The directory will populate after the first florist finishes onboarding.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            Sign in, complete the florist onboarding flow, then return here to
            verify that public marketplace data is being read from Supabase.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/onboarding/florist"
              className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800"
            >
              Start florist onboarding
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-stone-900 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-900 hover:text-stone-50"
            >
              Open dashboard
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
