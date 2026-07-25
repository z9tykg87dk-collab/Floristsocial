import type {
  FloristMapItem,
  MapBounds,
  SearchCountry,
} from "@/lib/fs-maps/types";

const GOOGLE_PLACES_SEARCH_URL =
  "https://places.googleapis.com/v1/places:searchText";

const GOOGLE_PLACES_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.addressComponents",
  "places.regularOpeningHours.weekdayDescriptions",
  "nextPageToken",
].join(",");

type GoogleLocalizedText = {
  text?: string;
  languageCode?: string;
};

type GoogleLatLng = {
  latitude?: number;
  longitude?: number;
};

type GoogleAddressComponent = {
  longText?: string;
  shortText?: string;
  types?: string[];
  languageCode?: string;
};

type GoogleOpeningHours = {
  weekdayDescriptions?: string[];
};

type GooglePlace = {
  id?: string;
  displayName?: GoogleLocalizedText;
  formattedAddress?: string;
  location?: GoogleLatLng;
  rating?: number;
  userRatingCount?: number;
  addressComponents?: GoogleAddressComponent[];
  regularOpeningHours?: GoogleOpeningHours;
};

type GoogleTextSearchResponse = {
  places?: GooglePlace[];
  nextPageToken?: string;
};

export type GooglePlacesSearchOptions = {
  bounds: MapBounds;
  country?: SearchCountry;
  languageCode?: string;
  query?: string;
  pageSize?: number;
  pageToken?: string;
};

function getGoogleMapsApiKey(): string {
  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY ??
    process.env.GOOGLE_PLACES_API_KEY ??
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Google Maps API-nyckel saknas. Lägg till GOOGLE_MAPS_API_KEY i .env.local."
    );
  }

  return apiKey;
}

function isFiniteCoordinate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function validateBounds(bounds: MapBounds): void {
  const values = [
    bounds.north,
    bounds.south,
    bounds.east,
    bounds.west,
  ];

  if (!values.every(isFiniteCoordinate)) {
    throw new Error("Kartans bounds innehåller ogiltiga koordinater.");
  }

  if (bounds.north <= bounds.south) {
    throw new Error("north måste vara större än south.");
  }

  if (bounds.north > 90 || bounds.south < -90) {
    throw new Error("Latitud måste ligga mellan -90 och 90.");
  }

  if (
    bounds.east > 180 ||
    bounds.east < -180 ||
    bounds.west > 180 ||
    bounds.west < -180
  ) {
    throw new Error("Longitud måste ligga mellan -180 och 180.");
  }

  if (bounds.east <= bounds.west) {
    throw new Error(
      "Bounds som korsar datumlinjen stöds inte ännu. east måste vara större än west."
    );
  }
}

function getAddressComponent(
  components: GoogleAddressComponent[] | undefined,
  acceptedTypes: string[]
): string | null {
  if (!components?.length) {
    return null;
  }

  const component = components.find((item) =>
    item.types?.some((type) => acceptedTypes.includes(type))
  );

  return component?.longText?.trim() || component?.shortText?.trim() || null;
}

function extractCity(place: GooglePlace): string | null {
  return getAddressComponent(place.addressComponents, [
    "locality",
    "postal_town",
    "administrative_area_level_2",
    "administrative_area_level_1",
  ]);
}

function extractPostcode(place: GooglePlace): string | null {
  return getAddressComponent(place.addressComponents, ["postal_code"]);
}

function normalizePageSize(pageSize: number | undefined): number {
  if (!Number.isFinite(pageSize)) {
    return 20;
  }

  return Math.min(20, Math.max(1, Math.trunc(pageSize ?? 20)));
}

function createTextQuery(
  query: string | undefined,
  country: SearchCountry
): string {
  const normalizedQuery = query?.trim();

  if (normalizedQuery) {
    return normalizedQuery;
  }

  const countryQueries: Record<string, string> = {
    SE: "blomsterbutik eller florist",
    NO: "blomsterbutikk eller florist",
    DK: "blomsterbutik eller florist",
    FI: "kukkakauppa tai floristi",
    IS: "blomabud eda florist",

    FR: "fleuriste ou magasin de fleurs",
    ES: "floristeria o florista",
    PT: "florista ou loja de flores",
    IT: "fioraio o negozio di fiori",

    DE: "Blumenladen oder Florist",
    NL: "bloemenwinkel of bloemist",
    BE: "bloemenwinkel fleuriste florist",
    LU: "fleuriste Blumenladen florist",
    AT: "Blumenladen oder Florist",
    CH: "Blumenladen fleuriste fioraio",

    PL: "kwiaciarnia lub florysta",
    CZ: "kvetinarstvi nebo florista",
    SK: "kvetinarstvo alebo florista",
    HU: "viragbolt vagy viragkoto",
    RO: "florarie sau florist",
    BG: "magazin za tsvetya ili florist",
    HR: "cvjecarnica ili florist",
    SI: "cvetlicarna ali florist",

    EE: "lillepood voi florist",
    LV: "ziedu veikals vai florists",
    LT: "geliu parduotuve arba floristas",
    GR: "anthopoleio i florist",

    IE: "flower shop or florist",
    GB: "flower shop or florist",

    US: "flower shop or florist",
    CA: "flower shop or florist",
    AU: "flower shop or florist",
    NZ: "flower shop or florist",

    JP: "flower shop or florist",
    KR: "flower shop or florist",
    CN: "flower shop or florist",
    IN: "flower shop or florist",
    TH: "flower shop or florist",
    TR: "cicekci veya florist",
    AE: "flower shop or florist",
    BR: "floricultura ou florista",
    MX: "floreria o florista",
    ZA: "flower shop or florist",
  };

  return countryQueries[country] ?? "flower shop or florist";
}

