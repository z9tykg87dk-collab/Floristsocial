import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  stockholmFloristSeeds,
  stockholmDiscoveryQueries,
} from "@/lib/fs-maps/stockholm-florists";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type GooglePlace = {
  id?: string;
  formattedAddress?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  displayName?: {
    text?: string;
  };
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
};

type FloristClaimRow = {
  external_place_id: string | null;
  claim_status: string | null;
};

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Miljövariabel saknas: ${name}`);
  }

  return value;
}

const supabaseAdmin = createClient(
  requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
  requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

async function searchPlaces(textQuery: string, maxResultCount = 10) {
  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY saknas i .env.local");
  }

  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": [
          "places.id",
          "places.displayName",
          "places.formattedAddress",
          "places.location",
          "places.nationalPhoneNumber",
          "places.internationalPhoneNumber",
          "places.websiteUri",
        ].join(","),
      },
      body: JSON.stringify({
        textQuery,
        languageCode: "sv",
        regionCode: "SE",
        maxResultCount,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Google Places returnerade ${response.status}: ${errorText}`,
    );
  }

  const data = await response.json();

  return (data.places || []) as GooglePlace[];
}

function parseSwedishAddress(formattedAddress: string | null) {
  const address = (formattedAddress || "").trim();
  const postalMatch = address.match(/\b(\d{3}\s?\d{2})\b/);
  const postalCode = postalMatch?.[1]?.replace(/\s+/g, " ") || "";

  const withoutCountry = address
    .replace(/,\s*Sverige\s*$/i, "")
    .trim();

  const parts = withoutCountry
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const streetAddress = parts[0] || "";

  let city = "";

  if (postalCode) {
    const postalIndex = withoutCountry.indexOf(postalCode);

    if (postalIndex >= 0) {
      city = withoutCountry
        .slice(postalIndex + postalCode.length)
        .replace(/^,\s*/, "")
        .trim();
    }
  }

  if (!city && parts.length > 1) {
    city = parts[parts.length - 1]
      .replace(postalCode, "")
      .trim();
  }

  return {
    streetAddress,
    postalCode,
    city,
  };
}

function toClaimPlace(place: GooglePlace, fallbackIndex: number) {
  const formattedAddress = place.formattedAddress || null;
  const parsed = parseSwedishAddress(formattedAddress);

  return {
    external_place_id: place.id || `google-place-${fallbackIndex}`,
    google_place_id: place.id || null,
    shop_name: place.displayName?.text || "Blomsterbutik",
    formatted_address: formattedAddress,
    street_address: parsed.streetAddress,
    postal_code: parsed.postalCode,
    city: parsed.city || "Stockholm",
    phone:
      place.internationalPhoneNumber ||
      place.nationalPhoneNumber ||
      "",
    website: place.websiteUri || "",
    latitude: place.location?.latitude || null,
    longitude: place.location?.longitude || null,
    claim_status: "GOOGLE_DISCOVERED",
  };
}

export async function GET() {
  try {
    const queryResults = await Promise.all(
      [...stockholmFloristSeeds, ...stockholmDiscoveryQueries].map(
        async (query) => searchPlaces(query, 10),
      ),
    );

    const googlePlaces = queryResults.flat();
    const uniquePlaces = new Map<string, GooglePlace>();

    googlePlaces.forEach((place, index) => {
      const key =
        place.id ||
        `${place.displayName?.text || "place"}-${place.formattedAddress || index}`;

      if (
        place.location?.latitude &&
        place.location?.longitude &&
        !uniquePlaces.has(key)
      ) {
        uniquePlaces.set(key, place);
      }
    });

    const { data: floristRows, error: floristError } =
      await supabaseAdmin
        .from("florists")
        .select("external_place_id, claim_status")
        .not("external_place_id", "is", null);

    if (floristError) {
      throw new Error(
        `Kunde inte läsa claim-status: ${floristError.message}`,
      );
    }

    const statusByPlaceId = new Map<string, string>();

    ((floristRows || []) as FloristClaimRow[]).forEach((row) => {
      if (row.external_place_id) {
        statusByPlaceId.set(
          row.external_place_id,
          row.claim_status || "CLAIM_PENDING",
        );
      }
    });

    const results = Array.from(uniquePlaces.values())
      .map((place, index) => {
        const item = toClaimPlace(place, index);
        const storedStatus = item.google_place_id
          ? statusByPlaceId.get(item.google_place_id)
          : undefined;

        return {
          ...item,
          claim_status: storedStatus || "GOOGLE_DISCOVERED",
        };
      })
      .filter((item) =>
        [
          "GOOGLE_DISCOVERED",
          "REJECTED",
          "SUSPENDED",
        ].includes(item.claim_status),
      );

    return NextResponse.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Okänt fel i claim-kartan.",
      },
      { status: 500 },
    );
  }
}
