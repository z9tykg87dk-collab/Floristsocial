import { createSupabaseServerClient } from "@/lib/supabase/server";

import type {
  FloristMapItem,
  MapBounds,
  SearchCountry,
} from "@/lib/fs-maps/types";

type SupabaseFloristRow = {
  id: string;
  shop_name: string | null;
  first_name: string | null;
  last_name: string | null;

  city: string | null;
  municipality: string | null;
  county: string | null;

  address_line_1: string | null;
  postal_code: string | null;

  latitude: number | null;
  longitude: number | null;

  delivery_radius_km: number | null;

  rating: number | null;
  review_count: number | null;
  opening_hours: unknown;

  logo_url: string | null;
  profile_image_url: string | null;

  is_active: boolean | null;
};

export type FloristSocialSearchOptions = {
  bounds: MapBounds;
  country?: SearchCountry;
  limit?: number;
};

function toFiniteNumber(value: unknown): number | null {
  const numberValue = Number(value);

  return Number.isFinite(numberValue)
    ? numberValue
    : null;
}

function normalizeLimit(limit: number | undefined): number {
  if (!Number.isFinite(limit)) {
    return 500;
  }

  return Math.min(
    1_000,
    Math.max(1, Math.trunc(limit ?? 500)),
  );
}

function getFloristName(row: SupabaseFloristRow): string {
  return (
    row.shop_name?.trim() ||
    `${row.first_name || ""} ${row.last_name || ""}`.trim() ||
    "Florist"
  );
}

function getCity(row: SupabaseFloristRow): string | null {
  return (
    row.city?.trim() ||
    row.municipality?.trim() ||
    row.county?.trim() ||
    null
  );
}

function getAddress(row: SupabaseFloristRow): string | null {
  const postalAndCity = [
    row.postal_code?.trim(),
    getCity(row),
  ]
    .filter(Boolean)
    .join(" ");

  const address = [
    row.address_line_1?.trim(),
    postalAndCity,
  ]
    .filter(Boolean)
    .join(", ");

  return address || null;
}

function normalizeOpeningHours(
  value: unknown,
): string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const descriptions = value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (!item || typeof item !== "object") {
        return "";
      }

      const record = item as Record<string, unknown>;

      const dayLabel =
        typeof record.dayLabel === "string"
          ? record.dayLabel.trim()
          : "";

      const isClosed = record.isClosed === true;

      const openTime =
        typeof record.openTime === "string"
          ? record.openTime.trim()
          : "";

      const closeTime =
        typeof record.closeTime === "string"
          ? record.closeTime.trim()
          : "";

      if (!dayLabel) {
        return "";
      }

      if (isClosed) {
        return `${dayLabel}: Stängt`;
      }

      if (openTime && closeTime) {
        return `${dayLabel}: ${openTime}–${closeTime}`;
      }

      return dayLabel;
    })
    .filter(Boolean);

  return descriptions.length > 0
    ? descriptions
    : null;
}

function toMapItem(
  row: SupabaseFloristRow,
  country: SearchCountry,
): FloristMapItem | null {
  const latitude = toFiniteNumber(row.latitude);
  const longitude = toFiniteNumber(row.longitude);

  if (
    latitude === null ||
    longitude === null ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  const floristName = getFloristName(row);

  return {
    florist_id: row.id,
    source: "supabase",

    /*
     * Kopplas till rätt Google Place ID-källa senare.
     * Merge-motorn använder tills vidare även namn,
     * adress och koordinater för dubblettkontroll.
     */
    google_place_id: null,

    florist_name: floristName,
    shop_name:
      row.shop_name?.trim() || floristName,

    address: getAddress(row),
    city: getCity(row),
    postcode:
      row.postal_code?.trim() || null,
    country,

    latitude,
    longitude,

    rating: toFiniteNumber(row.rating),
    review_count:
      toFiniteNumber(row.review_count),

    logo_url:
      row.logo_url?.trim() || null,
    profile_image_url:
      row.profile_image_url?.trim() || null,

    delivery_radius_km:
      toFiniteNumber(row.delivery_radius_km),

    distance_km: null,

    opening_hours:
      normalizeOpeningHours(row.opening_hours),

    standard_delivery_fee: null,
    express_delivery_available: false,
    express_delivery_fee: null,

    verification_level: "NONE",
    fs_map_status: "approved_display",
  };
}

export async function searchFloristSocialFlorists(
  options: FloristSocialSearchOptions,
): Promise<FloristMapItem[]> {
  const supabase =
    await createSupabaseServerClient();

  const country = options.country ?? "SE";

  const { data, error } = await supabase
    .from("florists")
    .select(`
      id,
      shop_name,
      first_name,
      last_name,
      city,
      municipality,
      county,
      address_line_1,
      postal_code,
      latitude,
      longitude,
      delivery_radius_km,
      rating,
      review_count,
      opening_hours,
      logo_url,
      profile_image_url,
      is_active
    `)
    .gte("latitude", options.bounds.south)
    .lte("latitude", options.bounds.north)
    .gte("longitude", options.bounds.west)
    .lte("longitude", options.bounds.east)
    .or("is_active.eq.true,is_active.is.null")
    .order("shop_name", { ascending: true })
    .limit(normalizeLimit(options.limit));

  if (error) {
    console.error(
      "[FS Maps] Kunde inte hämta registrerade florister:",
      error,
    );

    return [];
  }

  return (data ?? [])
    .map((row) =>
      toMapItem(row as SupabaseFloristRow, country),
    )
    .filter(
      (item): item is FloristMapItem =>
        item !== null,
    );
}
