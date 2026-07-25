// ======================================================
// FloristSocial Maps Engine
// Shared Types
// ======================================================

export type LatLng = {
  lat: number;
  lng: number;
};

export type MapBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export type SearchCountry = string;

export type SearchSource =
  | "supabase"
  | "google"
  | "cache";

export type VerificationLevel =
  | "NONE"
  | "BASIC"
  | "BUSINESS"
  | "FULL";

export type FSMapStatus =
  | "approved_display"
  | "google_discovered"
  | "claim_pending"
  | "rejected"
  | "suspended";

export interface FloristMapItem {
  florist_id: string;

  source: SearchSource;

  google_place_id: string | null;

  florist_name: string;

  shop_name: string;

  address: string | null;

  city: string | null;

  postcode: string | null;

  country: SearchCountry;

  latitude: number;

  longitude: number;

  rating: number | null;

  review_count: number | null;

  logo_url: string | null;

  profile_image_url: string | null;

  delivery_radius_km: number | null;

  distance_km: number | null;

  opening_hours: string[] | null;

  standard_delivery_fee: number | null;

  express_delivery_available: boolean;

  express_delivery_fee: number | null;

  verification_level: VerificationLevel;

  fs_map_status: FSMapStatus;
}

export interface SearchRequest {
  bounds: MapBounds;

  country: SearchCountry;

  includeGoogle: boolean;

  includeRegistered: boolean;

  includeUnregistered: boolean;
}

export interface SearchResponse {
  success: boolean;

  results: FloristMapItem[];

  count: number;

  cached: boolean;

  generated_at: string;
}
