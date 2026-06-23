import Link from "next/link";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getCurrentUser } from "@/lib/auth";
import { getDirectoryFlorist } from "@/lib/directory";
import { getMissingRequiredEnv, getMissingStripeConnectEnv } from "@/lib/env";
import { getMarketplaceProduct } from "@/lib/products";

type CheckoutPageProps = {
  searchParams: Promise<{
    product?: string;
    seller?: string;
  }>;
};

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;
  const productId = params.product;
  const sellerId = params.seller;
  const user = await getCurrentUser();
  const missingEnv = getMissingRequiredEnv().filter(
    (key) =>
      key === "NEXT_PUBLIC_SUPABASE_URL" ||
      key === "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );
  const missingStripeEnv = getMissingStripeConnectEnv();
  const { product, floristProfile } = productId
    ? await getMarketplaceProduct(productId)
    : { product: null, floristProfile: null };
  const sellerFlorist = sellerId ? await getDirectoryFlorist(sellerId) : null;

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
          Checkout
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
          Sign in before placing an order.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
          This first checkout flow stores the order against the signed-in
          customer account before redirecting to Stripe Checkout.
        </p>
        <Link
          href={`/auth/sign-in?next=${encodeURIComponent(`/checkout?product=${productId ?? ""}`)}`}
          className="mt-8 inline-flex w-fit rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800"
        >
          Go to sign in
        </Link>
      </main>
    );
  }

  if (!product || !floristProfile) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
          Checkout
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
          Select a live product before checkout.
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
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
        Checkout
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
        Complete a direct order for {product.title}.
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600">
        This V1 checkout creates a direct order record first, then sends the
        customer to Stripe Checkout for payment.
      </p>
      {sellerFlorist ? (
        <div className="mt-8 rounded-[2rem] border border-amber-300 bg-amber-50 p-6 text-sm leading-6 text-stone-800">
          Referral order via{" "}
          <span className="font-semibold">{sellerFlorist.shop_name}</span>. Net
          payment will split 80% executor, 10% seller florist, 10% FloristSocial
          after Stripe fees.
        </div>
      ) : null}

      {missingEnv.length > 0 ? (
        <div className="mt-8 rounded-3xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          Missing Supabase environment variables: {missingEnv.join(", ")}.
        </div>
      ) : null}

      {missingStripeEnv.length > 0 ? (
        <div className="mt-8 rounded-3xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          Missing Stripe environment variables: {missingStripeEnv.join(", ")}.
        </div>
      ) : null}

      <div className="mt-8 rounded-[2rem] border border-stone-300 bg-white/85 p-6 shadow-[0_18px_50px_rgba(120,53,15,0.08)]">
        <CheckoutForm
          floristProfile={floristProfile}
          product={product}
          sellerFlorist={sellerFlorist}
        />
      </div>
    </main>
  );
}
