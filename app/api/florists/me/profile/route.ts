import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OpeningHour = {
  id: number;
  dayLabel: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  note: string;
};

type DeliveryArea = {
  id: number;
  city: string;
  area: string;
  postalCode: string;
  radius: number;
  price: string;
};

type FloristProfilePayload = {
  shop_name?: unknown;
  florist_name?: unknown;
  bio?: unknown;
  description?: unknown;
  phone?: unknown;
  public_email?: unknown;
  website?: unknown;
  instagram?: unknown;
  address_line_1?: unknown;
  address_line_2?: unknown;
  postal_code?: unknown;
  city?: unknown;
  municipality?: unknown;
  county?: unknown;
  country?: unknown;
  delivery_radius_km?: unknown;
  delivery_model?: unknown;
  delivery_areas?: unknown;

  services?: unknown;
  styles?: unknown;
  price_level?: unknown;
  minimum_booking_value?: unknown;
  years_in_business?: unknown;
  team_size?: unknown;
  opening_hours?: unknown;

  specialties?: unknown;
  quality_badges?: unknown;
  sustainability_options?: unknown;
  sustainability_text?: unknown;
};

type FloristProfileRow = {
  id: string;
  shop_name: string | null;
  florist_name: string | null;
  bio: string | null;
  description: string | null;
  phone: string | null;
  public_email: string | null;
  website: string | null;
  instagram: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  postal_code: string | null;
  city: string | null;
  municipality: string | null;
  county: string | null;
  country: string | null;
  delivery_radius_km: number | null;
  delivery_model: string | null;
  delivery_areas: unknown;

  services: unknown;
  styles: unknown;
  price_level: string | null;
  minimum_booking_value: string | null;
  years_in_business: string | null;
  team_size: string | null;
  opening_hours: unknown;

  profile_image_url: string | null;
  logo_url: string | null;
  cover_image_url: string | null;

  specialties: string[] | null;
  quality_badges: string[] | null;
  sustainability_options: string[] | null;
  sustainability_text: string | null;
};

const PROFILE_SELECT = [
  "id",
  "shop_name",
  "florist_name",
  "bio",
  "description",
  "phone",
  "public_email",
  "website",
  "instagram",
  "address_line_1",
  "address_line_2",
  "postal_code",
  "city",
  "municipality",
  "county",
  "country",
  "delivery_radius_km",
  "delivery_model",
  "delivery_areas",
  "services",
  "styles",
  "price_level",
  "minimum_booking_value",
  "years_in_business",
  "team_size",
  "opening_hours",
  "profile_image_url",
  "logo_url",
  "cover_image_url",
  "specialties",
  "quality_badges",
  "sustainability_options",
  "sustainability_text",
].join(",");

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

function normalizeOpeningHours(value: unknown): OpeningHour[] {
  if (!Array.isArray(value)) return [];

  return value.slice(0, 7).map((item, index) => {
    const row =
      item && typeof item === "object"
        ? (item as Record<string, unknown>)
        : {};

    return {
      id:
        typeof row.id === "number" && Number.isFinite(row.id)
          ? row.id
          : index + 1,
      dayLabel:
        typeof row.dayLabel === "string"
          ? row.dayLabel.trim().slice(0, 40)
          : "",
      openTime:
        typeof row.openTime === "string"
          ? row.openTime.trim().slice(0, 10)
          : "",
      closeTime:
        typeof row.closeTime === "string"
          ? row.closeTime.trim().slice(0, 10)
          : "",
      isClosed: row.isClosed === true,
      note:
        typeof row.note === "string"
          ? row.note.trim().slice(0, 300)
          : "",
    };
  });
}

