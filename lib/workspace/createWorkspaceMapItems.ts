export type WorkspaceMapSourceFlorist = {
  id: string;
  shop_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;

  city?: string | null;
  municipality?: string | null;
  county?: string | null;

  address_line_1?: string | null;
  postal_code?: string | null;

  latitude?: number | null;
  longitude?: number | null;

  delivery_radius_km?: number | null;

  rating?: number | null;
  review_count?: number | null;
  verification_level?: string | null;

  opening_hours?: unknown;

  logo_url?: string | null;
  profile_image_url?: string | null;

  is_active?: boolean | null;
};

export type WorkspaceMapOpeningHour = {
  dayLabel?: string;
  isClosed?: boolean;
  openTime?: string;
  closeTime?: string;
};

export type WorkspaceMapItem = {
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
  opening_hours: WorkspaceMapOpeningHour[] | null;
  same_day_cutoff_time: string | null;
  standard_delivery_fee: number | null;
  express_delivery_available: boolean | null;
  express_delivery_fee: number | null;
  fs_map_status: string | null;
  verification_level: string | null;
  google_place_id: string | null;
  address: string | null;
  formatted_address: string | null;
  street_address: string | null;
  address_line_1: string | null;
  postal_code: string | null;
};

function getFloristName(florist: WorkspaceMapSourceFlorist): string {
  return (
    florist.shop_name ||
    `${florist.first_name || ""} ${florist.last_name || ""}`.trim() ||
    florist.email ||
    "Florist"
  );
}

function normalizeOpeningHours(
  value: unknown,
): WorkspaceMapOpeningHour[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  return value.filter(
    (item): item is WorkspaceMapOpeningHour =>
      typeof item === "object" && item !== null,
  );
}

function hasValidCoordinates(
  florist: WorkspaceMapSourceFlorist,
): florist is WorkspaceMapSourceFlorist & {
  latitude: number;
  longitude: number;
} {
  return (
    typeof florist.latitude === "number" &&
    Number.isFinite(florist.latitude) &&
    florist.latitude >= -90 &&
    florist.latitude <= 90 &&
    typeof florist.longitude === "number" &&
    Number.isFinite(florist.longitude) &&
    florist.longitude >= -180 &&
    florist.longitude <= 180
  );
}

export function createWorkspaceMapItems(
  florists: WorkspaceMapSourceFlorist[],
): WorkspaceMapItem[] {
  return florists
    .filter((florist) => florist.is_active !== false)
    .filter(hasValidCoordinates)
    .map((florist) => {
      const floristName = getFloristName(florist);
      const address = florist.address_line_1 || null;

      return {
        florist_id: florist.id,
        florist_name: floristName,
        shop_name: florist.shop_name || floristName,
        city:
          florist.city ||
          florist.municipality ||
          florist.county ||
          null,
        area: florist.municipality || florist.county || null,
        delivery_radius_km: florist.delivery_radius_km ?? null,
        latitude: florist.latitude,
        longitude: florist.longitude,
        distance_km: 0,
        profile_image_url: florist.profile_image_url || null,
        logo_url: florist.logo_url || florist.profile_image_url || null,
        rating: florist.rating ?? null,
        review_count: florist.review_count ?? null,
        opening_hours: normalizeOpeningHours(florist.opening_hours),
        same_day_cutoff_time: null,
        standard_delivery_fee: null,
        express_delivery_available: null,
        express_delivery_fee: null,
        fs_map_status: "REGISTERED",
        verification_level: florist.verification_level ?? null,
        google_place_id: null,
        address,
        formatted_address: address,
        street_address: address,
        address_line_1: address,
        postal_code: florist.postal_code || null,
      };
    });
}
