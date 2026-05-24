import Link from "next/link";
import {
CalendarDays,
Check,
Clock,
Heart,
MapPin,
MessageCircle,
Phone,
ShieldCheck,
ShoppingBag,
Store,
Truck,
UserRound,
Video,
} from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import FloristSocialHeader from "@/components/layout/FloristSocialHeader";
import FloristSocialFooter from "@/components/layout/FloristSocialFooter";
import FloristSocialMobileBottomNav from "@/components/layout/FloristSocialMobileBottomNav";

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

const demoProducts = [
{
title: "Bukett Rosa Dröm",
price: "från 599 kr",
image: "[https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=900&auto=format&fit=crop](https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=900&auto=format&fit=crop)",
},
{
title: "Röda rosor",
price: "från 499 kr",
image: "[https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=900&auto=format&fit=crop](https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=900&auto=format&fit=crop)",
},
{
title: "Säsongens bukett",
price: "från 449 kr",
image: "[https://images.unsplash.com/photo-1468327768560-75b778cbb551?q=80&w=900&auto=format&fit=crop](https://images.unsplash.com/photo-1468327768560-75b778cbb551?q=80&w=900&auto=format&fit=crop)",
},
];

const fallbackDeliveryAreas = [
{ city: "Stockholm innerstad", price: 79 },
{ city: "Södermalm", price: 89 },
{ city: "Kungsholmen", price: 89 },
{ city: "Nacka", price: 129 },
{ city: "Solna", price: 129 },
];

const fallbackCover =
"[https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1800&auto=format&fit=crop](https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1800&auto=format&fit=crop)";

function isUuid(value: string) {
return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function asArray(value: any) {
return Array.isArray(value) ? value : [];
}

function asObject(value: any) {
return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function text(...values: any[]) {
return values.find((value) => typeof value === "string" && value.trim().length > 0)?.trim() || "";
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
value.image?.public_url
);
}

function postImage(post: FeedItem) {
return text(
post.image_thumbnail_url,
post.image_medium_url,
post.image_original_url,
post.image_url,
post.media_url,
post.url
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
return text(florist.shop_name, florist.florist_name, florist.profile_name, florist.name) || "Florist";
}

function getLocation(florist: Florist) {
const city = text(florist.city, florist.municipality, florist.county) || "Stockholm";
const country = text(florist.country) || "Sweden";
return `${city} / ${country === "Sverige" ? "Sweden" : country}`;
}

function getAddress(florist: Florist) {
const street = text(florist.street_address, florist.address, florist.company_address, florist.address_line_1);
const postal = text(florist.postal_code, florist.zip, florist.zip_code);
const city = text(florist.city, florist.municipality) || "Stockholm";
const country = text(florist.country) || "Sweden";

if (!street && !postal) return `${city} / ${country === "Sverige" ? "Sweden" : country}`;
return [street, postal, city].filter(Boolean).join(" ") + ` / ${country === "Sverige" ? "Sweden" : country}`;
}

const dayNames = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];
const shortDayNames = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];

