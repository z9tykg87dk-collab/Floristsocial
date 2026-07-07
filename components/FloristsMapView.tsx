"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Globe2,
  Home,
  LocateFixed,
  MapPin,
  MessageCircle,
  Search,
  ShoppingCart,
  Star,
  Store,
  Truck,
} from "lucide-react";
import GuestAuthAction from "@/components/GuestAuthAction";

const FloristSearchMap = dynamic(() => import("@/components/FloristSearchMap"), {
  ssr: false,
});

type Florist = {
  id: string;
  shop_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  city?: string | null;
  municipality?: string | null;
  county?: string | null;
  bio?: string | null;
  description?: string | null;
  logo_url?: string | null;
  profile_image_url?: string | null;
  created_at?: string | null;
};

type OpeningHour = {
  dayLabel?: string;
  isClosed?: boolean;
  openTime?: string;
  closeTime?: string;
};

type FloristMapItem = {
  florist_id: string;
  florist_name: string | null;
  shop_name: string | null;
  city: string | null;
  area: string | null;
  delivery_radius_km: number | null;
  latitude: number;
  longitude: number;
  distance_km: number;
  profile_image_url: string | null;
  logo_url: string | null;
  rating: number | null;
  review_count: number | null;
  opening_hours: OpeningHour[] | null;
  same_day_cutoff_time: string | null;
  standard_delivery_fee: number | null;
  express_delivery_available: boolean | null;
  express_delivery_fee: number | null;
};

const countries = [
  "Sverige",
  "Norge",
  "Danmark",
  "Finland",
  "Island",
  "Frankrike",
  "Tyskland",
  "Spanien",
  "Italien",
  "Portugal",
  "Nederländerna",
  "Belgien",
  "Schweiz",
  "Österrike",
  "Polen",
  "Storbritannien",
  "Irland",
  "USA",
  "Kanada",
  "Australien",
  "Nya Zeeland",
  "Japan",
  "Sydkorea",
  "Kina",
  "Indien",
  "Thailand",
  "Turkiet",
  "Förenade Arabemiraten",
  "Brasilien",
  "Mexiko",
  "Sydafrika",
];

