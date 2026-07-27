"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Globe2,
  Home,
  LocateFixed,
  MapPin,
  MessageCircle,
  Search,
  ShoppingCart,
  Star,
  Store,
  Truck,
  X,
} from "lucide-react";
import GuestAuthAction from "@/components/GuestAuthAction";
import type {
  FSMapViewport,
} from "@/components/FSMap";
import type {
  FloristMapItem as FSMapsSearchItem,
} from "@/lib/fs-maps/types";

const FSMap = dynamic(() => import("@/components/FSMap"), {
  ssr: false,
});

type Florist = {
  id: string;
  shop_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  city?: string | null;
  municipality?: string | null;
  county?: string | null;
  bio?: string | null;
  description?: string | null;
  logo_url?: string | null;
  profile_image_url?: string | null;
  created_at?: string | null;
};

type OpeningHour = {
  dayLabel?: string;
  isClosed?: boolean;
  openTime?: string;
  closeTime?: string;
};

type FloristMapItem = {
  florist_id: string;
  florist_name: string | null;
  shop_name: string | null;

  city: string | null;
  area: string | null;

  delivery_radius_km: number | null;

  latitude: number;
  longitude: number;
  distance_km: number;

  profile_image_url: string | null;
  logo_url: string | null;

  rating: number | null;
  review_count: number | null;

  opening_hours: OpeningHour[] | null;

  same_day_cutoff_time: string | null;
  standard_delivery_fee: number | null;

  express_delivery_available: boolean | null;
  express_delivery_fee: number | null;

  fs_map_status?: string | null;
  verification_level?:
    | "NONE"
    | "BASIC"
    | "BUSINESS"
    | "FULL"
    | string
    | null;

  google_place_id?: string | null;

  address?: string | null;
  formatted_address?: string | null;
  street_address?: string | null;
  address_line_1?: string | null;
  postal_code?: string | null;
};

type FSMapsSearchResponse = {
  results?: FSMapsSearchItem[];
  total?: number;
  cached?: boolean;
  searchedAt?: string;
  error?: string;
  message?: string;
};

const countries = [
  "Sverige",
  "Norge",
  "Danmark",
  "Finland",
  "Island",
  "Frankrike",
  "Tyskland",
  "Spanien",
  "Italien",
  "Portugal",
  "Nederländerna",
  "Belgien",
  "Schweiz",
  "Österrike",
  "Polen",
  "Storbritannien",
  "Irland",
  "USA",
  "Kanada",
  "Australien",
  "Nya Zeeland",
  "Japan",
  "Sydkorea",
  "Kina",
  "Indien",
  "Thailand",
  "Turkiet",
  "Förenade Arabemiraten",
  "Brasilien",
  "Mexiko",
  "Sydafrika",
];

const countryCodes: Record<string, string> = {
  Sverige: "SE",
  Norge: "NO",
  Danmark: "DK",
  Finland: "FI",
  Island: "IS",

  Frankrike: "FR",
  Tyskland: "DE",
  Spanien: "ES",
  Italien: "IT",
  Portugal: "PT",
  Nederländerna: "NL",
  Belgien: "BE",
  Schweiz: "CH",
  Österrike: "AT",
  Polen: "PL",
  Storbritannien: "GB",
  Irland: "IE",

  USA: "US",
  Kanada: "CA",
  Australien: "AU",
  "Nya Zeeland": "NZ",

  Japan: "JP",
  Sydkorea: "KR",
  Kina: "CN",
  Indien: "IN",
  Thailand: "TH",
  Turkiet: "TR",
  "Förenade Arabemiraten": "AE",

  Brasilien: "BR",
  Mexiko: "MX",
  Sydafrika: "ZA",
};

const countryLanguageCodes: Record<string, string> = {
  Sverige: "sv",
  Norge: "no",
  Danmark: "da",
  Finland: "fi",
  Island: "is",

  Frankrike: "fr",
  Tyskland: "de",
  Spanien: "es",
  Italien: "it",
  Portugal: "pt",
  Nederländerna: "nl",
  Belgien: "fr",
  Schweiz: "de",
  Österrike: "de",
  Polen: "pl",
  Storbritannien: "en",
  Irland: "en",

  USA: "en",
  Kanada: "en",
  Australien: "en",
  "Nya Zeeland": "en",

  Japan: "ja",
  Sydkorea: "ko",
  Kina: "zh",
  Indien: "en",
  Thailand: "th",
  Turkiet: "tr",
  "Förenade Arabemiraten": "en",

  Brasilien: "pt",
  Mexiko: "es",
  Sydafrika: "en",
};

