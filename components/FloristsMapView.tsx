"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
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

export default function FloristsMapView() {
  const [results, setResults] = useState<FloristResult[]>([]);
  const [recipientLat, setRecipientLat] = useState<number | null>(null);
  const [recipientLng, setRecipientLng] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [hoveredFloristId, setHoveredFloristId] = useState<string | null>(null);

  useEffect(() => {
    const savedAddress = localStorage.getItem("recipientAddress") || "";
    const savedResults = localStorage.getItem("nearbyFloristResults");
    const savedLat = localStorage.getItem("recipientLat");
    const savedLng = localStorage.getItem("recipientLng");

    setAddress(savedAddress);

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

    window.location.href = "/order/private/guest-v4";
  }

  return (
    <main className="min-h-screen bg-[#fbf7f2] text-stone-950">
      <div className="border-b border-stone-200 bg-white px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-4">
          <Link
            href="/florists"
            className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-black !text-white"
          >
            <ArrowLeft size={16} />
            Tillbaka
          </Link>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-600">
              Stor karta
            </p>
            <h1 className="truncate text-2xl font-black md:text-3xl">
              Florister nära mottagaren
            </h1>
            <p className="mt-1 truncate text-sm font-semibold text-stone-500">
              {address || "Sök först på /florists för att visa resultat här."}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-sm font-black text-pink-700">
            <Search size={16} />
            {results.length} florist{results.length === 1 ? "" : "er"}
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <section className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-4 text-center">
          <div>
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-pink-50 text-3xl">
              🌸
            </div>
            <h2 className="text-3xl font-black">Ingen sökning hittades</h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-stone-500">
              Gå tillbaka till floristsidan och sök på mottagarens adress först.
            </p>
            <Link
              href="/florists"
              className="mt-6 inline-flex rounded-full bg-pink-600 px-6 py-3 text-sm font-black !text-white"
            >
              Gå till sökning
            </Link>
          </div>
        </section>
      ) : (
        <section className="mx-auto grid max-w-[1800px] gap-0 px-4 py-4 md:px-6 lg:grid-cols-[430px_1fr]">
          <aside className="max-h-[calc(100vh-118px)] overflow-y-auto rounded-l-[30px] border border-stone-200 bg-white p-4 shadow-sm">
            <div className="mb-4 rounded-[22px] bg-[#fbf7f2] p-4 ring-1 ring-stone-200">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-600">
                Mottagare
              </p>
              <p className="mt-1 text-sm font-black text-stone-900">
                {address}
              </p>
              <p className="mt-2 text-xs font-semibold text-stone-500">
                Jämför florister, öppettider, leveranspris och produkter direkt på kartan.
              </p>
            </div>

            <div className="space-y-4">
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
                    className={`overflow-hidden rounded-[24px] border bg-white shadow-sm transition ${
                      isHovered ? "border-pink-500 shadow-xl" : "border-stone-200"
                    }`}
                  >
                    <div className="flex gap-4 p-4">
                      <div className="h-28 w-28 shrink-0 overflow-hidden rounded-[18px] bg-pink-50 ring-1 ring-stone-200">
                        <img src={image} alt={name} className="h-full w-full object-cover" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="truncate text-lg font-black">{name}</h2>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
                          <span className="inline-flex items-center gap-1 text-amber-600">
                            <Star size={14} fill="currentColor" />
                            {florist.rating ?? 4.9}
                          </span>

                          <span
                            className={`rounded-full px-2 py-1 text-xs font-black ${
                              status.open
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            ● {status.label}
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold text-stone-600">
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={14} />
                            {florist.distance_km} km
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock size={14} />
                            {florist.same_day_cutoff_time || "-"}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Truck size={14} />
                            {florist.standard_delivery_fee ?? 0} kr
                          </span>
                          {florist.express_delivery_available && (
                            <span className="inline-flex items-center gap-1">
                              <Zap size={14} />
                              {florist.express_delivery_fee ?? 0} kr
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-t border-stone-100 p-3">
                      <Link
                        href={`/florist/${florist.florist_id}`}
                        className="inline-flex items-center justify-center gap-1 rounded-xl bg-white px-2 py-3 text-xs font-black text-stone-900 ring-1 ring-stone-200"
                      >
                        <Store size={14} />
                        Butik
                      </Link>

                      <Link
                        href={`/chat?floristId=${florist.florist_id}`}
                        className="inline-flex items-center justify-center gap-1 rounded-xl bg-white px-2 py-3 text-xs font-black text-stone-900 ring-1 ring-stone-200"
                      >
                        <MessageCircle size={14} />
                        Chat
                      </Link>

                      <button
                        type="button"
                        onClick={() => orderFromFlorist(florist)}
                        className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-xl bg-pink-600 px-2 py-3 text-xs font-black !text-white"
                      >
                        <ShoppingCart size={14} />
                        Beställ
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </aside>

          <section className="min-h-[calc(100vh-118px)] rounded-r-[30px] border-y border-r border-stone-200 bg-white shadow-sm">
            <FloristSearchMap
              recipientLat={recipientLat}
              recipientLng={recipientLng}
              florists={results}
              hoveredFloristId={hoveredFloristId}
              onHoverFlorist={setHoveredFloristId}
              onOrderFlorist={orderFromFlorist}
            />
          </section>
        </section>
      )}
    </main>
  );
}