function normalizeDeliveryAreas(value: unknown): DeliveryArea[] {
  if (!Array.isArray(value)) return [];

  return value.slice(0, 50).map((item, index) => {
    const row =
      item && typeof item === "object"
        ? (item as Record<string, unknown>)
        : {};

    const rawRadius =
      typeof row.radius === "number"
        ? row.radius
        : Number(String(row.radius ?? "").replace(",", "."));

    const radius = Number.isFinite(rawRadius)
      ? Math.min(Math.max(rawRadius, 1), 150)
      : 15;

    return {
      id:
        typeof row.id === "number" && Number.isFinite(row.id)
          ? row.id
          : index + 1,
      city:
        typeof row.city === "string"
          ? row.city.trim().slice(0, 150)
          : "",
      area:
        typeof row.area === "string" && row.area.trim()
          ? row.area.trim().slice(0, 150)
          : "Annat område",
      postalCode:
        typeof row.postalCode === "string"
          ? row.postalCode.trim().slice(0, 50)
          : "",
      radius,
      price:
        typeof row.price === "string"
          ? row.price.trim().slice(0, 50)
          : "",
    };
  });
}

function normalizeOptionalText(
  value: unknown,
  maximumLength = 500,
): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maximumLength) : null;
}

function normalizeRequiredText(
  value: unknown,
  maximumLength = 200,
): string {
  if (typeof value !== "string") return "";

  return value.trim().slice(0, maximumLength);
}

function normalizeEmail(value: unknown): string | null {
  const email = normalizeOptionalText(value, 320);

  if (!email) return null;

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return valid ? email.toLowerCase() : null;
}

