"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowRight,
  Clock,
  MapPin,
  MessageCircle,
  Search,
  ShoppingCart,
  Star,
  Store,
  Truck,
  Zap,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const FloristSearchMap = dynamic(() => import("@/components/FloristSearchMap"), {
  ssr: false,
});

type OpeningHour = {
  dayLabel?: string;
  isClosed?: boolean;
  openTime?: string;
  closeTime?: string;
};

type FloristResult = {
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

const fallbackImage = "/design-preview/buketter/bukett-romantisk-rosa-1000.jpg";

const dayNames = [
  "Söndag",
  "Måndag",
  "Tisdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lördag",
];

function isOpenNow(openingHours: OpeningHour[] | null) {
  if (!openingHours || openingHours.length === 0) {
    return { open: false, label: "Öppettider saknas" };
  }

  const now = new Date();
  const todayName = dayNames[now.getDay()];
  const today = openingHours.find((day) => day.dayLabel === todayName);

  if (!today || today.isClosed) {
    return { open: false, label: "Stängt just nu" };
  }

  const openTime = today.openTime || "10:00";
  const closeTime = today.closeTime || "18:00";

  const [openHour, openMinute] = openTime.split(":").map(Number);
  const [closeHour, closeMinute] = closeTime.split(":").map(Number);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = (openHour || 0) * 60 + (openMinute || 0);
  const closeMinutes = (closeHour || 0) * 60 + (closeMinute || 0);

  const open = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;

  return {
    open,
    label: open ? "Öppet nu" : "Stängt just nu",
  };
}

export default function TestHittaFloristPage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FloristResult[]>([]);
  const [error, setError] = useState("");
  const [recipientLat, setRecipientLat] = useState<number | null>(null);
  const [recipientLng, setRecipientLng] = useState<number | null>(null);
  const [hoveredFloristId, setHoveredFloristId] = useState<string | null>(null);

  useEffect(() => {
    const savedAddress = localStorage.getItem("recipientAddress");
    const savedResults = localStorage.getItem("nearbyFloristResults");
    const savedLat = localStorage.getItem("recipientLat");
    const savedLng = localStorage.getItem("recipientLng");

    if (savedAddress) setAddress(savedAddress);
    if (savedLat) setRecipientLat(Number(savedLat));
    if (savedLng) setRecipientLng(Number(savedLng));

    if (savedResults) {
      try {
        setResults(JSON.parse(savedResults));
      } catch {
        localStorage.removeItem("nearbyFloristResults");
      }
    }
  }, []);

  useEffect(() => {
    if (address.trim()) {
      localStorage.setItem("recipientAddress", address);
    }
  }, [address]);

  async function searchFlorists() {
    const cleanAddress = address.trim();

    if (cleanAddress.length < 5) {
      setError("Skriv mottagarens adress först.");
      return;
    }

    localStorage.setItem("recipientAddress", cleanAddress);

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const geoRes = await fetch(
        `/api/geocode?address=${encodeURIComponent(cleanAddress)}`
      );

      const geoData = await geoRes.json();

      if (!geoRes.ok) {
        throw new Error(geoData.error || "Kunde inte hitta adressen.");
      }

      localStorage.setItem("recipientLat", String(geoData.latitude));
      localStorage.setItem("recipientLng", String(geoData.longitude));
      localStorage.setItem(
        "recipientDisplayName",
        geoData.display_name || cleanAddress
      );

      setRecipientLat(Number(geoData.latitude));
      setRecipientLng(Number(geoData.longitude));

      const { data, error } = await supabase.rpc("find_nearby_florists", {
        recipient_lat: geoData.latitude,
        recipient_lng: geoData.longitude,
        max_distance_km: 30,
      });

      if (error) throw error;

      const nextResults = (data || []) as FloristResult[];
      setResults(nextResults);
      localStorage.setItem("nearbyFloristResults", JSON.stringify(nextResults));
    } catch (err: any) {
      setError(err.message || "Något gick fel.");
    } finally {
      setLoading(false);
    }
  }

  function orderFromFlorist(florist: FloristResult) {
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

    window.location.href = `/florist/${florist.florist_id}`;
  }

  return (
    <main className="min-h-screen bg-[#fbf7f2] text-stone-950">
      <section className="mx-auto max-w-[1540px] px-4 py-6 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[560px_1fr]">
          <aside className="rounded-[34px] bg-white p-5 shadow-sm ring-1 ring-stone-200 md:p-7">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-sm font-black text-pink-700">
                <MapPin size={16} />
                Hitta florist nära mottagaren
              </div>

              <h1 className="text-4xl font-black tracking-tight">
                Hitta florist
              </h1>

              <p className="mt-2 text-sm font-semibold text-stone-500">
                Vi hittar florister som kan leverera till mottagarens adress.
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-[#fbf7f2] p-2 ring-1 ring-stone-200">
              <div className="flex gap-2">
                <div className="flex flex-1 items-center gap-3 rounded-xl bg-white px-4">
                  <Search size={19} className="text-pink-600" />
                  <input
                    className="h-13 w-full bg-transparent text-sm font-bold outline-none placeholder:text-stone-400"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Drottninggatan 10 Stockholm"
                  />
                </div>

                <button
                  type="button"
                  onClick={searchFlorists}
                  className="cursor-pointer rounded-xl bg-pink-600 px-5 py-3 text-sm font-black !text-white shadow-sm transition hover:scale-105 hover:bg-pink-700"
                >
                  {loading ? "Söker..." : "Sök"}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            {results.length > 0 && (
              <div className="mt-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-stone-900">
                    {results.length} florist
                    {results.length === 1 ? "" : "er"} hittades
                  </p>
                  <p className="text-xs font-semibold text-stone-500">
                    Nära mottagarens adress
                  </p>
                </div>

                <div className="rounded-full bg-pink-50 px-4 py-2 text-xs font-black text-pink-700">
                  Sorterat efter avstånd
                </div>
              </div>
            )}

            <div className="mt-5 space-y-4">
              {results.map((florist) => {
                const name =
                  florist.florist_name || florist.shop_name || "Florist";
                const image =
                  florist.profile_image_url ||
                  florist.logo_url ||
                  fallbackImage;
                const rating = florist.rating ?? 4.9;
                const reviewCount = florist.review_count ?? 0;
                const openStatus = isOpenNow(florist.opening_hours);
                const isHovered = hoveredFloristId === florist.florist_id;

                return (
                  <article
                    key={florist.florist_id}
                    onMouseEnter={() => setHoveredFloristId(florist.florist_id)}
                    onMouseLeave={() => setHoveredFloristId(null)}
                    className={`overflow-hidden rounded-[24px] border bg-white shadow-sm transition ${
                      isHovered
                        ? "border-pink-500 shadow-xl"
                        : "border-stone-200"
                    }`}
                  >
                    <div className="flex gap-4 p-4">
                      <div className="h-32 w-32 shrink-0 overflow-hidden rounded-[18px] bg-pink-50 ring-1 ring-stone-200">
                        <img
                          src={image}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h2 className="truncate text-xl font-black">
                              {name}
                            </h2>

                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-bold">
                              <span className="inline-flex items-center gap-1 text-amber-600">
                                <Star size={16} fill="currentColor" />
                                {rating}
                              </span>

                              <span className="text-stone-500">
                                ({reviewCount})
                              </span>

                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${
                                  openStatus.open
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-red-50 text-red-700"
                                }`}
                              >
                                ● {openStatus.label}
                              </span>
                            </div>
                          </div>

                          <ArrowRight size={18} className="text-stone-400" />
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-b border-stone-100 pb-3 text-sm font-semibold text-stone-600">
                          <div className="flex items-center gap-2">
                            <MapPin size={15} />
                            {florist.distance_km} km
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock size={15} />
                            {florist.same_day_cutoff_time || "-"}
                          </div>

                          <div className="flex items-center gap-2">
                            <Truck size={15} />
                            {florist.standard_delivery_fee ?? 0} kr
                          </div>

                          {florist.express_delivery_available && (
                            <div className="flex items-center gap-2">
                              <Zap size={15} className="text-yellow-600" />
                              {florist.express_delivery_fee ?? 0} kr
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 border-t border-stone-100 p-4 pt-3">
                      <Link
                        href={`/public/florist/${florist.florist_id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 text-xs font-black text-stone-900 ring-1 ring-stone-200 transition hover:bg-stone-50"
                      >
                        <Store size={15} />
                        <span className="hidden sm:inline">Besök butik</span>
                      </Link>

                      <Link
                        href={`/chat?floristId=${florist.florist_id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 text-xs font-black text-stone-900 ring-1 ring-stone-200 transition hover:bg-stone-50"
                      >
                        <MessageCircle size={15} />
                        <span className="hidden sm:inline">Chatta</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => orderFromFlorist(florist)}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-pink-600 px-3 py-3 text-xs font-black !text-white transition hover:bg-pink-700"
                      >
                        <ShoppingCart size={15} />
                        <span className="hidden sm:inline">Beställ här</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {results.length === 0 && !loading && (
              <p className="mt-8 text-sm font-semibold text-stone-500">
                Skriv mottagarens adress och klicka på Sök.
              </p>
            )}
          </aside>

          <section className="lg:sticky lg:top-6 lg:self-start">
            {results.length > 0 ? (
              <FloristSearchMap
                recipientLat={recipientLat}
                recipientLng={recipientLng}
                florists={results}
                hoveredFloristId={hoveredFloristId}
                onHoverFlorist={setHoveredFloristId}
                onOrderFlorist={orderFromFlorist}
              />
            ) : (
              <div className="grid h-[620px] place-items-center rounded-[34px] border border-stone-200 bg-white shadow-sm">
                <div className="max-w-md text-center">
                  <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-pink-50 text-3xl">
                    🌸
                  </div>
                  <h2 className="text-2xl font-black">Kartan visas här</h2>
                  <p className="mt-2 text-sm font-semibold text-stone-500">
                    När du söker på en mottagaradress visas florister och
                    avstånd direkt på kartan.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