function normalizeHours(hours: any[]) {
return hours.map((day, index) => ({
label: text(day.dayLabel, day.label, day.day) || dayNames[index] || `Dag ${index + 1}`,
short: text(day.shortLabel) || shortDayNames[index] || "Dag",
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

function buildPortfolio(florist: Florist) {
const serviceItems = Object.entries(asObject(florist.service_portfolio_items)).flatMap(([serviceName, items]) =>
asArray(items).map((item: any, index: number) => ({
id: item.id || `${serviceName}-${index}`,
title: text(item.title, item.name) || serviceName,
description: text(item.description, item.text),
price: item.price || item.base_price || "",
serviceName,
image: imgFrom(item),
}))
);

const generalItems = asArray(florist.general_portfolio_items).map((item: any, index: number) => ({
id: item.id || `general-${index}`,
title: text(item.title, item.name) || `Portfolio ${index + 1}`,
description: text(item.description, item.text),
price: item.price || item.base_price || "",
serviceName: text(item.serviceName, item.service_name, item.category) || "Portfolio",
image: imgFrom(item),
}));

const oldImages = asArray(florist.portfolio_images).map((item: any, index: number) => ({
id: `old-${index}`,
title: text(item.title, item.name) || `Portfolio ${index + 1}`,
description: text(item.description, item.text),
price: item.price || "",
serviceName: "Portfolio",
image: imgFrom(item),
}));

return [...serviceItems, ...generalItems, ...oldImages].filter((item) => item.image) as PortfolioItem[];
}

function splitDescription(value: string, name: string) {
const fallback = `${name} skapar blomsterarrangemang med känsla, kvalitet och personlig service.`;
const parts = (value || fallback).split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);

return {
about: parts[0] || fallback,
note: parts.slice(1).join("\n\n") || "Blommor är vårt språk. Vi skapar personliga arrangemang för vardag, kärlek, minnen och stora ögonblick.",
};
}

async function loadFloristProfile(slugOrId: string) {
const supabase = await createSupabaseServerClient();
const lookupColumn = isUuid(slugOrId) ? "id" : "slug";

let { data: florist, error } = await supabase.from("florists").select("*").eq(lookupColumn, slugOrId).maybeSingle();

if (!florist && lookupColumn === "slug") {
const fallback = await supabase.from("florists").select("*").eq("profile_name", slugOrId).maybeSingle();
florist = fallback.data;
error = fallback.error;
}

if (error || !florist) return { florist: null, posts: [] as FeedItem[] };

const { data: posts } = await supabase.from("feed_items").select("*").eq("florist_id", florist.id).limit(80);
return { florist, posts: (posts || []) as FeedItem[] };
}

export default async function FloristSocialProfilePage({ params }: PageProps) {
const { id } = await params;
const { florist, posts } = await loadFloristProfile(id);

if (!florist) {
return (
<> <FloristSocialHeader role="guest" country="SE" active="florists" /> <main className="grid min-h-screen place-items-center bg-[#f7f4ef] px-5 text-stone-900"> <section className="max-w-md rounded-[32px] bg-white p-8 text-center shadow-xl ring-1 ring-stone-200"> <Store className="mx-auto text-stone-300" size={48} /> <h1 className="mt-4 text-3xl font-bold">Florist hittades inte</h1> <p className="mt-3 text-stone-600">Vi kunde inte hitta floristprofilen du försökte öppna.</p> <div className="mt-6 grid gap-3"> <Link href="/feed" className="rounded-2xl bg-stone-900 px-5 py-3 text-sm font-bold !text-white">Till feed</Link> <Link href="/marketplace" className="rounded-2xl border border-stone-300 bg-white px-5 py-3 text-sm font-bold text-stone-900">Till marketplace</Link> </div> </section> </main> <FloristSocialFooter />
</>
);
}

const name = getName(florist);
const services = asArray(florist.services);
const styles = asArray(florist.styles);
const openingHours = asArray(florist.opening_hours);
const today = getTodayStatus(openingHours);
const description = splitDescription(text(florist.bio, florist.description), name);
const portfolio = buildPortfolio(florist);
const imagePosts = posts.filter((post) => postImage(post) || post.video_url);
const shopPosts = imagePosts.filter((post) => post.is_shoppable);
const deliveryAreas = asArray(florist.delivery_areas);
const deliveryList = deliveryAreas.length ? deliveryAreas : fallbackDeliveryAreas;

const logo = text(florist.logo_url, florist.profile_image_url);
const firstPostWithImage = imagePosts.find((post) => postImage(post));
const cover = text(florist.cover_image_url, firstPostWithImage ? postImage(firstPostWithImage) : "") || fallbackCover;
const aboutImage = text(florist.shop_image_url, florist.storefront_image_url, florist.cover_image_url, portfolio[0]?.image, firstPostWithImage ? postImage(firstPostWithImage) : "") || fallbackCover;

const realProducts = shopPosts
.slice(0, 3)
.map((post) => ({
title: text(post.product_title, post.title, post.caption) || "Floristprodukt",
price: formatPrice(post.base_price || post.price, post.currency || "SEK") || "Pris på förfrågan",
image: postImage(post),
href: `/orders/new?floristId=${florist.id}&postId=${post.id}`,
}))
.filter((item) => item.image);

const products: ProductCard[] = realProducts.length
? realProducts
: demoProducts.map((product) => ({ ...product, href: `/orders/new?floristId=${florist.id}` }));

const previewPortfolio = portfolio.length ? portfolio.slice(0, 3) : products.map((product, index) => ({
id: `product-preview-${index}`,
title: product.title,
description: "",
price: product.price,
serviceName: "Portfolio",
image: product.image,
}));

return (
<> <FloristSocialHeader role="guest" country="SE" active="florists" />

```
  <main className="min-h-screen bg-[#f7f4ef] pb-20 text-stone-950 md:pb-0">
    <section className="mx-auto max-w-[1680px] px-3 pt-3 sm:px-5 lg:px-8 lg:pt-6">
      <div className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-stone-200 lg:rounded-[36px]">
        <div className="h-[190px] overflow-hidden bg-stone-200 sm:h-[230px] lg:h-[300px] xl:h-[330px]">
          <img src={cover} alt={name} className="h-full w-full object-cover" />
        </div>

        <div className="relative px-4 pb-6 sm:px-6 lg:px-12 lg:pb-9">
          <button className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full bg-white text-stone-900 shadow-md ring-1 ring-stone-200 lg:hidden" type="button">
            <Heart size={22} />
          </button>

          <div className="grid gap-5 lg:grid-cols-[190px_1fr_auto] lg:items-end xl:grid-cols-[220px_1fr_auto]">
            <div className="relative -mt-14 h-32 w-32 shrink-0 overflow-hidden rounded-full border-[6px] border-white bg-white shadow-2xl sm:-mt-16 sm:h-40 sm:w-40 lg:-mt-24 lg:h-44 lg:w-44">
              {logo ? <img src={logo} alt={`${name} logotyp`} className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-stone-400"><UserRound size={46} /></div>}
              <span className={`absolute bottom-4 right-4 h-5 w-5 rounded-full border-2 border-white ${today.openNow ? "bg-emerald-500" : "bg-red-500"}`} />
            </div>

            <div className="min-w-0 lg:pb-2">
              <h1 className="text-4xl font-[900] leading-none tracking-tight sm:text-5xl xl:text-6xl">{name}</h1>
              <div className="mt-4 flex flex-col gap-2 text-sm text-stone-700 md:flex-row md:flex-wrap md:items-center md:gap-x-5">
                <span className="inline-flex items-center gap-2 font-bold"><span className={`h-3 w-3 rounded-full ${today.openNow ? "bg-emerald-500" : "bg-red-500"}`} />{today.openNow ? "Online på FloristSocial" : "Stängt just nu"}</span>
                <span className="inline-flex items-center gap-2"><MapPin size={16} />{getAddress(florist)}</span>
                <span className="inline-flex items-center gap-2"><Clock size={16} />{today.text}</span>
              </div>
              <p className="mt-2 text-sm text-stone-500">Vanligtvis svarar inom några minuter</p>
              <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${getAddress(florist)}`)}`} target="_blank" className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 text-sm font-bold text-stone-900 shadow-sm hover:bg-stone-50">
                <MapPin size={16} /> Visa på kartan
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:max-w-[560px] lg:flex-wrap lg:justify-end lg:pb-2">
              <Action href={`/messages/new?floristId=${florist.id}`} icon={<MessageCircle size={18} />} primary>Chatta på FloristSocial</Action>
              <Action href={`/calls/audio?floristId=${florist.id}`} icon={<Phone size={18} />}>Ljudsamtal</Action>
              <Action href={`/calls/video?floristId=${florist.id}`} icon={<Video size={18} />}>Videosamtal</Action>
              <Action href={`/orders/new?floristId=${florist.id}`} icon={<ShoppingBag size={18} />} primary>Beställ</Action>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InfoCard icon={<MapPin size={25} />} label="Stad" value={getLocation(florist)} />
            <InfoCard icon={<Truck size={25} />} label="Leveransradie" value={`${florist.delivery_radius_km || 15} km`} />
            <InfoCard icon={<Clock size={25} />} label="Svarar snabbt" value="Vanligtvis inom några minuter" />
            <InfoCard icon={<ShoppingBag size={25} />} label="Medlem sedan" value={florist.created_at ? new Date(florist.created_at).getFullYear().toString() : "2026"} />
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-[1680px] space-y-5 px-3 py-5 sm:px-5 lg:px-8">
      <section className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-200 lg:p-6">
        <div className="grid gap-5 lg:grid-cols-[320px_1fr] lg:items-center">
          <div className="h-56 overflow-hidden rounded-[24px] bg-stone-100 lg:h-44 xl:h-48">
            <img src={aboutImage} alt={name} className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-[900] tracking-tight lg:text-3xl">Om {name}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-700">{description.about}</p>
            <h3 className="mt-4 font-black">Några ord från floristen</h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-stone-600">{description.note}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {services.slice(0, 10).map((service) => <PinkTag key={service}>{service}</PinkTag>)}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.12fr_1fr_1fr]">
        <Panel title="Sortiment & produkter" link="Visa alla produkter" href={`/marketplace?floristId=${florist.id}`}>
          <div className="grid grid-cols-3 gap-3">
            {products.slice(0, 3).map((product) => <ProductMini key={product.title} {...product} />)}
          </div>
        </Panel>

        <Panel title="Leveransområden & priser" link="Visa alla områden och priser" href="#delivery">
          <div className="grid grid-cols-4 gap-2 border-b border-stone-100 pb-4 text-center text-xs font-bold text-pink-600">
            <MiniMetric icon={<Truck size={18} />} label="Bud avgift" value={formatPrice(florist.delivery_fee_from || 79)} />
            <MiniMetric icon={<Clock size={18} />} label="Stopptid" value={text(florist.same_day_cutoff) || "11:00"} />
            <MiniMetric icon={<Phone size={18} />} label="Express" value="Ja" />
            <MiniMetric icon={<CalendarDays size={18} />} label="Söndag" value="Ja" />
          </div>
          <div id="delivery" className="mt-3 space-y-2 text-sm">
            {deliveryList.slice(0, 6).map((area: any, index: number) => (
              <div key={`${area.city || area.area || index}`} className="flex items-center justify-between border-b border-stone-100 pb-2 last:border-0">
                <span>{area.city || area.area || "Leveransområde"}</span>
                <strong>från {area.price || area.delivery_price || 79} kr</strong>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Portfolio" link="Visa hela portfolion" href="#portfolio">
          <div className="grid grid-cols-3 gap-3">
            {previewPortfolio.map((item) => (
              <div key={item.id || item.title} className="aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <section id="portfolio" className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-200 lg:p-6">
        <SectionTop title="Serviceportfolio" subtitle="Bilder, priser och exempel från floristens registrerade tjänster." />
        {portfolio.length === 0 ? <EmptyState text="Ingen portfolio uppladdad ännu." /> : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {portfolio.map((item) => <PortfolioTile key={item.id} item={item} />)}
          </div>
        )}
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr_2fr]">
        <section className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-200 lg:p-6">
          <h2 className="flex items-center gap-2 text-xl font-[900] tracking-tight"><Clock size={22} /> Öppettider</h2>
          <OpeningHoursList hours={openingHours} />
        </section>

        <section className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-200 lg:p-6">
          <h2 className="flex items-center gap-2 text-xl font-[900] tracking-tight"><MapPin size={22} /> Adress</h2>
          <p className="mt-4 text-sm leading-7 text-stone-700">{getAddress(florist)}</p>
          <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${getAddress(florist)}`)}`} target="_blank" className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 text-sm font-bold text-stone-900 hover:bg-stone-50">
            <MapPin size={16} /> Visa på kartan
          </Link>
        </section>

        <section className="rounded-[28px] bg-pink-50 p-6 ring-1 ring-pink-100 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div className="flex items-start gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white text-pink-600 shadow-sm"><ShieldCheck size={34} /></div>
            <div>
              <h2 className="text-2xl font-[900] tracking-tight text-pink-700">Kontakta oss tryggt via FloristSocial</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-700">Vi är online på FloristSocial under våra öppettider. Kontakta oss gärna via meddelande, ljudsamtal eller videosamtal för snabbast hjälp.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 text-sm font-medium text-stone-700 lg:mt-0">
            <TrustItem text="Trygg och säker kommunikation" />
            <TrustItem text="Snabb respons under öppettider" />
            <TrustItem text="Inte online? Vi meddelar via SMS eller e-post när vi svarar" />
          </div>
        </section>
      </div>

      <section className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-200 lg:p-6">
        <SectionTop title="Tjänster & stil" subtitle="Allt floristen har registrerat som specialiteter och designstil." />
        <div className="grid gap-6 md:grid-cols-2">
          <TagGroup title="Tjänster" items={services} />
          <TagGroup title="Stilar" items={styles} />
        </div>
      </section>
    </section>
  </main>

  <FloristSocialMobileBottomNav active="overview" />
  <FloristSocialFooter />
</>

);
}

function Action({ href, icon, children, primary = false }: { href: string; icon: React.ReactNode; children: React.ReactNode; primary?: boolean }) {
return <Link href={href} className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-extrabold transition ${primary ? "bg-gradient-to-r from-pink-600 to-fuchsia-500 !text-white shadow-lg shadow-pink-600/20 hover:from-pink-700 hover:to-fuchsia-600" : "border border-pink-300 bg-white !text-pink-700 hover:bg-pink-50"}`}>{icon}{children}</Link>;
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
return <div className="flex items-center gap-4 rounded-[22px] bg-white p-5 ring-1 ring-stone-200"><div className="text-stone-900">{icon}</div><div><div className="font-black">{label}</div><div className="mt-1 text-sm text-stone-600">{value}</div></div></div>;
}

