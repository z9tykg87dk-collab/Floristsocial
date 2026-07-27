"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import FSMap, {
  type FSMapViewport,
} from "@/components/FSMap";

import type {
  FloristMapItem as FSMapsItem,
} from "@/lib/fs-maps/types";

type OpeningHour = {
  dayLabel?: string;
  isClosed?: boolean;
  openTime?: string;
  closeTime?: string;
};

export type WorkspaceGlobalMapItem = {
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

type SearchResponse = {
  results?: FSMapsItem[];
  error?: string;
  message?: string;
};

type WorkspaceGlobalMapProps = {
  initialItems: WorkspaceGlobalMapItem[];

  filterText?: string;
  selectedCity?: string;
  countryCode?: string;
  resetToken?: number;

  onVisibleCountChange?: (
    count: number,
  ) => void;

  recipientLat?: number | null;
  recipientLng?: number | null;

  hoveredFloristId?: string | null;

  onHoverFlorist?: (
    floristId: string | null,
  ) => void;

  onOrderFlorist?: (
    florist: WorkspaceGlobalMapItem,
  ) => void;
};

function normalizeOpeningHours(
  descriptions: string[] | null,
): OpeningHour[] | null {
  if (!descriptions?.length) {
    return null;
  }

  const closedPattern =
    /stängt|closed|fermé|ferme|cerrado|geschlossen|chiuso/i;

  return descriptions.map((description) => {
    const separatorIndex =
      description.indexOf(":");

    const dayLabel =
      separatorIndex >= 0
        ? description
            .slice(0, separatorIndex)
            .trim()
        : description.trim();

    const hours =
      separatorIndex >= 0
        ? description
            .slice(separatorIndex + 1)
            .trim()
        : "";

    if (closedPattern.test(hours)) {
      return {
        dayLabel,
        isClosed: true,
      };
    }

    const match = hours.match(
      /(\d{1,2}[:.]\d{2})\s*[–—-]\s*(\d{1,2}[:.]\d{2})/,
    );

    return {
      dayLabel,
      isClosed: false,
      openTime:
        match?.[1]?.replace(".", ":"),
      closeTime:
        match?.[2]?.replace(".", ":"),
    };
  });
}

function toWorkspaceMapItem(
  item: FSMapsItem,
): WorkspaceGlobalMapItem | null {
  const latitude = Number(item.latitude);
  const longitude = Number(item.longitude);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  const address =
    item.address || null;

  return {
    florist_id: item.florist_id,

    florist_name:
      item.florist_name ||
      item.shop_name ||
      null,

    shop_name:
      item.shop_name ||
      item.florist_name ||
      null,

    city: item.city || null,
    area: address || item.city || null,

    delivery_radius_km:
      item.delivery_radius_km ?? null,

    latitude,
    longitude,
    distance_km: item.distance_km ?? 0,

    profile_image_url:
      item.profile_image_url || null,

    logo_url:
      item.logo_url || null,

    rating:
      item.rating ?? null,

    review_count:
      item.review_count ?? null,

    opening_hours:
      normalizeOpeningHours(
        item.opening_hours,
      ),

    same_day_cutoff_time: null,

    standard_delivery_fee:
      item.standard_delivery_fee ?? null,

    express_delivery_available:
      item.express_delivery_available ??
      false,

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

    postal_code:
      item.postcode || null,
  };
}

function identity(
  item: WorkspaceGlobalMapItem,
): string {
  if (item.google_place_id?.trim()) {
    return `google:${item.google_place_id}`;
  }

  if (item.florist_id?.trim()) {
    return `florist:${item.florist_id}`;
  }

  return [
    item.shop_name ||
      item.florist_name ||
      "florist",

    Number(item.latitude).toFixed(5),
    Number(item.longitude).toFixed(5),
  ].join(":");
}

function mergeItems(
  currentItems: WorkspaceGlobalMapItem[],
  incomingItems: WorkspaceGlobalMapItem[],
): WorkspaceGlobalMapItem[] {
  const merged =
    new Map<string, WorkspaceGlobalMapItem>();

  for (const item of currentItems) {
    merged.set(identity(item), item);
  }

  for (const item of incomingItems) {
    const key = identity(item);
    const previous = merged.get(key);

    merged.set(
      key,
      previous
        ? {
            ...previous,
            ...item,

            logo_url:
              item.logo_url ||
              previous.logo_url,

            profile_image_url:
              item.profile_image_url ||
              previous.profile_image_url,

            opening_hours:
              item.opening_hours ||
              previous.opening_hours,
          }
        : item,
    );
  }

  return Array.from(
    merged.values(),
  ).slice(-500);
}

export default function WorkspaceGlobalMap({
  initialItems,
  filterText = "",
  selectedCity = "",
  countryCode = "SE",
  resetToken = 0,
  onVisibleCountChange,
  recipientLat,
  recipientLng,
  hoveredFloristId,
  onHoverFlorist,
  onOrderFlorist,
}: WorkspaceGlobalMapProps) {
  const [
    dynamicItems,
    setDynamicItems,
  ] = useState<WorkspaceGlobalMapItem[]>(
    initialItems,
  );

  const lastViewportKeyRef =
    useRef("");

  const requestRef =
    useRef<AbortController | null>(null);

  useEffect(() => {
    setDynamicItems((currentItems) =>
      mergeItems(
        currentItems,
        initialItems,
      ),
    );
  }, [initialItems]);

  useEffect(() => {
    requestRef.current?.abort();
    lastViewportKeyRef.current = "";
    setDynamicItems(initialItems);
  }, [countryCode, resetToken]);

  useEffect(() => {
    return () => {
      requestRef.current?.abort();
    };
  }, []);

  const handleViewportIdle = useCallback(
    async (viewport: FSMapViewport) => {
      const longitudeSpan =
        viewport.east - viewport.west;

      const latitudeSpan =
        viewport.north - viewport.south;

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
        viewport.east <= viewport.west ||
        longitudeSpan >= 179.5 ||
        latitudeSpan >= 170 ||
        viewport.zoom < 3
      ) {
        return;
      }

      const key = [
        viewport.north.toFixed(4),
        viewport.south.toFixed(4),
        viewport.east.toFixed(4),
        viewport.west.toFixed(4),
        viewport.zoom.toFixed(2),
      ].join("|");

      if (
        key === lastViewportKeyRef.current
      ) {
        return;
      }

      lastViewportKeyRef.current = key;

      requestRef.current?.abort();

      const controller =
        new AbortController();

      requestRef.current = controller;

      const params =
        new URLSearchParams({
          north: String(viewport.north),
          south: String(viewport.south),
          east: String(viewport.east),
          west: String(viewport.west),

          /*
           * GEO Control börjar med Sverige.
           * Landstyrning blir nästa separata
           * administratörsfunktion.
           */
          country: countryCode,
          language: "sv",
          pageSize: "20",
        });

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
          (await response.json()) as SearchResponse;

        if (!response.ok) {
          throw new Error(
            data.message ||
            data.error ||
            "GEO Control kunde inte hämta florister.",
          );
        }

        const incomingItems =
          (data.results ?? [])
            .map(toWorkspaceMapItem)
            .filter(
              (
                item,
              ): item is WorkspaceGlobalMapItem =>
                item !== null,
            );

        setDynamicItems((currentItems) =>
          mergeItems(
            currentItems,
            incomingItems,
          ),
        );
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        lastViewportKeyRef.current = "";

        console.error(
          "[WorkspaceGlobalMap] Sökningen misslyckades:",
          error,
        );
      } finally {
        if (
          requestRef.current === controller
        ) {
          requestRef.current = null;
        }
      }
    },
    [countryCode],
  );

  const items = useMemo(() => {
    const needle =
      filterText
        .trim()
        .toLocaleLowerCase("sv");

    const cityNeedle =
      selectedCity
        .trim()
        .toLocaleLowerCase("sv");

    return dynamicItems.filter((item) => {
      const city =
        item.city
          ?.toLocaleLowerCase("sv") ||
        "";

      const searchableText = [
        item.shop_name,
        item.florist_name,
        item.city,
        item.area,
        item.address,
        item.formatted_address,
        item.street_address,
        item.address_line_1,
        item.postal_code,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("sv");

      const matchesText =
        !needle ||
        searchableText.includes(needle);

      const matchesCity =
        !cityNeedle ||
        city === cityNeedle ||
        searchableText.includes(cityNeedle);

      return matchesText && matchesCity;
    });
  }, [
    dynamicItems,
    filterText,
    selectedCity,
  ]);

  useEffect(() => {
    onVisibleCountChange?.(
      items.length,
    );
  }, [
    items.length,
    onVisibleCountChange,
  ]);

  return (
    <FSMap
      recipientLat={recipientLat}
      recipientLng={recipientLng}
      florists={items}
      hoveredFloristId={hoveredFloristId}
      onHoverFlorist={onHoverFlorist}
      onOrderFlorist={onOrderFlorist}
      onViewportIdle={handleViewportIdle}
      autoFit={false}
      includeSeedPlaces={false}
      clusterMarkers
      mode="full"
    />
  );
}