const citiesByCountry: Record<string, string[]> = {
  Sverige: [
    "Stockholm",
    "Göteborg",
    "Malmö",
    "Uppsala",
    "Västerås",
    "Örebro",
    "Linköping",
    "Helsingborg",
    "Jönköping",
    "Norrköping",
    "Lund",
    "Umeå",
    "Gävle",
    "Borås",
    "Södertälje",
    "Eskilstuna",
    "Halmstad",
    "Växjö",
    "Karlstad",
    "Sundsvall",
  ],
  Norge: ["Oslo", "Bergen", "Trondheim", "Stavanger", "Drammen", "Tromsø"],
  Danmark: ["Köpenhamn", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers"],
  Finland: ["Helsingfors", "Esbo", "Tammerfors", "Vanda", "Åbo", "Uleåborg"],
  Frankrike: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes"],
  Tyskland: ["Berlin", "Hamburg", "München", "Köln", "Frankfurt", "Stuttgart"],
  Spanien: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Málaga", "Bilbao"],
  Storbritannien: ["London", "Manchester", "Birmingham", "Liverpool", "Edinburgh", "Glasgow"],
};


function normalizeCitySearchValue(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("sv");
}

function findCountryForCity(
  cityValue: string,
): string | null {
  const normalizedCity =
    normalizeCitySearchValue(cityValue);

  if (!normalizedCity) {
    return null;
  }

  for (
    const [candidateCountry, candidateCities]
    of Object.entries(citiesByCountry)
  ) {
    const matches = candidateCities.some(
      (candidateCity) =>
        normalizeCitySearchValue(candidateCity) ===
        normalizedCity,
    );

    if (matches) {
      return candidateCountry;
    }
  }

  return null;
}

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
  Oslo: [59.9139, 10.7522],
  Köpenhamn: [55.6761, 12.5683],
  Helsingfors: [60.1699, 24.9384],
  Paris: [48.8566, 2.3522],
  Berlin: [52.52, 13.405],
  Madrid: [40.4168, -3.7038],
  London: [51.5072, -0.1276],
};


function findCityCoordinates(
  cityValue: string,
): [number, number] | undefined {
  const normalizedCity =
    normalizeCitySearchValue(cityValue);

  if (!normalizedCity) {
    return undefined;
  }

  const match = Object.entries(
    cityCoordinates,
  ).find(
    ([candidateCity]) =>
      normalizeCitySearchValue(
        candidateCity,
      ) === normalizedCity,
  );

  return match?.[1];
}

const fallbackImages = [
  "/design-preview/buketter/bukett-romantisk-rosa-1000.jpg",
  "/design-preview/buketter/bukett-floristens-val-pastell-750.jpg",
  "/design-preview/event/staende-dekoration-6000.jpg",
  "/design-preview/buketter/bukett-modern-orange-rosa.jpg",
];

function floristName(florist: Florist) {
  return (
    florist.shop_name ||
    `${florist.first_name || ""} ${florist.last_name || ""}`.trim() ||
    florist.email ||
    "Florist"
  );
}

function floristCity(florist: Florist) {
  return florist.city || florist.municipality || florist.county || "Sverige";
}

function floristImage(florist: Florist, index: number) {
  return (
    florist.logo_url ||
    florist.profile_image_url ||
    fallbackImages[index % fallbackImages.length]
  );
}

