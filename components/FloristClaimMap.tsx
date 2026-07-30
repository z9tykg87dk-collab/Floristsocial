"use client";

import { useEffect, useMemo, useState } from "react";
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";

export type FloristClaimPlace = {
  external_place_id: string;
  google_place_id: string | null;
  shop_name: string;
  formatted_address: string | null;
  street_address: string;
  postal_code: string;
  city: string;
  phone: string;
  website: string;
  latitude: number;
  longitude: number;
  claim_status:
    | "GOOGLE_DISCOVERED"
    | "REJECTED"
    | "SUSPENDED"
    | string;
};

type FloristClaimMapProps = {
  selectedExternalPlaceId?: string | null;
  onClaimPlace: (place: FloristClaimPlace) => void;

  /*
   * Används av sökfältet i sektionen
   * "Import & verifiering".
   */
  externalSearchQuery?: string;
  externalSearchRequestId?: number;
};

const STOCKHOLM = {
  lat: 59.3293,
  lng: 18.0686,
};

type ClaimPlacesResponse = {
  success?: boolean;
  count?: number;
  results?: FloristClaimPlace[];
  error?: string;
};

async function fetchClaimPlaces(
  query = "",
): Promise<FloristClaimPlace[]> {
  const params = new URLSearchParams();

  if (query.trim()) {
    params.set(
      "q",
      query.trim(),
    );
  }

  const url = params.size
    ? `/api/fs-maps/claim-places?${params.toString()}`
    : "/api/fs-maps/claim-places";

  const response = await fetch(
    url,
    {
      cache: "no-store",
    },
  );

  const data =
    (await response.json()) as ClaimPlacesResponse;

  if (!response.ok || !data.success) {
    throw new Error(
      data.error ||
        "Kunde inte hämta butiker till claim-kartan.",
    );
  }

  return Array.isArray(data.results)
    ? data.results
    : [];
}

function ClaimMapController({
  target,
}: {
  target: {
    lat: number;
    lng: number;
  } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !target) {
      return;
    }

    map.panTo(target);
    map.setZoom(15);
  }, [
    map,
    target,
  ]);

  return null;
}

