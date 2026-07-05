import Link from "next/link";
import {
  Bell,
  Box,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Gift,
  Globe2,
  Languages,
  Mail,
  Palette,
  Sparkles,
  ChevronDown,
  Clock,
  FileText,
  Grid2X2,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Package,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  UserRound,
  Video,
} from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

type Florist = Record<string, any>;
type FeedItem = Record<string, any>;

type ProductCard = {
  title: string;
  price: string;
  image: string;
  href: string;
};

type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  serviceName: string;
  image: string;
};

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1800&auto=format&fit=crop";

const FALLBACK_SHOP =
  "https://images.unsplash.com/photo-1487070183336-b863922373d4?q=80&w=1200&auto=format&fit=crop";

const FALLBACK_PRODUCTS = [
  "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1468327768560-75b778cbb551?q=80&w=900&auto=format&fit=crop",
];

const FALLBACK_DELIVERY = [
  { city: "Stockholm innerstad", price: 79 },
  { city: "Södermalm", price: 89 },
  { city: "Kungsholmen", price: 89 },
  { city: "Nacka", price: 129 },
  { city: "Solna", price: 129 },
];

const DAY_NAMES = [
  "Måndag",
  "Tisdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lördag",
  "Söndag",
];
const SHORT_DAYS = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];
const SERVICE_OPTIONS = [
  "Bröllop",
  "Begravning",
  "Event",
  "Företagsblommor",
  "Buketter",
  "Blombud",
  "Prenumerationer",
  "Samma dag-leverans",
  "Hotell & restaurang",
  "Workshops",
  "Hemleverans",
  "Skyltfönster & installationer",
  "Krukväxter",
];

const STYLE_OPTIONS = [
  "Romantiskt",
  "Modernt",
  "Vilt & organiskt",
  "Klassiskt",
  "Minimalistiskt",
  "Färgstarkt",
  "Lyxigt",
  "Nordiskt",
  "Säsongsbaserat",
  "Exklusivt",
];


function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function asArray(value: any) {
  return Array.isArray(value) ? value : [];
}

function asObject(value: any) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function text(...values: any[]) {
  return (
    values
      .find((value) => typeof value === "string" && value.trim().length > 0)
      ?.trim() || ""
  );
}

function labelFromItem(value: any) {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (typeof value === "object") {
    return text(
      value.label,
      value.title,
      value.name,
      value.serviceName,
      value.service_name,
      value.category,
      value.style,
      value.value,
    );
  }
  return "";
}

function labelsFromArray(value: any) {
  return asArray(value)
    .map(labelFromItem)
    .filter((item) => item && item.length > 0);
}

