import Link from "next/link";

import { appShellLinks, buildPhases, roles } from "@/lib/app-config";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7ed_0%,_#f7f3ec_42%,_#efe6da_100%)] text-stone-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between border-b border-stone-300/70 pb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
              FloristSocial V1
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
              Marketplace, florist workflow and social layer on one platform.
            </h1>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-stone-900 px-5 py-2 text-sm font-semibold transition hover:bg-stone-900 hover:text-stone-50"
          >
            Open dashboard
          </Link>
        </header>

        <section className="grid gap-8 py-12 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <p className="max-w-3xl text-lg leading-8 text-stone-700 sm:text-xl">
              The first milestone is a real transaction flow: customer account,
              florist onboarding, product publishing, checkout with Stripe and
              payout visibility for the executing florist.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {appShellLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-3xl border border-stone-300 bg-white/75 p-5 shadow-[0_12px_40px_rgba(120,53,15,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(120,53,15,0.14)]"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-700">
                    {item.eyebrow}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-stone-300 bg-stone-950 p-6 text-stone-50 shadow-[0_20px_60px_rgba(28,25,23,0.35)]">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-300">
              Revenue split
            </p>
            <div className="mt-6 space-y-5">
              <div>
                <h2 className="text-lg font-semibold">Direct order</h2>
                <p className="mt-1 text-sm text-stone-300">
                  Stripe fee is deducted first. Net amount is split 80% to the
                  executor florist and 20% to FloristSocial.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Referral order</h2>
                <p className="mt-1 text-sm text-stone-300">
                  Stripe fee is deducted first. Net amount is split 80% to the
                  executor florist, 10% to the seller florist and 10% to
                  FloristSocial.
                </p>
              </div>
            </div>
            <div className="mt-8 border-t border-stone-700 pt-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
                Roles
              </p>
              <ul className="mt-4 space-y-2 text-sm text-stone-200">
                {roles.map((role) => (
                  <li
                    key={role}
                    className="rounded-full bg-stone-900 px-4 py-2"
                  >
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </section>

        <section className="py-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
                Build phases
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Technical foundation first, then commerce.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-stone-600">
              This structure is meant to keep the V1 honest: authentication,
              florist profiles, product listings, checkout and payout logic
              before the social feed grows deeper.
            </p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {buildPhases.map((phase) => (
              <article
                key={phase.name}
                className="rounded-3xl border border-stone-300 bg-white/80 p-6"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
                  {phase.name}
                </p>
                <h3 className="mt-3 text-xl font-semibold">{phase.title}</h3>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
                  {phase.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
