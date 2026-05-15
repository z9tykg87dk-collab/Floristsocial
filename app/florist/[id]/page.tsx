import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function asArray(value: any) {
  return Array.isArray(value) ? value : [];
}

function asObject(value: any) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  return {};
}

function getImageUrl(item: any) {
  if (!item) return "";
  if (typeof item === "string") return item;
  return item.url || item.publicUrl || item.src || item.image?.url || "";
}

function formatPrice(value: any) {
  if (value === null || value === undefined || value === "") return "";
  const text = String(value).trim();
  if (!text) return "";
  return text.toLowerCase().includes("kr") ? text : `${text} kr`;
}

function orderLink(floristId: string, item: any) {
  const params = new URLSearchParams();
  params.set("floristId", floristId);
  if (item?.serviceName) params.set("service", String(item.serviceName));
  if (item?.title) params.set("title", String(item.title));
  if (item?.price) params.set("price", String(item.price));
  return `/orders/new?${params.toString()}`;
}

function serviceLink(floristId: string, service: string) {
  const params = new URLSearchParams();
  params.set("floristId", floristId);
  params.set("service", service);
  return `/orders/new?${params.toString()}`;
}

function styleLink(floristId: string, style: string) {
  const params = new URLSearchParams();
  params.set("floristId", floristId);
  params.set("style", style);
  return `/orders/new?${params.toString()}`;
}

function flattenServicePortfolio(servicePortfolioItems: any) {
  const obj = asObject(servicePortfolioItems);

  return Object.entries(obj)
    .flatMap(([serviceName, items]) =>
      asArray(items).map((item: any) => ({
        ...item,
        serviceName: item?.serviceName || serviceName,
        url: getImageUrl(item),
      }))
    )
    .filter((item: any) => item.url);
}

function normalizeGeneralPortfolio(generalPortfolioItems: any) {
  return asArray(generalPortfolioItems)
    .map((item: any) => ({
      ...item,
      serviceName: item?.serviceName || "Allmän portfolio",
      url: getImageUrl(item),
    }))
    .filter((item: any) => item.url);
}

function fallbackPortfolio(portfolioImages: any) {
  return asArray(portfolioImages)
    .map((item: any, index: number) => ({
      title: item?.title || `Portfolio ${index + 1}`,
      price: item?.price || "",
      description: item?.description || "",
      hashtags: item?.hashtags || "",
      serviceName: item?.serviceName || "Portfolio",
      url: getImageUrl(item),
    }))
    .filter((item: any) => item.url);
}

