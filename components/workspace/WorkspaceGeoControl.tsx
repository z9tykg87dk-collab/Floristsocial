"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  createWorkspaceMapItems,
} from "@/lib/workspace/createWorkspaceMapItems";
import type {
  FloristMapItem as FSMapsItem,
} from "@/lib/fs-maps/types";
import {
  Activity,
  CheckCircle2,
  CircleOff,
  MapPinned,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";

const WorkspaceGlobalMap = dynamic(
  () =>
    import(
      "@/components/workspace/WorkspaceGlobalMap"
    ),
  {
  ssr: false,
  loading: () => (
    <div className="grid h-full min-h-[620px] place-items-center bg-stone-100">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-pink-600" />
        <p className="mt-4 text-sm font-bold text-stone-500">
          Laddar GEO Control…
        </p>
      </div>
    </div>
  ),
  },
);

export type WorkspaceFlorist = {
  id: string;
  shop_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;

  city?: string | null;
  municipality?: string | null;
  county?: string | null;

  address_line_1?: string | null;
  postal_code?: string | null;

  latitude?: number | null;
  longitude?: number | null;

  delivery_radius_km?: number | null;

  rating?: number | null;
  review_count?: number | null;
  verification_level?: string | null;

  opening_hours?: unknown;

  bio?: string | null;
  description?: string | null;

  logo_url?: string | null;
  profile_image_url?: string | null;

  is_active?: boolean | null;
  created_at?: string | null;
};


type WorkspaceGeoControlProps = {
  initialFlorists: WorkspaceFlorist[];
};

const FOS_COUNTRY_SUGGESTIONS = [
  {
    name: "Sverige",
    code: "SE",
    aliases: ["sweden"],
  },
  {
    name: "Norge",
    code: "NO",
    aliases: ["norway"],
  },
  {
    name: "Danmark",
    code: "DK",
    aliases: ["denmark"],
  },
  {
    name: "Finland",
    code: "FI",
    aliases: ["suomi"],
  },
  {
    name: "Island",
    code: "IS",
    aliases: ["iceland"],
  },
  {
    name: "Frankrike",
    code: "FR",
    aliases: ["france"],
  },
  {
    name: "Tyskland",
    code: "DE",
    aliases: ["germany"],
  },
  {
    name: "Spanien",
    code: "ES",
    aliases: ["spain"],
  },
  {
    name: "Storbritannien",
    code: "GB",
    aliases: [
      "united kingdom",
      "great britain",
      "england",
      "uk",
    ],
  },
  {
    name: "Italien",
    code: "IT",
    aliases: ["italy"],
  },
  {
    name: "Nederländerna",
    code: "NL",
    aliases: ["netherlands", "holland"],
  },
  {
    name: "Belgien",
    code: "BE",
    aliases: ["belgium"],
  },
  {
    name: "Österrike",
    code: "AT",
    aliases: ["austria"],
  },
  {
    name: "Schweiz",
    code: "CH",
    aliases: ["switzerland"],
  },
  {
    name: "Portugal",
    code: "PT",
    aliases: [],
  },
  {
    name: "Irland",
    code: "IE",
    aliases: ["ireland"],
  },
  {
    name: "Polen",
    code: "PL",
    aliases: ["poland"],
  },
  {
    name: "Tjeckien",
    code: "CZ",
    aliases: ["czechia", "czech republic"],
  },
  {
    name: "USA",
    code: "US",
    aliases: [
      "united states",
      "united states of america",
    ],
  },
  {
    name: "Kanada",
    code: "CA",
    aliases: ["canada"],
  },
  {
    name: "Australien",
    code: "AU",
    aliases: ["australia"],
  },
  {
    name: "Japan",
    code: "JP",
    aliases: [],
  },
  {
    name: "Indien",
    code: "IN",
    aliases: ["india"],
  },
  {
    name: "Brasilien",
    code: "BR",
    aliases: ["brazil"],
  },
  {
    name: "Argentina",
    code: "AR",
    aliases: [],
  },
] as const;

function normalizeCountryLookup(
  value: string,
) {
  return value
    .trim()
    .toLocaleLowerCase("sv")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function findCountryCode(
  value: string,
): string | null {
  const directCode =
    value.trim().toUpperCase();

  if (directCode === "UK") {
    return "GB";
  }

  if (/^[A-Z]{2}$/.test(directCode)) {
    return directCode;
  }

  const normalized =
    normalizeCountryLookup(value);

  if (!normalized) {
    return null;
  }

  const found =
    FOS_COUNTRY_SUGGESTIONS.find(
      (country) => {
        const names = [
          country.name,
          ...country.aliases,
        ].map(normalizeCountryLookup);

        return names.includes(normalized);
      },
    );

  return found?.code || null;
}




function getFloristName(florist: WorkspaceFlorist) {
  return (
    florist.shop_name ||
    `${florist.first_name || ""} ${florist.last_name || ""}`.trim() ||
    florist.email ||
    "Florist"
  );
}

function getFloristCity(florist: WorkspaceFlorist) {
  return florist.city || florist.municipality || florist.county || "Stockholm";
}

type FloristNameResult = {
  id: string;
  name: string;
  city: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  mapItem?: FSMapsItem;
};

function normalizeFloristName(
  value: string,
) {
  return value
    .trim()
    .toLocaleLowerCase("sv")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getFSMapsName(item: FSMapsItem) {
  return (
    item.shop_name?.trim() ||
    item.florist_name?.trim() ||
    "Florist"
  );
}

function rankNameResults<T>(
  items: T[],
  query: string,
  getName: (item: T) => string,
) {
  const needle = normalizeFloristName(query);
  const exact: T[] = [];
  const partial: T[] = [];

  for (const item of items) {
    const name = normalizeFloristName(
      getName(item),
    );

    if (name === needle) {
      exact.push(item);
    } else if (name.includes(needle)) {
      partial.push(item);
    }
  }

  return exact.length > 0 ? exact : partial;
}

function toRegisteredNameResult(
  florist: WorkspaceFlorist,
): FloristNameResult | null {
  const latitude = Number(florist.latitude);
  const longitude = Number(florist.longitude);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  const city = getFloristCity(florist);
  const address = [
    florist.address_line_1,
    [florist.postal_code, city]
      .filter(Boolean)
      .join(" "),
  ]
    .filter(Boolean)
    .join(", ") || null;

  return {
    id: florist.id,
    name: getFloristName(florist),
    city,
    address,
    latitude,
    longitude,
  };
}

function toMapNameResult(
  item: FSMapsItem,
): FloristNameResult {
  return {
    id: item.florist_id,
    name: getFSMapsName(item),
    city: item.city || null,
    address: item.address || null,
    latitude: Number(item.latitude),
    longitude: Number(item.longitude),
    mapItem: item,
  };
}

function deduplicateMapItems(
  items: FSMapsItem[],
) {
  const unique = new Map<string, FSMapsItem>();

  for (const item of items) {
    const key =
      item.google_place_id?.trim() ||
      item.florist_id?.trim() ||
      [
        normalizeFloristName(getFSMapsName(item)),
        normalizeFloristName(item.address || ""),
      ].join(":");

    if (!unique.has(key)) {
      unique.set(key, item);
    }
  }

  return Array.from(unique.values());
}

export default function WorkspaceGeoControl({
  initialFlorists,
}: WorkspaceGeoControlProps) {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [countryName, setCountryName] =
    useState("");
  const [
    activeCountryCode,
    setActiveCountryCode,
  ] = useState("SE");
  const [hoveredFloristId, setHoveredFloristId] = useState<string | null>(null);
  const [selectedFloristId, setSelectedFloristId] =
    useState<string | null>(null);
  const [nameSearchResults, setNameSearchResults] =
    useState<FloristNameResult[]>([]);
  const [nameSearchMapItems, setNameSearchMapItems] =
    useState<FSMapsItem[]>([]);

  const [
    mapTarget,
    setMapTarget,
  ] = useState<
    [number, number] | null
  >(null);

  const [
    mapSearchBusy,
    setMapSearchBusy,
  ] = useState(false);

  const [
    mapSearchStatus,
    setMapSearchStatus,
  ] = useState("");

  const [
    mapResetToken,
    setMapResetToken,
  ] = useState(0);

  const [
    visibleMapCount,
    setVisibleMapCount,
  ] = useState(0);

  const cities = useMemo(() => {
    return Array.from(
      new Set(
        initialFlorists
          .map((florist) => getFloristCity(florist))
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b, "sv"));
  }, [initialFlorists]);

  /*
   * Land, stad och sökfras används för att flytta
   * kartan. De ska inte filtrera bort florister som
   * ligger i den aktuella geografiska kartytan.
   */
  const filteredFlorists = initialFlorists;

  const mapItems = useMemo(
    () => createWorkspaceMapItems(filteredFlorists),
    [filteredFlorists],
  );

  const mapCenter = useMemo<[number, number] | null>(() => {
    if (mapItems.length === 0) {
      return null;
    }

    const totals = mapItems.reduce(
      (result, florist) => ({
        latitude: result.latitude + florist.latitude,
        longitude: result.longitude + florist.longitude,
      }),
      {
        latitude: 0,
        longitude: 0,
      },
    );

    return [
      totals.latitude / mapItems.length,
      totals.longitude / mapItems.length,
    ];
  }, [mapItems]);

  const floristsWithLogo = initialFlorists.filter(
    (florist) => Boolean(florist.logo_url),
  ).length;

  const floristsWithoutLogo =
    initialFlorists.length - floristsWithLogo;

  function focusFloristNameResult(
    result: FloristNameResult,
  ) {
    if (
      !Number.isFinite(result.latitude) ||
      !Number.isFinite(result.longitude)
    ) {
      setMapSearchStatus(
        "Butiken saknar giltig kartposition.",
      );
      return;
    }

    setNameSearchResults([]);
    setNameSearchMapItems(
      result.mapItem ? [result.mapItem] : [],
    );
    setSelectedFloristId(result.id);
    setHoveredFloristId(result.id);

    setMapTarget(null);
    setMapResetToken((current) => current + 1);

    window.requestAnimationFrame(() => {
      setMapTarget([
        result.latitude,
        result.longitude,
      ]);
    });

    setMapSearchStatus(
      result.city
        ? `Visar ${result.name} i ${result.city}.`
        : `Visar ${result.name}.`,
    );
  }

  function showMultipleNameResults(
    results: FloristNameResult[],
    mapItems: FSMapsItem[],
    message: string,
    center?: [number, number],
  ) {
    setNameSearchResults(results.slice(0, 12));
    setNameSearchMapItems(mapItems.slice(0, 12));
    setSelectedFloristId(null);
    setHoveredFloristId(null);
    setMapSearchStatus(message);
    setMapResetToken((current) => current + 1);

    if (center) {
      setMapTarget(null);
      window.requestAnimationFrame(() => {
        setMapTarget(center);
      });
    }
  }

  async function focusSearchOnMap() {
    const searchValue = search.trim();
    const cityValue = selectedCity.trim();
    const countryValue = countryName.trim();

    setNameSearchResults([]);
    setSelectedFloristId(null);

    if (!searchValue) {
      setMapSearchStatus(
        "Skriv floristens eller butikens namn.",
      );
      return;
    }

    const registeredResults = initialFlorists
      .map(toRegisteredNameResult)
      .filter(
        (item): item is FloristNameResult =>
          item !== null,
      );

    const registeredMatches = rankNameResults(
      registeredResults,
      searchValue,
      (item) => item.name,
    );

    const hasLocation = Boolean(
      countryValue && cityValue,
    );

    if (!hasLocation) {
      if (registeredMatches.length === 1) {
        focusFloristNameResult(
          registeredMatches[0],
        );
        return;
      }

      if (registeredMatches.length > 1) {
        showMultipleNameResults(
          registeredMatches,
          [],
          "Flera butiker har samma eller liknande namn. Ange land och stad för att avgränsa sökningen, eller välj rätt butik nedan.",
        );
        return;
      }

      setNameSearchMapItems([]);
      setMapSearchStatus(
        "Butiken kunde inte identifieras unikt. Ange land och stad och sök igen.",
      );
      setMapResetToken((current) => current + 1);
      return;
    }

    const countryCode = findCountryCode(
      countryValue,
    );

    if (!countryCode) {
      setMapSearchStatus(
        "Kontrollera landet. Skriv landets namn eller en tvåbokstavskod.",
      );
      return;
    }

    setMapSearchBusy(true);
    setMapSearchStatus(
      `Söker efter ${searchValue} i ${cityValue}, ${countryValue}…`,
    );

    try {
      const geoParams = new URLSearchParams({
        address: cityValue,
        countryName: countryValue,
        countryCode,
      });

      const geoResponse = await fetch(
        `/api/geocode?${geoParams.toString()}`,
        { cache: "no-store" },
      );

      const geoData =
        (await geoResponse.json()) as {
          latitude?: number;
          longitude?: number;
          error?: string;
        };

      if (!geoResponse.ok) {
        throw new Error(
          geoData.error ||
          "Staden kunde inte hittas i det angivna landet.",
        );
      }

      const latitude = Number(geoData.latitude);
      const longitude = Number(geoData.longitude);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        throw new Error(
          "Karttjänsten returnerade ogiltiga koordinater.",
        );
      }

      setActiveCountryCode(countryCode);

      const params = new URLSearchParams({
        north: String(latitude + 0.38),
        south: String(latitude - 0.38),
        east: String(longitude + 0.55),
        west: String(longitude - 0.55),
        country: countryCode,
        language: "sv",
        pageSize: "20",
        query: searchValue,
        bypassCache: "true",
      });

      const response = await fetch(
        `/api/fs-maps/search?${params.toString()}`,
        { cache: "no-store" },
      );

      const data =
        (await response.json()) as {
          results?: FSMapsItem[];
          error?: string;
          message?: string;
        };

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.error ||
          "Floristsökningen misslyckades.",
        );
      }

      const mapMatches = deduplicateMapItems(
        rankNameResults(
          data.results ?? [],
          searchValue,
          getFSMapsName,
        ),
      );

      const results = mapMatches.map(
        toMapNameResult,
      );

      if (results.length === 0) {
        setNameSearchMapItems([]);
        setMapTarget([latitude, longitude]);
        setMapResetToken(
          (current) => current + 1,
        );
        setMapSearchStatus(
          `Ingen florist eller butik med namnet ${searchValue} hittades i ${cityValue}, ${countryValue}.`,
        );
        return;
      }

      if (results.length === 1) {
        focusFloristNameResult(results[0]);
        return;
      }

      showMultipleNameResults(
        results,
        mapMatches,
        `Flera träffar hittades i ${cityValue}, ${countryValue}. Välj rätt butik nedan.`,
        [latitude, longitude],
      );
    } catch (error) {
      setNameSearchMapItems([]);
      setMapSearchStatus(
        error instanceof Error
          ? error.message
          : "Floristsökningen misslyckades.",
      );
    } finally {
      setMapSearchBusy(false);
    }
  }

  function handleCityChange(
    value: string,
  ) {
    setSelectedCity(value);
    setHoveredFloristId(null);

    setMapSearchStatus(
      value
        ? `Staden ${value} är vald. Tryck på Sök florist.`
        : "Visar alla städer i den aktuella kartvyn.",
    );
  }

  function resetFilters() {
    setSearch("");
    setSelectedCity("");
    setCountryName("");
    setActiveCountryCode("SE");
    setHoveredFloristId(null);
    setSelectedFloristId(null);
    setNameSearchResults([]);
    setNameSearchMapItems([]);

    setMapTarget([
      59.3293,
      18.0686,
    ]);

    setMapSearchStatus(
      "Kartan är återställd till Stockholm.",
    );

    setMapResetToken(
      (current) => current + 1,
    );
  }

  return (
    <section className="mt-9 overflow-hidden rounded-[34px] bg-white shadow-md shadow-stone-200/60 ring-1 ring-stone-200/80">
      <div className="border-b border-stone-200 px-6 py-6 md:px-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-pink-600">
              <MapPinned size={16} />
              FOS Geographic Operations
            </div>

            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              GEO Control
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600 md:text-base">
              Operativ kartvy för floristnätverket, geografisk täckning och
              kommande Match Engine.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
              <CheckCircle2 size={16} />
              Kartmotor online
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-700">
              <Sparkles size={16} />
              Match Engine förbereds
            </span>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="border-b border-stone-200 bg-[#fbf7f2] p-5 xl:border-b-0 xl:border-r md:p-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-400">
              Kartfilter
            </p>

            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-stone-200">
                <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-stone-400">
                  <Search size={14} className="text-pink-600" />
                  Florist / butik
                </span>

                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setNameSearchResults([]);
                      setSelectedFloristId(null);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void focusSearchOnMap();
                      }
                    }}
                    placeholder="Skriv floristens eller butikens namn"
                    autoComplete="off"
                    className="w-full bg-transparent pr-9 text-sm font-bold text-stone-950 outline-none placeholder:text-stone-400"
                  />

                  {search ? (
                    <button
                      type="button"
                      aria-label="Rensa florist- eller butiksnamn"
                      title="Rensa sökning"
                      onClick={() => {
                        setSearch("");
                        setHoveredFloristId(null);
                        setSelectedFloristId(null);
                        setNameSearchResults([]);
                        setNameSearchMapItems([]);
                        setMapResetToken(
                          (current) => current + 1,
                        );
                        setMapSearchStatus(
                          "Floristnamnet har rensats.",
                        );
                      }}
                      className="absolute right-0 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-lg font-bold text-stone-400 transition hover:bg-stone-100 hover:text-stone-950"
                    >
                      ×
                    </button>
                  ) : null}
                </div>

                <p className="mt-2 text-[11px] font-semibold leading-5 text-stone-400">
                  Sök bara på floristens eller butikens namn. Land och stad behövs när namnet inte ger en unik träff.
                </p>

                {nameSearchResults.length > 0 ? (
                  <div className="mt-3 space-y-2 border-t border-stone-100 pt-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.12em] text-stone-400">
                      Välj rätt butik
                    </p>

                    {nameSearchResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() =>
                          focusFloristNameResult(result)
                        }
                        className="block w-full rounded-xl bg-stone-50 px-3 py-3 text-left ring-1 ring-stone-200 transition hover:bg-pink-50 hover:ring-pink-200"
                      >
                        <span className="block text-sm font-black text-stone-950">
                          {result.name}
                        </span>
                        <span className="mt-1 block text-xs font-semibold leading-5 text-stone-500">
                          {[result.address, result.city]
                            .filter(Boolean)
                            .join(" · ") || "Adress saknas"}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <label className="rounded-2xl bg-white px-4 py-3 ring-1 ring-stone-200">
                <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-stone-400">
                  <MapPinned size={14} className="text-pink-600" />
                  Land
                </span>

                <div className="relative">
                  <input
                    type="text"
                    list="fos-country-options"
                    value={countryName}
                    onChange={(event) => {
                      const value =
                        event.target.value;

                      setCountryName(value);

                      const code =
                        findCountryCode(value);

                      if (code) {
                        setActiveCountryCode(code);
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void focusSearchOnMap();
                      }
                    }}
                    placeholder="Ex. Norge"
                    autoComplete="country-name"
                    className="w-full bg-transparent pr-9 text-sm font-bold text-stone-950 outline-none placeholder:text-stone-400"
                  />

                  {countryName ? (
                    <button
                      type="button"
                      aria-label="Rensa land"
                      title="Rensa land"
                      onClick={() => {
                        setCountryName("");
                        setActiveCountryCode("SE");
                        setMapSearchStatus(
                          "Land har rensats.",
                        );
                      }}
                      className="absolute right-0 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-lg font-bold text-stone-400 transition hover:bg-stone-100 hover:text-stone-950"
                    >
                      ×
                    </button>
                  ) : null}
                </div>

                <datalist id="fos-country-options">
                  {FOS_COUNTRY_SUGGESTIONS.map(
                    (country) => (
                      <option
                        key={country.code}
                        value={country.name}
                      >
                        {country.code}
                      </option>
                    ),
                  )}
                </datalist>

                <p className="mt-2 text-[11px] font-semibold leading-5 text-stone-400">
                  Du kan även skriva ett annat land eller en tvåbokstavskod.
                </p>
              </label>

              <label className="rounded-2xl bg-white px-4 py-3 ring-1 ring-stone-200">
                <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-stone-400">
                  <MapPinned size={14} className="text-pink-600" />
                  Stad
                </span>

                <div className="relative">
                  <input
                    type="text"
                    list="fos-city-options"
                    value={selectedCity}
                    onChange={(event) =>
                      handleCityChange(
                        event.target.value,
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();

                        void focusSearchOnMap();
                      }
                    }}
                    placeholder="Ex. Oslo"
                    autoComplete="address-level2"
                    className="w-full bg-transparent pr-9 text-sm font-bold text-stone-950 outline-none placeholder:text-stone-400"
                  />

                  {selectedCity ? (
                    <button
                      type="button"
                      aria-label="Rensa stad"
                      title="Rensa stad"
                      onClick={() => {
                        setSelectedCity("");
                        setHoveredFloristId(null);
                        setMapSearchStatus(
                          "Stad har rensats.",
                        );
                      }}
                      className="absolute right-0 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-lg font-bold text-stone-400 transition hover:bg-stone-100 hover:text-stone-950"
                    >
                      ×
                    </button>
                  ) : null}
                </div>

                <datalist id="fos-city-options">
                  {cities.map((city) => (
                    <option
                      key={city}
                      value={city}
                    />
                  ))}
                </datalist>

                <p className="mt-2 text-[11px] font-semibold leading-5 text-stone-400">
                  Land och stad är valfria vid en unik träff. Ange dem när flera florister har samma eller liknande namn.
                </p>
              </label>

              <button
                type="button"
                onClick={() =>
                  void focusSearchOnMap()
                }
                disabled={mapSearchBusy}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-pink-600 px-4 py-3 text-sm font-black text-white transition hover:bg-pink-700 disabled:cursor-wait disabled:opacity-60"
              >
                <Search size={16} />

                {mapSearchBusy
                  ? "Söker…"
                  : "Sök florist"}
              </button>

              <button
                type="button"
                onClick={resetFilters}
                className="rounded-2xl bg-stone-950 px-4 py-3 text-sm font-black text-white transition hover:bg-stone-800"
              >
                Återställ kartan
              </button>

              {mapSearchStatus ? (
                <p
                  aria-live="polite"
                  className="rounded-2xl bg-white px-4 py-3 text-xs font-bold leading-5 text-stone-600 ring-1 ring-stone-200"
                >
                  {mapSearchStatus}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-7">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-400">
              Nätverksstatus
            </p>

            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl bg-white p-4 ring-1 ring-stone-200">
                <div className="flex items-center justify-between gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-pink-50 text-pink-600">
                    <Store size={19} />
                  </div>

                  <span className="text-2xl font-black">
                    {initialFlorists.length}
                  </span>
                </div>

                <p className="mt-3 text-sm font-black">
                  Registrerade florister
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 ring-1 ring-stone-200">
                <div className="flex items-center justify-between gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <CheckCircle2 size={19} />
                  </div>

                  <span className="text-2xl font-black">
                    {floristsWithLogo}
                  </span>
                </div>

                <p className="mt-3 text-sm font-black">
                  Med logotypmarkör
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 ring-1 ring-stone-200">
                <div className="flex items-center justify-between gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-stone-100 text-stone-600">
                    <CircleOff size={19} />
                  </div>

                  <span className="text-2xl font-black">
                    {floristsWithoutLogo}
                  </span>
                </div>

                <p className="mt-3 text-sm font-black">
                  Utan logotyp
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 ring-1 ring-stone-200">
                <div className="flex items-center justify-between gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-50 text-sky-700">
                    <Activity size={19} />
                  </div>

                  <span className="text-2xl font-black">
                    {visibleMapCount}
                  </span>
                </div>

                <p className="mt-3 text-sm font-black">
                  Visas på kartan
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-white p-4 ring-1 ring-stone-200">
            <div className="flex items-center gap-2 text-sm font-black">
              <ShieldCheck size={17} className="text-pink-600" />
              Guardian
            </div>

            <p className="mt-2 text-xs leading-6 text-stone-500">
              Guardian kopplas till GEO Control efter att FloristSocials
              utvecklingssystem är färdigställt.
            </p>
          </div>
        </aside>

        <div className="min-h-[620px] bg-stone-100">
          <WorkspaceGlobalMap
            recipientLat={
              mapTarget?.[0] ??
              mapCenter?.[0] ??
              null
            }
            recipientLng={
              mapTarget?.[1] ??
              mapCenter?.[1] ??
              null
            }
            initialItems={mapItems}
            searchResults={nameSearchMapItems}
            selectedFloristId={selectedFloristId}
            onSelectedFloristChange={
              setSelectedFloristId
            }
            filterText=""
            selectedCity=""
            countryCode={activeCountryCode}
            resetToken={mapResetToken}
            hoveredFloristId={hoveredFloristId}
            onHoverFlorist={setHoveredFloristId}
            onVisibleCountChange={
              setVisibleMapCount
            }
          />
        </div>
      </div>
    </section>
  );
}
