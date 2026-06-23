import Link from "next/link";

import { OrderStatusTimeline } from "@/components/orders/order-status-timeline";
import { getCurrentUser } from "@/lib/auth";
import { getMissingRequiredEnv } from "@/lib/env";
import { formatSek, getCustomerOrders } from "@/lib/orders";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  const missingEnv = getMissingRequiredEnv().filter(
    (key) =>
      key === "NEXT_PUBLIC_SUPABASE_URL" ||
      key === "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
          Order history
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
          Sign in to view your orders.
        </h1>
        <Link
          href="/auth/sign-in?next=/orders"
          className="mt-8 inline-flex w-fit rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800"
        >
          Go to sign in
        </Link>
      </main>
    );
  }

  const orders = await getCustomerOrders(user.id);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-6 border-b border-stone-300 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
            Order history
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
            Track customer orders and payment state.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600">
            This is the first customer-side order history view. It shows the
            order records created during checkout and updated by the Stripe
            webhook.
          </p>
        </div>
        <div className="rounded-[2rem] border border-stone-300 bg-white/80 px-6 py-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
            Orders
          </p>
          <p className="mt-2 text-4xl font-semibold text-stone-900">
            {orders.length}
          </p>
        </div>
      </div>

      {missingEnv.length > 0 ? (
        <div className="mt-8 rounded-3xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          Missing environment variables: {missingEnv.join(", ")}.
        </div>
      ) : null}

      {orders.length > 0 ? (
        <section className="mt-10 space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-[2rem] border border-stone-300 bg-white/85 p-6 shadow-[0_18px_50px_rgba(120,53,15,0.08)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
                    Order #{order.order_number}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-stone-900">
                    {order.recipient_name}
                  </h2>
                  <p className="mt-2 text-sm text-stone-600">
                    {order.delivery_address || "No address"} ·{" "}
                    {order.delivery_city || "No city"}
                  </p>
                </div>
                <div className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-stone-50">
                  {order.status}
                </div>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-4">
                <Stat label="Total" value={formatSek(order.total_amount)} />
                <Stat label="Source" value={order.source} />
                <Stat
                  label="Payment"
                  value={
                    order.stripe_payment_intent_id ? "Captured" : "Pending"
                  }
                />
                <Stat
                  label="Delivery date"
                  value={order.delivery_date || "Not set"}
                />
              </div>
              <div className="mt-6">
                <OrderStatusTimeline status={order.status} />
              </div>
              <div className="mt-6">
                <Link
                  href={`/orders/${order.id}`}
                  className="inline-flex rounded-full border border-stone-900 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-900 hover:text-stone-50"
                >
                  Open details
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="mt-10 rounded-[2.5rem] border border-dashed border-stone-300 bg-white/60 p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
            No orders yet
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-stone-900">
            Place the first order in the marketplace to populate this history.
          </h2>
          <div className="mt-8">
            <Link
              href="/marketplace"
              className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800"
            >
              Browse marketplace
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-stone-50 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-stone-900">{value}</p>
    </div>
  );
}