function portfolioByService(items: any[]) {
  return items.reduce<Record<string, any[]>>((groups, item) => {
    const key = item.serviceName || "Portfolio";
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {});
}

function buildFloristStory(florist: any, styles: any[], deliveryAreas: any[]) {
  const shopName = florist.shop_name || florist.florist_name || "Floristen";
  const styleText = styles.length > 0 ? styles.slice(0, 3).join(", ").toLowerCase() : "personliga";
  const deliveryModel = florist.delivery_model ? String(florist.delivery_model).toLowerCase() : "lokalt";
  const firstPrice = deliveryAreas.find((area: any) => area?.price)?.price;
  const priceText = firstPrice ? ` och leveranspriset börjar från ${formatPrice(firstPrice)}` : "";
  const radiusText = florist.delivery_radius_km ? ` inom upp till ${florist.delivery_radius_km} km` : "";

  return `${shopName} erbjuder ${styleText} blomsterarrangemang och buketter till sina kunder. ${shopName} levererar ${deliveryModel}${radiusText}${priceText}.`;
}

function nextTwoMonths() {
  const today = new Date();
  const months = [];

  for (let offset = 0; offset < 2; offset += 1) {
    const first = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const year = first.getFullYear();
    const month = first.getMonth();
    const numberOfDays = new Date(year, month + 1, 0).getDate();
    const startDay = (first.getDay() + 6) % 7;

    months.push({
      label: first.toLocaleDateString("sv-SE", { month: "long", year: "numeric" }),
      blanks: Array.from({ length: startDay }),
      days: Array.from({ length: numberOfDays }, (_, index) => {
        const date = new Date(year, month, index + 1);
        return {
          day: index + 1,
          value: date.toISOString().slice(0, 10),
        };
      }),
    });
  }

  return months;
}

export default async function FloristProfilePage({ params }: PageProps) {
  const { id } = await params;
  const lookupColumn = isUuid(id) ? "id" : "slug";

  const { data: florist, error } = await supabase
    .from("florists")
    .select("*")
    .eq(lookupColumn, id)
    .single();

  console.log("FLORIST PROFILE LOOKUP:", {
    id,
    lookupColumn,
    florist,
    error,
  });

  if (error || !florist) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-neutral-200">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Florist hittades inte</h1>
          <p className="text-neutral-600 mb-8">Vi kunde inte hitta floristprofilen du försökte öppna.</p>
          <div className="space-y-3">
            <Link href="/" className="block w-full rounded-2xl bg-black text-white py-3 font-medium hover:opacity-90 transition">
              Tillbaka till feed
            </Link>
            <Link href="/florists" className="block w-full rounded-2xl border border-neutral-300 py-3 font-medium hover:bg-neutral-100 transition">
              Visa alla florister
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shopName = florist.shop_name || florist.florist_name || florist.profile_name || "Florist";
  const logoImage = florist.logo_url || "";
  const profileImage = florist.profile_image_url && florist.profile_image_url !== logoImage ? florist.profile_image_url : "https://placehold.co/400x400/png";

  const servicePortfolio = flattenServicePortfolio(florist.service_portfolio_items);
  const generalPortfolio = normalizeGeneralPortfolio(florist.general_portfolio_items);
  const oldPortfolio = fallbackPortfolio(florist.portfolio_images);
  const portfolioItems = servicePortfolio.length || generalPortfolio.length ? [...servicePortfolio, ...generalPortfolio] : oldPortfolio;
  const groupedServicePortfolio = portfolioByService(servicePortfolio);

  const coverImage = florist.cover_image_url || portfolioItems[0]?.url || "https://placehold.co/1400x500/png";
  const services = asArray(florist.services || florist.selectedServices);
  const styles = asArray(florist.styles || florist.selectedStyles);
  const deliveryAreas = asArray(florist.delivery_areas || florist.coverageAreas);
  const openingHours = asArray(florist.opening_hours);
  const closedDates = asArray(florist.closed_dates);
  const holidayOverrides = asArray(florist.holiday_overrides);
  const calendarEvents = asArray(florist.calendar_events);
  const seasonalClosures = asArray(florist.seasonal_closures);
  const floristStory = buildFloristStory(florist, styles, deliveryAreas);
  const months = nextTwoMonths();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="relative h-[420px] bg-neutral-200 overflow-hidden">
        <Image src={coverImage} alt={shopName} fill className="object-cover" priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className="absolute bottom-8 left-0 right-0 px-6">
          <div className="max-w-6xl mx-auto text-white">
            <div className="flex items-center gap-4 mb-5">
              {logoImage && (
                <div className="relative h-20 w-20 rounded-3xl overflow-hidden bg-white shadow-xl border border-white/60">
                  <Image src={logoImage} alt={`${shopName} logotyp`} fill className="object-cover" unoptimized />
                </div>
              )}
              <div>
                <div className="inline-flex rounded-full bg-white/20 backdrop-blur px-4 py-2 text-sm mb-3">
                  Aktiv florist på FloristSocial
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{shopName}</h1>
              </div>
            </div>
            {(florist.city || florist.municipality || florist.county) && (
              <p className="text-lg text-white/90">
                📍 {[florist.city, florist.municipality, florist.county].filter(Boolean).join(", ")}
              </p>
            )}
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 pb-20 -mt-10 relative z-10">
        <section className="bg-white rounded-[32px] shadow-xl border border-neutral-200 p-6 md:p-10 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="relative w-36 h-36 shrink-0 rounded-[28px] overflow-hidden border-4 border-white shadow-lg bg-neutral-100">
              <Image src={profileImage} alt={`${shopName} profilbild`} fill className="object-cover" unoptimized />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                {florist.role && <span className="rounded-full bg-green-100 text-green-700 px-4 py-1 text-sm font-medium">{florist.role}</span>}
                {florist.price_level && <span className="rounded-full bg-pink-100 text-pink-700 px-4 py-1 text-sm font-medium">{florist.price_level}</span>}
                {florist.delivery_model && <span className="rounded-full bg-blue-100 text-blue-700 px-4 py-1 text-sm font-medium">{florist.delivery_model}</span>}
              </div>

              <h2 className="text-3xl font-bold mb-3">{shopName}</h2>
              <p className="text-neutral-600 text-lg leading-relaxed max-w-3xl">{floristStory}</p>
              {florist.bio && <p className="text-neutral-500 leading-7 mt-4 max-w-3xl">{florist.bio}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-8 text-sm">
                {florist.legal_business_name && <InfoCard label="Företagsnamn" value={florist.legal_business_name} />}
                {florist.city && <InfoCard label="Stad" value={florist.city} />}
                {florist.country && <InfoCard label="Land" value={florist.country} />}
                {florist.price_level && <InfoCard label="Prisnivå" value={florist.price_level} />}
                {florist.minimum_booking_value && <InfoCard label="Minsta bokningsvärde" value={formatPrice(florist.minimum_booking_value)} />}
                {florist.years_in_business && <InfoCard label="År i branschen" value={`${florist.years_in_business} år`} />}
                {florist.team_size && <InfoCard label="Team" value={`${florist.team_size} florist(er)`} />}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href={`/messages/new?floristId=${florist.id}`} className="rounded-2xl bg-black text-white px-6 py-3 text-center font-semibold hover:opacity-90 transition">
                  Kontakta floristen via FloristSocial
                </Link>
                <Link href={`/orders/new?floristId=${florist.id}`} className="rounded-2xl border border-neutral-300 px-6 py-3 text-center font-semibold hover:bg-neutral-50 transition">
                  Starta beställning
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Panel title="Specialiteter och tjänster" subtitle="Välj en tjänst för att starta beställning eller se exempelbilder.">
              {services.length === 0 ? (
                <EmptyState text="Inga tjänster registrerade ännu." />
              ) : (
                <div className="space-y-8">
                  {services.map((service: any, index: number) => {
                    const serviceName = String(service);
                    const items = groupedServicePortfolio[serviceName] || [];

                    return (
                      <div key={`${serviceName}-${index}`} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                          <div>
                            <h3 className="text-xl font-bold text-neutral-900">{serviceName}</h3>
                            <p className="text-sm text-neutral-500">Exempel och beställningsväg för {serviceName.toLowerCase()}.</p>
                          </div>
                          <Link href={serviceLink(florist.id, serviceName)} className="rounded-2xl bg-pink-600 text-white px-5 py-3 text-sm font-semibold hover:bg-pink-700 transition">
                            Beställ {serviceName}
                          </Link>
                        </div>

                        {items.length === 0 ? (
                          <p className="text-sm text-neutral-500">Inga bilder uppladdade för denna tjänst ännu.</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {items.map((item: any, itemIndex: number) => (
                              <PortfolioCard key={`${item.url}-${itemIndex}`} item={item} floristId={florist.id} />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Panel>

            <Panel title="Portfolio" subtitle="Bilder, priser och beskrivningar från floristen.">
              {portfolioItems.length === 0 ? (
                <EmptyState text="Inga portfolio-bilder uppladdade ännu." />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {portfolioItems.map((item: any, index: number) => (
                    <PortfolioCard key={`${item.url}-${index}`} item={item} floristId={florist.id} />
                  ))}
                </div>
              )}
            </Panel>

            <Panel title="Stil" subtitle="Klicka på en stil för att starta en beställning i den stilen.">
              {styles.length === 0 ? (
                <EmptyState text="Inga stilar registrerade ännu." />
              ) : (
                <div className="flex flex-wrap gap-3">
                  {styles.map((style: any, index: number) => {
                    const styleName = String(style);
                    return (
                      <Link key={`${styleName}-${index}`} href={styleLink(florist.id, styleName)} className="rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-900 hover:text-white transition">
                        {styleName}
                      </Link>
                    );
                  })}
                </div>
              )}
            </Panel>
          </div>

          <aside className="space-y-8">
            <Panel title="Leveransområden" subtitle="Pris baserat på avstånd från butiken.">
              {deliveryAreas.length === 0 ? (
                <EmptyState text="Inga leveransområden registrerade ännu." />
              ) : (
                <div className="space-y-3">
                  {deliveryAreas.map((area: any, index: number) => (
                    <div key={`${area?.id || area?.city || "area"}-${index}`} className="rounded-2xl border border-neutral-200 p-4 bg-neutral-50">
                      <div className="font-semibold text-neutral-900">{area?.city || florist.city || "Leveransområde"}</div>
                      <div className="text-sm text-neutral-600 mt-2">
                        Avstånd från butik upp till {area?.radius || florist.delivery_radius_km || "?"} km är {formatPrice(area?.price) || "ej angivet"}.
                      </div>
                      {area?.area && <div className="text-xs text-neutral-400 mt-2">Område: {area.area}</div>}
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            <Panel title="Öppettider" subtitle="Butikens registrerade tider.">
              {openingHours.length === 0 ? (
                <EmptyState text="Inga öppettider registrerade ännu." />
              ) : (
                <div className="space-y-2">
                  {openingHours.map((day: any, index: number) => (
                    <div key={`${day?.dayLabel || "day"}-${day?.id || index}`} className="flex justify-between gap-4 text-sm border-b border-neutral-100 pb-2">
                      <span className="font-medium">{day?.dayLabel || day?.day || `Dag ${index + 1}`}</span>
                      <span className="text-neutral-600">{day?.isClosed ? "Stängt" : `${day?.openTime || ""}–${day?.closeTime || ""}`}</span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            <Panel title="Helgdagar" subtitle="Floristens val för svenska helgdagar.">
              {holidayOverrides.length === 0 ? (
                <EmptyState text="Inga helgdagar registrerade ännu." />
              ) : (
                <div className="space-y-2">
                  {holidayOverrides.map((holiday: any, index: number) => (
                    <div key={`${holiday?.name || "holiday"}-${index}`} className="rounded-2xl bg-neutral-50 border border-neutral-200 p-3 text-sm">
                      <div className="font-semibold">{holiday?.name}</div>
                      <div className={holiday?.status === "open" ? "text-emerald-700" : "text-red-700"}>
                        {holiday?.status === "open" ? "Öppet" : "Stängt"}
                      </div>
                      {holiday?.note && <div className="text-neutral-500 mt-1">{holiday.note}</div>}
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            <Panel title="Floristkalender" subtitle="Kommande två månader och avvikande dagar.">
              <ClosedDaysCalendar months={months} closedDates={closedDates} calendarEvents={calendarEvents} />
            </Panel>

            <Panel title="Längre stängda perioder" subtitle="Till exempel sommarstängt eller semester.">
              {seasonalClosures.length === 0 ? (
                <EmptyState text="Inga längre stängda perioder registrerade ännu." />
              ) : (
                <div className="space-y-3">
                  {seasonalClosures.map((closure: any, index: number) => (
                    <div key={`${closure?.from || "closure"}-${closure?.to || index}`} className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 text-sm">
                      <div className="font-semibold">{closure?.title || "Stängd period"}</div>
                      <div className="text-neutral-600 mt-1">{closure?.from} – {closure?.to}</div>
                      {closure?.note && <div className="text-neutral-500 mt-2">{closure.note}</div>}
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </aside>
        </div>
      </main>
    </div>
  );
}

function PortfolioCard({ item, floristId }: { item: any; floristId: string }) {
  return (
    <Link href={orderLink(floristId, item)} className="overflow-hidden rounded-[28px] bg-white border border-neutral-200 shadow-sm group hover:shadow-lg transition">
      <div className="relative aspect-square bg-neutral-100">
        <Image src={item.url} alt={item.title || "Portfolio"} fill className="object-cover group-hover:scale-105 transition duration-500" unoptimized />
      </div>
      <div className="p-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-pink-600 mb-2">{item.serviceName || "Portfolio"}</div>
        <h3 className="font-bold text-lg text-neutral-900">{item.title || "Beställ liknande"}</h3>
        {item.price && <p className="mt-1 font-semibold text-neutral-700">{formatPrice(item.price)}</p>}
        {item.description && <p className="mt-3 text-sm leading-6 text-neutral-600">{item.description}</p>}
        {item.hashtags && <p className="mt-3 text-sm text-pink-600 break-words">{item.hashtags}</p>}
        <div className="mt-4 inline-flex rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white">
          Beställ / köp liknande
        </div>
      </div>
    </Link>
  );
}

function ClosedDaysCalendar({
  months,
  closedDates,
  calendarEvents,
}: {
  months: any[];
  closedDates: any[];
  calendarEvents: any[];
}) {
  const closedSet = new Set(closedDates.map(String));
  const eventByDate = new Map(calendarEvents.map((event: any) => [String(event.date), event]));
  const weekdays = ["M", "T", "O", "T", "F", "L", "S"];

  return (
    <div className="space-y-6">
      {months.map((month, monthIndex) => (
        <div key={`${month.label}-${monthIndex}`}>
          <h3 className="font-semibold capitalize mb-3">{month.label}</h3>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-neutral-400 mb-2">
            {weekdays.map((day, index) => (
              <div key={`${day}-${index}`}>{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {month.blanks.map((_: any, index: number) => (
              <div key={`blank-${month.label}-${index}`} />
            ))}
            {month.days.map((day: any) => {
              const event = eventByDate.get(day.value);
              const isClosed = closedSet.has(day.value) || event?.status === "closed";
              const isOpen = event?.status === "open";
              const isSpecial = event?.status === "special-hours";
              const isActivity = event?.status === "activity";

              return (
                <div
                  key={day.value}
                  title={event?.title || day.value}
                  className={`aspect-square rounded-xl text-sm font-medium border flex items-center justify-center ${
                    isClosed
                      ? "bg-red-500 text-white border-red-500"
                      : isOpen
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : isSpecial
                      ? "bg-amber-500 text-white border-amber-500"
                      : isActivity
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-neutral-700 border-neutral-200"
                  }`}
                >
                  {day.day}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
      <div className="text-xs uppercase tracking-wide text-neutral-400 mb-1">{label}</div>
      <div className="font-medium text-neutral-900 break-words">{value}</div>
    </div>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-[32px] border border-neutral-200 shadow-sm p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
        {subtitle && <p className="text-neutral-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 py-12 text-center">
      <p className="text-neutral-500">{text}</p>
    </div>
  );
}

