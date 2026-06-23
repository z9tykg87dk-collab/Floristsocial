import Link from "next/link";

import { OrderStatusTimeline } from "@/components/orders/order-status-timeline";
import { getOrderDetailsForCurrentUser, formatSek } from "@/lib/orders";

type OrderDetailsPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { orderId } = await params;
  const details = await getOrderDetailsForCurrentUser(orderId);

  if (!details) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
          Order details
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
          Order not found or access denied.
        </h1>
        <Link
          href="/orders"
          className="mt-8 inline-flex w-fit rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800"
        >
          Back to orders
        </Link>
      </main>
    );
  }

  const { order, items, payouts } = details;

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-6 border-b border-stone-300 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
            Order details
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
            Order #{order.order_number}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600">
            Recipient: {order.recipient_name}. This page is shared between
            customer and florist views so both sides can inspect the same order
            record.
          </p>
        </div>
        <div className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50">
          {order.status}
        </div>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <Metric label="Total" value={formatSek(order.total_amount)} />
        <Metric label="Source" value={order.source} />
        <Metric label="Stripe fee" value={formatSek(order.stripe_fee_amount)} />
        <Metric
          label="Delivery date"
          value={order.delivery_date || "Not set"}
        />
      </section>

      <section className="mt-8 rounded-[2rem] border border-stone-300 bg-white/85 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
          Order timeline
        </p>
        <div className="mt-6">
          <OrderStatusTimeline status={order.status} />
        </div>
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-stone-300 bg-white/85 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
            Delivery
          </p>
          <div className="mt-6 space-y-3 text-sm text-stone-700">
            <p>{order.delivery_address || "No delivery address"}</p>
            <p>
              {(order.delivery_postal_code || "No postal code") +
                " " +
                (order.delivery_city || "No city")}
            </p>
            <p>Recipient phone: {order.recipient_phone || "Not provided"}</p>
            <p>Card message: {order.card_message || "None"}</p>
            <p>Notes: {order.notes || "None"}</p>
          </div>
        </div>
        <div className="rounded-[2rem] border border-stone-300 bg-white/85 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
            Revenue split
          </p>
          <div className="mt-6 grid gap-3">
            <MetricRow
              label="Executor"
              value={formatSek(order.executor_amount)}
            />
            <MetricRow label="Seller" value={formatSek(order.seller_amount)} />
            <MetricRow
              label="Platform"
              value={formatSek(order.platform_amount)}
            />
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-stone-300 bg-white/85 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
          Order items
        </p>
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-stone-200 bg-stone-50 px-4 py-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-stone-900">
                    {item.product_title}
                  </h2>
                  <p className="mt-1 text-sm text-stone-600">
                    Quantity {item.quantity}
                  </p>
                </div>
                <div className="text-sm font-medium text-stone-900">
                  {formatSek(item.line_total_amount)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-stone-300 bg-white/85 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
          Payout records
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {payouts.map((payout) => (
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
                    {payout.recipient_role}
                  </p>
                </div>
                <div className="rounded-full bg-stone-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-50">
                  {payout.status}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-stone-300 bg-white/80 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
        {label}
      </p>
      <p className="mt-3 text-xl font-semibold text-stone-900">{value}</p>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-stone-50 px-4 py-4">
      <dt className="text-sm text-stone-600">{label}</dt>
      <dd className="text-sm font-medium text-stone-900">{value}</dd>
    </div>
  );
}
