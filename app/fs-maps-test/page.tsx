import FSMaps from "@/components/fs-maps/FSMaps";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function FSMapsTestPage() {
  const supabase = await createSupabaseServerClient();

  const { data: florists } = await (supabase as any)
    .from("florists")
    .select("id, shop_name, florist_name, profile_name, city, address_line_1, latitude, longitude, rating, review_count, delivery_radius_km, profile_image_url, logo_url, slug, is_active")
    .eq("is_active", true);

  return (
    <main className="min-h-screen bg-[#fff8f6] px-3 py-8 md:px-6">
      <section className="mx-auto max-w-[1450px]">
        <FSMaps florists={florists || []} />
      </section>
    </main>
  );
}
