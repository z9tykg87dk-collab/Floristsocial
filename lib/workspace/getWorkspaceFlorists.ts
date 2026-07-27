import { createSupabaseServerClient } from "@/lib/supabase/server";

export type WorkspaceFlorist = {
  id: string;
  shop_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;

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

  verification_level: string | null;

  opening_hours: unknown;

  logo_url: string | null;
  profile_image_url: string | null;

  bio: string | null;
  description: string | null;

  is_active: boolean | null;

  created_at: string | null;
};

export async function getWorkspaceFlorists(): Promise<WorkspaceFlorist[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("florists")
    .select(`
      id,
      shop_name,
      first_name,
      last_name,
      email,
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
      bio,
      description,
      is_active,
      created_at
    `)
    .order("shop_name", { ascending: true });

  if (error) {
    console.error("[Workspace] Failed to load florists:", error);
    return [];
  }

  return (data ?? []).map((florist) => ({
    ...florist,
    verification_level: null,
  }));
}
