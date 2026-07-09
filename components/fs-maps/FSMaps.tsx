"use client";

import Link from "next/link";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { useState } from "react";

type Florist = {
  id: string;
  shop_name?: string | null;
  florist_name?: string | null;
  profile_name?: string | null;
  city?: string | null;
  address_line_1?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  rating?: number | null;
  review_count?: number | null;
  delivery_radius_km?: number | null;
  slug?: string | null;
};

const STOCKHOLM = { lat: 59.3293, lng: 18.0686 };

function floristName(florist: Florist) {
  return florist.shop_name || florist.florist_name || florist.profile_name || "Florist";
}

function floristPosition(florist: Florist) {
  const lat = Number(florist.latitude);
  const lng = Number(florist.longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
}

export default function FSMaps({ florists = [] }: { florists?: Florist[] }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [selectedFlorist, setSelectedFlorist] = useState<Florist | null>(null);

  const floristsWithPosition = florists.filter((florist) => floristPosition(florist));

  if (!apiKey) {
    return (
      <div className="grid min-h-[520px] place-items-center rounded-[34px] bg-red-50 p-8 text-center ring-1 ring-red-100">
        <div>
          <h2 className="text-2xl font-black text-red-700">Google Maps API-nyckel saknas</h2>
          <p className="mt-3 text-sm font-semibold text-red-600">
            Lägg till NEXT_PUBLIC_GOOGLE_MAPS_API_KEY i .env.local och starta om npm run dev.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[34px] bg-white shadow-sm ring-1 ring-stone-200">
      <div className="border-b border-stone-100 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-600">
          FS-Maps Google Engine
        </p>
        <h1 className="mt-2 text-3xl font-black">FloristSocial Map</h1>
        <p className="mt-2 text-sm font-semibold text-stone-600">
          Visar {floristsWithPosition.length} florister med koordinater.
        </p>
      </div>

      <div className="h-[620px]">
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={STOCKHOLM}
            defaultZoom={11}
            mapId="FS_MAPS_TEST"
            gestureHandling="greedy"
            disableDefaultUI={false}
            style={{ width: "100%", height: "100%" }}
          >
            {floristsWithPosition.map((florist) => {
              const position = floristPosition(florist);
              if (!position) return null;

              return (
                <AdvancedMarker
                  key={florist.id}
                  position={position}
                  title={floristName(florist)}
                  onClick={() => setSelectedFlorist(florist)}
                >
                  <Pin background="#db2777" borderColor="#831843" glyphColor="#ffffff" glyph="🌸" />
                </AdvancedMarker>
              );
            })}

            {selectedFlorist && floristPosition(selectedFlorist) ? (
              <InfoWindow
                position={floristPosition(selectedFlorist)!}
                onCloseClick={() => setSelectedFlorist(null)}
              >
                <div className="min-w-[220px] p-2">
                  <h3 className="text-base font-black text-stone-950">
                    {floristName(selectedFlorist)}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-stone-600">
                    {selectedFlorist.address_line_1 || "Adress saknas"}
                    {selectedFlorist.city ? `, ${selectedFlorist.city}` : ""}
                  </p>
                  <p className="mt-2 text-sm font-bold text-pink-700">
                    ⭐ {selectedFlorist.rating || "Nytt"} · Leverans {selectedFlorist.delivery_radius_km || 15} km
                  </p>
                  <Link
                    href={`/florist/${selectedFlorist.id}`}
                    className="mt-3 inline-flex rounded-full bg-pink-600 px-4 py-2 text-sm font-black !text-white"
                  >
                    Visa profil
                  </Link>
                </div>
              </InfoWindow>
            ) : null}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
