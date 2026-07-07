"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Globe2,
  Home,
  LocateFixed,
  MapPin,
  Search,
} from "lucide-react";

const FloristSearchMap = dynamic(() => import("@/components/FloristSearchMap"), {
  ssr: false,
});

type HomeFlorist = {
  name: string;
  city: string;
  image: string;
};

const cityCoordinates: Record<string, [number, number]> = {
  Stockholm: [59.3293, 18.0686],
  Göteborg: [57.7089, 11.9746],
  Malmö: [55.605, 13.0038],
  Uppsala: [59.8586, 17.6389],
};


const countries = [
  "Sverige",
  "Norge",
  "Danmark",
  "Finland",
  "Island",
  "Tyskland",
  "Frankrike",
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
  Norge: [
    "Oslo",
    "Bergen",
    "Trondheim",
    "Stavanger",
    "Drammen",
    "Fredrikstad",
    "Kristiansand",
    "Sandnes",
    "Tromsø",
    "Sarpsborg",
    "Skien",
    "Ålesund",
  ],
  Danmark: [
    "Köpenhamn",
    "Aarhus",
    "Odense",
    "Aalborg",
    "Esbjerg",
    "Randers",
    "Kolding",
    "Horsens",
    "Vejle",
    "Roskilde",
    "Herning",
    "Helsingør",
  ],
  Finland: [
    "Helsingfors",
    "Esbo",
    "Tammerfors",
    "Vanda",
    "Åbo",
    "Uleåborg",
    "Lahtis",
    "Kuopio",
    "Jyväskylä",
    "Björneborg",
    "Vasa",
    "Joensuu",
  ],
  Frankrike: [
    "Paris",
    "Marseille",
    "Lyon",
    "Toulouse",
    "Nice",
    "Nantes",
    "Montpellier",
    "Strasbourg",
    "Bordeaux",
    "Lille",
    "Rennes",
    "Reims",
  ],
  Tyskland: [
    "Berlin",
    "Hamburg",
    "München",
    "Köln",
    "Frankfurt",
    "Stuttgart",
    "Düsseldorf",
    "Dortmund",
    "Essen",
    "Leipzig",
    "Bremen",
    "Dresden",
  ],
  Spanien: [
    "Madrid",
    "Barcelona",
    "Valencia",
    "Sevilla",
    "Zaragoza",
    "Málaga",
    "Murcia",
    "Palma",
    "Bilbao",
    "Alicante",
    "Córdoba",
    "Valladolid",
  ],
  Italien: [
    "Rom",
    "Milano",
    "Neapel",
    "Turin",
    "Palermo",
    "Genua",
    "Bologna",
    "Florens",
    "Bari",
    "Catania",
    "Venedig",
    "Verona",
  ],
};

const cityPostalCodes: Record<string, string> = {
  Stockholm: "111 51",
  Göteborg: "411 03",
  Malmö: "211 22",
  Uppsala: "753 20",
  Västerås: "722 12",
  Örebro: "702 10",
  Linköping: "582 19",
  Helsingborg: "252 20",
  Jönköping: "553 16",
  Norrköping: "602 24",
};

const addressPostalCodes: Record<string, string> = {
  "Drottninggatan 10": "111 51",
};

