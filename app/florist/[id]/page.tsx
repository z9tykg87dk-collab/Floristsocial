import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import FloristProfile from "@/components/FloristProfile";

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export default async function FloristPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  const query = supabase.from("florist_profiles").select("*");

  const { data: florist, error } = isUuid(id)
    ? await query.or(`id.eq.${id},profile_id.eq.${id}`).maybeSingle()
    : await query.eq("slug", id).maybeSingle();

  if (error) {
    console.error("Florist profile fetch error:", error.message);
  }

  const floristProfileId = florist?.id;

  const { data: products } = floristProfileId
    ? await supabase
        .from("products")
        .select("*")
        .eq("florist_profile_id", floristProfileId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
    : { data: [] };

  const { data: services } = floristProfileId
    ? await supabase
        .from("florist_services")
        .select("*")
        .eq("florist_profile_id", floristProfileId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
    : { data: [] };

  const { data: deliveryAreas } = floristProfileId
    ? await supabase
        .from("florist_delivery_areas")
        .select("*")
        .eq("florist_profile_id", floristProfileId)
        .order("created_at", { ascending: false })
    : { data: [] };

  const { data: portfolioItems } = floristProfileId
    ? await supabase
        .from("florist_portfolio_items")
        .select("*")
        .eq("florist_profile_id", floristProfileId)
        .eq("is_public", true)
        .order("created_at", { ascending: false })
    : { data: [] };

  const { data: closedDays } = floristProfileId
    ? await supabase
        .from("florist_closed_days")
        .select("*")
        .eq("florist_profile_id", floristProfileId)
        .order("created_at", { ascending: false })
    : { data: [] };

  const { data: openingHours } = floristProfileId
    ? await supabase
        .from("florist_opening_hours")
        .select("*")
        .eq("florist_profile_id", floristProfileId)
        .order("created_at", { ascending: true })
    : { data: [] };

  return (
    <FloristProfile
      florist={florist}
      products={products || []}
      services={services || []}
      deliveryAreas={deliveryAreas || []}
      portfolioItems={portfolioItems || []}
      closedDays={closedDays || []}
      openingHours={openingHours || []}
    />
  );
}
