import Link from "next/link";
import { ArrowLeft, Grid2X2, ShoppingBag, Store } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

type AnyRecord = Record<string, any>;

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1468327768560-75b778cbb551?q=80&w=900&auto=format&fit=crop",
];

const CATEGORIES = [
  "Buketter",
  "Bröllop",
  "Begravning",
  "Event",
  "Företagsblommor",
  "Växter",
  "Presentbox",
  "Portfolio",
];

function text(...values: any[]) {
  return values.find((v) => typeof v === "string" && v.trim())?.trim() || "";
}

function imgFrom(value: AnyRecord) {
  return text(
    value.image_thumbnail_url,
    value.image_medium_url,
    value.image_original_url,
    value.image_url,
    value.media_url,
    value.url,
    value.image?.url,
    value.public_url
  );
}

function priceFrom(value: AnyRecord) {
  const raw = value.base_price || value.price || value.amount || "";
  if (!raw) return "Pris på förfrågan";
  return String(raw).toLowerCase().includes("kr") ? String(raw) : `${raw} kr`;
}

function categoryFrom(value: AnyRecord) {
  const raw = text(value.category, value.service_name, value.serviceName, value.product_category, value.type);
  if (!raw) return "Portfolio";
  const found = CATEGORIES.find((cat) => raw.toLowerCase().includes(cat.toLowerCase()));
  return found || raw;
}

async function loadData(id: string) {
  const supabase = await createSupabaseServerClient();

  const { data: florist } = await supabase
    .from("florists")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const { data: posts } = await supabase
    .from("feed_items")
    .select("*")
    .eq("florist_id", id)
    .limit(120);

  return { florist, posts: posts || [] };
}

export default async function PublicFloristProductsPage({ params }: PageProps) {
  const { id } = await params;
  const { florist, posts } = await loadData(id);

  const name = text(florist?.shop_name, florist?.florist_name, florist?.profile_name) || "Florist";

  const products = (posts as AnyRecord[])
    .filter((post) => imgFrom(post) || post.is_shoppable || post.product_title || post.title)
    .map((post, index) => ({
      id: post.id || `item-${index}`,
      title: text(post.product_title, post.title, post.caption) || "Floristprodukt",
      price: priceFrom(post),
      category: categoryFrom(post),
      image: imgFrom(post) || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
      href: `/order/private/guest-v4?floristId=${id}&postId=${post.id || ""}&product=${encodeURIComponent(text(post.product_title, post.title, "Floristprodukt"))}`,
    }));

  const fallbackProducts = CATEGORIES.slice(0, 6).map((category, index) => ({
    id: `fallback-${category}`,
    title: category === "Buketter" ? "Säsongens bukett" : category,
    price: "Pris på förfrågan",
    category,
    image: FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
    href: `/order/private/guest-v4?floristId=${id}&category=${encodeURIComponent(category)}`,
  }));

  const visibleProducts = products.length ? products : fallbackProducts;

  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ef", color: "#1c1917" }}>
      <div style={{ width: 1240, margin: "0 auto", padding: "34px 0 80px" }}>
        <Link href={`/public/florist/${id}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#57534e", fontWeight: 850, textDecoration: "none" }}>
          <ArrowLeft size={18} /> Tillbaka till profilen
        </Link>

        <section style={{ marginTop: 18, borderRadius: 34, background: "white", border: "1px solid #e7e2dc", padding: 34 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 24, alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "inline-flex", gap: 8, alignItems: "center", color: "#e60073", fontWeight: 950 }}>
                <Store size={22} /> {name}
              </div>
              <h1 style={{ margin: "16px 0 0", fontSize: 48, lineHeight: 1, fontWeight: 950, letterSpacing: "-0.05em" }}>
                Sortiment & produkter
              </h1>
              <p style={{ margin: "14px 0 0", maxWidth: 720, fontSize: 16, lineHeight: 1.7, color: "#57534e" }}>
                Här visas floristens publicerade produkter, portfolio och kategorier. Klick på produkt leder till beställningssidan.
              </p>
            </div>
            <Link href={`/order/private/guest-v4?floristId=${id}`} style={{ height: 52, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 16, background: "#e60073", color: "white", padding: "0 20px", fontWeight: 950, textDecoration: "none" }}>
              <ShoppingBag size={18} /> Beställ
            </Link>
          </div>
        </section>

        <section style={{ marginTop: 22, display: "grid", gridTemplateColumns: "260px 1fr", gap: 24 }}>
          <aside style={{ borderRadius: 26, background: "white", border: "1px solid #e7e2dc", padding: 20, alignSelf: "start" }}>
            <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8, fontSize: 20, fontWeight: 950 }}>
              <Grid2X2 size={20} /> Kategorier
            </h2>
            <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
              {CATEGORIES.map((cat) => (
                <a key={cat} href={`#${encodeURIComponent(cat)}`} style={{ borderRadius: 14, background: "#fff7fb", border: "1px solid #ffe0ed", padding: "11px 13px", color: "#e60073", fontSize: 14, fontWeight: 900, textDecoration: "none" }}>
                  {cat}
                </a>
              ))}
            </div>
          </aside>

          <div style={{ display: "grid", gap: 26 }}>
            {CATEGORIES.map((category) => {
              const items = visibleProducts.filter((item) => item.category === category || (category === "Portfolio" && !CATEGORIES.includes(item.category)));
              if (!items.length) return null;

              return (
                <section key={category} id={encodeURIComponent(category)} style={{ borderRadius: 26, background: "white", border: "1px solid #e7e2dc", padding: 20 }}>
                  <h2 style={{ margin: 0, fontSize: 26, fontWeight: 950 }}>{category}</h2>
                  <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                    {items.map((item) => (
                      <Link key={item.id} href={item.href} style={{ color: "#1c1917", textDecoration: "none" }}>
                        <article style={{ overflow: "hidden", borderRadius: 22, border: "1px solid #e7e2dc", background: "white" }}>
                          <div style={{ height: 230, background: "#f5f5f4" }}>
                            <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          </div>
                          <div style={{ padding: 15 }}>
                            <div style={{ fontSize: 12, fontWeight: 950, color: "#e60073" }}>{item.category}</div>
                            <h3 style={{ margin: "6px 0 0", fontSize: 16, fontWeight: 950 }}>{item.title}</h3>
                            <p style={{ margin: "5px 0 0", color: "#57534e", fontWeight: 850 }}>{item.price}</p>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
