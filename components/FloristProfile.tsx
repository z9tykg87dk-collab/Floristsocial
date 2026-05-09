"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Flower2,
  HeartHandshake,
  Lock,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  Send,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Video,
  WalletCards,
} from "lucide-react";

type FloristProfileProps = {
  florist: any;
  products: any[];
  services: any[];
  deliveryAreas: any[];
  portfolioItems: any[];
  closedDays: any[];
  openingHours: any[];
};

function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined) return "Pris ej angivet";
  return value.toLocaleString("sv-SE") + " kr";
}

function getServiceEmoji(serviceName: string) {
  const name = String(serviceName || "").toLowerCase();

  if (name.includes("bröllop")) return "💍";
  if (name.includes("begrav")) return "🕊️";
  if (name.includes("event")) return "✨";
  if (name.includes("företag")) return "🏢";
  if (name.includes("bukett")) return "💐";
  if (name.includes("blombud")) return "🚚";
  if (name.includes("workshop")) return "🌿";

  return "🌸";
}

function displayShopName(name: string | null | undefined) {
  return name?.trim() || "Florist";
}

function getPublicAddress(florist: any) {
  const parts = [florist?.street_address, florist?.postal_code, florist?.city].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : florist?.city || "Adress ej angiven";
}

function isOpenNow(openingHours: any[]) {
  if (!openingHours || openingHours.length === 0) return true;

  const today = new Date().toLocaleDateString("sv-SE", { weekday: "long" });
  const normalizedToday = today.charAt(0).toUpperCase() + today.slice(1);
  const row = openingHours.find((item) => String(item.day_label || "").toLowerCase() === normalizedToday.toLowerCase());

  if (!row) return true;
  return !row.is_closed;
}

