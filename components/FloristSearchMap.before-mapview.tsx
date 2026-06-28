"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

const dayNames = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];

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

    if (recipientLat && recipientLng) points.push([recipientLat, recipientLng]);

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

function ProductCarousel({
  florist,
  onOrderFlorist,
}: {
  florist: FloristMapItem;
  onOrderFlorist?: (florist: FloristMapItem) => void;
}) {
  const [index, setIndex] = useState(0);
  const item = demoProducts[index];

  function getOrderPath() {
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

  function buyProduct() {
    localStorage.setItem("selectedFloristId", florist.florist_id);
    localStorage.setItem(
      "selectedFloristName",
      florist.florist_name || florist.shop_name || "Florist"
    );

    localStorage.setItem("selectedProductTitle", item.title);
    localStorage.setItem("selectedProductPrice", String(item.price));
    localStorage.setItem("selectedProductImage", item.image);

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

    window.location.href = getOrderPath();
  }

  return (
    <div style={{ marginTop: 18, borderTop: "1px solid #e7e5e4", paddingTop: 14 }}>
      <div style={{ marginBottom: 10, fontSize: 14, fontWeight: 900 }}>
        Inspiration från butiken
      </div>

      <div style={{ position: "relative" }}>
        <div style={{ overflow: "hidden", borderRadius: 16, border: "1px solid #f1f5f9" }}>
          <img
            src={item.image}
            alt={item.title}
            style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }}
          />

          <button
            type="button"
            onClick={() => setIndex((current) => (current === 0 ? demoProducts.length - 1 : current - 1))}
            style={{
              position: "absolute",
              left: 10,
              top: 44,
              width: 34,
              height: 34,
              borderRadius: 999,
              border: "1px solid #e7e5e4",
              background: "rgba(255,255,255,.92)",
              cursor: "pointer",
              fontWeight: 900,
              boxShadow: "0 8px 20px rgba(0,0,0,.15)",
            }}
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() => setIndex((current) => (current === demoProducts.length - 1 ? 0 : current + 1))}
            style={{
              position: "absolute",
              right: 10,
              top: 44,
              width: 34,
              height: 34,
              borderRadius: 999,
              border: "1px solid #e7e5e4",
              background: "rgba(255,255,255,.92)",
              cursor: "pointer",
              fontWeight: 900,
              boxShadow: "0 8px 20px rgba(0,0,0,.15)",
            }}
          >
            ›
          </button>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900 }}>{item.title}</div>
              <div style={{ marginTop: 3, fontSize: 13, fontWeight: 800, color: "#57534e" }}>
                {item.price} kr
              </div>
            </div>

            <button
              type="button"
              onClick={buyProduct}
              style={{
                border: 0,
                borderRadius: 999,
                background: "#db2777",
                color: "white",
                padding: "10px 14px",
                cursor: "pointer",
                fontWeight: 900,
                whiteSpace: "nowrap",
              }}
            >
              Köp
            </button>
          </div>
        </div>

      </div>

      <div style={{ marginTop: 9, textAlign: "center", fontSize: 12, fontWeight: 800, color: "#78716c" }}>
        {index + 1} / {demoProducts.length}
      </div>
    </div>
  );
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
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
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
              <Popup closeButton maxWidth={430} minWidth={400}>
                <div style={{ width: 400, maxWidth: "95vw", padding: 9 }}>
                  <div style={{ display: "flex", gap: 16 }}>
                    <img
                      src={image}
                      alt={name}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 18,
                        objectFit: "cover",
                      }}
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 21, fontWeight: 900 }}>{name}</div>

                      <div style={{ marginTop: 8, display: "flex", gap: 10, alignItems: "center", fontSize: 14 }}>
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

                      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, fontSize: 13 }}>
                        <div>📍 {florist.distance_km} km</div>
                        <div>⏰ {florist.same_day_cutoff_time || "-"}</div>
                        <div>🚚 {florist.standard_delivery_fee ?? 0} kr</div>
                        {florist.express_delivery_available && (
                          <div>⚡ {florist.express_delivery_fee ?? 0} kr</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "0.9fr 0.9fr 1.4fr", gap: 10, marginTop: 18 }}>
                    <a href={`/florist/${florist.florist_id}`} style={{ padding: 10, borderRadius: 12, border: "1px solid #e7e5e4", textAlign: "center", fontWeight: 800 }}>
                      Besök butik
                    </a>

                    <a href={`/chat?floristId=${florist.florist_id}`} style={{ padding: 10, borderRadius: 12, border: "1px solid #e7e5e4", textAlign: "center", fontWeight: 800 }}>
                      Chatta
                    </a>

                    <button
                      type="button"
                      onClick={() => onOrderFlorist?.(florist)}
                      style={{ padding: 10, borderRadius: 12, border: 0, background: "#db2777", color: "white", fontWeight: 900, cursor: "pointer" }}
                    >
                      Beställ här
                    </button>
                  </div>

                  <ProductCarousel florist={florist} onOrderFlorist={onOrderFlorist} />
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
