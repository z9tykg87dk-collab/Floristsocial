"use client";

import FSMap from "@/components/FSMap";

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
  mode?: "full" | "preview";
};

export default function FloristSearchMap({
  recipientLat,
  recipientLng,
  florists,
  hoveredFloristId,
  onHoverFlorist,
  onOrderFlorist,
  mode = "full",
}: Props) {
  return (
    <FSMap
      recipientLat={recipientLat}
      recipientLng={recipientLng}
      florists={florists}
      hoveredFloristId={hoveredFloristId}
      onHoverFlorist={onHoverFlorist}
      onOrderFlorist={onOrderFlorist}
      mode={mode === "preview" ? "compact" : "full"}
    />
  );
}
