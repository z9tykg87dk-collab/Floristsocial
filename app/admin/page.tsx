import Link from "next/link";

import { PayoutStatusForm } from "@/components/admin/payout-status-form";
import { getAdminOverview } from "@/lib/admin";
import { getMissingRequiredEnv } from "@/lib/env";
import { formatSek } from "@/lib/orders";

export default async function AdminPage() {
  const missingEnv = getMissingRequiredEnv();
  const overview = await getAdminOverview();

  if (!overview || overview.access === "signed_out") {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
          Admin
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
          Sign in with an admin account to view platform oversight.
        </h1>
        <Link
          href="/auth/sign-in?next=/admin"
          className="mt-8 inline-flex w-fit rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800"
        >
          Go to sign in
        </Link>
      </main>
    );
  }

if (overview.access === "forbidden") {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
        Admin
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
        You do not have access to this page.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
        Your current role is: <strong>{overview.profile?.role ?? "unknown"}</strong>.
        Only admins can access this page.
      </p>
      <Link
        href="/dashboard"
        className="mt-8 inline-flex w-fit rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800"
      >
        Go to dashboard
      </Link>
    </main>
  );
}

  const totalPlatformPayouts = overview.payouts
    .filter((payout) => payout.recipient_role === "admin")
    .reduce((sum, payout) => sum + payout.amount, 0);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-6 border-b border-stone-300 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
            Admin
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
            Platform oversight for onboarding, orders and payouts.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600">
            This V1 admin overview is intentionally narrow: profile status,
            florist readiness, order flow and payout visibility.
          </p>
        </div>
        <div className="rounded-[2rem] border border-stone-300 bg-white/80 px-6 py-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
            Admin role
          </p>
          <p className="mt-2 text-2xl font-semibold text-stone-900">
            {overview.profile.full_name || overview.profile.role}
          </p>
        </div>
      </div>

      {missingEnv.length > 0 ? (
        <div className="mt-8 rounded-3xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          Missing environment variables: {missingEnv.join(", ")}.
        </div>
      ) : null}

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <MetricCard label="Profiles" value={String(overview.profiles.length)} />
        <MetricCard label="Florists" value={String(overview.florists.length)} />
        <MetricCard label="Orders" value={String(overview.orders.length)} />
        <MetricCard
          label="Platform share"
          value={formatSek(totalPlatformPayouts)}
        />
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-stone-300 bg-white/85 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
            Latest florists
          </p>
          <div className="mt-6 space-y-3">
            {overview.florists.slice(0, 6).map((florist) => (
              <article
                key={florist.id}
                className="rounded-3xl border border-stone-200 bg-stone-50 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-stone-900">
                      {florist.shop_name}
                    </h2>
                    <p className="mt-1 text-sm text-stone-600">
                      {florist.city} · {florist.slug}
                    </p>
                  </div>
                  <div className="rounded-full bg-stone-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-50">
                    {florist.stripe_onboarding_complete
                      ? "Stripe ready"
                      : "Stripe pending"}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-stone-300 bg-white/85 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
            Latest orders
          </p>
          <div className="mt-6 space-y-3">
            {overview.orders.slice(0, 6).map((order) => (
              <article
                key={order.id}
                className="rounded-3xl border border-stone-200 bg-stone-50 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-stone-900">
                      Order #{order.order_number}
                    </h2>
                    <p className="mt-1 text-sm text-stone-600">
                      {order.recipient_name} · {order.source}
                    </p>
                  </div>
                  <div className="rounded-full bg-stone-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-50">
                    {order.status}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-4 text-sm">
                  <span className="text-stone-600">
                    {order.delivery_city || "No city"}
                  </span>
                  <span className="font-medium text-stone-900">
                    {formatSek(order.total_amount)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-stone-300 bg-white/85 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
          Payout records
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {overview.payouts.slice(0, 9).map((payout) => (
            <article
              key={payout.id}
              className="rounded-3xl border border-stone-200 bg-stone-50 px-4 py-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-stone-900">
                    {formatSek(payout.amount)}
                  </h2>
                  <p className="mt-1 text-sm text-stone-600">
                    {payout.recipient_role} · {payout.order_id}
                  </p>
                </div>
                <div className="rounded-full bg-stone-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-50">
                  {payout.status}
                </div>
              </div>
              <PayoutStatusForm
                payoutId={payout.id}
                currentStatus={payout.status}
              />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-stone-300 bg-white/80 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-stone-900">{value}</p>
    </div>
  );
}



