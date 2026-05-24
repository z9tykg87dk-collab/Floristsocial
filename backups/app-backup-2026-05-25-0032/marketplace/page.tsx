import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, Sparkles, Store, UserRound } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import FloristSocialHeader from "@/components/layout/FloristSocialHeader";
import FloristSocialFooter from "@/components/layout/FloristSocialFooter";

type MarketplaceItem = {
  id: string;
  florist_id: string | null;
  florist_name: string | null;
  florist_slug: string | null;
  florist_logo_url: string | null;
  caption: string | null;
  description: string | null;
  hashtags: string[] | string | null;
  media_type: string | null;
  image_thumbnail_url: string | null;
  image_medium_url: string | null;
  image_original_url: string | null;
  image_alt: string | null;
  is_shoppable: boolean | null;
  is_featured: boolean | null;
  is_sponsored: boolean | null;
  city: string | null;
  category: string | null;
  style: string | null;
  occasion: string | null;
  product_id: string | null;
  product_title: string | null;
  base_price: number | null;
  currency: string | null;
  allow_price_upgrade: boolean | null;
  seasonal_disclaimer: string | null;
  created_at: string;
};

const categoryChips = ["Alla", "Buketter", "Bröllop", "Begravning", "Event", "Företagsblommor", "Säsong"];
const priceChips = ["400+ kr", "600+ kr", "1000+ kr", "1500+ kr", "Premium"];

function pickImage(item: MarketplaceItem) {
  return item.image_thumbnail_url || item.image_medium_url || item.image_original_url || "";
}

function formatPrice(value: number | null, currency: string | null) {
  if (!value) return "Pris på förfrågan";
  if ((currency || "SEK") === "SEK") return `${Math.round(value)} kr`;
  return `${Math.round(value)} ${currency || ""}`.trim();
}

function productLink(item: MarketplaceItem) {
  const params = new URLSearchParams();
  if (item.product_id) params.set("productId", item.product_id);
  if (item.florist_id) params.set("floristId", item.florist_id);
  if (item.id) params.set("postId", item.id);
  if (item.product_title) params.set("title", item.product_title);
  if (item.base_price) params.set("price", String(item.base_price));
  return `/orders/new?${params.toString()}`;
}

function floristLink(item: MarketplaceItem) {
  if (item.florist_slug) return `/florist/${item.florist_slug}`;
  if (item.florist_id) return `/florist/${item.florist_id}`;
  return "/florists";
}

async function loadMarketplaceItems() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("feed_items")
    .select("*")
    .eq("is_shoppable", true)
    .not("product_id", "is", null)
    .limit(80);

  if (!error && data) {
    return { items: data as MarketplaceItem[], error: null };
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select(`
      id,
      post_id,
      florist_id,
      title,
      description,
      category,
      service_name,
      style,
      occasion,
      base_price,
      currency,
      image_thumbnail_url,
      image_medium_url,
      image_original_url,
      image_alt,
      is_featured,
      is_sponsored,
      allow_price_upgrade,
      seasonal_disclaimer,
      created_at
    `)
    .eq("is_public", true)
    .eq("is_active", true)
    .limit(80);

  if (productsError) return { items: [] as MarketplaceItem[], error: productsError };

  const mapped = (products || []).map((product: any) => ({
    id: product.post_id || product.id,
    florist_id: product.florist_id,
    florist_name: null,
    florist_slug: null,
    florist_logo_url: null,
    caption: null,
    description: product.description,
    hashtags: null,
    media_type: "image",
    image_thumbnail_url: product.image_thumbnail_url,
    image_medium_url: product.image_medium_url,
    image_original_url: product.image_original_url,
    image_alt: product.image_alt,
    is_shoppable: true,
    is_featured: product.is_featured,
    is_sponsored: product.is_sponsored,
    city: null,
    category: product.category,
    style: product.style,
    occasion: product.occasion,
    product_id: product.id,
    product_title: product.title,
    base_price: product.base_price,
    currency: product.currency,
    allow_price_upgrade: product.allow_price_upgrade,
    seasonal_disclaimer: product.seasonal_disclaimer,
    created_at: product.created_at,
  }));

  return { items: mapped as MarketplaceItem[], error: null };
}

