"use client";

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

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
  latitude: number;
  longitude: number;
  distance_km: number;
  profile_image_url: string | null;
  logo_url: string | null;
  rating: number | null;
  review_count: number | null;
  opening_hours?: OpeningHour[] | null;
  standard_delivery_fee: number | null;
  same_day_cutoff_time: string | null;
  express_delivery_available: boolean | null;
  express_delivery_fee: number | null;
};

type Props = {
  recipientLat: number | null;
  recipientLng: number | null;
  florists: FloristMapItem[];
  hoveredFloristId?: string | null;
  onHoverFlorist?: (floristId: string | null) => void;
  onOrderFlorist?: (florist: FloristMapItem) => void;
};

const dayNames = [
  "Söndag",
  "Måndag",
  "Tisdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lördag",
];

function isOpenNow(openingHours?: OpeningHour[] | null) {
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

function FitMap({
  recipientLat,
  recipientLng,
  florists,
}: {
  recipientLat: number | null;
  recipientLng: number | null;
  florists: FloristMapItem[];
}) {
  const map = useMap();

  useEffect(() => {
    const points: [number, number][] = [];

    if (recipientLat && recipientLng) {
      points.push([recipientLat, recipientLng]);
    }

    florists.forEach((florist) => {
      if (florist.latitude && florist.longitude) {
        points.push([florist.latitude, florist.longitude]);
      }
    });

    if (points.length > 0) {
      map.fitBounds(points, { padding: [50, 50], maxZoom: 13 });
    }
  }, [recipientLat, recipientLng, florists, map]);

  return null;
}

function recipientIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="font-size:38px;transform:translate(-10px,-28px)">📍</div>`,
    iconSize: [40, 40],
  });
}

function floristIcon(logoUrl: string | null, active: boolean) {
  const size = active ? 54 : 48;
  const imageHtml = logoUrl
    ? `<img src="${logoUrl}" style="width:82%;height:82%;object-fit:contain;" />`
    : `<span style="font-size:${active ? "25px" : "22px"};">🌸</span>`;

  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:${size}px;
        height:${size}px;
        border-radius:999px;
        background:white;
        border:2px solid #111827;
        box-shadow:0 10px 24px rgba(0,0,0,.22);
        display:flex;
        align-items:center;
        justify-content:center;
        overflow:hidden;
        transform:translate(-16px,-32px);
      ">
        ${imageHtml}
      </div>
      <div style="
        width:0;
        height:0;
        border-left:7px solid transparent;
        border-right:7px solid transparent;
        border-top:10px solid #111827;
        margin-left:15px;
        margin-top:-2px;
      "></div>
    `,
    iconSize: [size, size + 14],
    iconAnchor: [size / 2, size + 14],
    popupAnchor: [0, -(size + 8)],
  });
}

export default function FloristSearchMap({
  recipientLat,
  recipientLng,
  florists,
  hoveredFloristId,
  onHoverFlorist,
  onOrderFlorist,
}: Props) {
  const center: [number, number] =
    recipientLat && recipientLng ? [recipientLat, recipientLng] : [59.3293, 18.0686];

  const markersRef = useRef<Record<string, L.Marker>>({});
  const recipient = useMemo(() => recipientIcon(), []);

  useEffect(() => {
    if (!hoveredFloristId) return;
    const marker = markersRef.current[hoveredFloristId];
    if (marker) marker.openPopup();
  }, [hoveredFloristId]);

  return (
    <div className="h-[620px] overflow-hidden rounded-[34px] border border-stone-200 bg-white shadow-sm">
      <MapContainer center={center} zoom={12} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitMap recipientLat={recipientLat} recipientLng={recipientLng} florists={florists} />

        {recipientLat && recipientLng && (
          <Marker position={[recipientLat, recipientLng]} icon={recipient}>
            <Popup>
              <strong>Mottagare</strong>
            </Popup>
          </Marker>
        )}

        {florists.map((florist) => {
          const name = florist.florist_name || florist.shop_name || "Florist";
          const image =
            florist.profile_image_url ||
            florist.logo_url ||
            "/design-preview/buketter/bukett-romantisk-rosa-1000.jpg";

          const logo = florist.logo_url || null;
          const active = hoveredFloristId === florist.florist_id;
          const status = isOpenNow(florist.opening_hours);

          return (
            <Marker
              key={florist.florist_id}
              ref={(ref) => {
                if (ref) markersRef.current[florist.florist_id] = ref;
              }}
              position={[florist.latitude, florist.longitude]}
              icon={floristIcon(logo, active)}
              eventHandlers={{
                mouseover: () => onHoverFlorist?.(florist.florist_id),
                mouseout: () => onHoverFlorist?.(null),
              }}
            >
              <Popup closeButton maxWidth={520} minWidth={480}>
                <div style={{ width: 480, maxWidth: "95vw", padding: 10 }}>
                  <div style={{ display: "flex", gap: 16 }}>
                    <img
                      src={image}
                      alt={name}
                      style={{
                        width: 132,
                        height: 132,
                        borderRadius: 18,
                        objectFit: "cover",
                      }}
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 21, fontWeight: 900 }}>{name}</div>

                      <div
                        style={{
                          marginTop: 8,
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                          fontSize: 14,
                        }}
                      >
                        <span>⭐ {florist.rating ?? 4.9} ({florist.review_count ?? 0})</span>
                        <span
                          style={{
                            borderRadius: 999,
                            padding: "4px 9px",
                            fontWeight: 900,
                            color: status.open ? "#047857" : "#b91c1c",
                            background: status.open ? "#ecfdf5" : "#fef2f2",
                          }}
                        >
                          {status.label}
                        </span>
                      </div>

                      <div
                        style={{
                          marginTop: 12,
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 9,
                          fontSize: 13,
                        }}
                      >
                        <div>📍 {florist.distance_km} km</div>
                        <div>⏰ {florist.same_day_cutoff_time || "-"}</div>
                        <div>🚚 {florist.standard_delivery_fee ?? 0} kr</div>
                        {florist.express_delivery_available && (
                          <div>⚡ {florist.express_delivery_fee ?? 0} kr</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 10,
                      marginTop: 18,
                    }}
                  >
                    <a
                      href={`/florist/${florist.florist_id}`}
                      style={{
                        padding: 12,
                        borderRadius: 12,
                        border: "1px solid #e7e5e4",
                        textAlign: "center",
                        fontWeight: 800,
                      }}
                    >
                      Besök butik
                    </a>

                    <a
                      href={`/chat?floristId=${florist.florist_id}`}
                      style={{
                        padding: 12,
                        borderRadius: 12,
                        border: "1px solid #e7e5e4",
                        textAlign: "center",
                        fontWeight: 800,
                      }}
                    >
                      Chatta
                    </a>

                    <button
                      type="button"
                      onClick={() => onOrderFlorist?.(florist)}
                      style={{
                        padding: 12,
                        borderRadius: 12,
                        border: 0,
                        background: "#db2777",
                        color: "white",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      Beställ här
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