function toFloristMapItem(
  place: GooglePlace,
  country: SearchCountry
): FloristMapItem | null {
  const latitude = place.location?.latitude;
  const longitude = place.location?.longitude;

  if (
    !place.id ||
    !isFiniteCoordinate(latitude) ||
    !isFiniteCoordinate(longitude)
  ) {
    return null;
  }

  const shopName = place.displayName?.text?.trim() || "Blomsterbutik";

  return {
    florist_id: `google-${place.id}`,
    source: "google",
    google_place_id: place.id,
    florist_name: shopName,
    shop_name: shopName,
    address: place.formattedAddress?.trim() || null,
    city: extractCity(place),
    postcode: extractPostcode(place),
    country,
    latitude,
    longitude,
    rating:
      typeof place.rating === "number" && Number.isFinite(place.rating)
        ? place.rating
        : null,
    review_count:
      typeof place.userRatingCount === "number" &&
      Number.isFinite(place.userRatingCount)
        ? place.userRatingCount
        : null,
    logo_url: null,
    profile_image_url: null,
    delivery_radius_km: null,
    distance_km: null,
    opening_hours:
      place.regularOpeningHours?.weekdayDescriptions?.length
        ? place.regularOpeningHours.weekdayDescriptions
        : null,
    standard_delivery_fee: null,
    express_delivery_available: false,
    express_delivery_fee: null,
    verification_level: "NONE",
    fs_map_status: "google_discovered",
  };
}

export async function searchGoogleFlorists(
  options: GooglePlacesSearchOptions
): Promise<{
  results: FloristMapItem[];
  nextPageToken: string | null;
}> {
  validateBounds(options.bounds);

  const country = options.country ?? "SE";
  const languageCode = options.languageCode?.trim() || "sv";
  const pageSize = normalizePageSize(options.pageSize);
  const apiKey = getGoogleMapsApiKey();

  const requestBody: Record<string, unknown> = {
    textQuery: createTextQuery(options.query, country),
    languageCode,
    regionCode: country,
    pageSize,
    locationRestriction: {
      rectangle: {
        low: {
          latitude: options.bounds.south,
          longitude: options.bounds.west,
        },
        high: {
          latitude: options.bounds.north,
          longitude: options.bounds.east,
        },
      },
    },
  };

  if (options.pageToken?.trim()) {
    requestBody.pageToken = options.pageToken.trim();
  }

  const response = await fetch(GOOGLE_PLACES_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": GOOGLE_PLACES_FIELD_MASK,
    },
    body: JSON.stringify(requestBody),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Google Places svarade med ${response.status}: ${errorText}`
    );
  }

  const data = (await response.json()) as GoogleTextSearchResponse;

  const results = (data.places ?? [])
    .map((place) => toFloristMapItem(place, country))
    .filter((item): item is FloristMapItem => item !== null);

  return {
    results,
    nextPageToken: data.nextPageToken?.trim() || null,
  };
}

export async function searchGoogleFloristPages(
  options: GooglePlacesSearchOptions & {
    maxPages?: number;
  },
): Promise<{
  results: FloristMapItem[];
  nextPageToken: string | null;
}> {
  const {
    maxPages: requestedMaxPages,
    ...searchOptions
  } = options;

  const maxPages = Math.min(
    3,
    Math.max(
      1,
      Math.trunc(requestedMaxPages ?? 1),
    ),
  );

  const allResults: FloristMapItem[] = [];
  let pageToken =
    searchOptions.pageToken?.trim() || undefined;

  let nextPageToken: string | null = null;

  for (
    let pageIndex = 0;
    pageIndex < maxPages;
    pageIndex += 1
  ) {
    const page = await searchGoogleFlorists({
      ...searchOptions,
      pageToken,
    });

    allResults.push(...page.results);
    nextPageToken = page.nextPageToken;

    if (!nextPageToken) {
      break;
    }

    pageToken = nextPageToken;
  }

  const uniqueResults =
    new Map<string, FloristMapItem>();

  for (const item of allResults) {
    const identity =
      item.google_place_id ||
      item.florist_id;

    if (!uniqueResults.has(identity)) {
      uniqueResults.set(identity, item);
    }
  }

  return {
    results: Array.from(uniqueResults.values()),
    nextPageToken,
  };
}

