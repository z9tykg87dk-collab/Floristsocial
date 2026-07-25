import { NextResponse } from "next/server";

const COUNTRY_NAME_BY_CODE: Record<string, string> = {
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
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
};

function normalizeCountryCode(
  value: string | null,
): string {
  const normalized = value
    ?.trim()
    .toUpperCase();

  if (normalized === "UK") {
    return "GB";
  }

  if (
    normalized &&
    /^[A-Z]{2}$/.test(normalized)
  ) {
    return normalized;
  }

  /*
   * Behåller bakåtkompatibilitet för äldre
   * adressflöden som bara används i Sverige.
   */
  return "SE";
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

  const countryCode =
    normalizeCountryCode(
      searchParams.get("countryCode") ||
      searchParams.get("country"),
    );

  const countryName =
    COUNTRY_NAME_BY_CODE[countryCode];

  const cleanAddress =
    address.trim();

  /*
   * Lägg bara till landets internationella namn
   * om adressen inte redan innehåller det.
   */
  const query =
    countryName &&
    !cleanAddress
      .toLocaleLowerCase("en")
      .includes(
        countryName.toLocaleLowerCase("en"),
      )
      ? `${cleanAddress}, ${countryName}`
      : cleanAddress;

  const params =
    new URLSearchParams({
      format: "jsonv2",
      limit: "1",
      addressdetails: "1",
      q: query,
      countrycodes:
        countryCode.toLocaleLowerCase("en"),
    });

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
            "Kunde inte hitta platsen.",
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
        data[0].address?.country_code
          ?.toUpperCase() ||
        countryCode,
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
