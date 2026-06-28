import Link from "next/link";
import { ArrowLeft, ShoppingBag, Sparkles, Store } from "lucide-react";
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

export default async function PublicFloristInspirationPage({ params }: PageProps) {
  const { id } = await params;
  const { florist, posts } = await loadData(id);

  const name =
    text(florist?.shop_name, florist?.florist_name, florist?.profile_name) ||
    "Florist";

  const items = (posts as AnyRecord[])
    .filter((post) => imgFrom(post) || post.product_title || post.title || post.caption)
    .map((post, index) => {
      const title = text(post.product_title, post.title, post.caption) || "Blomsterinspiration";
      const price = priceFrom(post);

      return {
        id: post.id || `inspiration-${index}`,
        title,
        price,
        image: imgFrom(post) || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
        href: `/order/private/guest-v4?mode=directProduct&floristId=${id}&postId=${post.id || ""}&product=${encodeURIComponent(title)}&price=${encodeURIComponent(price)}`,
      };
    });

  const fallbackItems = Array.from({ length: 9 }).map((_, index) => {
    const title = `Blomsterinspiration ${index + 1}`;
    const price = index % 3 === 0 ? "från 500 kr" : index % 3 === 1 ? "från 750 kr" : "från 1 000 kr";

    return {
      id: `fallback-${index}`,
      title,
      price,
      image: FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
      href: `/order/private/guest-v4?mode=directProduct&floristId=${id}&product=${encodeURIComponent(title)}&price=${encodeURIComponent(price)}`,
    };
  });

  const visibleItems = items.length ? items : fallbackItems;

  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ef", color: "#1c1917" }}>
      <div style={{ width: 1240, margin: "0 auto", padding: "34px 0 80px" }}>
        <Link
          href={`/public/florist/${id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "#57534e",
            fontWeight: 850,
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={18} /> Tillbaka till profilen
        </Link>

        <section
          style={{
            marginTop: 18,
            borderRadius: 34,
            background: "white",
            border: "1px solid #e7e2dc",
            padding: 34,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 24 }}>
            <div>
              <div style={{ display: "inline-flex", gap: 8, alignItems: "center", color: "#e60073", fontWeight: 950 }}>
                <Store size={22} /> {name}
              </div>
              <h1 style={{ margin: "16px 0 0", fontSize: 48, lineHeight: 1, fontWeight: 950, letterSpacing: "-0.05em" }}>
                Blomsterinspiration
              </h1>
              <p style={{ margin: "14px 0 0", maxWidth: 760, fontSize: 16, lineHeight: 1.7, color: "#57534e" }}>
                Floristens publicerade bilder, produkter och inspirationsinlägg. Klick på en bild leder till beställningssidan.
              </p>
            </div>

            <Link
              href={`/public/florist/${id}/products`}
              style={{
                height: 52,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 16,
                background: "#e60073",
                color: "white",
                padding: "0 20px",
                fontWeight: 950,
                textDecoration: "none",
              }}
            >
              <ShoppingBag size={18} /> Sortiment
            </Link>
          </div>
        </section>

        <section
          style={{
            marginTop: 22,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 18,
          }}
        >
          {visibleItems.map((item) => (
            <Link key={item.id} href={item.href} style={{ color: "#1c1917", textDecoration: "none" }}>
              <article
                style={{
                  overflow: "hidden",
                  borderRadius: 24,
                  border: "1px solid #e7e2dc",
                  background: "white",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
                }}
              >
                <div style={{ height: 270, background: "#f5f5f4" }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 950, color: "#e60073" }}>
                    <Sparkles size={14} /> Inspiration
                  </div>
                  <h2 style={{ margin: "7px 0 0", fontSize: 17, fontWeight: 950 }}>
                    {item.title}
                  </h2>
                  <p style={{ margin: "5px 0 0", color: "#57534e", fontWeight: 850 }}>
                    {item.price}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
