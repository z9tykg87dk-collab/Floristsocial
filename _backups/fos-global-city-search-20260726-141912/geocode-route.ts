import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COUNTRY_NAME_BY_CODE: Record<string, string> = {
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  IS: "Iceland",
  FR: "France",
  DE: "Germany",
  ES: "Spain",
  GB: "United Kingdom",
  IT: "Italy",
  NL: "Netherlands",
  BE: "Belgium",
  AT: "Austria",
  CH: "Switzerland",
  PT: "Portugal",
  IE: "Ireland",
  PL: "Poland",
  CZ: "Czechia",
  EE: "Estonia",
  LV: "Latvia",
  LT: "Lithuania",
  GR: "Greece",
  HR: "Croatia",
  SI: "Slovenia",
  SK: "Slovakia",
  HU: "Hungary",
  RO: "Romania",
  BG: "Bulgaria",
  LU: "Luxembourg",
  US: "United States",
  CA: "Canada",
  AU: "Australia",
  NZ: "New Zealand",
  JP: "Japan",
  KR: "South Korea",
  IN: "India",
  BR: "Brazil",
  AR: "Argentina",
  MX: "Mexico",
  ZA: "South Africa",
  AE: "United Arab Emirates",
};

const COUNTRY_CODE_BY_NAME: Record<string, string> = {
  sverige: "SE",
  sweden: "SE",

  norge: "NO",
  norway: "NO",

  danmark: "DK",
  denmark: "DK",

  finland: "FI",
  suomi: "FI",

  island: "IS",
  iceland: "IS",

  frankrike: "FR",
  france: "FR",

  tyskland: "DE",
  germany: "DE",

  spanien: "ES",
  spain: "ES",

  storbritannien: "GB",
  england: "GB",
  "united kingdom": "GB",
  "great britain": "GB",

  italien: "IT",
  italy: "IT",

  nederländerna: "NL",
  nederlanderna: "NL",
  netherlands: "NL",
  holland: "NL",

  belgien: "BE",
  belgium: "BE",

  österrike: "AT",
  osterrike: "AT",
  austria: "AT",

  schweiz: "CH",
  switzerland: "CH",

  portugal: "PT",

  irland: "IE",
  ireland: "IE",

  polen: "PL",
  poland: "PL",

  tjeckien: "CZ",
  czechia: "CZ",
  "czech republic": "CZ",

  estland: "EE",
  estonia: "EE",

  lettland: "LV",
  latvia: "LV",

  litauen: "LT",
  lithuania: "LT",

  grekland: "GR",
  greece: "GR",

  usa: "US",
  "united states": "US",
  "united states of america": "US",

  kanada: "CA",
  canada: "CA",

  australien: "AU",
  australia: "AU",

  japan: "JP",

  indien: "IN",
  india: "IN",

  brasilien: "BR",
  brazil: "BR",

  argentina: "AR",

  mexico: "MX",
  mexiko: "MX",

  sydafrika: "ZA",
  "south africa": "ZA",
};

function normalizeCountryName(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("sv")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeCountryCode(
  value: string | null,
): string | null {
  const normalized = value
    ?.trim()
    .toUpperCase();

  if (!normalized) {
    return null;
  }

  if (normalized === "UK") {
    return "GB";
  }

  if (/^[A-Z]{2}$/.test(normalized)) {
    return normalized;
  }

  return null;
}

function resolveCountry(
  rawCountryCode: string | null,
  rawCountryName: string | null,
) {
  const directCode =
    normalizeCountryCode(rawCountryCode) ||
    normalizeCountryCode(rawCountryName);

  const nameKey = rawCountryName
    ? normalizeCountryName(rawCountryName)
    : "";

  const mappedCode =
    nameKey
      ? COUNTRY_CODE_BY_NAME[nameKey]
      : null;

  const hasExplicitCountry = Boolean(
    rawCountryCode?.trim() ||
    rawCountryName?.trim(),
  );

  const countryCode =
    directCode ||
    mappedCode ||
    (
      hasExplicitCountry
        ? null
        : "SE"
    );

  const countryName =
    rawCountryName?.trim() &&
    !normalizeCountryCode(rawCountryName)
      ? rawCountryName.trim()
      : countryCode
        ? COUNTRY_NAME_BY_CODE[countryCode] || null
        : null;

  return {
    countryCode,
    countryName,
  };
}

export async function GET(req: Request) {
  const { searchParams } =
    new URL(req.url);

  const address =
    searchParams.get("address") ||
    searchParams.get("q");

  if (
    !address ||
    address.trim().length < 2
  ) {
    return NextResponse.json(
      {
        error:
          "Ange en stad, adress eller ett postnummer.",
      },
      { status: 400 },
    );
  }

  const {
    countryCode,
    countryName,
  } = resolveCountry(
    searchParams.get("countryCode"),
    searchParams.get("countryName") ||
      searchParams.get("country"),
  );

  const cleanAddress =
    address.trim();

  const query =
    countryName &&
    !normalizeCountryName(cleanAddress).includes(
      normalizeCountryName(countryName),
    )
      ? `${cleanAddress}, ${countryName}`
      : cleanAddress;

  const params =
    new URLSearchParams({
      format: "jsonv2",
      limit: "1",
      addressdetails: "1",
      q: query,
    });

  if (countryCode) {
    params.set(
      "countrycodes",
      countryCode.toLocaleLowerCase("en"),
    );
  }

  const url =
    `https://nominatim.openstreetmap.org/search?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "FloristSocial/1.0 nick@makalosablommor.se",
        "Accept-Language":
          "sv,en;q=0.8",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            "Kunde inte kontakta karttjänsten.",
        },
        { status: 502 },
      );
    }

    const data =
      (await response.json()) as Array<{
        lat?: string;
        lon?: string;
        display_name?: string;
        address?: {
          city?: string;
          town?: string;
          village?: string;
          municipality?: string;
          postcode?: string;
          country?: string;
          country_code?: string;
        };
      }>;

    if (
      !Array.isArray(data) ||
      data.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Kunde inte hitta platsen i det angivna landet.",
        },
        { status: 404 },
      );
    }

    const latitude =
      Number(data[0].lat);

    const longitude =
      Number(data[0].lon);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return NextResponse.json(
        {
          error:
            "Karttjänsten returnerade ogiltiga koordinater.",
        },
        { status: 502 },
      );
    }

    const resolvedCountryCode =
      data[0].address?.country_code
        ?.toUpperCase() ||
      countryCode ||
      null;

    return NextResponse.json({
      latitude,
      longitude,
      display_name:
        data[0].display_name ||
        cleanAddress,
      city:
        data[0].address?.city ||
        data[0].address?.town ||
        data[0].address?.village ||
        data[0].address?.municipality ||
        null,
      postcode:
        data[0].address?.postcode ||
        null,
      country:
        data[0].address?.country ||
        countryName ||
        null,
      country_code:
        resolvedCountryCode,
    });
  } catch (error) {
    console.error(
      "[api/geocode] Geocoding misslyckades:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Något gick fel vid platssökningen.",
      },
      { status: 500 },
    );
  }
}