function shuffleFlorists(items: Florist[]) {
  return [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}




function getMapItemIdentity(
  item: FloristMapItem,
): string {
  const placeId =
    item.google_place_id?.trim();

  if (placeId) {
    return `google:${placeId}`;
  }

  const floristId =
    item.florist_id?.trim();

  if (floristId) {
    return `florist:${floristId}`;
  }

  const name = (
    item.shop_name ||
    item.florist_name ||
    "florist"
  )
    .trim()
    .toLocaleLowerCase("sv");

  return [
    "position",
    name,
    Number(item.latitude).toFixed(5),
    Number(item.longitude).toFixed(5),
  ].join(":");
}

function mergeMapItems(
  currentItems: FloristMapItem[],
  incomingItems: FloristMapItem[],
): FloristMapItem[] {
  const merged =
    new Map<string, FloristMapItem>();

  /*
   * Behåll alla florister som redan har hittats
   * under den aktuella platssökningen.
   */
  for (const item of currentItems) {
    merged.set(
      getMapItemIdentity(item),
      item,
    );
  }

  /*
   * Lägg till nya träffar och uppdatera tidigare
   * träffar med färskare information.
   */
  for (const item of incomingItems) {
    const identity =
      getMapItemIdentity(item);

    const existing =
      merged.get(identity);

    merged.set(
      identity,
      existing
        ? {
            ...existing,
            ...item,

            /*
             * Behåll befintliga bilder och detaljer
             * när en senare Google-sida saknar dem.
             */
            logo_url:
              item.logo_url ||
              existing.logo_url,

            profile_image_url:
              item.profile_image_url ||
              existing.profile_image_url,

            opening_hours:
              item.opening_hours ||
              existing.opening_hours,
          }
        : item,
    );
  }

  /*
   * Skydd mot obegränsad minnesökning om någon
   * drar kartan genom väldigt många områden.
   */
  return Array.from(
    merged.values(),
  ).slice(-500);
}

function normalizeApiOpeningHours(
  descriptions: string[] | null,
): OpeningHour[] | null {
  if (!descriptions?.length) {
    return null;
  }

  const closedPattern =
    /stängt|closed|fermé|ferme|cerrado|geschlossen|chiuso/i;

  return descriptions.map((description) => {
    const separatorIndex = description.indexOf(":");

    const dayLabel =
      separatorIndex >= 0
        ? description.slice(0, separatorIndex).trim()
        : description.trim();

    const hours =
      separatorIndex >= 0
        ? description.slice(separatorIndex + 1).trim()
        : "";

    if (closedPattern.test(hours)) {
      return {
        dayLabel,
        isClosed: true,
      };
    }

    const timeMatch = hours.match(
      /(\d{1,2}[:.]\d{2})\s*[–—-]\s*(\d{1,2}[:.]\d{2})/,
    );

    return {
      dayLabel,
      isClosed: false,
      openTime:
        timeMatch?.[1]?.replace(".", ":"),
      closeTime:
        timeMatch?.[2]?.replace(".", ":"),
    };
  });
}

function toDynamicMapItem(
  item: FSMapsSearchItem,
): FloristMapItem | null {
  const latitude = Number(item.latitude);
  const longitude = Number(item.longitude);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  const address = item.address || null;

  return {
    florist_id: item.florist_id,
    florist_name:
      item.florist_name || item.shop_name,
    shop_name:
      item.shop_name || item.florist_name,

    city: item.city || null,
    area: address || item.city || null,

    delivery_radius_km:
      item.delivery_radius_km ?? null,

    latitude,
    longitude,
    distance_km: item.distance_km ?? 0,

    profile_image_url:
      item.profile_image_url || null,
    logo_url: item.logo_url || null,

    rating: item.rating ?? null,
    review_count: item.review_count ?? null,

    opening_hours:
      normalizeApiOpeningHours(
        item.opening_hours,
      ),

    same_day_cutoff_time: null,

    standard_delivery_fee:
      item.standard_delivery_fee ?? null,

    express_delivery_available:
      item.express_delivery_available ?? false,

    express_delivery_fee:
      item.express_delivery_fee ?? null,

    fs_map_status:
      item.fs_map_status || null,

    verification_level:
      item.verification_level || "NONE",

    google_place_id:
      item.google_place_id || null,

    address,
    formatted_address: address,
    street_address: address,
    address_line_1: address,
    postal_code: item.postcode || null,
  };
}

export default function FloristsMapView({
  initialFlorists,
}: {
  initialFlorists: Florist[];
}) {
  const [country, setCountry] = useState("Sverige");
  const [city, setCity] = useState("Stockholm");
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [requiredFieldErrors, setRequiredFieldErrors] = useState({
    country: false,
    city: false,
  });
  const [deliveryDate, setDeliveryDate] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [sortMode, setSortMode] = useState("random");
  const [purchaseMode, setPurchaseMode] = useState<"flowers" | "subscription">("flowers");
  const [hoveredFloristId, setHoveredFloristId] = useState<string | null>(null);
  const [shuffledFlorists, setShuffledFlorists] = useState<Florist[]>(initialFlorists);
  const [
    dynamicMapItems,
    setDynamicMapItems,
  ] = useState<FloristMapItem[]>([]);
  const [
    mapTarget,
    setMapTarget,
  ] = useState<[number, number] | null>(null);


  const [
    currentViewport,
    setCurrentViewport,
  ] = useState<FSMapViewport | null>(null);

  const [
    resolvedCountryCode,
    setResolvedCountryCode,
  ] = useState<string | null>(null);

  const [
    mapAction,
    setMapAction,
  ] = useState<
    "idle" |
    "searching" |
    "locating" |
    "success" |
    "error"
  >("idle");

  const [
    mapActionMessage,
    setMapActionMessage,
  ] = useState("");

  const lastViewportKeyRef = useRef("");
  const activeMapRequestRef =
    useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      activeMapRequestRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const savedCountry =
      localStorage.getItem("deliveryCountry") ||
      "Sverige";

    const savedCity =
      localStorage.getItem("deliveryCity") ||
      "Stockholm";

    const inferredCountry =
      findCountryForCity(savedCity);

    setCountry(
      inferredCountry || savedCountry,
    );

    setCity(savedCity);
    setStreetAddress(localStorage.getItem("deliveryStreetAddress") || "");
    setPostalCode(localStorage.getItem("deliveryPostalCode") || "");
    setDeliveryDate(localStorage.getItem("deliveryDate") || "");
    setPurchaseMode(
      localStorage.getItem("purchaseMode") === "subscription"
        ? "subscription"
        : "flowers"
    );
    setShuffledFlorists(shuffleFlorists(initialFlorists));
  }, [initialFlorists]);

  const filteredFlorists = useMemo(() => {
    const source = sortMode === "random" ? shuffledFlorists : [...initialFlorists];

    const cityNeedle = city.trim().toLowerCase();

    const filtered = cityNeedle
      ? source.filter((florist) =>
          floristCity(florist).toLowerCase().includes(cityNeedle)
        )
      : source;

    if (sortMode === "az") {
      return [...filtered].sort((a, b) => floristName(a).localeCompare(floristName(b), "sv"));
    }

    return filtered;
  }, [city, initialFlorists, shuffledFlorists, sortMode]);

  const mapItems = dynamicMapItems;

  const visibleMapItems = useMemo(() => {
    if (!currentViewport) {
      return mapItems;
    }

    return mapItems.filter((item) => {
      const latitude = Number(item.latitude);
      const longitude = Number(item.longitude);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        return false;
      }

      const latitudeVisible =
        latitude >= currentViewport.south &&
        latitude <= currentViewport.north;

      /*
       * Normalt är väst mindre än öst. Om kartan korsar
       * datumlinjen behöver longituden kontrolleras omvänt.
       */
      const longitudeVisible =
        currentViewport.west <= currentViewport.east
          ? longitude >= currentViewport.west &&
            longitude <= currentViewport.east
          : longitude >= currentViewport.west ||
            longitude <= currentViewport.east;

      return latitudeVisible && longitudeVisible;
    });
  }, [
    currentViewport,
    mapItems,
  ]);

  const connectedFloristCount = useMemo(
    () =>
      visibleMapItems.filter((item) => {
        const verificationLevel = String(
          item.verification_level || "",
        ).toUpperCase();

        return [
          "BASIC",
          "BUSINESS",
          "FULL",
        ].includes(verificationLevel);
      }).length,
    [visibleMapItems],
  );

  const totalVisibleMapCount =
    visibleMapItems.length;

  const visibleFlorists = filteredFlorists.slice(0, visibleCount);
  const citySuggestions = citiesByCountry[country] || [];

  const selectedCoords =
    mapTarget ??
    (
      city && cityCoordinates[city]
        ? cityCoordinates[city]
        : null
    );




  const focusMapAt = useCallback(
    (
      latitude: number,
      longitude: number,
    ) => {
      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        return;
      }

      activeMapRequestRef.current?.abort();
      activeMapRequestRef.current = null;

      lastViewportKeyRef.current = "";
      setDynamicMapItems([]);

      /*
       * Null följt av ett nytt värde gör att även samma
       * stad kan sökas igen efter att kartan har flyttats.
       */
      setMapTarget(null);

      window.requestAnimationFrame(() => {
        setMapTarget([
          latitude,
          longitude,
        ]);
      });
    },
    [],
  );

  const searchMapLocation = useCallback(
    async () => {
      const missingCity =
        city.trim().length === 0;

      setRequiredFieldErrors({
        country: false,
        city: missingCity,
      });

      if (missingCity) {
        setMapAction("error");

        setMapActionMessage(
          "Fyll i stad för att FloristSocial ska kunna hitta rätt plats.",
        );

        window.requestAnimationFrame(() => {
          document
            .getElementById("florist-city")
            ?.focus();
        });

        return;
      }

      saveSearch();

      setMapAction("searching");
      setMapActionMessage(
        "Söker efter staden…",
      );

      const normalizedStreet =
        streetAddress.trim();

      const normalizedPostalCode =
        postalCode.trim();

      const normalizedCity =
        city.trim();

      const fullAddress = [
        normalizedStreet,
        normalizedPostalCode,
        normalizedCity,
      ]
        .filter(Boolean)
        .join(", ");

      try {
        const params = new URLSearchParams({
          address: fullAddress,
          global: "1",
        });

        const response = await fetch(
          `/api/geocode?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const payload = await response
          .json()
          .catch(() => null);

        if (
          !response.ok ||
          !payload ||
          typeof payload !== "object"
        ) {
          throw new Error(
            "Platsen kunde inte hittas.",
          );
        }

        const record =
          payload as Record<string, unknown>;

        const latitude =
          Number(record.latitude);

        const longitude =
          Number(record.longitude);

        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude)
        ) {
          throw new Error(
            "Karttjänsten returnerade ogiltiga koordinater.",
          );
        }

        const resolvedCity =
          typeof record.city === "string"
            ? record.city
            : normalizedCity;

        const resolvedCountry =
          typeof record.country === "string"
            ? record.country
            : "";

        const nextCountryCode =
          typeof record.country_code === "string"
            ? record.country_code.toUpperCase()
            : null;

        const placeLabel =
          typeof record.display_name === "string"
            ? record.display_name
            : [resolvedCity, resolvedCountry]
                .filter(Boolean)
                .join(", ");

        const accepted = window.confirm(
          `Menar du ${placeLabel}?`,
        );

        if (!accepted) {
          setMapAction("idle");
          setMapActionMessage(
            "Skriv en mer exakt stad eller komplettera med gatuadress eller postnummer.",
          );

          return;
        }

        setCity(resolvedCity);

        if (resolvedCountry) {
          setCountry(resolvedCountry);
        }

        setResolvedCountryCode(
          nextCountryCode,
        );

        localStorage.setItem(
          "deliveryCity",
          resolvedCity,
        );

        localStorage.setItem(
          "recipientCity",
          resolvedCity,
        );

        if (resolvedCountry) {
          localStorage.setItem(
            "deliveryCountry",
            resolvedCountry,
          );

          localStorage.setItem(
            "recipientCountry",
            resolvedCountry,
          );
        }

        if (nextCountryCode) {
          localStorage.setItem(
            "recipientCountryCode",
            nextCountryCode,
          );
        }

        focusMapAt(
          latitude,
          longitude,
        );

        localStorage.setItem(
          "recipientLat",
          String(latitude),
        );

        localStorage.setItem(
          "recipientLng",
          String(longitude),
        );

        localStorage.setItem(
          "recipientSearchMode",
          "city-search",
        );

        setMapAction("success");

        setMapActionMessage(
          resolvedCountry
            ? `Visar florister nära ${resolvedCity}, ${resolvedCountry}.`
            : `Visar florister nära ${resolvedCity}.`,
        );
      } catch (error) {
        console.warn(
          "[FloristsMapView] Platssökningen misslyckades:",
          error,
        );

        setMapAction("error");

        setMapActionMessage(
          error instanceof Error
            ? error.message
            : "Platsen kunde inte hittas.",
        );
      }
    },
    [
      city,
      focusMapAt,
      postalCode,
      streetAddress,
    ],
  );

  const useCurrentLocation = useCallback(
    () => {
      // Florist nära mig använder position och kräver inte land eller stad.
      setRequiredFieldErrors({
        country: false,
        city: false,
      });

      if (!navigator.geolocation) {
        setMapAction("error");

        setMapActionMessage(
          "Din webbläsare stöder inte platsdelning.",
        );

        return;
      }

      setMapAction("locating");

      setMapActionMessage(
        "Hämtar din nuvarande position…",
      );

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          /*
           * Använd enhetens språk/region som
           * rimlig landsgissning för Nära mig.
           */
          const localeCountryCode = Array.from(
            new Set([
              ...navigator.languages,
              navigator.language,
            ]),
          )
            .map((locale) => {
              const match = locale.match(
                /[-_]([A-Za-z]{2})$/,
              );

              return match?.[1]?.toUpperCase();
            })
            .find(Boolean);

          const inferredCountry =
            Object.entries(countryCodes)
              .find(
                ([, countryCode]) =>
                  countryCode === localeCountryCode,
              )?.[0];

          if (inferredCountry) {
            setCountry(inferredCountry);

            localStorage.setItem(
              "deliveryCountry",
              inferredCountry,
            );

            localStorage.setItem(
              "recipientCountry",
              inferredCountry,
            );
          }

          setCity("");
          setStreetAddress("");
          setPostalCode("");

          localStorage.setItem(
            "deliveryCity",
            "",
          );

          localStorage.setItem(
            "recipientCity",
            "",
          );

          localStorage.setItem(
            "recipientLat",
            String(latitude),
          );

          localStorage.setItem(
            "recipientLng",
            String(longitude),
          );

          localStorage.setItem(
            "recipientSearchMode",
            "near-me",
          );

          localStorage.setItem(
            "recipientAddress",
            "Min nuvarande position",
          );

          focusMapAt(
            latitude,
            longitude,
          );

          setMapAction("success");

          setMapActionMessage(
            "Visar florister nära din position.",
          );
        },
        (error) => {
          console.error(
            "[FloristsMapView] Platsdelning misslyckades:",
            error,
          );

          const message =
            error.code ===
            error.PERMISSION_DENIED
              ? "Tillåt platsåtkomst i webbläsaren för att använda Florist nära mig."
              : error.code ===
                  error.POSITION_UNAVAILABLE
                ? "Din position kunde inte fastställas."
                : error.code ===
                    error.TIMEOUT
                  ? "Det tog för lång tid att hämta positionen."
                  : "Kunde inte hämta din position.";

          setMapAction("error");
          setMapActionMessage(message);
        },
        {
          enableHighAccuracy: true,
          timeout: 12_000,
          maximumAge: 60_000,
        },
      );
    },
    [focusMapAt],
  );

  const clearCountry = useCallback(() => {
    setCountry("");
    setResolvedCountryCode(null);

    setRequiredFieldErrors((current) => ({
      ...current,
      country: false,
    }));

    localStorage.removeItem("deliveryCountry");
    localStorage.removeItem("recipientCountry");
    localStorage.removeItem("recipientCountryCode");
    localStorage.removeItem("orderRecipientCountry");

    setMapAction("idle");
    setMapActionMessage("");
  }, []);

  const clearCityAndLocation = useCallback(() => {
    activeMapRequestRef.current?.abort();
    activeMapRequestRef.current = null;

    lastViewportKeyRef.current = "";

    setCity("");
    setCountry("");
    setResolvedCountryCode(null);

    setStreetAddress("");
    setPostalCode("");

    setMapTarget(null);
    setDynamicMapItems([]);
    setHoveredFloristId(null);

    setRequiredFieldErrors({
      country: false,
      city: false,
    });

    setMapAction("idle");
    setMapActionMessage("");

    [
      "deliveryCity",
      "deliveryCountry",
      "deliveryStreetAddress",
      "deliveryPostalCode",
      "recipientCity",
      "recipientCountry",
      "recipientCountryCode",
      "recipientStreetAddress",
      "recipientPostalCode",
      "recipientLat",
      "recipientLng",
      "recipientAddress",
      "recipientSearchMode",
      "orderRecipientCity",
      "orderRecipientCountry",
      "orderRecipientStreetAddress",
      "orderRecipientPostalCode",
      "orderRecipientAddress",
    ].forEach((key) => {
      localStorage.removeItem(key);
    });
  }, []);

  const handleCountryChange = useCallback(
    (nextCountry: string) => {
      setRequiredFieldErrors((current) => ({
        ...current,
        country: false,
      }));

      activeMapRequestRef.current?.abort();
      lastViewportKeyRef.current = "";
      setDynamicMapItems([]);
      setMapTarget(null);
      setMapAction("idle");
      setMapActionMessage("");

      setCountry(nextCountry);

      const currentCityCountry =
        findCountryForCity(city);

      if (
        city &&
        currentCityCountry !== nextCountry
      ) {
        setCity("");
      }
    },
    [city],
  );

  const handleCityChange = useCallback(
    (nextCity: string) => {
      setRequiredFieldErrors((current) => ({
        ...current,
        city: false,
      }));

      activeMapRequestRef.current?.abort();
      lastViewportKeyRef.current = "";
      setDynamicMapItems([]);
      setMapTarget(null);
      setMapAction("idle");
      setMapActionMessage("");

      setCity(nextCity);

      const inferredCountry =
        findCountryForCity(nextCity);

      if (
        inferredCountry &&
        inferredCountry !== country
      ) {
        setCountry(inferredCountry);
      }
    },
    [country],
  );

  const handleViewportIdle = useCallback(
    async (viewport: FSMapViewport) => {
      setCurrentViewport(viewport);

      const values = [
        viewport.north,
        viewport.south,
        viewport.east,
        viewport.west,
        viewport.zoom,
      ];

      if (
        !values.every(Number.isFinite) ||
        viewport.north <= viewport.south ||
        viewport.east <= viewport.west
      ) {
        return;
      }

      const longitudeSpan =
        viewport.east - viewport.west;

      const latitudeSpan =
        viewport.north - viewport.south;

      /*
       * Google Places locationRestriction accepterar
       * inte kartrektanglar bredare än 180 grader.
       *
       * Vid global vy väntar vi därför tills
       * besökaren zoomar in till Europa, ett land
       * eller en stad.
       */
      if (
        longitudeSpan >= 179.5 ||
        latitudeSpan >= 170 ||
        viewport.zoom < 3
      ) {
        activeMapRequestRef.current?.abort();
        lastViewportKeyRef.current = "";
        return;
      }

      const effectiveCountry =
        findCountryForCity(city) || country;

      const countryCode =
        resolvedCountryCode ||
        countryCodes[effectiveCountry] ||
        "";

      const languageCode =
        countryLanguageCodes[effectiveCountry] || "en";

      const viewportKey = [
        countryCode,
        viewport.north.toFixed(4),
        viewport.south.toFixed(4),
        viewport.east.toFixed(4),
        viewport.west.toFixed(4),
        viewport.zoom.toFixed(2),
      ].join("|");

      if (
        viewportKey ===
        lastViewportKeyRef.current
      ) {
        return;
      }

      lastViewportKeyRef.current =
        viewportKey;

      activeMapRequestRef.current?.abort();

      const controller = new AbortController();
      activeMapRequestRef.current = controller;

      const params = new URLSearchParams({
        north: String(viewport.north),
        south: String(viewport.south),
        east: String(viewport.east),
        west: String(viewport.west),
        language: languageCode,
        pageSize: "20",
      });

      if (countryCode) {
        params.set("country", countryCode);
      }

      try {
        const response = await fetch(
          `/api/fs-maps/search?${params.toString()}`,
          {
            method: "GET",
            signal: controller.signal,
            cache: "no-store",
          },
        );

        const data =
          (await response.json()) as FSMapsSearchResponse;

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.error ||
              "Kunde inte hämta florister.",
          );
        }

        const nextItems = (data.results ?? [])
          .map(toDynamicMapItem)
          .filter(
            (
              item,
            ): item is FloristMapItem =>
              item !== null,
          );

        setDynamicMapItems((currentItems) =>
          mergeMapItems(
            currentItems,
            nextItems,
          ),
        );
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        lastViewportKeyRef.current = "";

        console.error(
          "[FloristsMapView] Dynamisk kartsökning misslyckades:",
          error,
        );
      } finally {
        if (
          activeMapRequestRef.current ===
          controller
        ) {
          activeMapRequestRef.current = null;
        }
      }
    },
    [
      city,
      country,
      resolvedCountryCode,
    ],
  );

  function saveSearch() {
    const fullAddress = [streetAddress, postalCode, city, country]
      .filter(Boolean)
      .join(", ");

    localStorage.setItem("deliveryCountry", country);
    localStorage.setItem("deliveryCity", city);
    localStorage.setItem("deliveryStreetAddress", streetAddress);
    localStorage.setItem("deliveryPostalCode", postalCode);
    localStorage.setItem("deliveryDate", deliveryDate);

    localStorage.setItem("recipientCountry", country);
    localStorage.setItem("recipientCity", city);
    localStorage.setItem("recipientStreetAddress", streetAddress);
    localStorage.setItem("recipientPostalCode", postalCode);
    localStorage.setItem("recipientDeliveryDate", deliveryDate);
    localStorage.setItem("recipientAddress", fullAddress);

    localStorage.setItem("orderRecipientCountry", country);
    localStorage.setItem("orderRecipientCity", city);
    localStorage.setItem("orderRecipientStreetAddress", streetAddress);
    localStorage.setItem("orderRecipientPostalCode", postalCode);
    localStorage.setItem("orderRecipientDeliveryDate", deliveryDate);
    localStorage.setItem("orderRecipientAddress", fullAddress);
    localStorage.setItem("purchaseMode", purchaseMode);
    localStorage.setItem(
      "selectedOrderType",
      purchaseMode === "subscription" ? "Bukett Prenumeration" : "Skicka blommor"
    );
  }

  function autoMatchToOrder() {
    saveSearch();
    localStorage.setItem("floristSelectionMode", "auto-match");
    localStorage.setItem("recipientSearchMode", "floristsocial-matching");
    localStorage.setItem("selectedFloristId", "");
    localStorage.setItem("selectedFloristName", "FloristSocial Matching");
    window.location.href = "/order/private/guest-v4";
  }

  function orderFromFlorist(florist: Florist) {
    saveSearch();

    localStorage.setItem("selectedFloristId", florist.id);
    localStorage.setItem("selectedFloristName", floristName(florist));

    window.location.href = "/order/private/guest-v4";
  }

  function orderFromMapFlorist(florist: FloristMapItem) {
    saveSearch();

    localStorage.setItem("selectedFloristId", florist.florist_id);
    localStorage.setItem(
      "selectedFloristName",
      florist.florist_name || florist.shop_name || "Florist"
    );

    localStorage.setItem(
      "selectedFloristDeliveryFee",
      String(florist.standard_delivery_fee ?? 0)
    );

    localStorage.setItem(
      "selectedFloristExpressFee",
      String(florist.express_delivery_fee ?? 0)
    );

    localStorage.setItem(
      "selectedFloristSameDayCutoff",
      florist.same_day_cutoff_time || ""
    );

    window.location.href = "/order/private/guest-v4";
  }

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-6 text-stone-950 md:px-8 lg:px-10">
      <section className="mx-auto max-w-[1800px]">
        <div className="rounded-[34px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-pink-600">
                FloristSocial karta
              </p>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                Hitta Florist
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600 md:text-base">
                Skriv stad och välj rätt plats. Land hämtas automatiskt.
                Gatuadress, postnummer och datum är valfria.
              </p>
            </div>

            <div className="rounded-full bg-pink-50 px-4 py-2 text-sm font-black text-pink-700">
              Visar {Math.min(visibleCount, filteredFlorists.length)} av{" "}
              {filteredFlorists.length} florister
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[360px_1fr]">
            <aside className="rounded-[30px] bg-[#fbf7f2] p-4 ring-1 ring-stone-200 md:p-5">
              <div className="grid gap-3">
                <SearchField
                  label="Land (valfritt)"
                  value={country}
                  onChange={handleCountryChange}
                  listId="map-country-list"
                  icon={Globe2}
                  inputId="florist-country"
                  invalid={false}
                  onClear={clearCountry}
                />
                <SearchField
                  label="Stad"
                  value={city}
                  onChange={handleCityChange}
                  listId="map-city-list"
                  icon={MapPin}
                  inputId="florist-city"
                  invalid={requiredFieldErrors.city}
                  onClear={clearCityAndLocation}
                />
                <SearchField label="Gatuadress" value={streetAddress} onChange={setStreetAddress} icon={Home} />
                <SearchField label="Postnummer" value={postalCode} onChange={setPostalCode} icon={MapPin} />

                <label className="rounded-2xl bg-white px-4 py-3 ring-1 ring-stone-200">
                  <span className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-stone-400">
                    <CalendarDays size={14} className="text-pink-600" />
                    Datum
                  </span>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(event) => setDeliveryDate(event.target.value)}
                    className="w-full bg-transparent text-sm font-bold outline-none"
                  />
                </label>

                <button
                  type="button"
                  onClick={autoMatchToOrder}
                  className="mt-2 rounded-2xl bg-emerald-50 px-4 py-4 text-sm font-black text-emerald-800 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
                >
                  Låt FloristSocial matcha florist
                </button>

                <button
                  type="button"
                  onClick={() => {
                    void searchMapLocation();
                  }}
                  disabled={
                    mapAction === "searching" ||
                    mapAction === "locating"
                  }
                  className="rounded-full bg-pink-600 px-4 py-4 text-sm font-black !text-white transition disabled:cursor-wait disabled:opacity-60"
                >
                  <Search size={16} className="mr-1 inline" />
                  {mapAction === "searching"
                    ? "Söker…"
                    : "SÖK FLORIST"}
                </button>

                <button
                  type="button"
                  onClick={useCurrentLocation}
                  disabled={
                    mapAction === "searching" ||
                    mapAction === "locating"
                  }
                  className="rounded-full bg-stone-950 px-4 py-4 text-sm font-black !text-white transition disabled:cursor-wait disabled:opacity-60"
                >
                  <LocateFixed size={16} className="mr-1 inline" />
                  {mapAction === "locating"
                    ? "Hämtar position…"
                    : "FLORIST NÄRA MIG"}
                </button>

                {mapActionMessage ? (
                  <p
                    role="status"
                    aria-live="polite"
                    className={[
                      "rounded-2xl px-4 py-3 text-xs font-bold leading-5",
                      mapAction === "error"
                        ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                        : "bg-white text-stone-600 ring-1 ring-stone-200",
                    ].join(" ")}
                  >
                    {mapActionMessage}
                  </p>
                ) : null}
              </div>

              <p className="mt-5 rounded-2xl bg-white p-4 text-xs font-semibold leading-6 text-stone-500 ring-1 ring-stone-200">
                Stad krävs för SÖK FLORIST. Land hämtas automatiskt när du bekräftar rätt plats. Gatuadress, postnummer och datum är valfria. FLORIST NÄRA MIG använder din aktuella position.
              </p>

              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl bg-white p-4 ring-1 ring-pink-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                      <Store size={18} />
                    </div>

                    <span className="text-2xl font-black text-stone-950">
                      {connectedFloristCount}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-black leading-5 text-stone-900">
                    {connectedFloristCount === 1
                      ? "florist är ansluten till FloristSocial"
                      : "florister är anslutna till FloristSocial"}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 ring-1 ring-stone-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                      <MapPin size={18} />
                    </div>

                    <span className="text-2xl font-black text-stone-950">
                      {totalVisibleMapCount}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-black leading-5 text-stone-900">
                    Totalt{" "}
                    {totalVisibleMapCount === 1
                      ? "visas 1 florist på kartan"
                      : `visas ${totalVisibleMapCount} florister på kartan`}
                  </p>
                </div>
              </div>
            </aside>

            <div className="relative aspect-square min-h-[620px] overflow-hidden rounded-[32px] bg-white ring-1 ring-stone-200">
              <FSMap
                recipientLat={selectedCoords?.[0] || null}
                recipientLng={selectedCoords?.[1] || null}
                florists={mapItems}
                hoveredFloristId={hoveredFloristId}
                onHoverFlorist={setHoveredFloristId}
                onOrderFlorist={orderFromMapFlorist}
                onViewportIdle={handleViewportIdle}
                autoFit={false}
                includeSeedPlaces={false}
                clusterMarkers
                mode="full"
              />
            </div>
          </div>

          <datalist id="map-country-list">
            {countries.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>

          <datalist id="map-city-list">
            {citySuggestions.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </div>

        <section className="mt-8 rounded-[34px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-pink-600">
                Resultat
              </p>
              <h2 className="text-3xl font-black tracking-tight">
                Florister som kan matcha leveransen
              </h2>
            </div>

            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value)}
              className="rounded-full bg-stone-50 px-5 py-3 text-sm font-black text-stone-900 ring-1 ring-stone-200"
            >
              <option value="random">Smart slumpmässig visning</option>
              <option value="az">A–Ö</option>
            </select>
          </div>

          {visibleFlorists.length === 0 ? (
            <div className="rounded-[28px] bg-stone-50 p-8 text-center ring-1 ring-stone-200">
              <h3 className="text-2xl font-black">Inga florister hittades</h3>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Prova att ändra stad eller söka på ett större område.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleFlorists.map((florist, index) => (
                <FloristCard
                  key={florist.id}
                  florist={florist}
                  index={index}
                  onOrder={() => orderFromFlorist(florist)}
                  onHover={() => setHoveredFloristId(florist.id)}
                  onLeave={() => setHoveredFloristId(null)}
                />
              ))}
            </div>
          )}

          {visibleCount < filteredFlorists.length ? (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((current) => current + 12)}
                className="rounded-full bg-stone-950 px-6 py-3 text-sm font-black !text-white"
              >
                Visa 12 till
              </button>
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}

function SearchField({
  label,
  value,
  onChange,
  listId,
  icon: Icon,
  inputId,
  invalid = false,
  onClear,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  listId?: string;
  icon: typeof Search;
  inputId?: string;
  invalid?: boolean;
  onClear?: () => void;
}) {
  return (
    <label
      className={[
        "rounded-2xl px-4 py-3 ring-1 transition",
        invalid
          ? "bg-red-50 ring-2 ring-red-500"
          : "bg-white ring-stone-200",
      ].join(" ")}
    >
      <span
        className={[
          "mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em]",
          invalid
            ? "text-red-700"
            : "text-stone-400",
        ].join(" ")}
      >
        <Icon
          size={14}
          className={
            invalid
              ? "text-red-600"
              : "text-pink-600"
          }
        />

        {label}
      </span>

      <div className="flex items-center gap-2">
        <input
          id={inputId}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          list={listId}
          aria-invalid={invalid}
          className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none"
        />

        {onClear && value ? (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onClear();
            }}
            aria-label={`Rensa ${label.toLocaleLowerCase("sv")}`}
            title={`Rensa ${label.toLocaleLowerCase("sv")}`}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-pink-50 hover:text-pink-700"
          >
            <X size={15} strokeWidth={2.5} />
          </button>
        ) : null}
      </div>

      {invalid ? (
        <span className="mt-2 block text-xs font-bold text-red-700">
          Obligatoriskt för SÖK FLORIST
        </span>
      ) : null}
    </label>
  );
}

function FloristCard({
  florist,
  index,
  onOrder,
  onHover,
  onLeave,
}: {
  florist: Florist;
  index: number;
  onOrder: () => void;
  onHover: () => void;
  onLeave: () => void;
}) {
  const name = floristName(florist);
  const city = floristCity(florist);
  const image = floristImage(florist, index);

  return (
    <article
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-stone-200/70 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="h-56 bg-stone-100">
        <img src={image} alt={name} className="h-full w-full object-cover" />
      </div>

      <div className="p-5">
        <h3 className="text-xl font-black">{name}</h3>

        <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-stone-500">
          <MapPin size={15} className="text-pink-600" />
          {city}
        </p>

        <p className="mt-2 flex items-center gap-1 text-sm font-black text-amber-600">
          <Star size={15} fill="currentColor" />
          4.9
        </p>

        <div className="mt-4 grid gap-2 text-xs font-black text-stone-600">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-emerald-700">
            <Truck size={14} />
            Levererar idag
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-3 py-2 text-stone-700">
            <Store size={14} />
            Butik oftast 10:00–18:00
          </span>
        </div>

        <p className="mt-4 text-xs font-semibold leading-6 text-stone-500">
          Kunden kan önska leveranstid, men exakt tid kan inte garanteras.
        </p>

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <a
            href={`/public/florist/${florist.id}`}
            className="rounded-full bg-stone-950 px-4 py-2 text-center text-sm font-black !text-white"
          >
            Profil
          </a>

          <GuestAuthAction icon={<MessageCircle size={15} />}>
            Chatta
          </GuestAuthAction>

          <button
            type="button"
            onClick={onOrder}
            className="rounded-full bg-pink-600 px-4 py-2 text-center text-sm font-black !text-white"
          >
            <ShoppingCart size={15} className="mr-1 inline" />
            Beställ
          </button>
        </div>
      </div>
    </article>
  );
}
