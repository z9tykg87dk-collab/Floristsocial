import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MarketingProfilePayload = {
  specialties?: unknown;
  quality_badges?: unknown;
  sustainability_options?: unknown;
  sustainability_text?: unknown;
};

type FloristMarketingRow = {
  id: string;
  shop_name: string | null;
  florist_name: string | null;
  specialties: string[] | null;
  quality_badges: string[] | null;
  sustainability_options: string[] | null;
  sustainability_text: string | null;
};

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ).slice(0, 50);
}

function normalizeOptionalText(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 2000) : null;
}

function serializeFlorist(florist: FloristMarketingRow) {
  return {
    id: florist.id,
    name: florist.shop_name || florist.florist_name || "Florist",
    specialties: florist.specialties || [],
    qualityBadges: florist.quality_badges || [],
    sustainabilityOptions: florist.sustainability_options || [],
    sustainabilityText: florist.sustainability_text || "",
  };
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Du måste vara inloggad." },
        { status: 401 },
      );
    }

    /*
     * De fyra marknadsföringskolumnerna finns i databasen men saknas ännu
     * i den lokalt genererade filen lib/database.types.ts.
     */
    const { data, error: floristError } = await (supabase as any)
      .from("florists")
      .select(
        [
          "id",
          "shop_name",
          "florist_name",
          "specialties",
          "quality_badges",
          "sustainability_options",
          "sustainability_text",
        ].join(","),
      )
      .eq("id", user.id)
      .maybeSingle();

    if (floristError) {
      return NextResponse.json(
        {
          error: "Floristprofilen kunde inte hämtas.",
          details: floristError.message,
        },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Ingen floristprofil är kopplad till kontot." },
        { status: 404 },
      );
    }

    const florist = data as FloristMarketingRow;

    return NextResponse.json({
      florist: serializeFlorist(florist),
    });
  } catch (error) {
    console.error("GET /api/florists/me/profile failed:", error);

    return NextResponse.json(
      {
        error: "Profilen kunde inte hämtas.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Du måste vara inloggad." },
        { status: 401 },
      );
    }

    let payload: MarketingProfilePayload;

    try {
      payload = (await request.json()) as MarketingProfilePayload;
    } catch {
      return NextResponse.json(
        { error: "Ogiltigt JSON-underlag." },
        { status: 400 },
      );
    }

    const updatePayload = {
      specialties: normalizeStringArray(payload.specialties),
      quality_badges: normalizeStringArray(payload.quality_badges),
      sustainability_options: normalizeStringArray(
        payload.sustainability_options,
      ),
      sustainability_text: normalizeOptionalText(
        payload.sustainability_text,
      ),
      updated_at: new Date().toISOString(),
    };

    /*
     * RLS begränsar uppdateringen till florists.id = auth.uid().
     * eq("id", user.id) ger dessutom samma ägarskapskontroll i frågan.
     */
    const { data, error: updateError } = await (supabase as any)
      .from("florists")
      .update(updatePayload)
      .eq("id", user.id)
      .select(
        [
          "id",
          "shop_name",
          "florist_name",
          "specialties",
          "quality_badges",
          "sustainability_options",
          "sustainability_text",
        ].join(","),
      )
      .maybeSingle();

    if (updateError) {
      return NextResponse.json(
        {
          error: "Profiländringarna kunde inte sparas.",
          details: updateError.message,
        },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error:
            "Floristprofilen kunde inte uppdateras eller tillhör inte kontot.",
        },
        { status: 404 },
      );
    }

    const florist = data as FloristMarketingRow;

    return NextResponse.json({
      success: true,
      florist: serializeFlorist(florist),
    });
  } catch (error) {
    console.error("PATCH /api/florists/me/profile failed:", error);

    return NextResponse.json(
      {
        error: "Profiländringarna kunde inte sparas.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