export default function HomeFloristMap({
  homeFlorists = [],
}: {
  homeFlorists?: HomeFlorist[];
}) {
  const [country, setCountry] = useState("Sverige");
  const [city, setCity] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [purchaseMode, setPurchaseMode] = useState<"flowers" | "subscription">("flowers");

  const citySuggestions = useMemo(() => {
    return citiesByCountry[country] || [];
  }, [country]);

  function updateCity(value: string) {
    setCity(value);

    if (!postalCode && cityPostalCodes[value]) {
      setPostalCode(cityPostalCodes[value]);
    }
  }

  function updateStreetAddress(value: string) {
    setStreetAddress(value);

    if (addressPostalCodes[value]) {
      setPostalCode(addressPostalCodes[value]);
    }
  }

  const mapItems = homeFlorists.map((florist, index) => {
    const base = cityCoordinates[florist.city] || cityCoordinates.Stockholm;
    const offset = index * 0.018;

    return {
      florist_id: florist.name,
      florist_name: florist.name,
      shop_name: florist.name,
      city: florist.city,
      area: null,
      delivery_radius_km: 15,
      latitude: base[0] + offset,
      longitude: base[1] + offset,
      distance_km: Number((1.1 + index * 0.6).toFixed(1)),
      profile_image_url: florist.image,
      logo_url: florist.image,
      rating: 4.9,
      review_count: 0,
      opening_hours: null,
      same_day_cutoff_time: "13:00",
      standard_delivery_fee: 149,
      express_delivery_available: true,
      express_delivery_fee: 249,
    };
  });

  function saveSearch(nextPath: string, mode?: "near-me" | "matching") {
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

    localStorage.setItem(
      "recipientSearchMode",
      mode === "near-me"
        ? "near-me"
        : mode === "matching"
          ? "floristsocial-matching"
          : "manual"
    );

    localStorage.setItem(
      "floristSelectionMode",
      mode === "matching" ? "auto-match" : "customer-choice"
    );

    localStorage.setItem("purchaseMode", purchaseMode);
    localStorage.setItem(
      "selectedOrderType",
      purchaseMode === "subscription" ? "Bukett Prenumeration" : "Skicka blommor"
    );

    window.location.href = nextPath;
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
      <div className="min-h-[660px] overflow-hidden rounded-[30px] bg-white shadow-sm ring-1 ring-stone-200">
        <FloristSearchMap
          recipientLat={null}
          recipientLng={null}
          florists={mapItems}
          mode="preview"
        />
      </div>

      <aside className="rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-stone-200 md:p-6">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-pink-600">
          Sök leveransadress
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPurchaseMode("flowers")}
            className={`rounded-2xl px-4 py-3 text-sm font-black ring-1 transition ${
              purchaseMode === "flowers"
                ? "bg-pink-600 !text-white ring-pink-600"
                : "bg-white text-stone-900 ring-stone-200 hover:bg-pink-50"
            }`}
          >
            Skicka Blommor
          </button>

          <button
            type="button"
            onClick={() => setPurchaseMode("subscription")}
            className={`rounded-2xl px-4 py-3 text-sm font-black ring-1 transition ${
              purchaseMode === "subscription"
                ? "bg-pink-600 !text-white ring-pink-600"
                : "bg-white text-stone-900 ring-stone-200 hover:bg-pink-50"
            }`}
          >
            <span className="block leading-tight">Bukett</span>
            <span className="block leading-tight">Prenumeration</span>
          </button>
        </div>

        <p className="mt-3 text-sm leading-7 text-stone-600">
          Fyll i det du vet. Inget fält är obligatoriskt. Sökningen går vidare
          till kartan där florister nära mottagaren visas.
        </p>

        <div className="mt-6 grid gap-3">
          <SearchInput
            icon={Globe2}
            label="Land"
            value={country}
            onChange={setCountry}
            placeholder="Sverige"
            listId="home-country-list"
          />

          <datalist id="home-country-list">
            {countries.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>

          <SearchInput
            icon={MapPin}
            label="Stad"
            value={city}
            onChange={updateCity}
            placeholder="Till exempel Stockholm"
            listId="home-city-list"
          />

          <datalist id="home-city-list">
            {citySuggestions.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>

          <SearchInput
            icon={Home}
            label="Gatuadress"
            value={streetAddress}
            onChange={updateStreetAddress}
            placeholder="Till exempel Drottninggatan 10"
            listId="home-address-list"
          />

          <datalist id="home-address-list">
            {Object.keys(addressPostalCodes).map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>

          <SearchInput
            icon={MapPin}
            label="Postnummer"
            value={postalCode}
            onChange={setPostalCode}
            placeholder="Fylls automatiskt när vi kan"
          />

          <label className="block rounded-2xl bg-stone-50 px-4 py-3 ring-1 ring-stone-200">
            <span className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-stone-400">
              <CalendarDays size={15} className="text-pink-600" />
              Leveransdatum
            </span>
            <input
              type="date"
              value={deliveryDate}
              onChange={(event) => setDeliveryDate(event.target.value)}
              className="w-full bg-transparent text-sm font-bold text-stone-900 outline-none"
            />
          </label>

          <button
            type="button"
            onClick={() => saveSearch("/order/private/guest-v4", "matching")}
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-5 py-4 text-sm font-black text-emerald-800 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
          >
            Låt FloristSocial matcha florist
          </button>

          <button
            type="button"
            onClick={() => saveSearch("/florists/map", "near-me")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-stone-50 px-4 py-4 text-sm font-black text-stone-900 ring-1 ring-stone-200 transition hover:bg-pink-50"
          >
            <LocateFixed size={18} className="text-pink-600" />
            Nära mig
          </button>

          <button
            type="button"
            onClick={() => saveSearch("/florists/map")}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-pink-600 px-5 py-4 text-sm font-black !text-white transition hover:bg-pink-700"
          >
            <Search size={18} />
            Sök
          </button>

          <button
            type="button"
            onClick={() => saveSearch("/florists/map")}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-5 py-4 text-sm font-black !text-white transition hover:bg-stone-800"
          >
            Full karta
            <ArrowRight size={18} />
          </button>

          
        </div>

        <div className="mt-6 rounded-[22px] bg-[#fbf7f2] p-4 ring-1 ring-stone-200">
          <p className="text-sm font-black text-stone-900">
            Leveranstid är en önskan
          </p>
          <p className="mt-2 text-xs font-semibold leading-6 text-stone-500">
            Kunden kan önska tidpunkt, men exakt leveranstid kan inte garanteras
            eftersom leveransen sker när mottagaren kan ta emot blommorna.
            Butiken kan vara stängd för besök men ändå erbjuda leverans.
          </p>
        </div>
      </aside>
    </div>
  );
}

function SearchInput({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  listId,
}: {
  icon: typeof Search;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  listId?: string;
}) {
  return (
    <label className="block rounded-2xl bg-stone-50 px-4 py-3 ring-1 ring-stone-200 transition focus-within:bg-white focus-within:ring-pink-300">
      <span className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-stone-400">
        <Icon size={15} className="text-pink-600" />
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        list={listId}
        className="w-full bg-transparent text-sm font-bold text-stone-900 outline-none placeholder:text-stone-400"
      />
    </label>
  );
}