export default function FloristProfile({
  florist,
  products,
  services,
  deliveryAreas,
  portfolioItems,
  closedDays,
  openingHours,
}: FloristProfileProps) {
  if (!florist) {
    return (
      <main className="min-h-screen bg-[#fbf7f2] p-6">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Florist hittades inte.</h1>
          <Link href="/feed" className="mt-4 inline-block text-sm font-semibold">
            Tillbaka till feed
          </Link>
        </div>
      </main>
    );
  }

  const shopName = displayShopName(florist.shop_name);
  const publicAddress = getPublicAddress(florist);
  const open = isOpenNow(openingHours);

  return (
    <main className="min-h-screen bg-[#fbf7f2] text-stone-900">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-5 md:py-8">
        <Link
          href="/feed"
          className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm"
        >
          <ArrowLeft size={16} />
          Tillbaka till feed
        </Link>

        <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl">
          <div className="relative h-32 bg-gradient-to-r from-emerald-100 via-pink-100 to-stone-100 sm:h-40 md:h-48">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.8),transparent_40%)]" />
          </div>

          <div className="px-4 pb-8 sm:px-6 md:px-8">
            <div className="relative -mt-12 rounded-[1.75rem] bg-white/95 p-4 shadow-sm ring-1 ring-stone-100 sm:-mt-14 sm:p-5 md:p-6">
              <div className="grid gap-5 lg:grid-cols-[1fr_430px] lg:items-center">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full border-4 border-white bg-stone-900 text-white shadow-lg sm:h-28 sm:w-28">
                    <Flower2 size={42} />
                  </div>

                  <div className="min-w-0">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 size={14} />
                      Verifierad florist
                    </div>

                    <h1 className="max-w-full break-words text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                      {shopName}
                    </h1>

                    <div className="mt-3 space-y-1 text-sm text-stone-600">
                      <p className="flex items-center gap-2">
                        <MapPin size={17} />
                        {florist.city || "Stad saknas"}
                      </p>

                      <p className="flex items-center gap-2 break-words">
                        <MapPin size={17} />
                        {publicAddress}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                      <span className="inline-flex items-center gap-1 font-semibold">
                        <Star size={16} className="fill-yellow-400 text-yellow-400" />
                        4.9
                      </span>
                      <span className="text-yellow-500">★★★★★</span>
                      <span className="text-stone-500">(128 omdömen)</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Link
                      href="/florist-chat"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-800"
                    >
                      <Video size={18} />
                      Videosamtal till {shopName}
                    </Link>

                    <Link
                      href="/florist-chat"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-pink-300 bg-pink-50 px-4 py-3 text-sm font-semibold text-pink-700 shadow-sm transition hover:bg-pink-100"
                    >
                      <Phone size={18} />
                      Ljudsamtal till {shopName}
                    </Link>
                  </div>

                  <Link
                    href="/florist-chat"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-800"
                  >
                    <MessageCircle size={18} />
                    Chatta med {shopName}
                  </Link>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Link
                      href="/orders/new"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-stone-50"
                    >
                      <Send size={18} />
                      Skicka en förmedling
                    </Link>

                    <Link
                      href="/orders/new"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-stone-50"
                    >
                      <FileText size={18} />
                      Skicka orderförfrågan
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <InfoCard
                icon={<MapPin size={20} />}
                title="Stad"
                value={florist.city || "Ej angivet"}
                badge={open ? "Öppet" : "Stängt"}
                badgeTone={open ? "green" : "red"}
                subValue={open ? "10:00 – 18:00" : "Stängt just nu"}
              />

              <InfoCard
                icon={<Truck size={20} />}
                title="Leveransradie"
                value={florist.delivery_radius_km ? String(florist.delivery_radius_km) + " km" : "Ej angivet"}
              />

              <InfoCard
                icon={<CreditCard size={20} />}
                title="Betalningar"
                value="Betalning hanteras via FloristSocial"
              />
            </div>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr_1.25fr]">
              <PortfolioCard portfolioItems={portfolioItems} />
              <AboutCard florist={florist} />
              <ServicesCard services={services} />
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr_0.9fr]">
              <DeliveryAreasCard deliveryAreas={deliveryAreas} />
              <ProductsCard products={products} />
              <OpeningHoursCard openingHours={openingHours} />
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
              <ClosedDaysCard closedDays={closedDays} />
              <PrivateContactNote />
            </section>

            <QuickMenu shopName={shopName} />
          </div>
        </div>
      </section>
    </main>
  );
}

function PortfolioCard({ portfolioItems }: { portfolioItems: any[] }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Portfolio</h2>
        <Link href="#" className="rounded-xl border border-purple-200 px-3 py-2 text-xs font-semibold text-purple-700">
          Visa hela portfolio →
        </Link>
      </div>

      {portfolioItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-600">
          Inga portfolio-bilder är publicerade ännu. Bild-URL kopplas i nästa steg via Supabase Storage.
        </div>
      ) : (
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            {portfolioItems.slice(0, 4).map((item) => (
              <PortfolioImage key={item.id} item={item} small />
            ))}
          </div>
          {portfolioItems[4] && <PortfolioImage item={portfolioItems[4]} />}
        </div>
      )}
    </section>
  );
}

function PortfolioImage({ item, small = false }: { item: any; small?: boolean }) {
  const className = small ? "h-36 w-full rounded-2xl object-cover" : "h-44 w-full rounded-2xl object-cover";

  if (!item.media_url) {
    return (
      <div className={(small ? "h-36" : "h-44") + " grid place-items-center rounded-2xl bg-stone-100 text-stone-500"}>
        <Camera size={28} />
      </div>
    );
  }

  if (item.media_type === "video") {
    return <video src={item.media_url} controls className={className} />;
  }

  return <img src={item.media_url} alt={item.title || "Portfolio"} className={className} />;
}

