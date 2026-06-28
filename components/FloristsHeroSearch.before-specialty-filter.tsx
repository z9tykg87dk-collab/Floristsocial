"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowRight,
  Clock,
  MapPin,
  MessageCircle,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  Truck,
  Zap,
} from "lucide-react";

const FloristSearchMap = dynamic(() => import("@/components/FloristSearchMap"), {
  ssr: false,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

const filters = [
  "Alla",
  "Buketter",
  "Bröllop",
  "Begravning",
  "Företag",
  "Event",
  "Växter",
];

const fallbackImage = "/design-preview/buketter/bukett-romantisk-rosa-1000.jpg";
const dayNames = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];

function isOpenNow(openingHours: OpeningHour[] | null) {
  if (!openingHours?.length) return { open: false, label: "Öppettider saknas" };

  const now = new Date();
  const today = openingHours.find((day) => day.dayLabel === dayNames[now.getDay()]);
  if (!today || today.isClosed) return { open: false, label: "Stängt just nu" };

  const [oh, om] = (today.openTime || "10:00").split(":").map(Number);
  const [ch, cm] = (today.closeTime || "18:00").split(":").map(Number);

  const current = now.getHours() * 60 + now.getMinutes();
  const openMinutes = (oh || 0) * 60 + (om || 0);
  const closeMinutes = (ch || 0) * 60 + (cm || 0);
  const open = current >= openMinutes && current <= closeMinutes;

  return { open, label: open ? "Öppet nu" : "Stängt just nu" };
}

export default function FloristsHeroSearch() {
  const [address, setAddress] = useState("");
  const [results, setResults] = useState<FloristResult[]>([]);
  const [recipientLat, setRecipientLat] = useState<number | null>(null);
  const [recipientLng, setRecipientLng] = useState<number | null>(null);
  const [hoveredFloristId, setHoveredFloristId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  async function searchFlorists() {
    const cleanAddress = address.trim();

    if (cleanAddress.length < 5) {
      setError("Skriv mottagarens adress först.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const geoRes = await fetch(`/api/geocode?address=${encodeURIComponent(cleanAddress)}`);
      const geoData = await geoRes.json();

      if (!geoRes.ok) {
        throw new Error(geoData.error || "Kunde inte hitta adressen.");
      }

      localStorage.setItem("recipientAddress", cleanAddress);
      localStorage.setItem("recipientLat", String(geoData.latitude));
      localStorage.setItem("recipientLng", String(geoData.longitude));
      localStorage.setItem("recipientDisplayName", geoData.display_name || cleanAddress);

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
    localStorage.setItem("selectedFloristName", florist.florist_name || florist.shop_name || "Florist");
    localStorage.setItem("selectedFloristDeliveryFee", String(florist.standard_delivery_fee ?? 0));
    localStorage.setItem("selectedFloristExpressFee", String(florist.express_delivery_fee ?? 0));
    localStorage.setItem("selectedFloristSameDayCutoff", florist.same_day_cutoff_time || "");

    window.location.href = `/florist/${florist.florist_id}`;
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[38px] bg-gradient-to-br from-white via-pink-50 to-emerald-50 p-6 shadow-sm ring-1 ring-stone-200/70 md:p-9">
          <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-pink-700 shadow-sm ring-1 ring-pink-100">
                <Sparkles size={16} />
                Hitta florist nära dig
              </div>

              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                Upptäck florister nära mottagaren
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-600">
                Skriv mottagarens adress så visar vi florister som kan leverera dit.
              </p>

              <div className="mt-7 max-w-2xl rounded-full bg-white p-2 shadow-lg ring-1 ring-stone-200">
                <div className="flex items-center gap-3 px-4">
                  <Search size={20} className="text-pink-600" />
                  <input
                    className="h-12 w-full bg-transparent text-sm font-semibold outline-none placeholder:text-stone-400"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") searchFlorists();
                    }}
                    placeholder="Drottninggatan 10 Stockholm"
                  />
                  <button
                    type="button"
                    onClick={searchFlorists}
                    className="hidden cursor-pointer rounded-full bg-stone-950 px-5 py-3 text-sm font-black !text-white transition hover:opacity-90 sm:block"
                  >
                    {loading ? "Söker..." : "Sök"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {filters.map((filter, index) => (
                  <button
                    key={filter}
                    className={
                      index === 0
                        ? "rounded-full bg-pink-600 px-4 py-2 text-sm font-black !text-white"
                        : "rounded-full bg-white px-4 py-2 text-sm font-black text-stone-800 ring-1 ring-stone-200"
                    }
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

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
              <div className="relative min-h-[380px] overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-100 via-sky-100 to-amber-50 shadow-xl ring-1 ring-stone-200">
                <div className="absolute inset-0 opacity-80">
                  <div className="absolute left-[12%] top-[18%] h-40 w-40 rounded-full bg-emerald-300/40 blur-3xl" />
                  <div className="absolute bottom-[10%] right-[12%] h-48 w-48 rounded-full bg-sky-300/40 blur-3xl" />
                  <div className="absolute left-[38%] top-[45%] h-52 w-52 rounded-full bg-amber-200/50 blur-3xl" />
                </div>

                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.36)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.36)_1px,transparent_1px)] bg-[size:56px_56px]" />

                <div className="absolute bottom-5 left-5 right-5 rounded-[24px] bg-white/90 p-5 shadow-lg backdrop-blur">
                  <p className="text-sm font-black text-stone-900">
                    Skriv mottagarens adress
                  </p>
                  <p className="mt-1 text-xs font-semibold text-stone-500">
                    Då visas florister och leveransinformation på kartan.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {results.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-6 md:px-8 lg:px-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-pink-600">
                Florister nära mottagaren
              </p>
              <h2 className="text-3xl font-black tracking-tight">
                {results.length} florist{results.length === 1 ? "" : "er"} kan leverera hit
              </h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {results.map((florist) => {
              const name = florist.florist_name || florist.shop_name || "Florist";
              const image = florist.profile_image_url || florist.logo_url || fallbackImage;
              const status = isOpenNow(florist.opening_hours);
              const isHovered = hoveredFloristId === florist.florist_id;

              return (
                <article
                  key={florist.florist_id}
                  onMouseEnter={() => setHoveredFloristId(florist.florist_id)}
                  onMouseLeave={() => setHoveredFloristId(null)}
                  className={`overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 transition hover:-translate-y-1 hover:shadow-xl ${
                    isHovered ? "ring-pink-400" : "ring-stone-200/70"
                  }`}
                >
                  <div className="relative h-56 bg-stone-100">
                    <img src={image} alt={name} className="h-full w-full object-cover" />
                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-pink-700 shadow-sm">
                      {status.label}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-black">{name}</h3>
                        <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-stone-500">
                          <MapPin size={15} className="text-pink-600" />
                          {florist.distance_km} km från mottagaren
                        </p>
                      </div>

                      <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-black text-amber-700">
                        <Star size={14} className="mr-1 inline" fill="currentColor" />
                        {florist.rating ?? 4.9}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-semibold text-stone-600">
                      <span className="inline-flex items-center gap-2">
                        <Clock size={15} />
                        {florist.same_day_cutoff_time || "-"}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Truck size={15} />
                        {florist.standard_delivery_fee ?? 0} kr
                      </span>
                      {florist.express_delivery_available && (
                        <span className="inline-flex items-center gap-2">
                          <Zap size={15} />
                          {florist.express_delivery_fee ?? 0} kr
                        </span>
                      )}
                    </div>

                    <div className="mt-5 grid gap-2 sm:grid-cols-3">
                      <Link href={`/florist/${florist.florist_id}`} className="inline-flex items-center justify-center gap-1 rounded-full bg-stone-950 px-4 py-2 text-sm font-black !text-white">
                        <Store size={15} />
                        Butik
                      </Link>
                      <Link href={`/chat?floristId=${florist.florist_id}`} className="inline-flex items-center justify-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-black text-stone-900 ring-1 ring-stone-200">
                        <MessageCircle size={15} />
                        Chatta
                      </Link>
                      <button onClick={() => orderFromFlorist(florist)} className="rounded-full bg-pink-600 px-4 py-2 text-sm font-black !text-white">
                        Beställ
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
