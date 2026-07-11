"use client";

import { useEffect, useMemo, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin,
} from "@vis.gl/react-google-maps";

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
  fs_map_status?: string | null;
  google_place_id?: string | null;
};

type FSMapProps = {
  recipientLat?: number | null;
  recipientLng?: number | null;
  florists: FloristMapItem[];
  hoveredFloristId?: string | null;
  onHoverFlorist?: (id: string | null) => void;
  onOrderFlorist?: (florist: FloristMapItem) => void;
  mode?: "full" | "compact";
};

const STOCKHOLM = { lat: 59.3293, lng: 18.0686 };

const demoProducts = [
  {
    title: "Floristens val",
    price: 625,
    image: "/design-preview/buketter/bukett-floristens-val-pastell-750.jpg",
  },
  {
    title: "Romantisk bukett",
    price: 750,
    image: "/design-preview/buketter/bukett-romantisk-rosa-1000.jpg",
  },
  {
    title: "Modern bukett",
    price: 875,
    image: "/design-preview/buketter/bukett-modern-orange-rosa.jpg",
  },
];

const approvedDetailedFlorists = [
  "makalösa blommor",
  "makalosa blommor",
  "blomsterjouren",
  "olas blommor",
  "bladverket",
  "blomsteraffären",
  "blomsteraffaren",
  "melanders blommor",
];

function cleanName(value: string | null) {
  return (value || "").trim();
}

function displayName(florist: FloristMapItem) {
  return (
    cleanName(florist.shop_name) ||
    cleanName(florist.florist_name) ||
    "Blomsterbutik"
  );
}

function isDetailedFlorist(florist: FloristMapItem) {
  const name = displayName(florist).toLowerCase();
  return approvedDetailedFlorists.some((item) => name.includes(item));
}

function getOrderPath() {
  if (typeof window === "undefined") return "/order/private/guest-v4";

  const customerType = localStorage.getItem("customerType");

  switch (customerType) {
    case "private_registered":
      return "/order/private/registered";
    case "company_registered":
      return "/order/company/registered";
    case "company_guest":
      return "/order/company/guest";
    default:
      return "/order/private/guest-v4";
  }
}

function ProductPopup({
  florist,
  onOrderFlorist,
}: {
  florist: FloristMapItem;
  onOrderFlorist?: (florist: FloristMapItem) => void;
}) {
  const [index, setIndex] = useState(0);
  const item = demoProducts[index];

  function buyProduct() {
    if (typeof window === "undefined") return;

    localStorage.setItem("selectedFloristId", florist.florist_id);
    localStorage.setItem("selectedFloristName", displayName(florist));
    localStorage.setItem("selectedProductTitle", item.title);
    localStorage.setItem("selectedProductPrice", String(item.price));
    localStorage.setItem("selectedProductImage", item.image);
    localStorage.setItem(
      "selectedFloristDeliveryFee",
      String(florist.standard_delivery_fee ?? 0),
    );
    localStorage.setItem(
      "selectedFloristExpressFee",
      String(florist.express_delivery_fee ?? 0),
    );
    localStorage.setItem(
      "selectedFloristSameDayCutoff",
      florist.same_day_cutoff_time || "",
    );

    onOrderFlorist?.(florist);
    window.location.href = getOrderPath();
  }

  return (
    <div className="mt-3 border-t border-stone-200 pt-3">
      <div className="mb-2 text-sm font-black text-stone-950">
        Inspiration från butiken
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-stone-100">
        <img
          src={item.image}
          alt={item.title}
          className="h-[120px] w-full object-cover"
        />

        <button
          type="button"
          onClick={() =>
            setIndex((current) =>
              current === 0 ? demoProducts.length - 1 : current - 1,
            )
          }
          className="absolute left-2 top-10 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-lg font-black shadow"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={() =>
            setIndex((current) =>
              current === demoProducts.length - 1 ? 0 : current + 1,
            )
          }
          className="absolute right-2 top-10 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-lg font-black shadow"
        >
          ›
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-black text-stone-950">{item.title}</div>
          <div className="text-xs font-semibold text-stone-500">
            Från {item.price} kr
          </div>
        </div>

        <button
          type="button"
          onClick={buyProduct}
          className="rounded-full bg-pink-600 px-4 py-2 text-xs font-black text-white hover:bg-pink-700"
        >
          Beställ
        </button>
      </div>
    </div>
  );
}

