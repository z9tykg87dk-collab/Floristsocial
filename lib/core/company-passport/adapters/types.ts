/**
 * Databasoberoende representation av de floristfält som
 * Company Passport-adaptern behöver.
 *
 * Typen är avsiktligt frikopplad från Supabase-genererade typer.
 * Därmed kan databasen förändras utan att domänmodellen blir
 * direkt beroende av Supabase.
 */
export type FloristRow = {
  id: string;

  created_at?: string | null;
  updated_at?: string | null;

  shop_name?: string | null;
  florist_name?: string | null;
  legal_business_name?: string | null;
  organization_number?: string | null;

  email?: string | null;
  public_email?: string | null;
  owner_email?: string | null;
  phone?: string | null;
  owner_phone?: string | null;
  first_name?: string | null;
  last_name?: string | null;

  address_line_1?: string | null;
  address_line_2?: string | null;
  postal_code?: string | null;
  city?: string | null;
  municipality?: string | null;
  county?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  external_place_id?: string | null;

  bio?: string | null;
  description?: string | null;
  website?: string | null;
  instagram?: string | null;
  business_instagram?: string | null;
  logo_url?: string | null;
  cover_image_url?: string | null;

  delivery_model?: string | null;
  delivery_radius_km?: number | null;

  verification_level?: string | null;
  claim_status?: string | null;
  status?: string | null;
  is_active?: boolean | null;

  stripe_account_id?: string | null;
  economy_settings?: unknown;
};

/**
 * Säker skrivmodell för florists-tabellen.
 *
 * Mappern returnerar bara fält som Company Passport äger.
 * Tekniska fält, lösenord, statistik och administratörsfält
 * ingår inte.
 */
export type FloristRowPatch = {
  shop_name?: string | null;
  florist_name?: string | null;
  legal_business_name?: string | null;
  organization_number?: string | null;

  email?: string | null;
  public_email?: string | null;
  owner_email?: string | null;
  phone?: string | null;
  owner_phone?: string | null;
  first_name?: string | null;
  last_name?: string | null;

  address_line_1?: string | null;
  postal_code?: string | null;
  city?: string | null;
  county?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  external_place_id?: string | null;

  description?: string | null;
  bio?: string | null;
  website?: string | null;
  instagram?: string | null;
  logo_url?: string | null;
  cover_image_url?: string | null;

  delivery_model?: string | null;
  delivery_radius_km?: number | null;

  verification_level?: string | null;
  claim_status?: string | null;
  is_active?: boolean | null;

  economy_settings?: Record<string, unknown>;
  updated_at?: string;
};
