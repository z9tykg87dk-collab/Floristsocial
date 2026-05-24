import Link from "next/link";

import { getDirectoryFlorist } from "@/lib/directory";
import { getMarketplaceProduct } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{
    productId: string;
  }>;
  searchParams: Promise<{
    seller?: string;
  }>;
};

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { productId } = await params;
  const { seller } = await searchParams;


  const { product, floristProfile } = await getMarketplaceProduct(productId);


  const sellerFlorist = seller
    ? await getDirectoryFlorist(seller)
    : null;

  if (!product || !floristProfile) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
        <h1 className="text-3xl font-semibold text-stone-900">
          Ingen produkt hittades
        </h1>
        <Link
          href="/marketplace"
          className="mt-6 inline-flex w-fit rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white"
        >
          Tillbaka till marketplace
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-semibold text-stone-900">
        {product.title}
      </h1>

      <p className="mt-4 text-lg text-stone-600">
        {product.description}
      </p>

      <div className="mt-6 text-xl font-semibold">
        {product.price_amount} {product.currency}
      </div>

      {sellerFlorist ? (
        <div className="mt-6 text-sm text-amber-700">
          Referral via {sellerFlorist.shop_name}
        </div>
      ) : null}

      <div className="mt-8">
        <Link
          href={
            sellerFlorist
              ? `/checkout?product=${product.id}&seller=${sellerFlorist.id}`
              : `/checkout?product=${product.id}`
          }
          className="inline-flex rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white"
        >
          Buy now
        </Link>
      </div>
    </main>
  );
}