export default function FloristClaimMap({
  selectedExternalPlaceId,
  onClaimPlace,
  externalSearchQuery = "",
  externalSearchRequestId = 0,
}: FloristClaimMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [places, setPlaces] = useState<FloristClaimPlace[]>([]);
  const [selected, setSelected] =
    useState<FloristClaimPlace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [
    shopQuery,
    setShopQuery,
  ] = useState("");

  const [
    searching,
    setSearching,
  ] = useState(false);

  const [
    searchMessage,
    setSearchMessage,
  ] = useState("");

  const [
    mapTarget,
    setMapTarget,
  ] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPlaces() {
      setLoading(true);
      setError("");

      try {
        const results =
          await fetchClaimPlaces();

        if (active) {
          setPlaces(results);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Kunde inte läsa kartdata.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPlaces();

    return () => {
      active = false;
    };
  }, []);

  async function searchShopByName(
    queryOverride?: string,
  ) {
    const query = (
      queryOverride ?? shopQuery
    ).trim();

    if (queryOverride !== undefined) {
      setShopQuery(query);
    }

    if (!query) {
      setSearchMessage(
        "Skriv floristens eller butikens namn.",
      );

      return;
    }

    setSearching(true);
    setSearchMessage("");
    setError("");

    try {
      const results =
        await fetchClaimPlaces(query);

      if (results.length === 0) {
        setSearchMessage(
          `Ingen florist eller butik hittades för "${query}".`,
        );

        return;
      }

      const firstResult = results[0];

      setPlaces(results);
      setSelected(firstResult);

      setMapTarget({
        lat: Number(
          firstResult.latitude,
        ),
        lng: Number(
          firstResult.longitude,
        ),
      });

      setSearchMessage(
        results.length === 1
          ? `1 butik hittades för "${query}".`
          : `${results.length} butiker hittades för "${query}".`,
      );
    } catch (searchError) {
      setSearchMessage(
        searchError instanceof Error
          ? searchError.message
          : "Butikssökningen misslyckades.",
      );
    } finally {
      setSearching(false);
    }
  }

  useEffect(() => {
    if (
      externalSearchRequestId <= 0 ||
      !externalSearchQuery.trim()
    ) {
      return;
    }

    void searchShopByName(
      externalSearchQuery,
    );
    // En ny request-id representerar ett nytt
    // uttryckligt knapptryck från registreringssidan.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalSearchRequestId]);

  async function showAllClaimPlaces() {
    setSearching(true);
    setSearchMessage("");
    setError("");

    try {
      const results =
        await fetchClaimPlaces();

      setPlaces(results);
      setShopQuery("");
      setSelected(null);
      setMapTarget(STOCKHOLM);

      setSearchMessage(
        "Visar alla tillgängliga butiker.",
      );
    } catch (loadError) {
      setSearchMessage(
        loadError instanceof Error
          ? loadError.message
          : "Kunde inte återställa butikerna.",
      );
    } finally {
      setSearching(false);
    }
  }

  const center = useMemo(() => {
    const selectedPlace = places.find(
      (place) =>
        place.external_place_id === selectedExternalPlaceId,
    );

    if (selectedPlace) {
      return {
        lat: Number(selectedPlace.latitude),
        lng: Number(selectedPlace.longitude),
      };
    }

    if (places[0]) {
      return {
        lat: Number(places[0].latitude),
        lng: Number(places[0].longitude),
      };
    }

    return STOCKHOLM;
  }, [places, selectedExternalPlaceId]);

  if (!apiKey) {
    return (
      <div className="grid min-h-[440px] place-items-center rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-semibold text-red-700">
          Google Maps API-nyckel saknas.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
      <div className="border-b border-stone-200 bg-stone-50 px-5 py-4">
        <h3 className="text-lg font-semibold text-stone-950">
          Hitta din butik på kartan
        </h3>

        <p className="mt-1 text-sm leading-6 text-stone-600">
          Klicka på butikens grå markör och välj sedan
          <strong> Jag äger denna butik</strong>.
        </p>

        <form
          className="mt-4 rounded-2xl border border-stone-200 bg-white p-4"
          onSubmit={(event) => {
            event.preventDefault();
            void searchShopByName();
          }}
        >
          <label
            htmlFor="claim-shop-search"
            className="block text-xs font-black uppercase tracking-[0.14em] text-stone-500"
          >
            Florist / Butik
          </label>

          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="claim-shop-search"
              type="search"
              value={shopQuery}
              onChange={(event) =>
                setShopQuery(
                  event.target.value,
                )
              }
              placeholder="Skriv floristens eller butikens namn"
              autoComplete="off"
              className="min-h-12 flex-1 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
            />

            <button
              type="submit"
              disabled={searching}
              className="min-h-12 rounded-xl bg-pink-600 px-5 text-sm font-black text-white transition hover:bg-pink-700 disabled:cursor-wait disabled:opacity-60"
            >
              {searching
                ? "Söker…"
                : "Hitta florist/butik"}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() =>
                void showAllClaimPlaces()
              }
              disabled={searching}
              className="text-sm font-black text-stone-600 underline decoration-stone-300 underline-offset-4 hover:text-stone-950 disabled:opacity-50"
            >
              Visa alla butiker
            </button>

            {searchMessage ? (
              <p
                aria-live="polite"
                className="text-sm font-bold text-stone-600"
              >
                {searchMessage}
              </p>
            ) : null}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="grid min-h-[440px] place-items-center">
          <p className="font-medium text-stone-500">
            Hämtar blomsterbutiker…
          </p>
        </div>
      ) : error ? (
        <div className="grid min-h-[440px] place-items-center p-6 text-center">
          <p className="font-semibold text-red-700">{error}</p>
        </div>
      ) : (
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={center}
            defaultZoom={11}
            mapId="FS_CLAIM_MAP"
            gestureHandling="greedy"
            style={{
              width: "100%",
              height: "500px",
            }}
          >
            <ClaimMapController
              target={mapTarget}
            />

            {places.map((place) => {
              const isSelected =
                selectedExternalPlaceId ===
                place.external_place_id;

              return (
                <AdvancedMarker
                  key={place.external_place_id}
                  position={{
                    lat: Number(place.latitude),
                    lng: Number(place.longitude),
                  }}
                  title={place.shop_name}
                  onClick={() => {
                    setSelected(place);

                    setMapTarget({
                      lat: Number(
                        place.latitude,
                      ),
                      lng: Number(
                        place.longitude,
                      ),
                    });
                  }}
                >
                  <Pin
                    background={
                      isSelected ? "#db2777" : "#78716c"
                    }
                    borderColor={
                      isSelected ? "#831843" : "#44403c"
                    }
                    glyphColor="#ffffff"
                    glyph={isSelected ? "✓" : "•"}
                    scale={isSelected ? 1.2 : 0.95}
                  />
                </AdvancedMarker>
              );
            })}

            {selected ? (
              <InfoWindow
                position={{
                  lat: Number(selected.latitude),
                  lng: Number(selected.longitude),
                }}
                onCloseClick={() => setSelected(null)}
              >
                <div className="max-h-[390px] w-[300px] overflow-y-auto p-2 pr-3">
                  <h3 className="text-base font-black text-stone-950">
                    {selected.shop_name}
                  </h3>

                  <p className="mt-1 text-sm font-semibold leading-5 text-stone-600">
                    {selected.formatted_address ||
                      [
                        selected.street_address,
                        selected.postal_code,
                        selected.city,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                  </p>

                  <div className="sticky top-0 z-10 -mx-2 mt-3 border-y border-pink-100 bg-white px-2 py-3">
                    <p className="text-sm font-bold text-stone-900">
                      Är du innehavare av denna butik?
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        onClaimPlace(selected);
                        setSelected(null);
                      }}
                      className="mt-2 w-full rounded-full bg-pink-600 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-pink-700"
                    >
                      Jag äger denna butik
                    </button>
                  </div>

                  {(selected.phone || selected.website) ? (
                    <div className="mt-3 space-y-1 rounded-2xl bg-stone-50 px-3 py-3 text-sm text-stone-700">
                      {selected.phone ? (
                        <p>
                          <span className="font-black">Telefon:</span>{" "}
                          {selected.phone}
                        </p>
                      ) : null}

                      {selected.website ? (
                        <p className="break-all">
                          <span className="font-black">Webbplats:</span>{" "}
                          {selected.website}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  <p className="mt-3 rounded-2xl bg-stone-50 px-3 py-3 text-sm font-semibold text-stone-600">
                    Inte ansluten till FloristSocial ännu.
                  </p>

                </div>
              </InfoWindow>
            ) : null}
          </Map>
        </APIProvider>
      )}

      {selectedExternalPlaceId ? (
        <div className="border-t border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-800">
          ✓ Butiken är vald. Kontrollera butikskortet och
          klicka på Importera företagsuppgifter när du är redo.
        </div>
      ) : null}
    </div>
  );
}