export default async function MarketplacePage() {
  const { items, error } = await loadMarketplaceItems();
  const visibleItems = items.filter((item) => pickImage(item));
  const featured = visibleItems.find((item) => item.is_featured) || visibleItems[0];

  return (
    <>
      <FloristSocialHeader role="guest" country="SE" active="marketplace" />

      <main className="min-h-screen bg-[#fbf7f2] text-stone-900">
        <section className="mx-auto max-w-7xl px-5 py-8 md:px-10 lg:px-16">
          <header className="mb-8 overflow-hidden rounded-[40px] bg-gradient-to-br from-white via-pink-50 to-emerald-50 p-6 text-stone-900 shadow-xl ring-1 ring-stone-200/70 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-pink-700 shadow-sm ring-1 ring-pink-100">
                  <ShoppingBag size={16} /> FloristSocial Marketplace
                </div>
                <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">Köp vackra blomsterarrangemang.</h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
                  Upptäck köpbara buketter och arrangemang från FloristSocial-feed. Floristen skapar en liknande produkt utifrån bilden, säsong och tillgängliga blommor.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/feed" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-pink-600 px-5 text-sm font-bold !text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700">
                    <Sparkles size={18} /> Visa feed
                  </Link>
                  <Link href="/feed/new" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-600 px-5 text-sm font-bold !text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700">
                    <Store size={18} /> Skapa ny feed
                  </Link>
                </div>
              </div>

              {featured && (
                <Link href={productLink(featured)} className="group overflow-hidden rounded-[32px] bg-white p-3 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-stone-100">
                    <Image src={pickImage(featured)} alt={featured.image_alt || featured.product_title || "Köpbar floristprodukt"} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="420px" unoptimized />
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-bold uppercase tracking-wide text-pink-600">Utvald produkt</div>
                    <h2 className="mt-1 text-xl font-bold text-stone-900">{featured.product_title || featured.caption || "Köp liknande arrangemang"}</h2>
                    <div className="mt-2 font-bold text-stone-700">{formatPrice(featured.base_price, featured.currency)}</div>
                  </div>
                </Link>
              )}
            </div>
          </header>

          <section className="mb-8 rounded-[32px] bg-white p-4 shadow-sm ring-1 ring-stone-200/70">
            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {categoryChips.map((item) => (
                  <span key={item} className="shrink-0 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-bold text-stone-700">
                    {item}
                  </span>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input placeholder="Sök produkt, florist, stil..." className="h-11 w-full rounded-full border border-stone-200 bg-white px-4 pl-11 text-sm outline-none focus:border-stone-500" />
              </div>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {priceChips.map((item) => (
                <span key={item} className="shrink-0 rounded-full bg-pink-50 px-4 py-2 text-xs font-bold text-pink-700">
                  {item}
                </span>
              ))}
            </div>
          </section>

          {error && (
            <div className="rounded-3xl bg-red-50 p-6 text-sm font-medium text-red-700">
              Kunde inte ladda marketplace: {JSON.stringify(error)}
            </div>
          )}

          {!error && visibleItems.length === 0 && (
            <div className="rounded-[32px] border border-dashed border-stone-300 bg-white p-12 text-center shadow-sm">
              <ShoppingBag className="mx-auto text-stone-300" size={46} />
              <h2 className="mt-4 text-2xl font-bold">Inga köpbara produkter ännu</h2>
              <p className="mt-2 text-stone-600">Skapa en post med pris så visas den här automatiskt.</p>
              <Link href="/feed/new" className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-pink-600 px-6 text-sm font-bold !text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700">
                Skapa köpbar post
              </Link>
            </div>
          )}

          {!error && visibleItems.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleItems.map((item) => (
                <ProductCard key={`${item.product_id || item.id}`} item={item} />
              ))}
            </div>
          )}
        </section>
      </main>

      <FloristSocialFooter />
    </>
  );
}

function ProductCard({ item }: { item: MarketplaceItem }) {
  const imageUrl = pickImage(item);
  const price = formatPrice(item.base_price, item.currency);

  return (
    <article className="group overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-stone-200/70 transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={productLink(item)} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
          <Image src={imageUrl} alt={item.image_alt || item.product_title || "FloristSocial produkt"} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" unoptimized />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {item.is_sponsored && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">Sponsrad</span>}
            {item.is_featured && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Utvald</span>}
          </div>
          <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
            <div className="text-xs font-bold uppercase tracking-wide text-pink-600">Köp liknande</div>
            <div className="text-lg font-bold text-stone-900">{price}</div>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-stone-500">
          <UserRound size={14} />
          <Link href={floristLink(item)} className="truncate hover:text-stone-900">
            {item.florist_name || "FloristSocial florist"}
          </Link>
        </div>

        <h2 className="line-clamp-2 text-lg font-bold text-stone-900">{item.product_title || item.caption || "Köp liknande arrangemang"}</h2>
        {item.description && <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-500">{item.description}</p>}

        <div className="mt-3 flex flex-wrap gap-2">
          {item.category && <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600">{item.category}</span>}
          {item.style && <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-700">{item.style}</span>}
        </div>

        {item.seasonal_disclaimer && (
          <div className="mt-4 rounded-2xl bg-stone-50 p-3 text-xs leading-5 text-stone-500">
            {item.seasonal_disclaimer}
          </div>
        )}

        <Link href={productLink(item)} className="mt-4 flex h-12 items-center justify-center gap-2 rounded-2xl bg-pink-600 px-5 text-sm font-bold !text-white transition hover:bg-pink-700">
          <ShoppingBag size={16} /> Beställ / köp liknande
        </Link>
      </div>
    </article>
  );
}

