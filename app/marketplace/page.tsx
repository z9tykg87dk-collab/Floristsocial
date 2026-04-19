import Link from "next/link";

import { getDirectoryFlorist } from "@/lib/directory";
import { getMissingRequiredEnv } from "@/lib/env";
import { getMarketplaceProducts } from "@/lib/products";

type MarketplacePageProps = {
  searchParams: Promise<{
    seller?: string;
  }>;
};

export default async function MarketplacePage({
  searchParams,
}: MarketplacePageProps) {
  const params = await searchParams;
  const missingEnv = getMissingRequiredEnv().filter(
    (key) =>
      key === "NEXT_PUBLIC_SUPABASE_URL" ||
      key === "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
  const products = await getMarketplaceProducts();
  const sellerFlorist = params.seller
    ? await getDirectoryFlorist(params.seller)
    : null;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-6 border-b border-stone-300 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
            Marketplace
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
            Live florist products ready for browsing and future checkout.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600">
            This is the first public product surface. It reads active listings
            from Supabase and gives you a concrete foundation for product detail
            pages, carts and order creation.
          </p>
        </div>
        <div className="rounded-[2rem] border border-stone-300 bg-white/80 px-6 py-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
            Live products
          </p>
          <p className="mt-2 text-4xl font-semibold text-stone-900">
            {products.length}
          </p>
        </div>
      </div>

      {sellerFlorist ? (
        <div className="mt-8 rounded-[2rem] border border-amber-300 bg-amber-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
            Referral order
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-stone-900">
            Shopping via {sellerFlorist.shop_name}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">
            Orders placed from this view are marked as referral orders. After
            Stripe fees, the net amount is split 80% to the executor florist,
            10% to the seller florist and 10% to FloristSocial.
          </p>
        </div>
      ) : null}

      {missingEnv.length > 0 ? (
        <div className="mt-8 rounded-3xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          Missing environment variables: {missingEnv.join(", ")}. Add them in
          `.env.local` before testing marketplace data from Supabase.
        </div>
      ) : null}

      {products.length > 0 ? (
        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="rounded-[2rem] border border-stone-300 bg-white/85 p-6 shadow-[0_18px_50px_rgba(120,53,15,0.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
                    {product.category || "Marketplace"}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-stone-900">
                    {product.title}
                  </h2>
                </div>
                <div className="rounded-full bg-stone-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-50">
                  {product.price_amount} SEK
                </div>
              </div>
              <p className="mt-4 min-h-24 text-sm leading-6 text-stone-600">
                {product.description || "No description yet."}
              </p>
              <dl className="mt-6 grid gap-3 text-sm text-stone-600">
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-stone-50 px-4 py-3">
                  <dt>Slug</dt>
                  <dd className="font-medium text-stone-900">{product.slug}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-stone-50 px-4 py-3">
                  <dt>Occasion</dt>
                  <dd className="font-medium text-stone-900">
                    {product.occasion || "Not set"}
                  </dd>
                </div>
              </dl>
              <div className="mt-6">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={
                      sellerFlorist
                        ? `/checkout?product=${product.id}&seller=${sellerFlorist.id}`
                        : `/checkout?product=${product.id}`
                    }
                    className="inline-flex rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800"
                  >
                    {sellerFlorist ? "Buy as referral order" : "Buy now"}
                  </Link>
                  <Link
                    href={
                      sellerFlorist
                        ? `/marketplace/${product.id}?seller=${sellerFlorist.id}`
                        : `/marketplace/${product.id}`
                    }
                    className="inline-flex rounded-full border border-stone-900 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-900 hover:text-stone-50"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="mt-10 rounded-[2.5rem] border border-dashed border-stone-300 bg-white/60 p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
            No products yet
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-stone-900">
            The marketplace will populate after a florist publishes products.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            Complete florist onboarding, add a product in the dashboard and
            return here to verify the public listing flow.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800"
            >
              Open dashboard
            </Link>
            <Link
              href="/onboarding/florist"
              className="rounded-full border border-stone-900 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-900 hover:text-stone-50"
            >
              Finish florist onboarding
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