function PinkTag({ children }: { children: React.ReactNode }) {
return <span className="rounded-full bg-pink-50 px-4 py-2 text-xs font-bold text-pink-700 ring-1 ring-pink-100">{children}</span>;
}

function Panel({ title, link, href, children }: { title: string; link?: string; href?: string; children: React.ReactNode }) {
return <section className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-200"><div className="mb-4 flex items-start justify-between gap-4"><h2 className="text-xl font-[900] tracking-tight">{title}</h2>{href && link && <Link href={href} className="shrink-0 text-sm font-black text-pink-600">{link} →</Link>}</div>{children}</section>;
}

function SectionTop({ title, subtitle }: { title: string; subtitle?: string }) {
return <div className="mb-5"><h2 className="text-xl font-[900] tracking-tight">{title}</h2>{subtitle && <p className="mt-1 text-sm text-stone-500">{subtitle}</p>}</div>;
}

function ProductMini({ title, price, image, href }: ProductCard) {
return <Link href={href} className="block"><div className="aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100"><img src={image} alt={title} className="h-full w-full object-cover transition duration-300 hover:scale-105" /></div><h3 className="mt-2 line-clamp-2 text-sm font-bold">{title}</h3><p className="text-xs text-stone-600">{price}</p></Link>;
}

function MiniMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
return <div className="grid place-items-center gap-1">{icon}<div>{label}</div><span className="text-stone-900">{value}</span></div>;
}