const citiesByCountry: Record<string, string[]> = {
  Sverige: [
    "Stockholm",
    "Göteborg",
    "Malmö",
    "Uppsala",
    "Västerås",
    "Örebro",
    "Linköping",
    "Helsingborg",
    "Jönköping",
    "Norrköping",
    "Lund",
    "Umeå",
    "Gävle",
    "Borås",
    "Södertälje",
    "Eskilstuna",
    "Halmstad",
    "Växjö",
    "Karlstad",
    "Sundsvall",
  ],
  Norge: ["Oslo", "Bergen", "Trondheim", "Stavanger", "Drammen", "Tromsø"],
  Danmark: ["Köpenhamn", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers"],
  Finland: ["Helsingfors", "Esbo", "Tammerfors", "Vanda", "Åbo", "Uleåborg"],
  Frankrike: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes"],
  Tyskland: ["Berlin", "Hamburg", "München", "Köln", "Frankfurt", "Stuttgart"],
};

const cityCoordinates: Record<string, [number, number]> = {
  Stockholm: [59.3293, 18.0686],
  Göteborg: [57.7089, 11.9746],
  Malmö: [55.605, 13.0038],
  Uppsala: [59.8586, 17.6389],
  Västerås: [59.6099, 16.5448],
  Örebro: [59.2753, 15.2134],
  Linköping: [58.4108, 15.6214],
  Helsingborg: [56.0465, 12.6945],
  Jönköping: [57.7826, 14.1618],
  Norrköping: [58.5877, 16.1924],
  Lund: [55.7047, 13.191],
  Umeå: [63.8258, 20.263],
  Oslo: [59.9139, 10.7522],
  Köpenhamn: [55.6761, 12.5683],
  Helsingfors: [60.1699, 24.9384],
  Paris: [48.8566, 2.3522],
  Berlin: [52.52, 13.405],
};

const fallbackImages = [
  "/design-preview/buketter/bukett-romantisk-rosa-1000.jpg",
  "/design-preview/buketter/bukett-floristens-val-pastell-750.jpg",
  "/design-preview/event/staende-dekoration-6000.jpg",
  "/design-preview/buketter/bukett-modern-orange-rosa.jpg",
];

function floristName(florist: Florist) {
  return (
    florist.shop_name ||
    `${florist.first_name || ""} ${florist.last_name || ""}`.trim() ||
    florist.email ||
    "Florist"
  );
}

function floristCity(florist: Florist) {
  return florist.city || florist.municipality || florist.county || "Sverige";
}

function floristImage(florist: Florist, index: number) {
  return (
    florist.logo_url ||
    florist.profile_image_url ||
    fallbackImages[index % fallbackImages.length]
  );
}

function shuffleFlorists(items: Florist[]) {
  return [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function toMapItems(florists: Florist[]): FloristMapItem[] {
  return florists.map((florist, index) => {
    const city = floristCity(florist);
    const base = cityCoordinates[city] || cityCoordinates.Stockholm;
    const offset = index * 0.015;

    return {
      florist_id: florist.id,
      florist_name: floristName(florist),
      shop_name: florist.shop_name || floristName(florist),
      city,
      area: florist.municipality || florist.county || null,
      delivery_radius_km: 15,
      latitude: base[0] + offset,
      longitude: base[1] + offset,
      distance_km: Number((1.2 + index * 0.7).toFixed(1)),
      profile_image_url: florist.profile_image_url || floristImage(florist, index),
      logo_url: florist.logo_url || florist.profile_image_url || null,
      rating: 4.9,
      review_count: 0,
      opening_hours: [
        {
          dayLabel: "Måndag",
          isClosed: false,
          openTime: "10:00",
          closeTime: "18:00",
        },
      ],
      same_day_cutoff_time: "13:00",
      standard_delivery_fee: 149,
      express_delivery_available: true,
      express_delivery_fee: 249,
    };
  });
}

export default function FloristsMapView({
  initialFlorists,
}: {
  initialFlorists: Florist[];
}) {
  const [country, setCountry] = useState("Sverige");
  const [city, setCity] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [sortMode, setSortMode] = useState("random");
  const [purchaseMode, setPurchaseMode] = useState<"flowers" | "subscription">("flowers");
  const [hoveredFloristId, setHoveredFloristId] = useState<string | null>(null);
  const [shuffledFlorists, setShuffledFlorists] = useState<Florist[]>(initialFlorists);

  useEffect(() => {
    setCountry(localStorage.getItem("deliveryCountry") || "Sverige");
    setCity(localStorage.getItem("deliveryCity") || "");
    setStreetAddress(localStorage.getItem("deliveryStreetAddress") || "");
    setPostalCode(localStorage.getItem("deliveryPostalCode") || "");
    setDeliveryDate(localStorage.getItem("deliveryDate") || "");
    setPurchaseMode(
      localStorage.getItem("purchaseMode") === "subscription"
        ? "subscription"
        : "flowers"
    );
    setShuffledFlorists(shuffleFlorists(initialFlorists));
  }, [initialFlorists]);

  const filteredFlorists = useMemo(() => {
    const source = sortMode === "random" ? shuffledFlorists : [...initialFlorists];

    const cityNeedle = city.trim().toLowerCase();

    const filtered = cityNeedle
      ? source.filter((florist) =>
          floristCity(florist).toLowerCase().includes(cityNeedle)
        )
      : source;

    if (sortMode === "az") {
      return [...filtered].sort((a, b) => floristName(a).localeCompare(floristName(b), "sv"));
    }

    return filtered;
  }, [city, initialFlorists, shuffledFlorists, sortMode]);

  const mapItems = useMemo(() => toMapItems(filteredFlorists), [filteredFlorists]);
  const visibleFlorists = filteredFlorists.slice(0, visibleCount);
  const citySuggestions = citiesByCountry[country] || [];

  const selectedCoords =
    city && cityCoordinates[city] ? cityCoordinates[city] : null;

  function saveSearch() {
    const fullAddress = [streetAddress, postalCode, city, country]
      .filter(Boolean)
      .join(", ");

    localStorage.setItem("deliveryCountry", country);
    localStorage.setItem("deliveryCity", city);
    localStorage.setItem("deliveryStreetAddress", streetAddress);
    localStorage.setItem("deliveryPostalCode", postalCode);
    localStorage.setItem("deliveryDate", deliveryDate);

    localStorage.setItem("recipientCountry", country);
    localStorage.setItem("recipientCity", city);
    localStorage.setItem("recipientStreetAddress", streetAddress);
    localStorage.setItem("recipientPostalCode", postalCode);
    localStorage.setItem("recipientDeliveryDate", deliveryDate);
    localStorage.setItem("recipientAddress", fullAddress);

    localStorage.setItem("orderRecipientCountry", country);
    localStorage.setItem("orderRecipientCity", city);
    localStorage.setItem("orderRecipientStreetAddress", streetAddress);
    localStorage.setItem("orderRecipientPostalCode", postalCode);
    localStorage.setItem("orderRecipientDeliveryDate", deliveryDate);
    localStorage.setItem("orderRecipientAddress", fullAddress);
    localStorage.setItem("purchaseMode", purchaseMode);
    localStorage.setItem(
      "selectedOrderType",
      purchaseMode === "subscription" ? "Bukett Prenumeration" : "Skicka blommor"
    );
  }

  function autoMatchToOrder() {
    saveSearch();
    localStorage.setItem("floristSelectionMode", "auto-match");
    localStorage.setItem("recipientSearchMode", "floristsocial-matching");
    localStorage.setItem("selectedFloristId", "");
    localStorage.setItem("selectedFloristName", "FloristSocial Matching");
    window.location.href = "/order/private/guest-v4";
  }

  function orderFromFlorist(florist: Florist) {
    saveSearch();

    localStorage.setItem("selectedFloristId", florist.id);
    localStorage.setItem("selectedFloristName", floristName(florist));

    window.location.href = "/order/private/guest-v4";
  }

  function orderFromMapFlorist(florist: FloristMapItem) {
    saveSearch();

    localStorage.setItem("selectedFloristId", florist.florist_id);
    localStorage.setItem(
      "selectedFloristName",
      florist.florist_name || florist.shop_name || "Florist"
    );

    localStorage.setItem(
      "selectedFloristDeliveryFee",
      String(florist.standard_delivery_fee ?? 0)
    );

    localStorage.setItem(
      "selectedFloristExpressFee",
      String(florist.express_delivery_fee ?? 0)
    );

    localStorage.setItem(
      "selectedFloristSameDayCutoff",
      florist.same_day_cutoff_time || ""
    );

    window.location.href = "/order/private/guest-v4";
  }

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-6 text-stone-950 md:px-8 lg:px-10">
      <section className="mx-auto max-w-[1800px]">
        <div className="rounded-[34px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-pink-600">
                FloristSocial karta
              </p>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                Hitta Florist
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600 md:text-base">
                Sök via land, stad, adress, postnummer eller datum. Informationen
                följer med till beställningen.
              </p>
            </div>

            <div className="rounded-full bg-pink-50 px-4 py-2 text-sm font-black text-pink-700">
              Visar {Math.min(visibleCount, filteredFlorists.length)} av{" "}
              {filteredFlorists.length} florister
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[360px_1fr]">
            <aside className="rounded-[30px] bg-[#fbf7f2] p-4 ring-1 ring-stone-200 md:p-5">
              <div className="grid gap-3">
                <SearchField label="Land" value={country} onChange={setCountry} listId="map-country-list" icon={Globe2} />
                <SearchField label="Stad" value={city} onChange={setCity} listId="map-city-list" icon={MapPin} />
                <SearchField label="Gatuadress" value={streetAddress} onChange={setStreetAddress} icon={Home} />
                <SearchField label="Postnummer" value={postalCode} onChange={setPostalCode} icon={MapPin} />

                <label className="rounded-2xl bg-white px-4 py-3 ring-1 ring-stone-200">
                  <span className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-stone-400">
                    <CalendarDays size={14} className="text-pink-600" />
                    Datum
                  </span>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(event) => setDeliveryDate(event.target.value)}
                    className="w-full bg-transparent text-sm font-bold outline-none"
                  />
                </label>

                <button
                  type="button"
                  onClick={autoMatchToOrder}
                  className="mt-2 rounded-2xl bg-emerald-50 px-4 py-4 text-sm font-black text-emerald-800 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
                >
                  Låt FloristSocial matcha florist
                </button>

                <button
                  type="button"
                  onClick={saveSearch}
                  className="rounded-full bg-pink-600 px-4 py-4 text-sm font-black !text-white"
                >
                  <Search size={16} className="mr-1 inline" />
                  Sök
                </button>

                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("recipientSearchMode", "near-me");
                    saveSearch();
                  }}
                  className="rounded-full bg-stone-950 px-4 py-4 text-sm font-black !text-white"
                >
                  <LocateFixed size={16} className="mr-1 inline" />
                  Nära mig
                </button>
              </div>

              <p className="mt-5 rounded-2xl bg-white p-4 text-xs font-semibold leading-6 text-stone-500 ring-1 ring-stone-200">
                Välj bara de fält du vill. Informationen sparas och följer med
                vidare till beställningen.
              </p>
            </aside>

            <div className="aspect-square min-h-[620px] overflow-hidden rounded-[32px] bg-white ring-1 ring-stone-200">
              <FloristSearchMap
                recipientLat={selectedCoords?.[0] || null}
                recipientLng={selectedCoords?.[1] || null}
                florists={mapItems}
                hoveredFloristId={hoveredFloristId}
                onHoverFlorist={setHoveredFloristId}
                onOrderFlorist={orderFromMapFlorist}
                mode="full"
              />
            </div>
          </div>

          <datalist id="map-country-list">
            {countries.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>

          <datalist id="map-city-list">
            {citySuggestions.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </div>

        <section className="mt-8 rounded-[34px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-pink-600">
                Resultat
              </p>
              <h2 className="text-3xl font-black tracking-tight">
                Florister som kan matcha leveransen
              </h2>
            </div>

            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value)}
              className="rounded-full bg-stone-50 px-5 py-3 text-sm font-black text-stone-900 ring-1 ring-stone-200"
            >
              <option value="random">Smart slumpmässig visning</option>
              <option value="az">A–Ö</option>
            </select>
          </div>

          {visibleFlorists.length === 0 ? (
            <div className="rounded-[28px] bg-stone-50 p-8 text-center ring-1 ring-stone-200">
              <h3 className="text-2xl font-black">Inga florister hittades</h3>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Prova att ändra stad eller söka på ett större område.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleFlorists.map((florist, index) => (
                <FloristCard
                  key={florist.id}
                  florist={florist}
                  index={index}
                  onOrder={() => orderFromFlorist(florist)}
                  onHover={() => setHoveredFloristId(florist.id)}
                  onLeave={() => setHoveredFloristId(null)}
                />
              ))}
            </div>
          )}

          {visibleCount < filteredFlorists.length ? (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((current) => current + 12)}
                className="rounded-full bg-stone-950 px-6 py-3 text-sm font-black !text-white"
              >
                Visa 12 till
              </button>
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}

