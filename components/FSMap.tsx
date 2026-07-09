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

const STOCKHOLM = { lat: 59.3293, lng: 18.0686 };

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
  return cleanName(florist.shop_name) || cleanName(florist.florist_name) || "Blomsterbutik";
}

function isDetailedFlorist(florist: FloristMapItem) {
  const name = displayName(florist).toLowerCase();
  return approvedDetailedFlorists.some((item) => name.includes(item));
}

export default function FSMap({
  recipientLat,
  recipientLng,
  florists,
  hoveredFloristId,
  onHoverFlorist,
}: {
  recipientLat?: number | null;
  recipientLng?: number | null;
  florists: FloristMapItem[];
  hoveredFloristId?: string | null;
  onHoverFlorist?: (id: string | null) => void;
  onOrderFlorist?: (florist: FloristMapItem) => void;
  mode?: "full" | "compact";
}) {
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
          Number.isFinite(Number(florist.longitude))
      ),
    [approvedPlaces, florists]
  );

  const center =
    recipientLat && recipientLng
      ? { lat: recipientLat, lng: recipientLng }
      : validFlorists[0]
        ? { lat: Number(validFlorists[0].latitude), lng: Number(validFlorists[0].longitude) }
        : STOCKHOLM;

  if (!apiKey) {
    return (
      <div className="grid h-full min-h-[620px] place-items-center bg-red-50 p-8 text-center">
        <div>
          <h2 className="text-2xl font-black text-red-700">Google Maps API-nyckel saknas</h2>
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
        defaultZoom={11}
        mapId="FS_MAPS_MAIN"
        gestureHandling="greedy"
        disableDefaultUI={false}
        style={{ width: "100%", height: "100%", minHeight: 620 }}
      >
        {recipientLat && recipientLng ? (
          <AdvancedMarker position={{ lat: recipientLat, lng: recipientLng }} title="Mottagare">
            <Pin background="#111827" borderColor="#111827" glyphColor="#ffffff" glyph="📍" />
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
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelected(florist);
                  }}
                  className={`relative h-8 w-7 transition ${
                    isHovered ? "scale-110" : ""
                  }`}
                  aria-label="Blomsterbutik inte ansluten"
                >
                  <span className="absolute left-1/2 top-0 grid h-6 w-6 -translate-x-1/2 place-items-center rounded-full border-2 border-white bg-stone-500 shadow-lg">
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </span>
                  <span className="absolute left-1/2 top-[18px] h-3 w-3 -translate-x-1/2 rotate-45 rounded-sm bg-stone-500 shadow" />
                </button>
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
            {isDetailedFlorist(selected) ? (
              <div className="min-w-[230px] p-2">
                <h3 className="text-base font-black text-stone-950">{displayName(selected)}</h3>
                <p className="mt-1 text-sm font-semibold text-stone-600">
                  {selected.area || selected.city || "Stockholm"}
                </p>
                <p className="mt-2 rounded-full bg-pink-50 px-3 py-2 text-xs font-black text-pink-700">
                  Visningsflorist på FS-Maps
                </p>
              </div>
            ) : (
              <div className="min-w-[220px] p-2">
                <h3 className="text-base font-black text-stone-950">Blomsterbutik</h3>
                <p className="mt-2 text-sm font-semibold text-stone-600">
                  Inte ansluten till FloristSocial.
                </p>
              </div>
            )}
          </InfoWindow>
        ) : null}
      </Map>
    </APIProvider>
  );
}
