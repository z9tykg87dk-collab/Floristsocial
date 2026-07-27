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

const FSMap = dynamic(() => import("@/components/FSMap"), {
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
});

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

const STOCKHOLM = {
  lat: 59.3293,
  lng: 18.0686,
};

const cityCoordinates: Record<string, [number, number]> = {
  Stockholm: [59.3293, 18.0686],
  Göteborg: [57.7089, 11.9746],
  Malmö: [55.605, 13.0038],
  Uppsala: [59.8586, 17.6389],
  Västerås: [59.6099, 16.5448],
  Örebro: [59.2753, 15.2134],
  Linköping: [58.4108, 15.6214],
  Helsingborg: [56.0465, 12.6945],
  Jönköping: [57.7826, 14.1618],
  Norrköping: [58.5877, 16.1924],
  Lund: [55.7047, 13.191],
  Umeå: [63.8258, 20.263],
  Gävle: [60.6749, 17.1413],
  Borås: [57.721, 12.9401],
  Södertälje: [59.1955, 17.6253],
  Eskilstuna: [59.3712, 16.5098],
  Halmstad: [56.6745, 12.8578],
  Växjö: [56.879, 14.8059],
  Karlstad: [59.3793, 13.5036],
  Sundsvall: [62.3908, 17.3069],
};

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
  const [hoveredFloristId, setHoveredFloristId] = useState<string | null>(null);

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

      const matchesCity =
        !selectedCity || getFloristCity(florist) === selectedCity;

      return matchesSearch && matchesCity;
    });
  }, [initialFlorists, search, selectedCity]);

  const mapItems = useMemo(
    () => createWorkspaceMapItems(filteredFlorists),
    [filteredFlorists],
  );

  const selectedCoordinates =
    selectedCity && cityCoordinates[selectedCity]
      ? cityCoordinates[selectedCity]
      : null;

  const floristsWithLogo = initialFlorists.filter(
    (florist) => Boolean(florist.logo_url),
  ).length;

  const floristsWithoutLogo =
    initialFlorists.length - floristsWithLogo;

  function resetFilters() {
    setSearch("");
    setSelectedCity("");
    setHoveredFloristId(null);
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
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Namn, stad eller område"
                  className="w-full bg-transparent text-sm font-bold text-stone-950 outline-none placeholder:text-stone-400"
                />
              </label>

              <label className="rounded-2xl bg-white px-4 py-3 ring-1 ring-stone-200">
                <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-stone-400">
                  <MapPinned size={14} className="text-pink-600" />
                  Stad
                </span>

                <select
                  value={selectedCity}
                  onChange={(event) => setSelectedCity(event.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-stone-950 outline-none"
                >
                  <option value="">Alla städer</option>

                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={resetFilters}
                className="rounded-2xl bg-stone-950 px-4 py-3 text-sm font-black text-white transition hover:bg-stone-800"
              >
                Återställ kartan
              </button>
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
                    {mapItems.length}
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
          {mapItems.length > 0 ? (
            <FSMap
              recipientLat={selectedCoordinates?.[0] || null}
              recipientLng={selectedCoordinates?.[1] || null}
              florists={mapItems}
              hoveredFloristId={hoveredFloristId}
              onHoverFlorist={setHoveredFloristId}
              mode="full"
            />
          ) : (
            <div className="grid min-h-[620px] place-items-center p-8 text-center">
              <div>
                <MapPinned
                  size={44}
                  className="mx-auto text-stone-300"
                />

                <h3 className="mt-4 text-xl font-black">
                  Inga florister matchar filtret
                </h3>

                <p className="mt-2 text-sm text-stone-500">
                  Återställ kartan eller ändra sökningen.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-full bg-stone-950 px-5 py-3 text-sm font-black text-white"
                >
                  Visa alla florister
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
