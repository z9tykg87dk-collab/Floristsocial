import Link from "next/link";

type CheckoutCancelPageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function CheckoutCancelPage({
  searchParams,
}: CheckoutCancelPageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
        Checkout cancelled
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
        The Stripe Checkout session was not completed.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
        Order reference: {params.order ?? "pending"}. The order record still
        exists in `pending_payment`, which is useful while the webhook and retry
        flow are being built.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/marketplace"
          className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800"
        >
          Back to marketplace
        </Link>
        <Link
          href="/dashboard"
          className="rounded-full border border-stone-900 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-900 hover:text-stone-50"
        >
          Open dashboard
        </Link>
      </div>
    </main>
  );
}