function PortfolioTile({ item }: { item: PortfolioItem }) {
return <article className="overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-stone-200"><div className="aspect-[4/5] bg-stone-100"><img src={item.image} alt={item.title} className="h-full w-full object-cover" /></div><div className="p-4"><div className="text-xs font-black uppercase tracking-wide text-pink-600">{item.serviceName}</div><h3 className="mt-1 font-black">{item.title}</h3>{item.price && <p className="mt-1 text-sm font-bold">{formatPrice(item.price)}</p>}{item.description && <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-500">{item.description}</p>}</div></article>;
}

function OpeningHoursList({ hours }: { hours: any[] }) {
const normalized = normalizeHours(hours);
if (!normalized.length) return <EmptyState text="Inga öppettider registrerade ännu." />;
return <div className="mt-4 space-y-2">{normalized.map((day) => <div key={day.label} className="flex justify-between border-b border-stone-100 py-2 text-sm last:border-0"><strong>{day.label}</strong><span className={day.closed ? "font-bold text-red-600" : "text-stone-600"}>{day.closed ? "Stängt" : `${day.open}–${day.close}`}</span></div>)}</div>;
}

function TagGroup({ title, items }: { title: string; items: string[] }) {
return <div><h3 className="mb-3 font-black">{title}</h3>{items.length === 0 ? <p className="text-sm text-stone-500">Inget registrerat ännu.</p> : <div className="flex flex-wrap gap-2">{items.map((item) => <span key={item} className="rounded-full bg-stone-100 px-4 py-2 text-sm font-bold text-stone-700">{item}</span>)}</div>}</div>;
}

function TrustItem({ text }: { text: string }) {
return <div className="flex items-start gap-2"><Check size={18} className="mt-0.5 shrink-0 text-pink-600" /> {text}</div>;
}

function EmptyState({ text }: { text: string }) {
return <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 p-10 text-center text-stone-500"><CalendarDays className="mx-auto mb-3 text-stone-300" size={34} />{text}</div>;
}

