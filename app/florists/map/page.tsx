import FloristsMapView from "@/components/FloristsMapView";
import { supabase } from "@/lib/supabase";

type Florist = {
  id: string;
  shop_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  city?: string | null;
  municipality?: string | null;
  county?: string | null;
  bio?: string | null;
  description?: string | null;
  logo_url?: string | null;
  profile_image_url?: string | null;
  created_at?: string | null;
};

export default async function FloristsMapPage() {
  const { data } = await supabase
    .from("florists")
    .select(
      "id, shop_name, first_name, last_name, email, city, municipality, county, bio, description, logo_url, profile_image_url, created_at"
    )
    .order("created_at", { ascending: false });

  return <FloristsMapView initialFlorists={(data || []) as Florist[]} />;
}