function normalizeUrl(value: unknown): string | null {
  const text = normalizeOptionalText(value, 1000);

  if (!text) return null;

  const candidate =
    text.startsWith("http://") || text.startsWith("https://")
      ? text
      : `https://${text}`;

  try {
    const url = new URL(candidate);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function normalizeRadius(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;

  const parsed =
    typeof value === "number"
      ? value
      : Number(String(value).replace(",", "."));

  if (!Number.isFinite(parsed)) return null;

  return Math.min(Math.max(parsed, 0), 500);
}

function serializeFlorist(florist: FloristProfileRow) {
  return {
    id: florist.id,
    name: florist.shop_name || florist.florist_name || "Florist",

    shopName: florist.shop_name || "",
    floristName: florist.florist_name || "",
    bio: florist.bio || "",
    description: florist.description || "",
    phone: florist.phone || "",
    publicEmail: florist.public_email || "",
    website: florist.website || "",
    instagram: florist.instagram || "",

    addressLine1: florist.address_line_1 || "",
    addressLine2: florist.address_line_2 || "",
    postalCode: florist.postal_code || "",
    city: florist.city || "",
    municipality: florist.municipality || "",
    county: florist.county || "",
    country: florist.country || "",
    deliveryRadiusKm: florist.delivery_radius_km,
    deliveryModel: florist.delivery_model || "",
    deliveryAreas: normalizeDeliveryAreas(florist.delivery_areas),

    services: normalizeStringArray(florist.services),
    styles: normalizeStringArray(florist.styles),
    priceLevel: florist.price_level || "",
    minimumBookingValue: florist.minimum_booking_value || "",
    yearsInBusiness: florist.years_in_business || "",
    teamSize: florist.team_size || "",
    openingHours: normalizeOpeningHours(florist.opening_hours),

    profileImageUrl: florist.profile_image_url || "",
    logoUrl: florist.logo_url || "",
    coverImageUrl: florist.cover_image_url || "",

    specialties: florist.specialties || [],
    qualityBadges: florist.quality_badges || [],
    sustainabilityOptions: florist.sustainability_options || [],
    sustainabilityText: florist.sustainability_text || "",
  };
}

async function getAuthenticatedFlorist() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  return {
    supabase,
    user,
    authError,
  };
}

export async function GET() {
  try {
    const { supabase, user, authError } = await getAuthenticatedFlorist();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Du måste vara inloggad." },
        { status: 401 },
      );
    }

    /*
     * Några nya kolumner saknas ännu i den lokalt genererade
     * lib/database.types.ts. Därför begränsas any-casten till just frågan.
     */
    const { data, error: floristError } = await (supabase as any)
      .from("florists")
      .select(PROFILE_SELECT)
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

    return NextResponse.json({
      florist: serializeFlorist(data as FloristProfileRow),
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
    const { supabase, user, authError } = await getAuthenticatedFlorist();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Du måste vara inloggad." },
        { status: 401 },
      );
    }

    let payload: FloristProfilePayload;

    try {
      payload = (await request.json()) as FloristProfilePayload;
    } catch {
      return NextResponse.json(
        { error: "Ogiltigt JSON-underlag." },
        { status: 400 },
      );
    }

    const shopName = normalizeRequiredText(payload.shop_name);

    if (!shopName) {
      return NextResponse.json(
        { error: "Butiksnamn måste anges." },
        { status: 400 },
      );
    }

    const publicEmail =
      payload.public_email === undefined
        ? undefined
        : normalizeEmail(payload.public_email);

    if (
      payload.public_email !== undefined &&
      normalizeOptionalText(payload.public_email) &&
      !publicEmail
    ) {
      return NextResponse.json(
        { error: "Den publika e-postadressen är ogiltig." },
        { status: 400 },
      );
    }

    const website =
      payload.website === undefined
        ? undefined
        : normalizeUrl(payload.website);

    if (
      payload.website !== undefined &&
      normalizeOptionalText(payload.website) &&
      !website
    ) {
      return NextResponse.json(
        { error: "Webbadressen är ogiltig." },
        { status: 400 },
      );
    }

    /*
     * Endast uttryckligen tillåtna floristfält ingår här.
     * Juridiska uppgifter, roll, verifiering, Stripe och Admin-fält
     * kan inte skickas genom denna route.
     */
    const updatePayload = {
      shop_name: shopName,
      florist_name:
        normalizeOptionalText(payload.florist_name, 200) || shopName,
      bio: normalizeOptionalText(payload.bio, 2000),
      description: normalizeOptionalText(payload.description, 4000),
      phone: normalizeOptionalText(payload.phone, 100),
      public_email: publicEmail ?? null,
      website: website ?? null,
      instagram: normalizeOptionalText(payload.instagram, 300),

      address_line_1: normalizeOptionalText(payload.address_line_1, 300),
      address_line_2: normalizeOptionalText(payload.address_line_2, 300),
      postal_code: normalizeOptionalText(payload.postal_code, 30),
      city: normalizeOptionalText(payload.city, 150),
      municipality: normalizeOptionalText(payload.municipality, 150),
      county: normalizeOptionalText(payload.county, 150),
      country:
        normalizeOptionalText(payload.country, 150) || "Sverige",
      delivery_radius_km: normalizeRadius(payload.delivery_radius_km),
      delivery_model: normalizeOptionalText(payload.delivery_model, 150),
      delivery_areas: normalizeDeliveryAreas(payload.delivery_areas),

      services: normalizeStringArray(payload.services),
      styles: normalizeStringArray(payload.styles),
      price_level: normalizeOptionalText(payload.price_level, 100),
      minimum_booking_value: normalizeOptionalText(
        payload.minimum_booking_value,
        100,
      ),
      years_in_business: normalizeOptionalText(
        payload.years_in_business,
        100,
      ),
      team_size: normalizeOptionalText(payload.team_size, 100),
      opening_hours: normalizeOpeningHours(payload.opening_hours),

      specialties: normalizeStringArray(payload.specialties),
      quality_badges: normalizeStringArray(payload.quality_badges),
      sustainability_options: normalizeStringArray(
        payload.sustainability_options,
      ),
      sustainability_text: normalizeOptionalText(
        payload.sustainability_text,
        2000,
      ),

      updated_at: new Date().toISOString(),
    };

    /*
     * Två ägarskapskontroller:
     * 1. Frågan begränsas till user.id.
     * 2. RLS kräver florists.id = auth.uid().
     */
    const { data, error: updateError } = await (supabase as any)
      .from("florists")
      .update(updatePayload)
      .eq("id", user.id)
      .select(PROFILE_SELECT)
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

    return NextResponse.json({
      success: true,
      florist: serializeFlorist(data as FloristProfileRow),
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