function AboutCard({ florist }: { florist: any }) {
  return (
    <section className="rounded-3xl bg-[#fbf7f2] p-5 shadow-sm ring-1 ring-stone-100">
      <h2 className="text-xl font-bold">Om floristen</h2>
      <p className="mt-3 text-sm leading-7 text-stone-700">
        {florist.bio || "Floristen har ännu inte lagt till en beskrivning."}
      </p>

      <div className="mt-5 space-y-3 text-sm">
        <MiniFact label="Grundat" value="2018" />
        <MiniFact label="Språk" value="Svenska, Engelska" />
        <MiniFact label="Miljömedveten" value="Miljövänliga material och metoder" />
      </div>
    </section>
  );
}

function ServicesCard({ services }: { services: any[] }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Tjänster & specialiteter</h2>
        <Link href="#" className="rounded-xl border border-purple-200 px-3 py-2 text-xs font-semibold text-purple-700">
          Visa alla tjänster →
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-600">
          Inga tjänster är publicerade ännu. Gör en ny registrering efter senaste uppdateringen för att fylla denna sektion.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {services.slice(0, 6).map((service) => (
            <article key={service.id} className="min-w-0">
              <div className="grid h-28 place-items-center rounded-2xl bg-stone-100 text-3xl">
                {getServiceEmoji(service.service_name)}
              </div>
              <h3 className="mt-2 break-words text-sm font-bold">{service.service_name}</h3>
              <Link href="#" className="mt-1 inline-block text-xs font-semibold text-purple-700">
                Läs mer →
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function DeliveryAreasCard({ deliveryAreas }: { deliveryAreas: any[] }) {
  const firstPrice = deliveryAreas.find((area) => area.delivery_price_amount)?.delivery_price_amount;

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
      <h2 className="text-xl font-bold">Leveransområden & Leveranspriser</h2>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-purple-50 p-3 text-xs text-purple-800 sm:grid-cols-4">
        <DeliveryStat label="Bud avgift kr (från)" value={firstPrice ? formatPrice(firstPrice) : "79 kr"} />
        <DeliveryStat label="Stopptid" value="11:00" />
        <DeliveryStat label="Express" value="Ja" />
        <DeliveryStat label="Specialleverans" value="Ja" />
      </div>

      {deliveryAreas.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-600">
          Inga leveransområden är publicerade ännu.
        </div>
      ) : (
        <div className="mt-4 divide-y divide-stone-100 text-sm">
          {deliveryAreas.slice(0, 6).map((area) => (
            <div key={area.id} className="flex items-center justify-between gap-4 py-2">
              <div>
                <p className="font-medium">{area.area || area.city}</p>
                {area.postal_code && <p className="text-xs text-stone-500">{area.postal_code}</p>}
              </div>
              <p className="font-semibold">från {formatPrice(area.delivery_price_amount)}</p>
            </div>
          ))}
        </div>
      )}

      <Link href="#" className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-purple-300 px-4 py-3 text-sm font-semibold text-purple-700">
        Visa alla områden & Leveranspriser
      </Link>
    </section>
  );
}

function ProductsCard({ products }: { products: any[] }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Sortiment & produkter</h2>
        <Link href="#" className="rounded-xl border border-purple-200 px-3 py-2 text-xs font-semibold text-purple-700">
          Visa alla produkter →
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-600">
          Inga produkter är publicerade ännu.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {products.slice(0, 4).map((product) => (
            <article key={product.id}>
              {product.image_url ? (
                <img src={product.image_url} alt={product.title} className="h-28 w-full rounded-2xl object-cover" />
              ) : (
                <div className="grid h-28 place-items-center rounded-2xl bg-stone-100">
                  <Flower2 size={28} />
                </div>
              )}
              <h3 className="mt-2 break-words text-xs font-bold">{product.title}</h3>
              <p className="text-xs text-stone-600">från {formatPrice(product.price_amount)}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function OpeningHoursCard({ openingHours }: { openingHours: any[] }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
      <SectionMiniTitle icon={<Clock size={20} />} title="Öppettider" />

      {openingHours.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-600">
          Öppettider är inte publicerade ännu.
        </div>
      ) : (
        <div className="mt-4 space-y-2 text-sm">
          {openingHours.map((row) => (
            <div key={row.id} className="flex justify-between gap-4">
              <strong>{row.day_label}</strong>
              <span className={row.is_closed ? "font-semibold text-red-600" : "text-stone-700"}>
                {row.is_closed ? "Stängt" : String(row.open_time || "--") + " – " + String(row.close_time || "--")}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ClosedDaysCard({ closedDays }: { closedDays: any[] }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
      <SectionMiniTitle icon={<CalendarDays size={20} />} title="Stängda dagar" />

      {closedDays.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-600">
          Inga stängda dagar är publicerade ännu.
        </div>
      ) : (
        <div className="mt-4 space-y-2 text-sm">
          {closedDays.slice(0, 8).map((day) => (
            <div key={day.id}>
              <strong>{day.closed_label}</strong>
              {day.reason && <span className="text-stone-500"> – {day.reason}</span>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function PrivateContactNote() {
  return (
    <section className="rounded-3xl bg-stone-50 p-5 shadow-sm ring-1 ring-stone-100">
      <SectionMiniTitle icon={<Lock size={20} />} title="Trygg kommunikation" />
      <p className="mt-3 text-sm leading-6 text-stone-600">
        Kontaktuppgifter visas inte publikt. Kommunikation, orderförfrågningar, förmedlingar och betalningar sker via FloristSocial.
      </p>
    </section>
  );
}

function QuickMenu({ shopName }: { shopName: string }) {
  const items = [
    { label: "Mina skickade order", icon: <PackageCheck size={20} /> },
    { label: "Mina mottagna order", icon: <ShoppingBag size={20} /> },
    { label: "Mina meddelanden", icon: <MessageCircle size={20} />, badge: "3" },
    { label: "Mina notiser", icon: <Bell size={20} />, badge: "3" },
    { label: "Mina fakturor", icon: <FileText size={20} /> },
    { label: "Ekonomisidan", icon: <WalletCards size={20} /> },
    { label: "Uppdatera leveranszoner", icon: <Truck size={20} /> },
    { label: "Mina leveransområden", icon: <MapPin size={20} /> },
    { label: "Kyrkor i mitt område", icon: <Flower2 size={20} /> },
    { label: "Mina avvikande datum", icon: <CalendarDays size={20} /> },
    { label: "Mina leverantörsbeställningar", icon: <HeartHandshake size={20} /> },
    { label: "Event", icon: <Sparkles size={20} /> },
  ];

  return (
    <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
      <h2 className="text-xl font-bold">Snabbmeny för {shopName}</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {items.map((item) => (
          <Link
            key={item.label}
            href="#"
            className="relative flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold transition hover:border-purple-300 hover:bg-purple-50"
          >
            <span className="text-purple-700">{item.icon}</span>
            {item.label}
            {item.badge && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[11px] text-white">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <Link href="#" className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 px-5 py-3 text-sm font-semibold">
          <Lock size={18} />
          Byt lösenord
        </Link>
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  title,
  value,
  badge,
  badgeTone,
  subValue,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  badge?: string;
  badgeTone?: "green" | "red";
  subValue?: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
      <div className="flex items-start justify-between gap-4">
        <div className="inline-flex rounded-2xl bg-purple-700 p-3 text-white">{icon}</div>
        {badge && (
          <span className={badgeTone === "red" ? "rounded-xl bg-red-50 px-3 py-1 text-sm font-semibold text-red-700" : "rounded-xl bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700"}>
            {badge}
          </span>
        )}
      </div>

      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-stone-600">{value}</p>
      {subValue && <p className="text-sm font-medium text-stone-700">{subValue}</p>}
    </div>
  );
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-3">
      <span className="font-semibold text-stone-700">{label}</span>
      <span className="text-stone-600">{value}</span>
    </div>
  );
}

function DeliveryStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-semibold">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}

function SectionMiniTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-2xl bg-purple-50 p-2 text-purple-700">{icon}</div>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}
