import Link from "next/link";

import { getDirectoryFlorist } from "@/lib/directory";
import { getMarketplaceProduct } from "@/lib/products";

type ProductDetailsPageProps = {
  params: Promise<{
    productId: string;
  }>;
  searchParams: Promise<{
    seller?: string;
  }>;
};

export default async function ProductDetailsPage({
  params,
  searchParams,
}: ProductDetailsPageProps) {
  const { productId } = await params;
  const { seller } = await searchParams;
  const { product, floristProfile } = await getMarketplaceProduct(productId);
  const sellerFlorist = seller ? await getDirectoryFlorist(seller) : null;

  if (!product || !floristProfile) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
          Product
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
          Product not found.
        </h1>
        <Link
          href="/marketplace"
          className="mt-8 inline-flex w-fit rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800"
        >
          Back to marketplace
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-16">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2.5rem] border border-stone-300 bg-white/85 p-8 shadow-[0_18px_50px_rgba(120,53,15,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
            Product details
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-stone-900">
            {product.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-stone-600">
            {product.description || "No description yet."}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <DetailCard label="Price" value={`${product.price_amount} SEK`} />
            <DetailCard
              label="Category"
              value={product.category || "Not set"}
            />
            <DetailCard
              label="Occasion"
              value={product.occasion || "Not set"}
            />
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-[2rem] border border-stone-300 bg-stone-950 p-6 text-stone-50">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
              Florist
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              {floristProfile.shop_name}
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-300">
              {floristProfile.bio || "This florist profile is ready for marketplace orders."}
            </p>
            <div className="mt-6 grid gap-3 text-sm text-stone-200">
              <div className="rounded-2xl bg-stone-900 px-4 py-3">
                {floristProfile.city}
              </div>
              <div className="rounded-2xl bg-stone-900 px-4 py-3">
                Delivery radius:{" "}
                {floristProfile.delivery_radius_km
                  ? `${floristProfile.delivery_radius_km} km`
                  : "Not set"}
              </div>
            </div>
          </div>

          {sellerFlorist ? (
            <div className="rounded-[2rem] border border-amber-300 bg-amber-50 p-6 text-stone-800">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
                Referral order
              </p>
              <p className="mt-3 text-sm leading-6">
                Shopping via {sellerFlorist.shop_name}. Net payment splits 80%
                executor, 10% seller florist, 10% FloristSocial after Stripe fees.
              </p>
            </div>
          ) : null}

          <div className="rounded-[2rem] border border-stone-300 bg-white/85 p-6">
            <div className="flex flex-wrap gap-3">
              <Link
                href={
                  sellerFlorist
                    ? `/checkout?product=${product.id}&seller=${sellerFlorist.id}`
                    : `/checkout?product=${product.id}`
                }
                className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800"
              >
                {sellerFlorist ? "Buy as referral order" : "Buy now"}
              </Link>
              <Link
                href={
                  sellerFlorist
                    ? `/marketplace?seller=${sellerFlorist.id}`
                    : "/marketplace"
                }
                className="rounded-full border border-stone-900 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-900 hover:text-stone-50"
              >
                Back to marketplace
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-stone-300 bg-stone-50 px-5 py-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
        {label}
      </p>
      <p className="mt-3 text-lg font-semibold text-stone-900">{value}</p>
    </div>
  );
}
