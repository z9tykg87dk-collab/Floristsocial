"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
  Search,
  Star,
  Truck,
  Zap,
} from "lucide-react";

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
    label: open ? `Öppet nu till ${closeTime}` : "Stängt just nu",
  };
}

export default function TestHittaFloristPage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FloristResult[]>([]);
  const [selectedFloristId, setSelectedFloristId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedAddress = localStorage.getItem("recipientAddress");
    const savedResults = localStorage.getItem("nearbyFloristResults");
    const savedFloristId = localStorage.getItem("selectedFloristId");

    if (savedAddress) setAddress(savedAddress);

    if (savedResults) {
      try {
        setResults(JSON.parse(savedResults));
      } catch {
        localStorage.removeItem("nearbyFloristResults");
      }
    }

    if (savedFloristId) setSelectedFloristId(savedFloristId);
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
    setSelectedFloristId(null);

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

      const { data, error } = await supabase.rpc("find_nearby_florists", {
        recipient_lat: geoData.latitude,
        recipient_lng: geoData.longitude,
        max_distance_km: 30,
      });

      if (error) throw error;

      const nextResults = (data || []) as FloristResult[];
      setResults(nextResults);
      localStorage.setItem("nearbyFloristResults", JSON.stringify(nextResults));
      localStorage.removeItem("selectedFloristId");
    } catch (err: any) {
      setError(err.message || "Något gick fel.");
    } finally {
      setLoading(false);
    }
  }

  function chooseFlorist(florist: FloristResult) {
    setSelectedFloristId(florist.florist_id);
    localStorage.setItem("selectedFloristId", florist.florist_id);
    localStorage.setItem(
      "selectedFloristName",
      florist.florist_name || florist.shop_name || "Florist"
    );
  }

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-10 text-stone-950">
      <section className="mx-auto max-w-5xl rounded-[36px] bg-white p-6 shadow-sm ring-1 ring-stone-200 md:p-10">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-sm font-black text-pink-700">
          <MapPin size={16} />
          Hitta florist nära mottagaren
        </div>

        <h1 className="text-4xl font-black tracking-tight">
          Sök på mottagarens adress
        </h1>

        <p className="mt-3 max-w-2xl text-stone-600">
          Vi hittar florister som kan leverera blomsterarrangemang nära mottagaren.
        </p>

        <div className="mt-7 flex flex-col gap-3 rounded-[24px] bg-[#fbf7f2] p-3 ring-1 ring-stone-200 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-4">
            <Search size={20} className="text-pink-600" />
            <input
              className="h-14 w-full bg-transparent text-sm font-semibold outline-none placeholder:text-stone-400"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Drottninggatan 10 Stockholm"
            />
          </div>

          <button
            type="button"
            onClick={searchFlorists}
            className="cursor-pointer rounded-2xl bg-stone-950 px-6 py-4 text-sm font-black !text-white transition hover:scale-105 hover:opacity-90"
          >
            {loading ? "Söker..." : "Hitta florist"}
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <p className="mt-8 text-sm font-black text-stone-600">
            {results.length} florist{results.length === 1 ? "" : "er"} hittades nära mottagaren
          </p>
        )}

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {results.map((florist) => {
            const isSelected = selectedFloristId === florist.florist_id;
            const name = florist.florist_name || florist.shop_name || "Florist";
            const image = florist.logo_url || florist.profile_image_url || fallbackImage;
            const rating = florist.rating ?? 4.9;
            const reviewCount = florist.review_count ?? 0;
            const openStatus = isOpenNow(florist.opening_hours);

            return (
              <article
                key={florist.florist_id}
                className={`overflow-hidden rounded-[30px] border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                  isSelected
                    ? "border-pink-500 ring-2 ring-pink-100"
                    : "border-stone-200"
                }`}
              >
                <div className="flex gap-4 p-5">
                  <div className="h-28 w-28 shrink-0 overflow-hidden rounded-[24px] bg-pink-50 ring-1 ring-stone-200">
                    <img
                      src={image}
                      alt={name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h2 className="truncate text-2xl font-black">{name}</h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          openStatus.open
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {openStatus.open ? "🟢 " : "🔴 "}
                        {openStatus.label}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-bold">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                        <Star size={15} fill="currentColor" />
                        {rating}
                      </span>

                      <span className="text-stone-500">
                        {reviewCount} recensioner
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-semibold">
                      <div className="flex items-center gap-2 text-stone-500">
                        <MapPin size={15} className="text-pink-600" />
                        <span>{florist.area ? `${florist.area}, ` : ""}{florist.city || "Okänd stad"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-stone-600">
                        <Clock size={15} className="text-pink-600" />
                        <span className="hidden md:inline">Stopptid {florist.same_day_cutoff_time || "-"}</span>
                        <span className="md:hidden">{florist.same_day_cutoff_time || "-"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-stone-600">
                        <Truck size={15} className="text-emerald-600" />
                        <span className="hidden md:inline">Leverans {florist.standard_delivery_fee ?? 0} kr</span>
                        <span className="md:hidden">{florist.standard_delivery_fee ?? 0} kr</span>
                      </div>

                      {florist.express_delivery_available && (
                        <div className="flex items-center gap-2 text-stone-600">
                          <Zap size={15} className="text-yellow-600" />
                          <span className="hidden md:inline">Express {florist.express_delivery_fee ?? 0} kr</span>
                          <span className="md:hidden">{florist.express_delivery_fee ?? 0} kr</span>
                        </div>
                      )}
                    </div>

                    <p className="mt-2 text-sm font-black text-stone-800">
                      Cirka {florist.distance_km} km från mottagaren
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-stone-100 p-5">
                  <Link
                    href={`/florist/${florist.florist_id}`}
                    className="rounded-full bg-white px-5 py-3 text-sm font-black text-stone-900 ring-1 ring-stone-200 transition hover:bg-stone-50"
                  >
                    Visa profil
                  </Link>

                  <Link
                    href={`/chat?floristId=${florist.florist_id}`}
                    className="rounded-full bg-white px-5 py-3 text-sm font-black text-stone-900 ring-1 ring-stone-200 transition hover:bg-stone-50"
                  >
                    <span className="hidden md:inline">Chatta</span>
                    <span className="md:hidden">💬</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => chooseFlorist(florist)}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-pink-600 px-5 py-3 text-sm font-black !text-white transition hover:opacity-90"
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle size={16} />
                        Vald
                      </>
                    ) : (
                      <>
                        Välj florist
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