function uniqueLabels(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function collectRegisteredServices(florist: Florist) {
  const rawLabels = [
    ...labelsFromArray(florist.services),
    ...labelsFromArray(florist.specialties),
    ...labelsFromArray(florist.specialities),
    ...labelsFromArray(florist.service_specialties),
    ...labelsFromArray(florist.selected_services),
    ...labelsFromArray(florist.offered_services),
    ...labelsFromArray(florist.categories),
    ...Object.keys(asObject(florist.service_portfolio_items)),
  ];

  const searchable = [
    ...rawLabels,
    text(florist.offer),
    text(florist.bio),
    text(florist.description),
  ]
    .join(" ")
    .toLowerCase();

  const matched = SERVICE_OPTIONS.filter((option) =>
    searchable.includes(option.toLowerCase()),
  );

  const custom = rawLabels.filter(
    (label) =>
      !SERVICE_OPTIONS.some(
        (option) => option.toLowerCase() === label.toLowerCase(),
      ),
  );

  return uniqueLabels([...matched, ...custom]);
}

function collectRegisteredStyles(florist: Florist) {
  const rawLabels = [
    ...labelsFromArray(florist.styles),
    ...labelsFromArray(florist.design_styles),
    ...labelsFromArray(florist.selected_styles),
    ...labelsFromArray(florist.florist_styles),
    ...labelsFromArray(florist.style_options),
  ];

  const searchable = [
    ...rawLabels,
    text(florist.style),
    text(florist.design_style),
    text(florist.bio),
    text(florist.description),
  ]
    .join(" ")
    .toLowerCase();

  const matched = STYLE_OPTIONS.filter((option) =>
    searchable.includes(option.toLowerCase()),
  );

  const custom = rawLabels.filter(
    (label) =>
      !STYLE_OPTIONS.some(
        (option) => option.toLowerCase() === label.toLowerCase(),
      ),
  );

  return uniqueLabels([...matched, ...custom]);
}

function imgFrom(value: any) {
  if (!value) return "";
  if (typeof value === "string") return value;

  return text(
    value.url,
    value.publicUrl,
    value.public_url,
    value.previewUrl,
    value.preview_url,
    value.storageUrl,
    value.storage_url,
    value.image_url,
    value.imageUrl,
    value.image_medium_url,
    value.image_original_url,
    value.file_url,
    value.fileUrl,
    value.src,
    value.path,
    value.image?.url,
    value.image?.publicUrl,
    value.image?.public_url,
  );
}

function safeImage(value: string, fallback: string) {
  return value && value.length > 8 ? value : fallback;
}

function postImage(post: FeedItem) {
  return text(
    post.image_thumbnail_url,
    post.image_medium_url,
    post.image_original_url,
    post.image_url,
    post.media_url,
    post.url,
  );
}

function formatPrice(value: any, currency = "SEK") {
  if (value === null || value === undefined || value === "") return "";
  const raw = String(value).trim();
  if (!raw) return "";
  if (raw.toLowerCase().includes("kr")) return raw;
  return currency === "SEK" ? `${raw} kr` : `${raw} ${currency}`;
}

function getName(florist: Florist) {
  return (
    text(
      florist.shop_name,
      florist.florist_name,
      florist.profile_name,
      florist.name,
    ) || "Florist"
  );
}

function getCity(florist: Florist) {
  return (
    text(florist.city, florist.municipality, florist.county) || "Stockholm"
  );
}

function getAddress(florist: Florist) {
  const street = text(
    florist.street_address,
    florist.address,
    florist.company_address,
    florist.address_line_1,
  );
  const postal = text(florist.postal_code, florist.zip, florist.zip_code);
  const city = getCity(florist);
  const country = text(florist.country) || "Sweden";

  if (!street && !postal)
    return `${city} / ${country === "Sverige" ? "Sweden" : country}`;
  return (
    [street, postal, city].filter(Boolean).join(" ") +
    ` / ${country === "Sverige" ? "Sweden" : country}`
  );
}

function normalizeHours(hours: any[]) {
  return hours.map((day, index) => ({
    label:
      text(day.dayLabel, day.label, day.day) ||
      DAY_NAMES[index] ||
      `Dag ${index + 1}`,
    short: text(day.shortLabel) || SHORT_DAYS[index] || "Dag",
    closed: Boolean(day.isClosed || day.closed),
    open: text(day.openTime, day.open, day.opens, day.from) || "",
    close: text(day.closeTime, day.close, day.closes, day.to) || "",
  }));
}

function todayIndexMondayFirst() {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

function getTodayStatus(hours: any[]) {
  const normalized = normalizeHours(hours);
  if (!normalized.length) return { text: "Idag 10:00–18:00", openNow: true };

  const today = normalized[todayIndexMondayFirst()] || normalized[0];
  if (!today || today.closed) return { text: "Idag stängt", openNow: false };

  const open = today.open || "10:00";
  const close = today.close || "18:00";
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = open.split(":").map(Number);
  const [ch, cm] = close.split(":").map(Number);
  const openMinutes = (oh || 0) * 60 + (om || 0);
  const closeMinutes = (ch || 0) * 60 + (cm || 0);

  return {
    text: `Idag ${open}–${close}`,
    openNow: current >= openMinutes && current <= closeMinutes,
  };
}

function getHoursSummary(hours: any[]) {
  const openDays = normalizeHours(hours).filter((day) => !day.closed);
  if (!openDays.length) return "Öppettider ej angivna";

  const weekdays = openDays.filter((day) =>
    ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"].includes(day.label),
  );
  const saturday = openDays.find((day) => day.label === "Lördag");
  const first = weekdays[0] || openDays[0];
  const last = weekdays[weekdays.length - 1] || openDays[openDays.length - 1];
  const weekdayText = `${first.short}–${last.short} ${first.open || "10:00"}–${first.close || "18:00"}`;

  return saturday
    ? `${weekdayText}  &  Lör ${saturday.open || "11:00"}–${saturday.close || "14:00"}`
    : weekdayText;
}

function buildPortfolio(florist: Florist) {
  const serviceItems = Object.entries(
    asObject(florist.service_portfolio_items),
  ).flatMap(([serviceName, items]) =>
    asArray(items).map((item: any, index: number) => ({
      id: item.id || `${serviceName}-${index}`,
      title: text(item.title, item.name) || serviceName,
      description: text(item.description, item.text),
      price: item.price || item.base_price || "",
      serviceName,
      image: imgFrom(item),
    })),
  );

  const generalItems = asArray(florist.general_portfolio_items).map(
    (item: any, index: number) => ({
      id: item.id || `general-${index}`,
      title: text(item.title, item.name) || `Portfolio ${index + 1}`,
      description: text(item.description, item.text),
      price: item.price || item.base_price || "",
      serviceName:
        text(item.serviceName, item.service_name, item.category) || "Portfolio",
      image: imgFrom(item),
    }),
  );

  const oldImages = asArray(florist.portfolio_images).map(
    (item: any, index: number) => ({
      id: `old-${index}`,
      title: text(item.title, item.name) || `Portfolio ${index + 1}`,
      description: text(item.description, item.text),
      price: item.price || "",
      serviceName: "Portfolio",
      image: imgFrom(item),
    }),
  );

  return [...serviceItems, ...generalItems, ...oldImages].filter(
    (item) => item.image && item.image.length > 5,
  ) as PortfolioItem[];
}

function splitDescription(value: string, name: string) {
  const fallback = `${name} skapar unika blomsterarrangemang med passion, kreativitet och kärlek till detaljer.`;
  const parts = (value || fallback)
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    about: parts[0] || fallback,
    note:
      parts.slice(1).join("\n\n") || "Varje bukett berättar en historia – din.",
  };
}

async function loadFloristProfile(slugOrId: string) {
  const supabase = await createSupabaseServerClient();
  const lookupColumn = isUuid(slugOrId) ? "id" : "slug";

  let { data: florist, error } = await supabase
    .from("florists")
    .select("*")
    .eq(lookupColumn, slugOrId)
    .maybeSingle();

  if (!florist && lookupColumn === "slug") {
    const fallback = await supabase
      .from("florists")
      .select("*")
      .eq("profile_name", slugOrId)
      .maybeSingle();
    florist = fallback.data;
    error = fallback.error;
  }

  if (error || !florist) return { florist: null, posts: [] as FeedItem[] };

  const { data: posts } = await supabase
    .from("feed_items")
    .select("*")
    .eq("florist_id", florist.id)
    .limit(80);
  return { florist, posts: (posts || []) as FeedItem[] };
}

export default async function FloristSocialProfilePage({ params }: PageProps) {
  const { id } = await params;
  const { florist, posts } = await loadFloristProfile(id);

  if (!florist) {
    return (
      <>
        <main
          style={{
            minHeight: "100vh",
            minWidth: 1480,
            background: "#f7f4ef",
            display: "grid",
            placeItems: "center",
          }}
        >
          <section
            style={{
              width: 420,
              borderRadius: 28,
              background: "white",
              padding: 36,
              textAlign: "center",
              boxShadow: "0 14px 45px rgba(15,23,42,0.08)",
              border: "1px solid #e7e2dc",
            }}
          >
            <Store style={{ margin: "0 auto", color: "#d6d3d1" }} size={48} />
            <h1 style={{ marginTop: 18, fontSize: 30, fontWeight: 900 }}>
              Florist hittades inte
            </h1>
            <p style={{ marginTop: 12, color: "#57534e" }}>
              Vi kunde inte hitta floristprofilen du försökte öppna.
            </p>
          </section>
        </main>
      </>
    );
  }

  const name = getName(florist);
  const services = collectRegisteredServices(florist);
  const styles = collectRegisteredStyles(florist);
  const openingHours = asArray(florist.opening_hours);
  const today = getTodayStatus(openingHours);
  const description = splitDescription(
    text(florist.bio, florist.description),
    name,
  );
  const portfolio = buildPortfolio(florist);
  const imagePosts = posts.filter((post) => postImage(post) || post.video_url);
  const shopPosts = imagePosts.filter((post) => post.is_shoppable);
  const deliveryAreas = asArray(florist.delivery_areas);
  const deliveryList = deliveryAreas.length ? deliveryAreas : FALLBACK_DELIVERY;

  const logo = text(florist.logo_url, florist.profile_image_url);
  const firstPostWithImage = imagePosts.find((post) => postImage(post));
  const cover = safeImage(
    text(
      florist.cover_image_url,
      firstPostWithImage ? postImage(firstPostWithImage) : "",
    ),
    FALLBACK_COVER,
  );
  const aboutImage = safeImage(
    text(
      florist.shop_image_url,
      florist.storefront_image_url,
      portfolio[0]?.image,
    ),
    FALLBACK_SHOP,
  );

  const productFallbacks = portfolio.length
    ? portfolio.slice(0, 3).map((item) => item.image)
    : FALLBACK_PRODUCTS;

  const realProducts = shopPosts
    .slice(0, 3)
    .map((post, index) => ({
      title:
        text(post.product_title, post.title, post.caption) || "Floristprodukt",
      price:
        formatPrice(post.base_price || post.price, post.currency || "SEK") ||
        "Pris på förfrågan",
      image: safeImage(
        postImage(post),
        productFallbacks[index] || FALLBACK_COVER,
      ),
      href: `/orders/new?floristId=${florist.id}&postId=${post.id}`,
    }))
    .filter((item) => item.image && item.image.length > 5);

  const products: ProductCard[] = realProducts.length
    ? realProducts
    : ["Bukett Rosa Dröm", "Röda rosor", "Säsongens bukett"].map(
        (title, index) => ({
          title,
          price:
            index === 0
              ? "från 599 kr"
              : index === 1
                ? "från 499 kr"
                : "från 449 kr",
          image:
            productFallbacks[index] ||
            FALLBACK_PRODUCTS[index] ||
            FALLBACK_COVER,
          href: `/orders/new?floristId=${florist.id}`,
        }),
      );

  const portfolioPreview = portfolio.length
    ? portfolio.slice(0, 3)
    : products.map((product, index) => ({
        id: `product-${index}`,
        title: product.title,
        description: "",
        price: product.price,
        serviceName: "Portfolio",
        image: product.image,
      }));

  return (
    <>
      <main
        style={{
          minWidth: 1480,
          background: "#f7f4ef",
          color: "#1c1917",
          paddingBottom: 80,
        }}
      >
        <div style={{ width: 1440, margin: "0 auto", padding: "18px 0" }}>
          <section
            style={{
              overflow: "hidden",
              borderRadius: 32,
              background: "white",
              border: "1px solid #e7e2dc",
              boxShadow: "0 14px 45px rgba(15,23,42,0.06)",
            }}
          >
            <div
              style={{ height: 160, overflow: "hidden", background: "#e7e5e4" }}
            >
              <img
                src={cover}
                alt={name}
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>

            <div style={{ padding: "0 42px 34px", position: "relative" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "165px 1fr 620px",
                  gap: 24,
                }}
              >
                <div>
                  <div
                    style={{
                      position: "relative",
                      marginTop: -48,
                      height: 132,
                      width: 132,
                      overflow: "hidden",
                      borderRadius: 999,
                      border: "7px solid white",
                      background: "white",
                      boxShadow: "0 16px 35px rgba(15,23,42,0.16)",
                    }}
                  >
                    {logo ? (
                      <img
                        src={logo}
                        alt={`${name} logotyp`}
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: "100%",
                          display: "grid",
                          placeItems: "center",
                          color: "#a8a29e",
                        }}
                      >
                        <UserRound size={48} />
                      </div>
                    )}
                    <span
                      style={{
                        position: "absolute",
                        right: 12,
                        bottom: 16,
                        height: 18,
                        width: 18,
                        borderRadius: 999,
                        border: "2px solid white",
                        background: today.openNow ? "#22c55e" : "#ef4444",
                      }}
                    />
                  </div>
                </div>

                <div style={{ paddingTop: 44 }}>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: name.length > 24 ? 42 : 56,
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      fontWeight: 950,
                      maxWidth: 520,
                      wordBreak: "break-word",
                    }}
                  >
                    {name}
                  </h1>
                  <div
                    style={{
                      marginTop: 13,
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      columnGap: 20,
                      rowGap: 8,
                      fontSize: 14,
                      color: "#44403c",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontWeight: 700,
                      }}
                    >
                      <span
                        style={{
                          height: 11,
                          width: 11,
                          borderRadius: 999,
                          background: today.openNow ? "#22c55e" : "#ef4444",
                        }}
                      />
                      {today.openNow
                        ? "Online på FloristSocial"
                        : "Stängt just nu"}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <MapPin size={16} />
                      {getAddress(florist)}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Clock size={16} />
                      {getHoursSummary(openingHours)}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    paddingTop: 52,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                    gap: 14,
                  }}
                >
                  <MapButton name={name} address={getAddress(florist)} />
                  <Action
                    href={`/messages/new?floristId=${florist.id}`}
                    icon={<MessageCircle size={18} />}
                    primary
                  >
                    Chatta
                  </Action>
                  <Action
                    href={`/calls/audio?floristId=${florist.id}`}
                    icon={<Phone size={18} />}
                  >
                    Ljudsamtal
                  </Action>
                  <Action
                    href={`/calls/video?floristId=${florist.id}`}
                    icon={<Video size={18} />}
                  >
                    Video
                  </Action>
                  <Action
                    href={`/orders/new?floristId=${florist.id}`}
                    icon={<ShoppingBag size={18} />}
                    primary
                  >
                    Beställ
                  </Action>
                </div>
              </div>

              <div
                style={{
                  marginTop: 36,
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 24,
                }}
              >
                <InfoCard
                  icon={<Store size={25} />}
                  label="Butik"
                  value={
                    text(
                      florist.street_address,
                      florist.address,
                      florist.company_address,
                      florist.address_line_1,
                    ) || getAddress(florist)
                  }
                />
                <InfoCard
                  icon={<Truck size={25} />}
                  label="Leveransradie"
                  value={`${florist.delivery_radius_km || 15} km`}
                />
                <InfoCard
                  icon={<Clock size={25} />}
                  label="Svarar snabbt"
                  value="Vanligtvis inom några minuter"
                />
                <InfoCard
                  icon={<ShoppingBag size={25} />}
                  label="Medlem sedan"
                  value={
                    florist.created_at
                      ? new Date(florist.created_at).getFullYear().toString()
                      : "2026"
                  }
                />
              </div>

              <section
                style={{
                  marginTop: 18,
                  borderRadius: 26,
                  background: "white",
                  border: "1px solid #e7e2dc",
                  padding: 16,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "340px 1fr",
                    gap: 28,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      height: 170,
                      overflow: "hidden",
                      borderRadius: 20,
                      background: "#f5f5f4",
                    }}
                  >
                    <img
                      src={aboutImage}
                      alt={name}
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: 24,
                        fontWeight: 950,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      Om {name}
                    </h2>
                    <EditableField
                      fieldName="bio"
                      href={`/florist-dashboard/profile?section=about&floristId=${florist.id}`}
                    >
                      {description.about}
                    </EditableField>
                    <EditableField
                      fieldName="description"
                      href={`/florist-dashboard/profile?section=note&floristId=${florist.id}`}
                      muted
                    >
                      {description.note}
                    </EditableField>
                    <div
                      style={{
                        marginTop: 16,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 9,
                      }}
                    >
                      {services.slice(0, 8).map((service) => (
                        <PinkTag key={service}>{service}</PinkTag>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </section>

          <section
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
            }}
          >
            <FeaturePill
              icon={<Globe2 size={22} />}
              title="Leverans över hela världen"
              text="Internationella beställningar, företagsgåvor och specialleveranser kan hanteras via FloristSocial."
            />
            <FeaturePill
              icon={<CalendarDays size={22} />}
              title="Högtidskalender"
              text="Högtider per land, årsdagar och födelsedagar med påminnelser via e-post eller SMS."
              href="/holiday-calendar"
            />
            <FeaturePill
              icon={<Gift size={22} />}
              title="Presentkort"
              text="Köp digitala presentkort och skicka till mottagaren via e-post eller SMS."
              href="/gift-cards"
            />
          </section>

          <section
            style={{
              marginTop: 20,
              borderRadius: 26,
              background: "white",
              padding: 20,
              boxShadow: "0 10px 35px rgba(15,23,42,0.04)",
              border: "1px solid #e7e2dc",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
                marginBottom: 16,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: 950,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Populärt just nu
                </h2>
                <p
                  style={{ margin: "5px 0 0", fontSize: 14, color: "#78716c" }}
                >
                  Trendande buketter, högtider och presentidéer på
                  FloristSocial.
                </p>
              </div>
              <Link
                href="/popular"
                style={{
                  fontSize: 14,
                  fontWeight: 950,
                  color: "#e60073",
                  textDecoration: "none",
                }}
              >
                Visa populärt →
              </Link>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 14,
              }}
            >
              <PopularCard
                icon={<Sparkles size={22} />}
                title="Säsongens buketter"
                text="Aktuella färger, blommor och stilar."
              />
              <PopularCard
                icon={<CalendarDays size={22} />}
                title="Kommande högtider"
                text="Planera beställningar i god tid."
              />
              <PopularCard
                icon={<Gift size={22} />}
                title="Presentkort"
                text="Digital gåva med valfri hälsning."
              />
              <PopularCard
                icon={<Globe2 size={22} />}
                title="Internationellt"
                text="Skicka omtanke över gränser."
              />
            </div>
          </section>

          <section
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 28,
            }}
          >
            <Panel
              title="Sortiment & produkter"
              link="Visa alla produkter"
              href={`/marketplace?floristId=${florist.id}`}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                }}
              >
                {products.slice(0, 3).map((product) => (
                  <ProductMini key={product.title} {...product} />
                ))}
              </div>
            </Panel>

            <Panel
              title="Leveransområden & priser"
              link="Visa alla områden och priser"
              href="#delivery"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 8,
                  borderBottom: "1px solid #f5f5f4",
                  paddingBottom: 13,
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: 850,
                  color: "#e60073",
                }}
              >
                <MiniMetric
                  href={`/marketplace?filter=delivery-fee`}
                  icon={<Truck size={17} />}
                  label="Bud avgift"
                  value={formatPrice(florist.delivery_fee_from || 79)}
                />
                <MiniMetric
                  href={`/marketplace?filter=delivery-cutoff`}
                  icon={<Clock size={17} />}
                  label="Stopptid"
                  value={text(florist.same_day_cutoff) || "11:00"}
                />
                <MiniMetric
                  href={`/marketplace?filter=express-delivery`}
                  icon={<Phone size={17} />}
                  label="Express"
                  value={florist.express_delivery === false ? "Nej" : "Ja"}
                />
                <MiniMetric
                  href={`/marketplace?filter=sunday-delivery`}
                  icon={<CalendarDays size={17} />}
                  label="Söndag"
                  value={florist.sunday_delivery === false ? "Nej" : "Ja"}
                />
              </div>
              <div id="delivery" style={{ marginTop: 12, fontSize: 14 }}>
                {deliveryList.slice(0, 5).map((area: any, index: number) => (
                  <Link
                    key={`${area.city || area.area || "area"}-${index}`}
                    href={`/marketplace?deliveryArea=${encodeURIComponent(area.city || area.area || "Leveransområde")}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom:
                        index === Math.min(deliveryList.length, 5) - 1
                          ? "0"
                          : "1px solid #f5f5f4",
                      padding: "7px 0",
                      color: "#1c1917",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    <span>{area.city || area.area || "Leveransområde"}</span>
                    <strong>
                      från {area.price || area.delivery_price || 79} kr
                    </strong>
                  </Link>
                ))}
              </div>
            </Panel>

            <Panel
              title="Portfolio"
              link="Visa hela portfolion"
              href="#portfolio"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                }}
              >
                {portfolioPreview.map((item) => (
                  <Link
                    key={item.id || item.title}
                    href={`/orders/new?item=${encodeURIComponent(item.title)}`}
                    style={{ display: "block", textDecoration: "none" }}
                  >
                    <div
                      style={{
                        height: 210,
                        overflow: "hidden",
                        borderRadius: 16,
                        background: "#f5f5f4",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </Panel>
          </section>

          <section
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: "250px 250px 1fr",
              gap: 28,
            }}
          >
            <section style={smallCardStyle}>
              <h2 style={smallHeadingStyle}>
                <Clock size={22} /> Öppettider
              </h2>
              <OpeningHoursCompact hours={openingHours} />
            </section>

            <section style={smallCardStyle}>
              <h2 style={smallHeadingStyle}>
                <MapPin size={22} /> Adress
              </h2>
              <p
                style={{
                  margin: "16px 0 0",
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "#57534e",
                }}
              >
                {getAddress(florist)}
              </p>
              <MapButton name={name} address={getAddress(florist)} compact />
            </section>

            <section
              style={{
                borderRadius: 26,
                background: "#fff1f7",
                border: "1px solid #ffe0ed",
                padding: 20,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "70px 1fr 330px",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    height: 64,
                    width: 64,
                    placeItems: "center",
                    borderRadius: 999,
                    background: "white",
                    color: "#e60073",
                    boxShadow: "0 8px 22px rgba(230,0,115,0.08)",
                  }}
                >
                  <ShieldCheck size={34} />
                </div>
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 24,
                      fontWeight: 950,
                      color: "#e60073",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Kontakta oss tryggt via FloristSocial
                  </h2>
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "#44403c",
                    }}
                  >
                    Vi är online på FloristSocial under våra öppettider.
                    Kontakta oss gärna via meddelande, ljudsamtal eller
                    videosamtal för snabbast hjälp.
                  </p>
                </div>
                <div
                  style={{
                    display: "grid",
                    gap: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#44403c",
                  }}
                >
                  <TrustItem text="Trygg och säker kommunikation" />
                  <TrustItem text="Snabb respons under öppettider" />
                  <TrustItem text="Inte online? Vi meddelar via SMS eller e-post" />
                </div>
              </div>
            </section>
          </section>

          <section
            id="portfolio"
            style={{
              marginTop: 20,
              borderRadius: 26,
              background: "white",
              padding: 20,
              boxShadow: "0 10px 35px rgba(15,23,42,0.04)",
              border: "1px solid #e7e2dc",
            }}
          >
            <SectionTop
              title="Serviceportfolio"
              subtitle="Ett urval från floristens registrerade tjänster."
            />
            {portfolio.length === 0 ? (
              <EmptyState text="Ingen portfolio uppladdad ännu." />
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 16,
                }}
              >
                {portfolio.slice(0, 6).map((item) => (
                  <PortfolioTile key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>

          <section
            style={{
              marginTop: 20,
              borderRadius: 26,
              background: "white",
              padding: 20,
              boxShadow: "0 10px 35px rgba(15,23,42,0.04)",
              border: "1px solid #e7e2dc",
            }}
          >
            <SectionTop
              title="Tjänster & stil"
              subtitle="Allt floristen har registrerat som specialiteter och designstil."
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 28,
              }}
            >
              <TagGroup title="Tjänster" items={services} />
              <TagGroup title="Stilar" items={styles} />
            </div>
          </section>
        </div>
      </main>

      <NewsletterBox />
      
      
    </>
  );
}

const smallCardStyle = {
  borderRadius: 26,
  background: "white",
  padding: 20,
  boxShadow: "0 10px 35px rgba(15,23,42,0.04)",
  border: "1px solid #e7e2dc",
};

const smallHeadingStyle = {
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 20,
  fontWeight: 950,
};

const FLORIST_EDITABLE_FIELDS = [
  "products",
  "product_prices",
  "portfolio",
  "portfolio_items",
  "portfolio_images",
  "opening_hours",
  "closed_dates",
  "delivery_areas",
  "delivery_times",
  "delivery_prices",
  "calendar_order_status",
  "holiday_calendar",
  "services",
  "styles",
  "delivery_cutoff",
  "express_delivery",
  "delivery_days",
  "delivery_fee",
  "cover_image",
  "profile_image",
  "florist_calendar",
  "contact_person",
  "bio",
  "description",
  "custom_reminders",
];

const ADMIN_ONLY_FIELDS = [
  "shop_name",
  "florist_name",
  "store_name",
  "company_name",
  "organization_number",
  "ownership_structure",
  "street_address",
  "company_address",
  "address_line_1",
  "postal_code",
  "city",
  "municipality",
  "county",
  "country",
];

function canFloristEditField(fieldName: string) {
  return (
    FLORIST_EDITABLE_FIELDS.includes(fieldName) &&
    !ADMIN_ONLY_FIELDS.includes(fieldName)
  );
}

function canEditProfileContent(
  role: "customer" | "florist" | "admin" | "superadmin",
  fieldName: string,
) {
  if (role === "admin" || role === "superadmin") return true;
  if (role === "florist") return canFloristEditField(fieldName);
  return false;
}

function customerOrderHref(floristId: string, params: Record<string, string>) {
  const query = new URLSearchParams({ floristId, ...params });
  return `/orders/new?${query.toString()}`;
}

function floristEditHref(floristId: string, section: string) {
  return `/florist-dashboard/edit/${section}?floristId=${floristId}`;
}

function adminOnlyHref(fieldName: string) {
  return `/admin/florists?lockedField=${encodeURIComponent(fieldName)}`;
}

const topLinkStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "#1c1917",
  textDecoration: "none",
};

function TopUtilityButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      style={{
        height: 42,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 999,
        border: "1px solid #ffd5e7",
        background: "#fff7fb",
        color: "#e60073",
        padding: "0 14px",
        fontSize: 13,
        fontWeight: 850,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function FeaturePill({
  icon,
  title,
  text,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  href?: string;
}) {
  const content = (
    <div
      style={{
        minHeight: 102,
        borderRadius: 22,
        border: "1px solid #ffe0ed",
        background: "#fff9fc",
        padding: 18,
        display: "grid",
        gridTemplateColumns: "34px 1fr",
        gap: 12,
        color: "#1c1917",
      }}
    >
      <div style={{ color: "#e60073", marginTop: 2 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 950 }}>{title}</div>
        <p
          style={{
            margin: "5px 0 0",
            fontSize: 13,
            lineHeight: 1.55,
            color: "#57534e",
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} style={{ textDecoration: "none" }}>
      {content}
    </Link>
  ) : (
    content
  );
}

function CalendarMiniCard({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 18,
        background: "#fff7fb",
        border: "1px solid #ffe0ed",
        padding: 14,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 800, color: "#e60073" }}>
        {title}
      </div>
      <div style={{ marginTop: 4, fontSize: 15, fontWeight: 950 }}>{value}</div>
    </div>
  );
}

function EditableField({
  href,
  children,
  muted = false,
  fieldName = "bio",
}: {
  href: string;
  children: React.ReactNode;
  muted?: boolean;
  fieldName?: string;
}) {
  if (!canFloristEditField(fieldName)) {
    return (
      <p
        style={{
          margin: muted ? "7px 0 0" : "9px 0 0",
          fontSize: 14,
          lineHeight: 1.7,
          color: muted ? "#57534e" : "#44403c",
          whiteSpace: muted ? "pre-line" : "normal",
        }}
      >
        {children}
      </p>
    );
  }

  return (
    <Link
      href={href}
      style={{
        display: "block",
        margin: muted ? "7px 0 0" : "9px 0 0",
        fontSize: 14,
        lineHeight: 1.7,
        color: muted ? "#57534e" : "#44403c",
        whiteSpace: muted ? "pre-line" : "normal",
        textDecoration: "none",
        borderRadius: 12,
      }}
    >
      {children}
    </Link>
  );
}

function PopularCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        borderRadius: 20,
        background: "#fff",
        border: "1px solid #e7e2dc",
        padding: 16,
        boxShadow: "0 8px 24px rgba(15,23,42,0.035)",
      }}
    >
      <div style={{ color: "#e60073" }}>{icon}</div>
      <div style={{ marginTop: 8, fontSize: 15, fontWeight: 950 }}>{title}</div>
      <p
        style={{
          margin: "5px 0 0",
          fontSize: 13,
          lineHeight: 1.5,
          color: "#57534e",
        }}
      >
        {text}
      </p>
    </div>
  );
}




function NewsletterBox() {
  return (
    <section
      style={{
        minWidth: 1480,
        background: "#fff7fb",
        borderTop: "1px solid #ffe0ed",
        borderBottom: "1px solid #ffe0ed",
      }}
    >
      <div
        style={{
          width: 1440,
          margin: "0 auto",
          padding: "26px 0",
          display: "grid",
          gridTemplateColumns: "1fr 520px",
          gap: 28,
          alignItems: "center",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 950,
              color: "#e60073",
            }}
          >
            Prenumerera på vårt nyhetsbrev
          </h2>
          <p style={{ margin: "6px 0 0", fontSize: 15, color: "#44403c" }}>
            Få 50 kr rabatt på din första beställning och tips om högtider,
            buketter och presentidéer.
          </p>
        </div>
        <form
          action="/newsletter"
          method="GET"
          style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}
        >
          <input
            type="email"
            placeholder="Din e-postadress"
            style={{
              height: 50,
              borderRadius: 16,
              border: "1px solid #ffd5e7",
              padding: "0 16px",
              fontSize: 14,
            }}
          />
          <button
            type="button"
            style={{
              height: 50,
              borderRadius: 16,
              border: "1px solid #e60073",
              background: "#e60073",
              color: "white",
              padding: "0 22px",
              fontSize: 14,
              fontWeight: 900,
            }}
          >
            Bekräfta registrering
          </button>
        </form>
      </div>
    </section>
  );
}

function Action({
  href,
  icon,
  children,
  primary = false,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        height: 58,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: 14,
        padding: "0 28px",
        fontSize: 14,
        fontWeight: 850,
        whiteSpace: "nowrap",
        textDecoration: "none",
        color: primary ? "white" : "#e60073",
        background: primary ? "#e60073" : "white",
        border: primary ? "1px solid #e60073" : "1px solid #ff8abd",
        boxShadow: primary ? "0 10px 20px rgba(230,0,115,0.14)" : "none",
      }}
    >
      {icon}
      {children}
    </Link>
  );
}

function MapButton({
  name,
  address,
  compact = false,
}: {
  name: string;
  address: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`)}`}
      target="_blank"
      style={{
        marginTop: compact ? 14 : 0,
        height: compact ? 42 : 48,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: 14,
        padding: compact ? "0 14px" : "0 18px",
        fontSize: 14,
        fontWeight: 850,
        color: "#292524",
        background: "white",
        border: "1px solid #e7e2dc",
        textDecoration: "none",
        boxShadow: "0 6px 14px rgba(15,23,42,0.035)",
      }}
    >
      <MapPin size={16} /> Visa på kartan
    </Link>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 17,
        borderRadius: 20,
        background: "#fffafd",
        padding: 21,
        minHeight: 86,
        boxShadow: "0 10px 35px rgba(230,0,115,0.035)",
        border: "1px solid #ffd5e7",
      }}
    >
      <div style={{ color: "#1c1917" }}>{icon}</div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 950 }}>{label}</div>
        <div style={{ marginTop: 4, fontSize: 14, color: "#57534e" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function PinkTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        borderRadius: 999,
        background: "#fff1f7",
        border: "1px solid #ffd5e7",
        padding: "8px 15px",
        fontSize: 12,
        fontWeight: 850,
        color: "#e60073",
      }}
    >
      {children}
    </span>
  );
}

function Panel({
  title,
  link,
  href,
  children,
}: {
  title: string;
  link?: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        minHeight: 340,
        borderRadius: 26,
        background: "white",
        padding: 20,
        boxShadow: "0 10px 35px rgba(15,23,42,0.04)",
        border: "1px solid #e7e2dc",
      }}
    >
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 950,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h2>
        {href && link && (
          <Link
            href={href}
            style={{
              flexShrink: 0,
              fontSize: 14,
              fontWeight: 950,
              color: "#e60073",
              textDecoration: "none",
            }}
          >
            {link} →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function SectionTop({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2
        style={{
          margin: 0,
          fontSize: 20,
          fontWeight: 950,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ margin: "5px 0 0", fontSize: 14, color: "#78716c" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function ProductMini({ title, price, image, href }: ProductCard) {
  return (
    <Link
      href={href}
      style={{ display: "block", color: "#1c1917", textDecoration: "none" }}
    >
      <div
        style={{
          height: 210,
          overflow: "hidden",
          borderRadius: 16,
          background: "#f5f5f4",
        }}
      >
        <img
          src={image}
          alt={title}
          style={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
      <h3
        style={{
          margin: "10px 0 0",
          fontSize: 14,
          fontWeight: 850,
          lineHeight: 1.25,
        }}
      >
        {title}
      </h3>
      <p style={{ margin: "3px 0 0", fontSize: 13, color: "#57534e" }}>
        {price}
      </p>
    </Link>
  );
}

function MiniMetric({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div
      style={{
        display: "grid",
        justifyItems: "center",
        gap: 3,
        cursor: href ? "pointer" : "default",
      }}
    >
      {icon}
      <div>{label}</div>
      <span style={{ color: "#1c1917", fontWeight: 900 }}>{value}</span>
    </div>
  );

  return href ? (
    <Link href={href} style={{ color: "inherit", textDecoration: "none" }}>
      {content}
    </Link>
  ) : (
    content
  );
}

function PortfolioTile({ item }: { item: PortfolioItem }) {
  return (
    <Link
      href={`/orders/new?item=${encodeURIComponent(item.title)}`}
      style={{ display: "block", color: "#1c1917", textDecoration: "none" }}
    >
      <article
        style={{
          overflow: "hidden",
          borderRadius: 24,
          background: "white",
          boxShadow: "0 10px 28px rgba(15,23,42,0.04)",
          border: "1px solid #e7e2dc",
          cursor: "pointer",
        }}
      >
        <div style={{ height: 280, background: "#f5f5f4" }}>
          <img
            src={item.image}
            alt={item.title}
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
        <div style={{ padding: 16 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 950,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              color: "#e60073",
            }}
          >
            {item.serviceName}
          </div>
          <h3 style={{ margin: "5px 0 0", fontSize: 15, fontWeight: 950 }}>
            {item.title}
          </h3>
          {item.price && (
            <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 850 }}>
              {formatPrice(item.price)}
            </p>
          )}
          {item.description && (
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 13,
                lineHeight: 1.5,
                color: "#78716c",
              }}
            >
              {item.description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

function OpeningHoursCompact({ hours }: { hours: any[] }) {
  const normalized = normalizeHours(hours);
  if (!normalized.length)
    return <EmptyState text="Inga öppettider registrerade ännu." />;

  const daysToShow = normalized.filter((day) =>
    ["Måndag", "Lördag", "Söndag"].includes(day.label),
  );
  const displayDays = daysToShow.length ? daysToShow : normalized.slice(0, 3);

  return (
    <div style={{ marginTop: 16 }}>
      {displayDays.map((day, index) => (
        <div
          key={day.label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom:
              index === displayDays.length - 1 ? "0" : "1px solid #f5f5f4",
            padding: "8px 0",
            fontSize: 14,
          }}
        >
          <strong>{day.short}</strong>
          <span
            style={{
              fontWeight: day.closed ? 850 : 500,
              color: day.closed ? "#dc2626" : "#57534e",
            }}
          >
            {day.closed ? "Stängt" : `${day.open}–${day.close}`}
          </span>
        </div>
      ))}
    </div>
  );
}

function TagGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 950 }}>
        {title}
      </h3>
      {items.length === 0 ? (
        <p style={{ margin: 0, fontSize: 14, color: "#78716c" }}>
          Inget registrerat ännu.
        </p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
          {items.map((item) => (
            <Link
              key={item}
              href={`/marketplace?tag=${encodeURIComponent(item)}`}
              style={{
                borderRadius: 999,
                background: "#f5f5f4",
                padding: "8px 15px",
                fontSize: 13,
                fontWeight: 850,
                color: "#57534e",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function TrustItem({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
      <Check
        size={18}
        style={{ marginTop: 1, flexShrink: 0, color: "#e60073" }}
      />{" "}
      {text}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        borderRadius: 24,
        border: "1px dashed #d6d3d1",
        background: "#fafaf9",
        padding: 38,
        textAlign: "center",
        color: "#78716c",
      }}
    >
      <CalendarDays
        style={{ margin: "0 auto 12px", color: "#d6d3d1" }}
        size={34}
      />
      {text}
    </div>
  );
}