function SearchField({
  label,
  value,
  onChange,
  listId,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  listId?: string;
  icon: typeof Search;
}) {
  return (
    <label className="rounded-2xl bg-stone-50 px-4 py-3 ring-1 ring-stone-200">
      <span className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-stone-400">
        <Icon size={14} className="text-pink-600" />
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        list={listId}
        className="w-full bg-transparent text-sm font-bold outline-none"
      />
    </label>
  );
}

function FloristCard({
  florist,
  index,
  onOrder,
  onHover,
  onLeave,
}: {
  florist: Florist;
  index: number;
  onOrder: () => void;
  onHover: () => void;
  onLeave: () => void;
}) {
  const name = floristName(florist);
  const city = floristCity(florist);
  const image = floristImage(florist, index);

  return (
    <article
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-stone-200/70 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="h-56 bg-stone-100">
        <img src={image} alt={name} className="h-full w-full object-cover" />
      </div>

      <div className="p-5">
        <h3 className="text-xl font-black">{name}</h3>

        <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-stone-500">
          <MapPin size={15} className="text-pink-600" />
          {city}
        </p>

        <p className="mt-2 flex items-center gap-1 text-sm font-black text-amber-600">
          <Star size={15} fill="currentColor" />
          4.9
        </p>

        <div className="mt-4 grid gap-2 text-xs font-black text-stone-600">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-emerald-700">
            <Truck size={14} />
            Levererar idag
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-3 py-2 text-stone-700">
            <Store size={14} />
            Butik oftast 10:00–18:00
          </span>
        </div>

        <p className="mt-4 text-xs font-semibold leading-6 text-stone-500">
          Kunden kan önska leveranstid, men exakt tid kan inte garanteras.
        </p>

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <a
            href={`/public/florist/${florist.id}`}
            className="rounded-full bg-stone-950 px-4 py-2 text-center text-sm font-black !text-white"
          >
            Profil
          </a>

          <GuestAuthAction icon={<MessageCircle size={15} />}>
            Chatta
          </GuestAuthAction>

          <button
            type="button"
            onClick={onOrder}
            className="rounded-full bg-pink-600 px-4 py-2 text-center text-sm font-black !text-white"
          >
            <ShoppingCart size={15} className="mr-1 inline" />
            Beställ
          </button>
        </div>
      </div>
    </article>
  );
}
