import {
  getCachedValue,
  setCachedValue,
} from "@/lib/fs-maps/cache";
import { searchGoogleFloristPages } from "@/lib/fs-maps/google";
import { mergeFloristMapItems } from "@/lib/fs-maps/merge";
import { searchFloristSocialFlorists } from "@/lib/fs-maps/supabase";
import type {
  FloristMapItem,
  MapBounds,
  SearchCountry,
} from "@/lib/fs-maps/types";

const DEFAULT_CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_RESULTS = 60;


function getGooglePageCount(
  bounds: MapBounds,
): number {
  const latitudeSpan = Math.abs(
    bounds.north - bounds.south,
  );

  const longitudeSpan = Math.abs(
    bounds.east - bounds.west,
  );

  /*
   * Stad eller tätortsområde:
   * läs upp till 60 Google-resultat.
   */
  if (
    latitudeSpan <= 0.8 &&
    longitudeSpan <= 1.0
  ) {
    return 3;
  }

  /*
   * Region eller större stad:
   * läs upp till 40 resultat.
   */
  if (
    latitudeSpan <= 2.5 &&
    longitudeSpan <= 3.0
  ) {
    return 2;
  }

  /*
   * Land- och Europavy:
   * en representativ första sida tills
   * rutindelning och klustring är installerad.
   */
  return 1;
}

export type FSMapsSearchInput = {
  bounds: MapBounds;
  country?: SearchCountry;
  languageCode?: string;
  query?: string;
  pageSize?: number;
  pageToken?: string;
  bypassCache?: boolean;
};

export type FSMapsSearchResult = {
  results: FloristMapItem[];
  total: number;
  nextPageToken: string | null;
  cached: boolean;
  searchedAt: string;
};

function normalizeNumber(value: number): number {
  return Number(value.toFixed(4));
}

function createCacheKey(input: FSMapsSearchInput): string {
  const bounds = input.bounds;

  return JSON.stringify({
    north: normalizeNumber(bounds.north),
    south: normalizeNumber(bounds.south),
    east: normalizeNumber(bounds.east),
    west: normalizeNumber(bounds.west),
    country: input.country ?? "SE",
    languageCode: input.languageCode?.trim() || "sv",
    query: input.query?.trim().toLowerCase() || "",
    pageSize: input.pageSize ?? 20,
    pageToken: input.pageToken?.trim() || "",
  });
}

function sortResults(
  items: FloristMapItem[]
): FloristMapItem[] {
  return [...items].sort((a, b) => {
    const sourceDifference =
      Number(b.source !== "google") -
      Number(a.source !== "google");

    if (sourceDifference !== 0) {
      return sourceDifference;
    }

    const verificationOrder: Record<string, number> = {
      FULL: 4,
      BUSINESS: 3,
      BASIC: 2,
      NONE: 1,
    };

    const verificationDifference =
      (verificationOrder[b.verification_level] ?? 0) -
      (verificationOrder[a.verification_level] ?? 0);

    if (verificationDifference !== 0) {
      return verificationDifference;
    }

    const ratingDifference =
      (b.rating ?? 0) - (a.rating ?? 0);

    if (ratingDifference !== 0) {
      return ratingDifference;
    }

    return (b.review_count ?? 0) - (a.review_count ?? 0);
  });
}

export async function searchFSMaps(
  input: FSMapsSearchInput
): Promise<FSMapsSearchResult> {
  const cacheKey = createCacheKey(input);

  if (!input.bypassCache) {
    const cached =
      getCachedValue<FSMapsSearchResult>(cacheKey);

    if (cached) {
      return {
        ...cached,
        cached: true,
      };
    }
  }

  const country = input.country ?? "SE";

  const [googleResult, floristSocialResults] =
    await Promise.all([
      searchGoogleFloristPages({
        bounds: input.bounds,
        country,
        languageCode: input.languageCode ?? "sv",
        query: input.query,
        pageSize: input.pageSize,
        pageToken: input.pageToken,
        maxPages: getGooglePageCount(input.bounds),
      }),
      searchFloristSocialFlorists({
        bounds: input.bounds,
        country,
      }),
    ]);

  const mergedResults = mergeFloristMapItems(
    floristSocialResults,
    googleResult.results
  );

  const sortedResults = sortResults(mergedResults).slice(
    0,
    MAX_RESULTS
  );

  const result: FSMapsSearchResult = {
    results: sortedResults,
    total: sortedResults.length,
    nextPageToken: googleResult.nextPageToken,
    cached: false,
    searchedAt: new Date().toISOString(),
  };

  setCachedValue(
    cacheKey,
    result,
    DEFAULT_CACHE_TTL_MS
  );

  return result;
}
