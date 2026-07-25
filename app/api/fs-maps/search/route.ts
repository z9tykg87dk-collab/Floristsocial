import { NextRequest, NextResponse } from "next/server";

import { searchFSMaps } from "@/lib/fs-maps/search";
import type {
  MapBounds,
  SearchCountry,
} from "@/lib/fs-maps/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseRequiredNumber(
  searchParams: URLSearchParams,
  key: string
): number {
  const rawValue = searchParams.get(key);

  if (rawValue === null || rawValue.trim() === "") {
    throw new Error(`Parametern "${key}" saknas.`);
  }

  const value = Number(rawValue);

  if (!Number.isFinite(value)) {
    throw new Error(`Parametern "${key}" är inte ett giltigt tal.`);
  }

  return value;
}

function parseBounds(searchParams: URLSearchParams): MapBounds {
  return {
    north: parseRequiredNumber(searchParams, "north"),
    south: parseRequiredNumber(searchParams, "south"),
    east: parseRequiredNumber(searchParams, "east"),
    west: parseRequiredNumber(searchParams, "west"),
  };
}

function parseCountry(
  searchParams: URLSearchParams
): SearchCountry {
  const rawValue =
    searchParams.get("country")?.trim().toUpperCase() || "SE";

  const aliases: Record<string, string> = {
    UK: "GB",
  };

  const value = aliases[rawValue] ?? rawValue;

  if (!/^[A-Z]{2}$/.test(value)) {
    throw new Error(
      `Landkoden "${rawValue}" maste besta av tva bokstaver.`
    );
  }

  return value;
}

function parseOptionalInteger(
  searchParams: URLSearchParams,
  key: string
): number | undefined {
  const rawValue = searchParams.get(key);

  if (!rawValue) {
    return undefined;
  }

  const value = Number(rawValue);

  if (!Number.isFinite(value)) {
    throw new Error(`Parametern "${key}" är ogiltig.`);
  }

  return Math.trunc(value);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const result = await searchFSMaps({
      bounds: parseBounds(searchParams),
      country: parseCountry(searchParams),
      languageCode:
        searchParams.get("language")?.trim() || "sv",
      query: searchParams.get("query")?.trim() || undefined,
      pageSize: parseOptionalInteger(searchParams, "pageSize"),
      pageToken:
        searchParams.get("pageToken")?.trim() || undefined,
      bypassCache:
        searchParams.get("bypassCache") === "true",
    });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control":
          "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Ett oväntat fel inträffade i kartmotorn.";

    console.error("[FS Maps Search]", error);

    return NextResponse.json(
      {
        error: "FS_MAPS_SEARCH_FAILED",
        message,
      },
      {
        status: 400,
      }
    );
  }
}