export default function FSMap({
  recipientLat,
  recipientLng,
  florists,
  hoveredFloristId,
  onHoverFlorist,
  onOrderFlorist,
  mode = "full",
}: FSMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [selected, setSelected] = useState<FloristMapItem | null>(null);
  const [approvedPlaces, setApprovedPlaces] = useState<FloristMapItem[]>([]);

  useEffect(() => {
    fetch("/api/fs-maps/places-seed")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.results)) {
          setApprovedPlaces(data.results);
        }
      })
      .catch(() => setApprovedPlaces([]));
  }, []);

  const validFlorists = useMemo(
    () =>
      [...approvedPlaces, ...florists].filter(
        (florist) =>
          Number.isFinite(Number(florist.latitude)) &&
          Number.isFinite(Number(florist.longitude)),
      ),
    [approvedPlaces, florists],
  );

  const center =
    recipientLat && recipientLng
      ? { lat: recipientLat, lng: recipientLng }
      : validFlorists[0]
        ? {
            lat: Number(validFlorists[0].latitude),
            lng: Number(validFlorists[0].longitude),
          }
        : STOCKHOLM;

  if (!apiKey) {
    return (
      <div className="grid h-full min-h-[620px] place-items-center bg-red-50 p-8 text-center">
        <div>
          <h2 className="text-2xl font-black text-red-700">
            Google Maps API-nyckel saknas
          </h2>
          <p className="mt-3 text-sm font-semibold text-red-600">
            Kontrollera NEXT_PUBLIC_GOOGLE_MAPS_API_KEY i .env.local.
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={center}
        defaultZoom={mode === "compact" ? 10 : 11}
        mapId="FS_MAPS_MAIN"
        gestureHandling="greedy"
        disableDefaultUI={mode === "compact"}
        style={{
          width: "100%",
          height: "100%",
          minHeight: mode === "compact" ? 420 : 620,
        }}
      >
        {recipientLat && recipientLng ? (
          <AdvancedMarker
            position={{ lat: recipientLat, lng: recipientLng }}
            title="Mottagare"
          >
            <Pin
              background="#111827"
              borderColor="#111827"
              glyphColor="#ffffff"
              glyph="📍"
            />
          </AdvancedMarker>
        ) : null}

        {validFlorists.map((florist) => {
          const detailed = isDetailedFlorist(florist);
          const isHovered = hoveredFloristId === florist.florist_id;

          return (
            <AdvancedMarker
              key={florist.florist_id}
              position={{
                lat: Number(florist.latitude),
                lng: Number(florist.longitude),
              }}
              title={detailed ? displayName(florist) : "Blomsterbutik"}
              onClick={() => setSelected(florist)}
              onMouseEnter={() => onHoverFlorist?.(florist.florist_id)}
              onMouseLeave={() => onHoverFlorist?.(null)}
            >
              {detailed ? (
                <Pin
                  background={isHovered ? "#be185d" : "#db2777"}
                  borderColor="#831843"
                  glyphColor="#ffffff"
                  glyph="🌸"
                  scale={isHovered ? 1.25 : 1}
                />
              ) : (
                <Pin
                  background={isHovered ? "#57534e" : "#78716c"}
                  borderColor="#44403c"
                  glyphColor="#ffffff"
                  glyph="•"
                  scale={isHovered ? 1.15 : 0.9}
                />
              )}
            </AdvancedMarker>
          );
        })}

        {selected ? (
          <InfoWindow
            position={{
              lat: Number(selected.latitude),
              lng: Number(selected.longitude),
            }}
            onCloseClick={() => setSelected(null)}
          >
            <div className="w-[280px] p-2">
              <h3 className="text-base font-black text-stone-950">
                {isDetailedFlorist(selected) ? displayName(selected) : "Blomsterbutik"}
              </h3>

              <p className="mt-1 text-sm font-semibold text-stone-600">
                {selected.area || selected.city || "Stockholm"}
              </p>

              {selected.rating ? (
                <p className="mt-2 text-xs font-black text-amber-700">
                  ★ {selected.rating}{" "}
                  {selected.review_count ? `(${selected.review_count} recensioner)` : ""}
                </p>
              ) : null}

              {isDetailedFlorist(selected) ? (
                <>
                  <p className="mt-2 rounded-full bg-pink-50 px-3 py-2 text-xs font-black text-pink-700">
                    Visningsflorist på FS Maps
                  </p>
                  <ProductPopup
                    florist={selected}
                    onOrderFlorist={onOrderFlorist}
                  />
                </>
              ) : (
                <p className="mt-3 rounded-2xl bg-stone-50 px-3 py-3 text-sm font-semibold text-stone-600">
                  Inte ansluten till FloristSocial ännu.
                </p>
              )}
            </div>
          </InfoWindow>
        ) : null}
      </Map>
    </APIProvider>
  );
}
