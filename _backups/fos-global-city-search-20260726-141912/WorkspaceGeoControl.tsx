"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  createWorkspaceMapItems,
} from "@/lib/workspace/createWorkspaceMapItems";
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

export default function WorkspaceGeoControl({
  initialFlorists,
}: WorkspaceGeoControlProps) {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [countryName, setCountryName] =
    useState("Sverige");
  const [
    activeCountryCode,
    setActiveCountryCode,
  ] = useState("SE");
  const [hoveredFloristId, setHoveredFloristId] = useState<string | null>(null);

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

  const filteredFlorists = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return initialFlorists.filter((florist) => {
      const floristName = getFloristName(florist).toLowerCase();
      const floristCity = getFloristCity(florist).toLowerCase();
      const area = `${florist.municipality || ""} ${
        florist.county || ""
      }`.toLowerCase();

      const matchesSearch =
        !needle ||
        floristName.includes(needle) ||
        floristCity.includes(needle) ||
        area.includes(needle);

      const selectedCityNeedle =
        selectedCity
          .trim()
          .toLocaleLowerCase("sv");

      const matchesCity =
        !selectedCityNeedle ||
        getFloristCity(florist)
          .trim()
          .toLocaleLowerCase("sv") ===
          selectedCityNeedle;

      return matchesSearch && matchesCity;
    });
  }, [initialFlorists, search, selectedCity]);

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

  function findRegisteredCoordinates(
    queryValue: string,
  ): [number, number] | null {
    const needle =
      queryValue
        .trim()
        .toLocaleLowerCase("sv");

    if (!needle) {
      return null;
    }

    const florist =
      initialFlorists.find((item) => {
        const searchableText = [
          getFloristName(item),
          getFloristCity(item),
          item.municipality,
          item.county,
          item.address_line_1,
          item.postal_code,
        ]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase("sv");

        return searchableText.includes(
          needle,
        );
      });

    const latitude =
      Number(florist?.latitude);

    const longitude =
      Number(florist?.longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return null;
    }

    return [
      latitude,
      longitude,
    ];
  }

  async function focusSearchOnMap(
    queryOverride?: string,
  ) {
    const searchValue =
      queryOverride?.trim() ||
      search.trim();

    const cityValue =
      selectedCity.trim();

    const queryParts = [
      searchValue,
      queryOverride
        ? ""
        : cityValue,
    ]
      .map((value) => value.trim())
      .filter(
        (
          value,
          index,
          values,
        ) =>
          Boolean(value) &&
          values.indexOf(value) === index,
      );

    const query =
      queryParts.join(", ");

    if (!query) {
      setMapSearchStatus(
        "Skriv ett floristnamn, en stad, ett område, en adress eller ett postnummer.",
      );

      return;
    }

    setMapSearchBusy(true);
    setMapSearchStatus(
      `Söker efter ${query}…`,
    );

    try {
      let coordinates =
        findRegisteredCoordinates(
          searchValue,
        ) ||
        findRegisteredCoordinates(
          cityValue,
        ) ||
        findRegisteredCoordinates(
          query,
        );

      let resolvedLabel =
        cityValue || searchValue || query;

      let resolvedCountryLabel =
        countryName.trim();

      if (!coordinates) {
        const params =
          new URLSearchParams({
            address: query,
          });

        const requestedCountryName =
          countryName.trim();

        const requestedCountryCode =
          findCountryCode(
            requestedCountryName,
          );

        if (requestedCountryName) {
          params.set(
            "countryName",
            requestedCountryName,
          );
        }

        if (requestedCountryCode) {
          params.set(
            "countryCode",
            requestedCountryCode,
          );
        }

        const response = await fetch(
          `/api/geocode?${params.toString()}`,
          {
            cache: "no-store",
          },
        );

        const data =
          (await response.json()) as {
            latitude?: number;
            longitude?: number;
            display_name?: string;
            city?: string | null;
            country?: string | null;
            country_code?: string | null;
            error?: string;
          };

        if (!response.ok) {
          throw new Error(
            data.error ||
            "Platsen kunde inte hittas.",
          );
        }

        const latitude =
          Number(data.latitude);

        const longitude =
          Number(data.longitude);

        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude)
        ) {
          throw new Error(
            "Karttjänsten returnerade ogiltiga koordinater.",
          );
        }

        coordinates = [
          latitude,
          longitude,
        ];

        resolvedLabel =
          data.city ||
          data.display_name ||
          query;

        resolvedCountryLabel =
          data.country ||
          requestedCountryName;

        if (data.city) {
          setSelectedCity(data.city);
        }

        const resolvedCountryCode =
          findCountryCode(
            data.country_code || "",
          );

        if (resolvedCountryCode) {
          setActiveCountryCode(
            resolvedCountryCode,
          );

          const countrySuggestion =
            FOS_COUNTRY_SUGGESTIONS.find(
              (country) =>
                country.code ===
                resolvedCountryCode,
            );

          if (countrySuggestion) {
            setCountryName(
              countrySuggestion.name,
            );
          } else if (data.country) {
            setCountryName(data.country);
          }
        } else if (data.country) {
          setCountryName(data.country);
        }
      } else {
        const requestedCountryCode =
          findCountryCode(countryName);

        if (requestedCountryCode) {
          setActiveCountryCode(
            requestedCountryCode,
          );
        }
      }

      if (!coordinates) {
        throw new Error(
          "Platsen kunde inte hittas.",
        );
      }

      const [
        latitude,
        longitude,
      ] = coordinates;

      /*
       * Nollställ först så att samma stad kan
       * sökas igen efter att kartan har flyttats.
       */
      setMapTarget(null);

      setMapResetToken(
        (current) => current + 1,
      );

      window.requestAnimationFrame(() => {
        setMapTarget([
          latitude,
          longitude,
        ]);
      });

      setHoveredFloristId(null);

      setMapSearchStatus(
        resolvedCountryLabel
          ? `Visar ${resolvedLabel}, ${resolvedCountryLabel}.`
          : `Visar ${resolvedLabel}.`,
      );
    } catch (error) {
      setMapSearchStatus(
        error instanceof Error
          ? error.message
          : "Sökningen misslyckades.",
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
        ? `Staden ${value} är vald. Tryck på Sök på kartan.`
        : "Visar alla städer i den aktuella kartvyn.",
    );
  }

  function resetFilters() {
    setSearch("");
    setSelectedCity("");
    setCountryName("Sverige");
    setActiveCountryCode("SE");
    setHoveredFloristId(null);

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
              <label className="rounded-2xl bg-white px-4 py-3 ring-1 ring-stone-200">
                <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-stone-400">
                  <Search size={14} className="text-pink-600" />
                  Sök florist eller område
                </span>

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();

                      void focusSearchOnMap();
                    }
                  }}
                  placeholder="Namn, stad eller område"
                  className="w-full bg-transparent text-sm font-bold text-stone-950 outline-none placeholder:text-stone-400"
                />
              </label>

              <label className="rounded-2xl bg-white px-4 py-3 ring-1 ring-stone-200">
                <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-stone-400">
                  <MapPinned size={14} className="text-pink-600" />
                  Land
                </span>

                <input
                  type="search"
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
                  placeholder="Ex. Sverige, Norge eller Frankrike"
                  autoComplete="country-name"
                  className="w-full bg-transparent text-sm font-bold text-stone-950 outline-none placeholder:text-stone-400"
                />

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

                <input
                  type="search"
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

                      void focusSearchOnMap(
                        event.currentTarget.value,
                      );
                    }
                  }}
                  placeholder="Skriv valfri stad"
                  autoComplete="address-level2"
                  className="w-full bg-transparent text-sm font-bold text-stone-950 outline-none placeholder:text-stone-400"
                />

                <datalist id="fos-city-options">
                  {cities.map((city) => (
                    <option
                      key={city}
                      value={city}
                    />
                  ))}
                </datalist>
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
                  : "Sök på kartan"}
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
            filterText={search}
            selectedCity={selectedCity}
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
