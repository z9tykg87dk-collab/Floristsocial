import { NextResponse } from "next/server";
import {
  stockholmFloristSeeds,
  stockholmDiscoveryQueries,
} from "@/lib/fs-maps/stockholm-florists";

export const dynamic = "force-dynamic";

type GooglePlace = {
  id?: string;
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
};

async function searchPlaces(textQuery: string, maxResultCount = 10) {
  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) throw new Error("GOOGLE_MAPS_API_KEY saknas i .env.local");

  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount",
    },
    body: JSON.stringify({
      textQuery,
      languageCode: "sv",
      regionCode: "SE",
      maxResultCount,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Places error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return (data.places || []) as GooglePlace[];
}

function toMapItem(place: GooglePlace, index: number, status: string, query: string) {
  return {
    florist_id: `${status}-${place.id || index}`,
    source_query: query,
    google_place_id: place.id || null,
    florist_name: place.displayName?.text || "Blomsterbutik",
    shop_name: place.displayName?.text || "Blomsterbutik",
    city: "Stockholm",
    area: place.formattedAddress || null,
    delivery_radius_km: 15,
    latitude: place.location?.latitude || null,
    longitude: place.location?.longitude || null,
    distance_km: 0,
    profile_image_url: null,
    logo_url: null,
    rating: place.rating || null,
    review_count: place.userRatingCount || null,
    opening_hours: null,
    same_day_cutoff_time: null,
    standard_delivery_fee: null,
    express_delivery_available: null,
    express_delivery_fee: null,
    fs_map_status: status,
  };
}

export async function GET() {
  try {
    const approvedRaw = await Promise.all(
      stockholmFloristSeeds.map(async (query, index) => {
        const places = await searchPlaces(query, 1);
        return toMapItem(places[0] || {}, index, "approved_display", query);
      })
    );

    const discoveredRaw = (
      await Promise.all(
        stockholmDiscoveryQueries.map(async (query) => {
          const places = await searchPlaces(query, 10);
          return places.map((place, index) =>
            toMapItem(place, index, "google_discovered", query)
          );
        })
      )
    ).flat();

    const byPlaceId = new Map<string, any>();

    for (const item of [...approvedRaw, ...discoveredRaw]) {
      if (!item.google_place_id || !item.latitude || !item.longitude) continue;
      if (!byPlaceId.has(item.google_place_id)) {
        byPlaceId.set(item.google_place_id, item);
      }
    }

    const results = Array.from(byPlaceId.values());

    return NextResponse.json({
      success: true,
      count: results.length,
      approved_count: approvedRaw.length,
      discovered_count: results.length - approvedRaw.length,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Okänt fel",
      },
      { status: 500 }
    );
  }
}
