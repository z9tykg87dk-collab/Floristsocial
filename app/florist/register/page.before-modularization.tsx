"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import ImportVerificationSection from "@/components/florist-registration/ImportVerificationSection";
import SpecialtiesSection from "@/components/florist-registration/SpecialtiesSection";
import QualitySection from "@/components/florist-registration/QualitySection";
import SustainabilitySection from "@/components/florist-registration/SustainabilitySection";
import FloristClaimMap, {
  type FloristClaimPlace,
} from "@/components/FloristClaimMap";
import {
  Building2,
  CalendarDays,
  Camera,
  Check,
  Clock,
  CreditCard,
  Eye,
  Flower2,
  Globe,
  ImagePlus,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Send,
  ShieldCheck,
  Store,
  Trash2,
  Truck,
  UploadCloud,
  User,
  X,
} from "lucide-react";

const DRAFT_KEY = "florist-registration-draft-v3";

const swedishCities = [
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
  "Eskilstuna",
  "Södertälje",
  "Karlstad",
  "Täby",
  "Växjö",
  "Halmstad",
  "Sundsvall",
  "Luleå",
  "Annan stad",
];

const cityAreas: Record<string, string[]> = {
  Stockholm: [
    "Annat område",
    "Södermalm",
    "Östermalm",
    "Vasastan",
    "Kungsholmen",
    "Norrmalm",
    "Gamla stan",
    "Liljeholmen",
    "Hammarby Sjöstad",
    "Årsta",
    "Enskede",
    "Bromma",
    "Solna",
    "Sundbyberg",
    "Nacka",
    "Lidingö",
    "Täby",
    "Danderyd",
    "Sollentuna",
    "Huddinge",
    "Farsta",
  ],
  Göteborg: [
    "Annat område",
    "Centrum",
    "Linné",
    "Majorna",
    "Hisingen",
    "Mölndal",
    "Partille",
  ],
  Malmö: [
    "Annat område",
    "Centrum",
    "Limhamn",
    "Västra Hamnen",
    "Triangeln",
    "Hyllie",
  ],
};

const serviceOptions = [
  "Bröllop",
  "Begravning",
  "Event",
  "Företagsblommor",
  "Buketter",
  "Blombud",
  "Prenumerationer",
  "Workshops",
  "Hemleverans",
  "Samma dag-leverans",
  "Hotell & restaurang",
  "Skyltfönster & installationer",
];

const styleOptions = [
  "Romantiskt",
  "Modernt",
  "Vilt & organiskt",
  "Klassiskt",
  "Nordiskt",
  "Lyxigt",
  "Färgstarkt",
  "Minimalistiskt",
  "Säsongsbaserat",
  "Exklusivt",
];

const swedishHolidays = [
  "Nyårsdagen",
  "Trettondedag jul",
  "Långfredagen",
  "Påskafton",
  "Påskdagen",
  "Annandag påsk",
  "Första maj",
  "Kristi himmelsfärdsdag",
  "Nationaldagen",
  "Midsommarafton",
  "Midsommardagen",
  "Alla helgons dag",
  "Julafton",
  "Juldagen",
  "Annandag jul",
  "Nyårsafton",
];

const priceLevels = [
  "Budget",
  "Mellan",
  "Premium",
  "Lyx",
  "Varierar per uppdrag",
];
const deliveryTypes = [
  "Lokal leverans",
  "Regional leverans",
  "Nationella uppdrag",
  "Endast upphämtning",
  "Ingen leverans",
];
const statusOptions = [
  "Ny ansökan",
  "Under granskning",
  "Godkänd",
  "Behöver kompletteras",
  "Pausad",
];
const planOptions = ["Free", "Starter", "Pro", "Premium", "Partner"];

const defaultOpeningHours = [
  {
    id: 1,
    dayLabel: "Måndag",
    openTime: "10:00",
    closeTime: "18:00",
    isClosed: false,
    note: "",
  },
  {
    id: 2,
    dayLabel: "Tisdag",
    openTime: "10:00",
    closeTime: "18:00",
    isClosed: false,
    note: "",
  },
  {
    id: 3,
    dayLabel: "Onsdag",
    openTime: "10:00",
    closeTime: "18:00",
    isClosed: false,
    note: "",
  },
  {
    id: 4,
    dayLabel: "Torsdag",
    openTime: "10:00",
    closeTime: "18:00",
    isClosed: false,
    note: "",
  },
  {
    id: 5,
    dayLabel: "Fredag",
    openTime: "10:00",
    closeTime: "18:00",
    isClosed: false,
    note: "",
  },
  {
    id: 6,
    dayLabel: "Lördag",
    openTime: "10:00",
    closeTime: "16:00",
    isClosed: false,
    note: "",
  },
  {
    id: 7,
    dayLabel: "Söndag",
    openTime: "11:00",
    closeTime: "15:00",
    isClosed: false,
    note: "",
  },
];

type OpeningHour = {
  id: number;
  dayLabel: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  note: string;
};

type CoverageArea = {
  id: number;
  city: string;
  area: string;
  postalCode: string;
  radius: number;
  price: string;
};

type UploadedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

type PortfolioDraftItem = UploadedImage & {
  title: string;
  price: string;
  description: string;
  hashtags: string;
  isSaved: boolean;
};

type HolidayOverride = {
  id: string;
  name: string;
  status: "open" | "closed";
  note: string;
};

type CalendarEvent = {
  id: string;
  date: string;
  status: "open" | "closed" | "special-hours" | "activity";
  title: string;
  note: string;
  openTime: string;
  closeTime: string;
};

type SeasonalClosure = {
  id: string;
  from: string;
  to: string;
  title: string;
  note: string;
};

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
    return trimmed;
  return "https://" + trimmed;
}

function normalizeSwedishPhone(value: string) {
  const trimmed = value.trim().replace(/\s+/g, "");
  if (!trimmed) return "";
  if (trimmed.startsWith("+")) return trimmed;
  if (trimmed.startsWith("00")) return "+" + trimmed.slice(2);
  if (trimmed.startsWith("0")) return "+46" + trimmed.slice(1);
  return "+46" + trimmed;
}

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!?#";
  const array = new Uint32Array(12);
  crypto.getRandomValues(array);
  return Array.from(array, (x) => chars[x % chars.length]).join("");
}

function maskOrgNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.length <= 4) return "XXXXXX-XXXX";
  return "XXXXXX-" + trimmed.slice(-4);
}

function collectFormDraft(form: HTMLFormElement) {
  const formData = new FormData(form);
  const draft: Record<string, string> = {};

  formData.forEach((value, key) => {
    if (typeof value === "string") draft[key] = value;
  });

  return draft;
}

function restoreFormDraft(
  form: HTMLFormElement,
  draft: Record<string, string>,
) {
  Object.entries(draft).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);
    if (!field) return;
    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement ||
      field instanceof HTMLSelectElement
    ) {
      field.value = value;
    }
  });
}

function getNextTwoMonths() {
  const today = new Date();

  return [0, 1].map((offset) => {
    const first = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const year = first.getFullYear();
    const month = first.getMonth();
    const numberOfDays = new Date(year, month + 1, 0).getDate();
    const startDay = (first.getDay() + 6) % 7;

    return {
      label: first.toLocaleDateString("sv-SE", {
        month: "long",
        year: "numeric",
      }),
      blanks: Array.from({ length: startDay }),
      days: Array.from({ length: numberOfDays }, (_, index) => {
        const date = new Date(year, month, index + 1);
        return {
          day: index + 1,
          value: date.toISOString().slice(0, 10),
        };
      }),
    };
  });
}

export default function FloristSocialRegistrationPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedQualityBadges, setSelectedQualityBadges] = useState<string[]>([]);
  const [selectedSustainability, setSelectedSustainability] = useState<string[]>([]);
  const [sustainabilityText, setSustainabilityText] = useState("");
  const [googleBusinessQuery, setGoogleBusinessQuery] = useState("");
  const [consentGoogleImport, setConsentGoogleImport] = useState(false);
  const [consentGooglePublish, setConsentGooglePublish] = useState(false);
  const [consentInstagramConnect, setConsentInstagramConnect] = useState(false);
  const [consentInstagramPublish, setConsentInstagramPublish] = useState(false);
  const [consentPublicProfile, setConsentPublicProfile] = useState(false);
  const [confirmsBusinessOwnership, setConfirmsBusinessOwnership] = useState(false);
  const [deliveryRadius, setDeliveryRadius] = useState(15);
  const [openingHours, setOpeningHours] =
    useState<OpeningHour[]>(defaultOpeningHours);
  const [holidayOverrides, setHolidayOverrides] = useState<HolidayOverride[]>(
    swedishHolidays.map((name) => ({
      id: name,
      name,
      status: "closed",
      note: "",
    })),
  );
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [seasonalClosures, setSeasonalClosures] = useState<SeasonalClosure[]>(
    [],
  );
  const [selectedCalendarDate, setSelectedCalendarDate] = useState("");
  const [serviceUploadPrompt, setServiceUploadPrompt] = useState<string | null>(
    null,
  );
  const [servicePortfolioItems, setServicePortfolioItems] = useState<
    Record<string, PortfolioDraftItem[]>
  >({});
  const [generalPortfolioItems, setGeneralPortfolioItems] = useState<
    PortfolioDraftItem[]
  >([]);
  const [profileImage, setProfileImage] = useState<UploadedImage | null>(null);
  const [logoImage, setLogoImage] = useState<UploadedImage | null>(null);
  const [coverImage, setCoverImage] = useState<UploadedImage | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [selectedClaimPlace, setSelectedClaimPlace] =
    useState<FloristClaimPlace | null>(null);
  const [coverageAreas, setCoverageAreas] = useState<CoverageArea[]>([
    {
      id: 1,
      city: "Stockholm",
      area: "Annat område",
      postalCode: "",
      radius: 15,
      price: "",
    },
  ]);

  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (!savedDraft) return;

    try {
      const draft = JSON.parse(savedDraft) as Record<string, string>;
      const form = document.querySelector<HTMLFormElement>(
        "form[data-florist-register-form='true']",
      );
      if (form) restoreFormDraft(form, draft);
    } catch (error) {
      console.error("Kunde inte läsa sparat utkast:", error);
    }
  }, []);

  const portfolioCount =
    Object.values(servicePortfolioItems).reduce(
      (total, items) => total + items.filter((item) => item.isSaved).length,
      0,
    ) + generalPortfolioItems.filter((item) => item.isSaved).length;

  const completionScore = useMemo(() => {
    let score = 20;
    if (selectedServices.length > 0) score += 20;
    if (selectedStyles.length > 0) score += 10;
    if (coverageAreas.some((item) => item.city && item.price)) score += 20;
    if (portfolioCount > 0) score += 20;
    if (
      holidayOverrides.length > 0 ||
      calendarEvents.length > 0 ||
      seasonalClosures.length > 0
    )
      score += 10;
    return Math.min(score, 100);
  }, [
    selectedServices,
    selectedStyles,
    coverageAreas,
    portfolioCount,
    holidayOverrides,
    calendarEvents,
    seasonalClosures,
  ]);

  function selectClaimPlace(place: FloristClaimPlace) {
    setSelectedClaimPlace(place);
    setGoogleBusinessQuery(place.shop_name);
    setConfirmsBusinessOwnership(true);

    const values: Record<string, string> = {
      shopName: place.shop_name || "",
      streetAddress: place.street_address || "",
      postalCode: place.postal_code || "",
      city: place.city || "",
      shopPhone: place.phone || "",
      websiteUrl: place.website || "",
    };

    Object.entries(values).forEach(([name, value]) => {
      const input = document.querySelector<
        HTMLInputElement | HTMLSelectElement
      >(`[name="${name}"]`);

      if (!input) return;

      const nativeSetter = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(input),
        "value",
      )?.set;

      if (nativeSetter) {
        nativeSetter.call(input, value);
      } else {
        input.value = value;
      }

      input.dispatchEvent(
        new Event("input", {
          bubbles: true,
        }),
      );

      input.dispatchEvent(
        new Event("change", {
          bubbles: true,
        }),
      );
    });

    document
      .querySelector("[name='shopName']")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  }

  function saveDraft() {
    const form = document.querySelector<HTMLFormElement>(
      "form[data-florist-register-form='true']",
    );
    if (!form) return;
    const draft = collectFormDraft(form);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setSubmitSuccess(
      "✅ Utkast sparat i webbläsaren. Bilder behöver väljas igen senare.",
    );
    setSubmitError("");
  }

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
    setSubmitSuccess("Utkastet är raderat från webbläsaren.");
    setSubmitError("");
  }

  function toggleService(value: string) {
    const exists = selectedServices.includes(value);
    setSelectedServices(
      exists
        ? selectedServices.filter((item) => item !== value)
        : [...selectedServices, value],
    );
    if (!exists) setServiceUploadPrompt(value);
  }

  function toggleStyle(value: string) {
    setSelectedStyles((styles) =>
      styles.includes(value)
        ? styles.filter((item) => item !== value)
        : [...styles, value],
    );
  }

  function toggleSpecialty(value: string) {
    setSelectedSpecialties((items) =>
      items.includes(value)
        ? items.filter((item) => item !== value)
        : [...items, value],
    );
  }

  function toggleQualityBadge(value: string) {
    setSelectedQualityBadges((items) =>
      items.includes(value)
        ? items.filter((item) => item !== value)
        : [...items, value],
    );
  }

  function toggleSustainability(value: string) {
    setSelectedSustainability((items) =>
      items.includes(value)
        ? items.filter((item) => item !== value)
        : [...items, value],
    );
  }

  function updateOpeningHour(
    id: number,
    field: keyof OpeningHour,
    value: string | boolean,
  ) {
    setOpeningHours((rows) =>
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  }

  function updateHoliday(
    id: string,
    field: keyof HolidayOverride,
    value: string,
  ) {
    setHolidayOverrides((items) =>
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  }

  function updateCoverageArea(
    id: number,
    field: keyof CoverageArea,
    value: string | number,
  ) {
    setCoverageAreas((areas) =>
      areas.map((area) => {
        if (area.id !== id) return area;
        if (field === "city")
          return { ...area, city: String(value), area: "Annat område" };
        return { ...area, [field]: value };
      }),
    );
  }

  function addCoverageArea() {
    setCoverageAreas((areas) => [
      ...areas,
      {
        id: Date.now(),
        city: "Stockholm",
        area: "Annat område",
        postalCode: "",
        radius: deliveryRadius,
        price: "",
      },
    ]);
  }

  function removeCoverageArea(id: number) {
    setCoverageAreas((areas) => areas.filter((area) => area.id !== id));
  }

  function addCalendarEvent(date: string) {
    const existing = calendarEvents.find((event) => event.date === date);
    if (existing) {
      setSelectedCalendarDate(date);
      return;
    }

    setCalendarEvents((events) => [
      ...events,
      {
        id: `${date}-${Date.now()}`,
        date,
        status: "closed",
        title: "Stängt",
        note: "",
        openTime: "",
        closeTime: "",
      },
    ]);
    setSelectedCalendarDate(date);
  }

  function updateCalendarEvent(
    id: string,
    field: keyof CalendarEvent,
    value: string,
  ) {
    setCalendarEvents((events) =>
      events.map((event) =>
        event.id === id ? { ...event, [field]: value } : event,
      ),
    );
  }

  function removeCalendarEvent(id: string) {
    setCalendarEvents((events) => events.filter((event) => event.id !== id));
  }

  function addSeasonalClosure() {
    setSeasonalClosures((items) => [
      ...items,
      {
        id: `${Date.now()}`,
        from: "",
        to: "",
        title: "Sommarstängt",
        note: "",
      },
    ]);
  }

  function updateSeasonalClosure(
    id: string,
    field: keyof SeasonalClosure,
    value: string,
  ) {
    setSeasonalClosures((items) =>
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  }

  function removeSeasonalClosure(id: string) {
    setSeasonalClosures((items) => items.filter((item) => item.id !== id));
  }

  function addPortfolioFilesToForm(requestFormData: FormData) {
    const servicePortfolioPayload: Record<string, any[]> = {};
    let fileIndex = 0;

    Object.entries(servicePortfolioItems).forEach(([serviceName, items]) => {
      servicePortfolioPayload[serviceName] = items.map((item) => {
        const fileKey = item.isSaved ? `portfolioFile_${fileIndex}` : null;
        if (fileKey) {
          requestFormData.append(fileKey, item.file);
          fileIndex += 1;
        }
        return {
          title: item.title,
          price: item.price,
          description: item.description,
          hashtags: item.hashtags,
          isSaved: item.isSaved,
          fileKey,
          serviceName,
          mediaType: item.file.type.startsWith("video/") ? "video" : "image",
        };
      });
    });

    const generalPortfolioPayload = generalPortfolioItems.map((item) => {
      const fileKey = item.isSaved ? `portfolioFile_${fileIndex}` : null;
      if (fileKey) {
        requestFormData.append(fileKey, item.file);
        fileIndex += 1;
      }
      return {
        title: item.title,
        price: item.price,
        description: item.description,
        hashtags: item.hashtags,
        isSaved: item.isSaved,
        fileKey,
        serviceName: "Allmän portfolio",
        mediaType: item.file.type.startsWith("video/") ? "video" : "image",
      };
    });

    if (profileImage) requestFormData.append("profileImage", profileImage.file);
    if (logoImage) requestFormData.append("logo", logoImage.file);
    if (coverImage) requestFormData.append("coverImage", coverImage.file);

    return { servicePortfolioPayload, generalPortfolioPayload };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const formData = new FormData(event.currentTarget);
      const requestFormData = new FormData();
      const { servicePortfolioPayload, generalPortfolioPayload } =
        addPortfolioFilesToForm(requestFormData);

      const ownerEmail = String(formData.get("ownerEmail") || "").trim();
      const shopEmail = String(formData.get("shopEmail") || "").trim();
      const password = String(
        formData.get("password") || generatedPassword || "",
      );
      const confirmPassword = String(formData.get("confirmPassword") || "");

      if (!ownerEmail.includes("@") || !shopEmail.includes("@")) {
        setSubmitError(
          "Kontrollera e-postadresserna. Både ägarens e-post och butikens e-post måste vara giltiga.",
        );
        setSubmitting(false);
        return;
      }

      if (!password || password.length < 8) {
        setSubmitError("Lösenordet måste vara minst 8 tecken.");
        setSubmitting(false);
        return;
      }

      if (confirmPassword && password !== confirmPassword) {
        setSubmitError("Lösenorden matchar inte.");
        setSubmitting(false);
        return;
      }

      const payload = {
        country: "Sverige",
        externalPlaceId:
          selectedClaimPlace?.external_place_id || "",
        googlePlaceId:
          selectedClaimPlace?.google_place_id || "",
        claimPlace: selectedClaimPlace,
        firstName: String(formData.get("firstName") || ""),
        lastName: String(formData.get("lastName") || ""),
        ownerEmail,
        email: ownerEmail,
        password,
        shopName: String(formData.get("shopName") || ""),
        legalBusinessName: String(formData.get("legalBusinessName") || ""),
        organizationNumber: String(formData.get("organizationNumber") || ""),
        maskedOrganizationNumber: maskOrgNumber(
          String(formData.get("organizationNumber") || ""),
        ),
        shopEmail,
        publicEmail: shopEmail,
        ownerPhone: normalizeSwedishPhone(
          String(formData.get("ownerPhone") || ""),
        ),
        shopPhone: normalizeSwedishPhone(
          String(formData.get("shopPhone") || ""),
        ),
        phone: normalizeSwedishPhone(String(formData.get("shopPhone") || "")),
        city: String(formData.get("city") || ""),
        postalCode: String(formData.get("postalCode") || ""),
        streetAddress: String(formData.get("streetAddress") || ""),
        addressLine2: String(formData.get("addressLine2") || ""),
        municipality: String(formData.get("municipality") || ""),
        county: String(formData.get("county") || ""),
        countryName: "Sverige",
        websiteUrl: normalizeUrl(String(formData.get("websiteUrl") || "")),
        instagramHandle: String(formData.get("instagramHandle") || ""),
        bio: String(formData.get("bio") || ""),
        deliveryModel: String(
          formData.get("deliveryModel") || "Lokal leverans",
        ),
        deliveryRadiusKm: deliveryRadius,
        priceLevel: String(formData.get("priceLevel") || ""),
        minimumBookingValue: String(formData.get("minimumBookingValue") || ""),
        yearsInBusiness: String(formData.get("yearsInBusiness") || ""),
        teamSize: String(formData.get("teamSize") || ""),
        stripeAccountId: String(formData.get("stripeAccountId") || ""),
        selectedServices,
        selectedStyles,
        selectedSpecialties,
        selectedQualityBadges,
        selectedSustainability,
        sustainabilityText,
        importVerification: {
          googleBusinessQuery,
          consentGoogleImport,
          consentGooglePublish,
          consentInstagramConnect,
          consentInstagramPublish,
          consentPublicProfile,
          confirmsBusinessOwnership,
        },
        coverageAreas,
        servicePortfolioItems: servicePortfolioPayload,
        generalPortfolioItems: generalPortfolioPayload,
        openingHours,
        holidayOverrides,
        calendarEvents,
        seasonalClosures,
        closedDates: [
          ...holidayOverrides
            .filter((item) => item.status === "closed")
            .map((item) => item.name),
          ...calendarEvents
            .filter((item) => item.status === "closed")
            .map((item) => item.date),
        ],
        status: String(formData.get("status") || "Ny ansökan"),
        plan: String(formData.get("plan") || "Free"),
        adminOwner: String(formData.get("adminOwner") || ""),
        adminNote: String(formData.get("adminNote") || ""),
        editPolicy: {
          floristCanEdit: [
            "open_closed",
            "prices",
            "images",
            "delivery_areas",
            "style",
            "services",
            "opening_hours",
            "bio",
            "calendar_events",
            "seasonal_closures",
          ],
          requiresAdminRequest: [
            "address",
            "phone",
            "email",
            "business_name",
            "organization_number",
            "website",
            "contact_person",
            "stripe_account_id",
          ],
        },
      };

      requestFormData.append("payload", JSON.stringify(payload));

      const response = await fetch("/api/florists/register", {
        method: "POST",
        body: requestFormData,
      });
      const result = await response.json();

      if (!response.ok) {
        setSubmitError(
          result.error ||
            result.details ||
            "Något gick fel vid registreringen.",
        );
        setSubmitting(false);
        return;
      }

      localStorage.removeItem(DRAFT_KEY);
      setSubmitSuccess(
        `✅ Registreringen skickades och floristkontot skapades. Profil: ${result.profileUrl || "skapad"}`,
      );
    } catch (error) {
      console.error(error);
      setSubmitError("Serverfel vid registrering.");
    }

    setSubmitting(false);
  }

  async function handleInterestSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log("FloristSocial intresseanmälan:", {
      name: String(formData.get("interestName") || ""),
      company: String(formData.get("interestCompany") || ""),
      phone: normalizeSwedishPhone(String(formData.get("interestPhone") || "")),
      email: String(formData.get("interestEmail") || ""),
      message: String(formData.get("interestMessage") || ""),
      createdAt: new Date().toISOString(),
    });
    setSubmitSuccess(
      "✅ Tack! Intresseanmälan är mottagen lokalt. Nästa steg är att koppla den till API/databas.",
    );
  }

  if (showInterestForm) {
    return (
      <main className="min-h-screen bg-[#fbf7f2] px-5 py-10 text-stone-900 md:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-xl md:p-10">
          <button
            type="button"
            onClick={() => setShowInterestForm(false)}
            className="mb-6 text-sm font-medium text-stone-500 hover:text-stone-900"
          >
            ← Tillbaka till full registrering
          </button>
          <SectionHeader
            icon={<Send size={20} />}
            title="Intresseanmälan till FloristSocial"
            description="För florister som vill visa intresse först och bli kontaktade av vårt team."
          />
          <form className="space-y-5" onSubmit={handleInterestSubmit}>
            <Field
              required
              name="interestName"
              label="Namn"
              placeholder="Ditt namn"
              icon={<User size={18} />}
            />
            <Field
              required
              name="interestCompany"
              label="Företagsnamn"
              placeholder="Ex. Makalösa Blommor"
              icon={<Store size={18} />}
            />
            <Field
              required
              name="interestPhone"
              label="Telefon / mobil"
              placeholder="070 000 00 00"
              icon={<Phone size={18} />}
            />
            <Field
              required
              name="interestEmail"
              label="E-post"
              placeholder="namn@foretag.se"
              type="email"
              icon={<Mail size={18} />}
            />
            <Textarea
              required
              name="interestMessage"
              label="Meddelande"
              placeholder="Berätta kort om verksamheten, stad, tjänster och varför ni vill vara med."
            />
            <Button type="submit">
              <Send size={16} /> Skicka intresseanmälan
            </Button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbf7f2] text-stone-900">
      {serviceUploadPrompt && (
        <ServiceUploadModal
          service={serviceUploadPrompt}
          initialItems={servicePortfolioItems[serviceUploadPrompt] || []}
          onClose={() => setServiceUploadPrompt(null)}
          onSave={(items) => {
            setServicePortfolioItems((current) => ({
              ...current,
              [serviceUploadPrompt]: items,
            }));
            setServiceUploadPrompt(null);
          }}
        />
      )}

      <section className="relative overflow-hidden px-5 py-10 md:px-10 lg:px-16">
        <div className="absolute right-[-160px] top-[-160px] h-96 w-96 rounded-full bg-pink-200/50 blur-3xl" />
        <div className="absolute bottom-[-180px] left-[-140px] h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <header className="mb-8 max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm">
                <Flower2 size={16} /> FloristSocial floristregistrering
              </div>
              <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
                Registrera florist till FloristSocial.
              </h1>
              <p className="mt-5 text-lg leading-8 text-stone-600">
                Komplett profil för butik, leverans, tjänster, bilder,
                öppettider, helgdagar och floristkalender.
              </p>
              <button
                type="button"
                onClick={() => setShowInterestForm(true)}
                className="mt-5 rounded-2xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold hover:bg-stone-50"
              >
                Vill du bara visa intresse? Öppna intresseanmälan
              </button>
            </header>

            <form
              data-florist-register-form="true"
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <FloristClaimMap
                selectedExternalPlaceId={
                  selectedClaimPlace?.external_place_id || null
                }
                onClaimPlace={selectClaimPlace}
              />

              <input
                type="hidden"
                name="externalPlaceId"
                value={
                  selectedClaimPlace?.external_place_id || ""
                }
              />

              <Card>
                <SectionHeader
                  icon={<User size={20} />}
                  title="1. Kontaktperson & inloggning"
                  description="Ägarens/kontaktpersonens e-post används för inloggning. Butikens e-post visas inte publikt direkt utan kontakt sker via FloristSocial."
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    required
                    name="firstName"
                    label="Förnamn"
                    placeholder="Ex. Nick"
                  />
                  <Field
                    required
                    name="lastName"
                    label="Efternamn"
                    placeholder="Ex. Hojjati"
                  />
                  <Field
                    required
                    name="ownerEmail"
                    label="Ägarens e-post / login"
                    placeholder="login@foretag.se"
                    type="email"
                    icon={<Mail size={18} />}
                  />
                  <Field
                    required
                    name="ownerPhone"
                    label="Kontaktpersonens mobil"
                    placeholder="070 000 00 00"
                    type="tel"
                    icon={<Phone size={18} />}
                  />
                  <PasswordFields
                    generatedPassword={generatedPassword}
                    onGenerated={setGeneratedPassword}
                  />
                  <Field
                    required
                    name="contactRole"
                    label="Roll i företaget"
                    placeholder="Ex. Ägare, huvudflorist, butikschef"
                  />
                </div>
              </Card>

              <Card>
                <SectionHeader
                  icon={<Building2 size={20} />}
                  title="2. Företagsinformation"
                  description="Företagsnamn kan visas på profilen. Organisationsnummer sparas men visas inte publikt."
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    required
                    name="shopName"
                    label="Florist namn / Butiksnamn"
                    placeholder="Ex. Makalösa Blommor"
                    icon={<Store size={18} />}
                  />
                  <Field
                    required
                    name="legalBusinessName"
                    label="Juridiskt företagsnamn"
                    placeholder="Ex. Makalösa Blommor AB"
                  />
                  <Field
                    required
                    name="organizationNumber"
                    label="Organisationsnummer"
                    placeholder="XXXXXX-XXXX"
                  />
                  <SelectField
                    required
                    name="vatRegistered"
                    label="Momsregistrerad"
                    options={["Ja", "Nej", "Ej angivet"]}
                  />
                  <Field
                    required
                    name="shopEmail"
                    label="Butikens e-post"
                    placeholder="info@dinbutik.se"
                    type="email"
                    icon={<Mail size={18} />}
                  />
                  <Field
                    required
                    name="shopPhone"
                    label="Butikens telefon"
                    placeholder="08 000 00 00"
                    type="tel"
                    icon={<Phone size={18} />}
                  />
                  <UrlField
                    name="websiteUrl"
                    label="Webbplats"
                    placeholder="makalosablommor.se"
                    icon={<Globe size={18} />}
                  />
                  <Field
                    name="instagramHandle"
                    label="Instagram företag"
                    placeholder="@dinblomsterbutik"
                    icon={<Camera size={18} />}
                  />
                </div>
              </Card>

              <ImportVerificationSection
                googleBusinessQuery={googleBusinessQuery}
                instagramHandle={String(
                  typeof document !== "undefined"
                    ? document.querySelector<HTMLInputElement>("input[name='instagramHandle']")?.value || ""
                    : ""
                )}
                consentGoogleImport={consentGoogleImport}
                consentGooglePublish={consentGooglePublish}
                consentInstagramConnect={consentInstagramConnect}
                consentInstagramPublish={consentInstagramPublish}
                consentPublicProfile={consentPublicProfile}
                confirmsBusinessOwnership={confirmsBusinessOwnership}
                onGoogleBusinessQueryChange={setGoogleBusinessQuery}
                onInstagramHandleChange={() => {}}
                onToggleGoogleImport={() => setConsentGoogleImport((value) => !value)}
                onToggleGooglePublish={() => setConsentGooglePublish((value) => !value)}
                onToggleInstagramConnect={() => setConsentInstagramConnect((value) => !value)}
                onToggleInstagramPublish={() => setConsentInstagramPublish((value) => !value)}
                onTogglePublicProfile={() => setConsentPublicProfile((value) => !value)}
                onToggleBusinessOwnership={() =>
                  setConfirmsBusinessOwnership((value) => !value)
                }
              />

              <Card>
                <SectionHeader
                  icon={<MapPin size={20} />}
                  title="3. Butiksadress"
                  description="Sverige sätts automatiskt. Leveransradie räknas senare från butikens adress."
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    required
                    name="streetAddress"
                    label="Gatuadress"
                    placeholder="Ex. Sveavägen 102"
                    icon={<MapPin size={18} />}
                  />
                  <Field
                    name="addressLine2"
                    label="Adressrad 2"
                    placeholder="Lokal, våning, c/o"
                  />
                  <Field
                    required
                    name="postalCode"
                    label="Postnummer"
                    placeholder="113 50"
                    inputMode="numeric"
                  />
                  <SelectField
                    required
                    name="city"
                    label="Stad"
                    options={swedishCities}
                  />
                  <Field
                    name="municipality"
                    label="Kommun"
                    placeholder="Ex. Stockholms kommun"
                  />
                  <Field
                    name="county"
                    label="Län"
                    placeholder="Ex. Stockholms län"
                  />
                  <Field
                    name="country"
                    label="Land"
                    placeholder="Sverige"
                    value="Sverige"
                    readOnly
                  />
                </div>
              </Card>

              <Card>
                <SectionHeader
                  icon={<Clock size={20} />}
                  title="4. Veckoöppettider"
                  description="Ordinarie öppettider måndag–söndag. Detta påverkar butikens grundschema."
                />
                <OpeningHoursEditor
                  openingHours={openingHours}
                  onChange={updateOpeningHour}
                />
              </Card>

              <Card>
                <SectionHeader
                  icon={<CalendarDays size={20} />}
                  title="5. Helgdagar, floristkalender och specialstängt"
                  description="Här anges svenska helgdagar, avvikande datum, aktiviteter och längre stängda perioder som sommarstängt."
                />
                <HolidayOverrideEditor
                  holidays={holidayOverrides}
                  onChange={updateHoliday}
                />
                <FloristCalendarEditor
                  selectedDate={selectedCalendarDate}
                  events={calendarEvents}
                  onSelectDate={addCalendarEvent}
                  onChange={updateCalendarEvent}
                  onRemove={removeCalendarEvent}
                />
                <SeasonalClosureEditor
                  closures={seasonalClosures}
                  onAdd={addSeasonalClosure}
                  onChange={updateSeasonalClosure}
                  onRemove={removeSeasonalClosure}
                />
              </Card>

              <Card>
                <SectionHeader
                  icon={<Truck size={20} />}
                  title="6. Leveransradie & täckningsområden"
                  description="Det viktigaste är stad, pris och radie. Område är valfritt och står som Annat område som standard."
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField
                    required
                    name="deliveryModel"
                    label="Leveransmodell"
                    options={deliveryTypes}
                  />
                  <Field
                    required
                    name="primaryDeliveryArea"
                    label="Primärt leveransområde"
                    placeholder="Ex. Stockholm med omnejd"
                  />
                  <Field
                    required
                    name="sameDayCutoff"
                    label="Samma dag-leverans senast kl."
                    placeholder="Ex. 13:00"
                  />
                  <Field
                    required
                    name="deliveryDays"
                    label="Dagar för leverans"
                    placeholder="Ex. Mån-lör"
                  />
                  <Field
                    required
                    name="minimumOrderValue"
                    label="Minsta ordervärde"
                    placeholder="Ex. 450 kr"
                    inputMode="numeric"
                  />
                  <Field
                    required
                    name="deliveryFeeFrom"
                    label="Leveransavgift från"
                    placeholder="Ex. 99 kr"
                    inputMode="numeric"
                  />
                </div>

                <div className="mt-8 rounded-3xl bg-stone-50 p-5">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <label
                      htmlFor="delivery-radius"
                      className="text-sm font-semibold"
                    >
                      Standardradie för leverans
                    </label>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-medium shadow-sm">
                      {deliveryRadius} km
                    </span>
                  </div>
                  <input
                    id="delivery-radius"
                    type="range"
                    min="1"
                    max="150"
                    value={deliveryRadius}
                    onChange={(event) =>
                      setDeliveryRadius(Number(event.target.value))
                    }
                    className="w-full accent-stone-900"
                  />
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold">Stad, pris och radie</h3>
                      <p className="mt-1 text-sm text-stone-600">
                        Område är valfritt. Annat område visas alltid som
                        standard.
                      </p>
                    </div>
                    <Button type="button" onClick={addCoverageArea}>
                      <Plus size={16} /> Lägg till område
                    </Button>
                  </div>

                  {coverageAreas.map((coverage, index) => {
                    const areas = cityAreas[coverage.city] || [
                      "Annat område",
                      "Centrum",
                    ];
                    return (
                      <div
                        key={coverage.id}
                        className="rounded-3xl border border-stone-200 bg-white p-4"
                      >
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <h4 className="font-semibold">
                            Leveransområde {index + 1}
                          </h4>
                          {coverageAreas.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCoverageArea(coverage.id)}
                              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} /> Ta bort
                            </button>
                          )}
                        </div>
                        <div className="grid gap-4 md:grid-cols-5">
                          <ControlledSelect
                            label="Stad"
                            value={coverage.city}
                            options={swedishCities}
                            onChange={(value) =>
                              updateCoverageArea(coverage.id, "city", value)
                            }
                          />
                          <ControlledSelect
                            label="Område"
                            value={coverage.area || "Annat område"}
                            options={areas}
                            onChange={(value) =>
                              updateCoverageArea(coverage.id, "area", value)
                            }
                          />
                          <ControlledInput
                            label="Postnummer/gräns"
                            value={coverage.postalCode}
                            onChange={(value) =>
                              updateCoverageArea(
                                coverage.id,
                                "postalCode",
                                value,
                              )
                            }
                            placeholder="Valfritt"
                          />
                          <ControlledInput
                            label="Pris kr"
                            value={coverage.price}
                            onChange={(value) =>
                              updateCoverageArea(coverage.id, "price", value)
                            }
                            placeholder="Ex. 99"
                          />
                          <label className="block">
                            <span className="mb-2 block text-sm font-semibold">
                              Radie: {coverage.radius} km
                            </span>
                            <input
                              type="range"
                              min="1"
                              max="150"
                              value={coverage.radius}
                              onChange={(event) =>
                                updateCoverageArea(
                                  coverage.id,
                                  "radius",
                                  Number(event.target.value),
                                )
                              }
                              className="mt-4 w-full accent-stone-900"
                            />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card>
                <SectionHeader
                  icon={<Flower2 size={20} />}
                  title="7. Tjänster & specialiteter"
                  description="Välj tjänster och lägg till bilder med titel, pris, beskrivning och hashtags per tjänst."
                />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {serviceOptions.map((service) => {
                    const savedCount =
                      servicePortfolioItems[service]?.filter(
                        (item) => item.isSaved,
                      ).length || 0;
                    return (
                      <div key={service} className="space-y-2">
                        <PillButton
                          active={selectedServices.includes(service)}
                          onClick={() => toggleService(service)}
                        >
                          {service}
                        </PillButton>
                        {selectedServices.includes(service) && (
                          <button
                            type="button"
                            onClick={() => setServiceUploadPrompt(service)}
                            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-left text-xs font-medium text-stone-600 transition hover:border-stone-400 hover:bg-stone-50"
                          >
                            {savedCount > 0
                              ? `✅ ${savedCount} portfolio-bild(er) sparade`
                              : "Lägg till portfolio, pris och hashtags"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <SelectField
                    required
                    name="priceLevel"
                    label="Prisnivå"
                    options={priceLevels}
                  />
                  <Field
                    required
                    name="minimumBookingValue"
                    label="Minsta bokningsvärde för event/bröllop"
                    placeholder="Ex. 8 000 kr"
                    inputMode="numeric"
                  />
                  <Field
                    required
                    name="yearsInBusiness"
                    label="Antal år i branschen"
                    placeholder="Ex. 8 år"
                    inputMode="numeric"
                  />
                  <Field
                    required
                    name="teamSize"
                    label="Antal florister i teamet"
                    placeholder="Ex. 3"
                    inputMode="numeric"
                  />
                </div>
                <Textarea
                  required
                  name="bio"
                  label="Beskriv floristen"
                  placeholder="Berätta om stil, erfarenhet, typiska kunder, sortiment och vad som gör floristen unik."
                />
              </Card>

              <SpecialtiesSection
                selectedSpecialties={selectedSpecialties}
                onToggle={toggleSpecialty}
              />

              <QualitySection
                selectedQualityBadges={selectedQualityBadges}
                onToggle={toggleQualityBadge}
              />

              <SustainabilitySection
                selectedSustainability={selectedSustainability}
                sustainabilityText={sustainabilityText}
                onToggle={toggleSustainability}
                onTextChange={setSustainabilityText}
              />

              <Card>
                <SectionHeader
                  icon={<ImagePlus size={20} />}
                  title="8. Bilder, logotyp & portfolio"
                  description="Profilbild, logotyp och omslagsbild är valfria. Portfolio kan få titel, beskrivning, pris och hashtags."
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <SingleImagePicker
                    label="Profilbild"
                    description="Visas på floristprofilen."
                    value={profileImage}
                    onChange={setProfileImage}
                  />
                  <SingleImagePicker
                    label="Logotyp"
                    description="Visas som varumärke på profilen."
                    value={logoImage}
                    onChange={setLogoImage}
                  />
                  <SingleImagePicker
                    label="Omslagsbild"
                    description="Stor bild överst på profilen."
                    value={coverImage}
                    onChange={setCoverImage}
                  />
                  <GeneralPortfolioEditor
                    items={generalPortfolioItems}
                    onChange={setGeneralPortfolioItems}
                  />
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <UrlField
                    name="portfolioUrl"
                    label="Portfolio URL"
                    placeholder="portfolio.dinbutik.se"
                  />
                  <UrlField
                    name="googleBusinessProfile"
                    label="Google Business Profile"
                    placeholder="g.page/dinbutik"
                  />
                </div>
              </Card>

              <Card>
                <SectionHeader
                  icon={<Eye size={20} />}
                  title="9. Stil, profil & synlighet"
                  description="Dessa stilar visas senare på floristprofilen och hjälper kunder att välja rätt florist."
                />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {styleOptions.map((style) => (
                    <PillButton
                      key={style}
                      active={selectedStyles.includes(style)}
                      variant="pink"
                      onClick={() => toggleStyle(style)}
                    >
                      {style}
                    </PillButton>
                  ))}
                </div>
              </Card>

              <Card>
                <SectionHeader
                  icon={<CreditCard size={20} />}
                  title="10. Stripe & utbetalningar"
                  description="Stripe-kontonummer sparas men ändring senare kräver adminbegäran."
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
                    <label className="flex items-center gap-3">
                      <input type="radio" name="stripe_option" defaultChecked />{" "}
                      <strong>Har redan Stripe-konto</strong>
                    </label>
                    <div className="mt-4">
                      <Field
                        name="stripeAccountId"
                        label="Stripe kontonummer"
                        placeholder="Ex. acct_..."
                      />
                    </div>
                  </div>
                  <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
                    <label className="flex items-center gap-3">
                      <input type="radio" name="stripe_option" />{" "}
                      <strong>Starta Stripe-registrering</strong>
                    </label>
                    <p className="mt-3 text-sm leading-6 text-stone-600">
                      Den här knappen kopplas till Stripe onboarding senare.
                    </p>
                    <div className="mt-4">
                      <Button type="button">Starta Stripe-registrering</Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <SectionHeader
                  icon={<ShieldCheck size={20} />}
                  title="11. Admin & godkännande"
                  description="Intern information för granskning innan publicering."
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField
                    required
                    name="status"
                    label="Status"
                    options={statusOptions}
                  />
                  <SelectField
                    required
                    name="plan"
                    label="Plan"
                    options={planOptions}
                  />
                  <Field
                    required
                    name="adminOwner"
                    label="Ansvarig admin"
                    placeholder="Ex. Nick"
                  />
                  <SelectField
                    required
                    name="priority"
                    label="Prioritet"
                    options={["Låg", "Normal", "Hög"]}
                  />
                  <div className="md:col-span-2">
                    <Textarea
                      required
                      name="adminNote"
                      label="Intern anteckning"
                      placeholder="Anteckningar för FloristSocial-teamet."
                    />
                  </div>
                </div>
                <label className="mt-6 flex items-start gap-3 rounded-2xl bg-stone-50 p-4 text-sm text-stone-700">
                  <input
                    required
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-stone-900"
                  />
                  <span>
                    Floristen godkänner att FloristSocial lagrar uppgifterna och
                    kontaktar företaget för verifiering innan profilen
                    publiceras.
                  </span>
                </label>
              </Card>

              {submitError && (
                <div className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
                  {submitError}
                </div>
              )}
              {submitSuccess && (
                <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                  {submitSuccess}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={saveDraft}>
                  Spara som utkast
                </Button>
                <Button type="button" variant="outline" onClick={clearDraft}>
                  Radera utkast
                </Button>
                <Button type="submit">
                  {submitting ? "Skickar..." : "Skicka registrering"}
                </Button>
              </div>
            </form>
          </div>

          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <div className="rounded-3xl border-none bg-white p-6 shadow-xl">
              <h2 className="text-xl font-semibold">Profilstatus</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Fyll i stad, radie, pris, tjänster, bilder och kalender för att
                göra profilen stark.
              </p>
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">Komplett profil</span>
                  <span>{completionScore}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full bg-stone-900 transition-all"
                    style={{ width: `${completionScore}%` }}
                  />
                </div>
              </div>
              <div className="mt-6 space-y-3 text-sm text-stone-600">
                <StatusItem done label="Kontaktuppgifter" />
                <StatusItem done label="Företagsuppgifter" />
                <StatusItem
                  done={coverageAreas.length > 0}
                  label="Stad, pris och radie"
                />
                <StatusItem
                  done={selectedServices.length > 0}
                  label="Tjänster valda"
                />
                <StatusItem
                  done={selectedStyles.length > 0}
                  label="Stilar valda"
                />
                <StatusItem
                  done={portfolioCount > 0}
                  label={`${portfolioCount} portfolio-bild(er) sparade`}
                />
                <StatusItem
                  done={
                    holidayOverrides.length > 0 || calendarEvents.length > 0
                  }
                  label="Kalender och stängda dagar"
                />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function PasswordFields({
  generatedPassword,
  onGenerated,
}: {
  generatedPassword: string;
  onGenerated: (value: string) => void;
}) {
  const [password, setPassword] = useState(generatedPassword);
  const [confirmPassword, setConfirmPassword] = useState(generatedPassword);

  function generate() {
    const next = generatePassword();
    onGenerated(next);
    setPassword(next);
    setConfirmPassword(next);
  }

  return (
    <div className="md:col-span-2 rounded-3xl bg-stone-50 p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold">Säkert lösenord</h3>
          <p className="text-sm text-stone-600">
            Floristen kan skriva eget lösenord eller generera ett starkt
            lösenord.
          </p>
        </div>
        <Button type="button" onClick={generate}>
          <KeyRound size={16} /> Generera lösenord
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Lösenord</span>
          <input
            name="password"
            required
            type="text"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minst 8 tecken"
            className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition placeholder:text-stone-400 focus:border-stone-500"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">
            Bekräfta lösenord
          </span>
          <input
            name="confirmPassword"
            required
            type="text"
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Upprepa lösenordet"
            className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition placeholder:text-stone-400 focus:border-stone-500"
          />
        </label>
      </div>
    </div>
  );
}

function OpeningHoursEditor({
  openingHours,
  onChange,
}: {
  openingHours: OpeningHour[];
  onChange: (
    id: number,
    field: keyof OpeningHour,
    value: string | boolean,
  ) => void;
}) {
  return (
    <div className="rounded-3xl bg-stone-50 p-5">
      <h3 className="mb-4 font-semibold">Veckans öppettider</h3>
      <div className="space-y-3">
        {openingHours.map((row) => (
          <div
            key={row.id}
            className="grid gap-3 rounded-2xl bg-white p-3 md:grid-cols-[120px_1fr_1fr_120px] md:items-center"
          >
            <strong className="text-sm">{row.dayLabel}</strong>
            <input
              type="time"
              value={row.openTime}
              disabled={row.isClosed}
              onChange={(event) =>
                onChange(row.id, "openTime", event.target.value)
              }
              className="h-11 rounded-xl border border-stone-200 px-3 disabled:bg-stone-100"
            />
            <input
              type="time"
              value={row.closeTime}
              disabled={row.isClosed}
              onChange={(event) =>
                onChange(row.id, "closeTime", event.target.value)
              }
              className="h-11 rounded-xl border border-stone-200 px-3 disabled:bg-stone-100"
            />
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={row.isClosed}
                onChange={(event) =>
                  onChange(row.id, "isClosed", event.target.checked)
                }
              />{" "}
              Stängt
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function HolidayOverrideEditor({
  holidays,
  onChange,
}: {
  holidays: HolidayOverride[];
  onChange: (id: string, field: keyof HolidayOverride, value: string) => void;
}) {
  return (
    <div className="rounded-3xl bg-stone-50 p-5">
      <h3 className="mb-2 font-semibold">Svenska helgdagar</h3>
      <p className="mb-4 text-sm text-stone-600">
        Välj om floristen håller öppet eller stängt på respektive helgdag.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {holidays.map((holiday) => (
          <div
            key={holiday.id}
            className="rounded-2xl bg-white border border-stone-200 p-4"
          >
            <div className="font-semibold text-sm">{holiday.name}</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange(holiday.id, "status", "open")}
                className={`rounded-xl px-3 py-2 text-sm font-medium ${holiday.status === "open" ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-700"}`}
              >
                Öppet
              </button>
              <button
                type="button"
                onClick={() => onChange(holiday.id, "status", "closed")}
                className={`rounded-xl px-3 py-2 text-sm font-medium ${holiday.status === "closed" ? "bg-red-600 text-white" : "bg-stone-100 text-stone-700"}`}
              >
                Stängt
              </button>
            </div>
            <input
              value={holiday.note}
              onChange={(event) =>
                onChange(holiday.id, "note", event.target.value)
              }
              placeholder="Notering, t.ex. öppet 11–14"
              className="mt-3 h-11 w-full rounded-xl border border-stone-200 px-3 text-sm outline-none focus:border-stone-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function FloristCalendarEditor({
  selectedDate,
  events,
  onSelectDate,
  onChange,
  onRemove,
}: {
  selectedDate: string;
  events: CalendarEvent[];
  onSelectDate: (date: string) => void;
  onChange: (id: string, field: keyof CalendarEvent, value: string) => void;
  onRemove: (id: string) => void;
}) {
  const months = getNextTwoMonths();
  const eventByDate = new Map(events.map((event) => [event.date, event]));
  const selectedEvent = events.find((event) => event.date === selectedDate);
  const weekdays = ["M", "T", "O", "T", "F", "L", "S"];

  return (
    <div className="mt-6 rounded-3xl bg-stone-50 p-5">
      <h3 className="mb-2 font-semibold">
        Floristkalender: två kommande månader
      </h3>
      <p className="mb-4 text-sm text-stone-600">
        Klicka på datum för avvikande stängt, specialöppet, aktivitet eller
        notering.
      </p>
      <div className="grid gap-5 lg:grid-cols-2">
        {months.map((month) => (
          <div
            key={month.label}
            className="rounded-2xl bg-white p-4 border border-stone-200"
          >
            <h4 className="mb-3 font-semibold capitalize">{month.label}</h4>
            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-stone-400">
              {weekdays.map((day, index) => (
                <div key={`${day}-${index}`}>{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {month.blanks.map((_, index) => (
                <div key={`blank-${month.label}-${index}`} />
              ))}
              {month.days.map((day) => {
                const event = eventByDate.get(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => onSelectDate(day.value)}
                    className={`aspect-square rounded-xl text-sm font-medium border ${event?.status === "closed" ? "bg-red-500 text-white border-red-500" : event?.status === "open" ? "bg-emerald-500 text-white border-emerald-500" : event?.status === "special-hours" ? "bg-amber-500 text-white border-amber-500" : event?.status === "activity" ? "bg-blue-500 text-white border-blue-500" : selectedDate === day.value ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"}`}
                  >
                    {day.day}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="mt-5 rounded-2xl bg-white border border-stone-200 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h4 className="font-semibold">Datum: {selectedEvent.date}</h4>
            <button
              type="button"
              onClick={() => onRemove(selectedEvent.id)}
              className="rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Ta bort
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <ControlledSelect
              label="Typ"
              value={selectedEvent.status}
              options={["closed", "open", "special-hours", "activity"]}
              onChange={(value) => onChange(selectedEvent.id, "status", value)}
            />
            <ControlledInput
              label="Titel"
              value={selectedEvent.title}
              onChange={(value) => onChange(selectedEvent.id, "title", value)}
              placeholder="Ex. Stängt, Workshop, Specialöppet"
            />
            <ControlledInput
              label="Öppnar"
              value={selectedEvent.openTime}
              onChange={(value) =>
                onChange(selectedEvent.id, "openTime", value)
              }
              placeholder="Ex. 11:00"
            />
            <ControlledInput
              label="Stänger"
              value={selectedEvent.closeTime}
              onChange={(value) =>
                onChange(selectedEvent.id, "closeTime", value)
              }
              placeholder="Ex. 15:00"
            />
            <div className="md:col-span-2">
              <SmallTextarea
                label="Notering"
                value={selectedEvent.note}
                onChange={(value) => onChange(selectedEvent.id, "note", value)}
                placeholder="Ex. Sommarstängt, privat event, extraöppet inför högtid."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SeasonalClosureEditor({
  closures,
  onAdd,
  onChange,
  onRemove,
}: {
  closures: SeasonalClosure[];
  onAdd: () => void;
  onChange: (id: string, field: keyof SeasonalClosure, value: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="mt-6 rounded-3xl bg-stone-50 p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold">Längre stängda perioder</h3>
          <p className="mt-1 text-sm text-stone-600">
            Till exempel sommarstängt, renovering eller semesterperiod.
          </p>
        </div>
        <Button type="button" onClick={onAdd}>
          <Plus size={16} /> Lägg till period
        </Button>
      </div>
      <div className="space-y-3">
        {closures.length === 0 && (
          <p className="text-sm text-stone-500">
            Ingen längre stängd period registrerad.
          </p>
        )}
        {closures.map((closure) => (
          <div
            key={closure.id}
            className="rounded-2xl bg-white border border-stone-200 p-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <ControlledInput
                label="Från"
                value={closure.from}
                onChange={(value) => onChange(closure.id, "from", value)}
                placeholder="YYYY-MM-DD"
              />
              <ControlledInput
                label="Till"
                value={closure.to}
                onChange={(value) => onChange(closure.id, "to", value)}
                placeholder="YYYY-MM-DD"
              />
              <ControlledInput
                label="Rubrik"
                value={closure.title}
                onChange={(value) => onChange(closure.id, "title", value)}
                placeholder="Ex. Sommarstängt"
              />
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => onRemove(closure.id)}
                  className="h-12 rounded-2xl px-4 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Ta bort period
                </button>
              </div>
              <div className="md:col-span-2">
                <SmallTextarea
                  label="Text till kunder"
                  value={closure.note}
                  onChange={(value) => onChange(closure.id, "note", value)}
                  placeholder="Ex. Vi har sommarstängt vecka 29–31 och öppnar igen den 5 augusti."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceUploadModal({
  service,
  initialItems,
  onClose,
  onSave,
}: {
  service: string;
  initialItems: PortfolioDraftItem[];
  onClose: () => void;
  onSave: (items: PortfolioDraftItem[]) => void;
}) {
  const [items, setItems] = useState<PortfolioDraftItem[]>(initialItems);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const nextItems = Array.from(fileList)
      .filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("video/"),
      )
      .map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        title: "",
        price: "",
        description: "",
        hashtags: service ? `#${service.replaceAll(" ", "")}` : "",
        isSaved: false,
      }));
    setItems((current) => [...current, ...nextItems]);
  }

  function updateItem(
    id: string,
    field: keyof PortfolioDraftItem,
    value: string | boolean,
  ) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  }

  function removeItem(id: string) {
    setItems((current) => {
      const imageToRemove = current.find((item) => item.id === id);
      if (imageToRemove) URL.revokeObjectURL(imageToRemove.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Portfolio för {service}</h2>
            <p className="mt-2 text-sm text-stone-600">
              Lägg till bild/video, titel, pris, beskrivning och hashtags.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-stone-100"
          >
            <X size={18} />
          </button>
        </div>
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            addFiles(event.dataTransfer.files);
          }}
          className="rounded-3xl border-2 border-dashed border-stone-300 bg-stone-50 p-5 transition hover:border-stone-500"
        >
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl bg-white px-4 py-8 text-center text-sm text-stone-600 transition hover:bg-stone-100">
            <UploadCloud size={32} /> Klicka eller dra in bild/video för{" "}
            {service}
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(event) => addFiles(event.target.files)}
              className="hidden"
            />
          </label>
        </div>
        {items.length > 0 && (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <PortfolioEditCard
                key={item.id}
                item={item}
                onUpdate={(field, value) => updateItem(item.id, field, value)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </div>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Stäng utan att fortsätta
          </Button>
          <Button type="button" onClick={() => onSave(items)}>
            Spara och fortsätt
          </Button>
        </div>
      </div>
    </div>
  );
}

function PortfolioEditCard({
  item,
  onUpdate,
  onRemove,
}: {
  item: PortfolioDraftItem;
  onUpdate: (field: keyof PortfolioDraftItem, value: string | boolean) => void;
  onRemove: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
      {item.file.type.startsWith("video/") ? (
        <video
          src={item.previewUrl}
          controls
          className="h-56 w-full object-cover"
        />
      ) : (
        <img
          src={item.previewUrl}
          alt={item.file.name}
          className="h-56 w-full object-cover"
        />
      )}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 p-3">
        <Button type="button" onClick={() => onUpdate("isSaved", true)}>
          <Save size={16} /> Spara bild
        </Button>
        <Button type="button" variant="outline" onClick={onRemove}>
          <Trash2 size={16} /> Ta bort bild
        </Button>
        <span
          className={`rounded-full px-3 py-2 text-xs font-semibold ${item.isSaved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
        >
          {item.isSaved ? "Sparad" : "Ej sparad"}
        </span>
      </div>
      <div className="space-y-3 p-4">
        <p className="break-all text-xs font-medium text-stone-500">
          {item.file.name}
        </p>
        <ControlledInput
          label="Titel"
          value={item.title}
          onChange={(value) => onUpdate("title", value)}
          placeholder="Ex. Bröllopsbukett i ljusa toner"
        />
        <ControlledInput
          label="Pris"
          value={item.price}
          onChange={(value) => onUpdate("price", value)}
          placeholder="Ex. 1 250 kr"
        />
        <SmallTextarea
          label="Beskrivning"
          value={item.description}
          onChange={(value) => onUpdate("description", value)}
          placeholder="Beskriv material, stil, säsong och passande tillfälle."
        />
        <ControlledInput
          label="Hashtags"
          value={item.hashtags}
          onChange={(value) => onUpdate("hashtags", value)}
          placeholder="#Bukett #Bröllop #Sommarblommor"
        />
      </div>
    </div>
  );
}

function SingleImagePicker({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: UploadedImage | null;
  onChange: (image: UploadedImage | null) => void;
}) {
  function addFile(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (value) URL.revokeObjectURL(value.previewUrl);
    onChange({
      id: `${file.name}-${file.size}-${Date.now()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    });
  }

  return (
    <div
      tabIndex={0}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        addFile(event.dataTransfer.files);
      }}
      onPaste={(event) => {
        event.preventDefault();
        event.stopPropagation();
        addFile(event.clipboardData.files);
      }}
      className="rounded-3xl border-2 border-dashed border-stone-300 bg-white p-5 transition hover:border-stone-500 focus:border-stone-700 focus:outline-none"
    >
      <h3 className="text-sm font-semibold">{label}</h3>
      <p className="mt-1 text-sm text-stone-500">{description}</p>
      <p className="mt-2 text-xs text-stone-400">
        Tips: klicka i rutan och klistra in bild med Cmd+V / Ctrl+V.
      </p>
      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl bg-stone-50 px-4 py-6 text-center text-sm text-stone-600 transition hover:bg-stone-100">
        <UploadCloud size={28} /> Klicka, dra in eller klistra in bild här
        <input
          type="file"
          accept="image/*"
          onChange={(event) => addFile(event.target.files)}
          className="hidden"
        />
      </label>
      {value && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
          <img
            src={value.previewUrl}
            alt={value.file.name}
            className="h-36 w-full object-cover"
          />
          <div className="flex items-center justify-between gap-2 p-3">
            <p className="truncate text-xs font-medium text-stone-700">
              {value.file.name}
            </p>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="rounded-xl px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Ta bort
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function GeneralPortfolioEditor({
  items,
  onChange,
}: {
  items: PortfolioDraftItem[];
  onChange: (items: PortfolioDraftItem[]) => void;
}) {
  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const nextItems = Array.from(fileList)
      .filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("video/"),
      )
      .map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        title: "",
        price: "",
        description: "",
        hashtags: "",
        isSaved: false,
      }));
    onChange([...items, ...nextItems]);
  }

  function updateItem(
    id: string,
    field: keyof PortfolioDraftItem,
    value: string | boolean,
  ) {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  }

  function removeItem(id: string) {
    const found = items.find((item) => item.id === id);
    if (found) URL.revokeObjectURL(found.previewUrl);
    onChange(items.filter((item) => item.id !== id));
  }

  return (
    <div
      tabIndex={0}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        addFiles(event.dataTransfer.files);
      }}
      onPaste={(event) => {
        event.preventDefault();
        event.stopPropagation();
        addFiles(event.clipboardData.files);
      }}
      className="md:col-span-2 rounded-3xl border-2 border-dashed border-stone-300 bg-white p-5 transition hover:border-stone-500 focus:border-stone-700 focus:outline-none"
    >
      <h3 className="text-sm font-semibold">Allmän portfolio</h3>
      <p className="mt-1 text-sm text-stone-500">
        Frivilliga bilder med titel, beskrivning, pris och hashtags.
      </p>
      <p className="mt-2 text-xs text-stone-400">
        Tips: klicka i rutan och klistra in bild med Cmd+V / Ctrl+V.
      </p>
      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl bg-stone-50 px-4 py-8 text-center text-sm text-stone-600 transition hover:bg-stone-100">
        <UploadCloud size={32} /> Klicka, dra in eller klistra in flera
        bilder/videos
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(event) => addFiles(event.target.files)}
          className="hidden"
        />
      </label>
      {items.length > 0 && (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <PortfolioEditCard
              key={item.id}
              item={item}
              onUpdate={(field, value) => updateItem(item.id, field, value)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-3xl border-none bg-white/90 p-6 shadow-sm backdrop-blur md:p-8">
      {children}
    </section>
  );
}

function Button({
  children,
  onClick,
  type = "button",
  variant = "default",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "outline";
}) {
  const className =
    variant === "outline"
      ? "inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white px-6 text-sm font-medium text-stone-900 transition hover:bg-stone-50"
      : "inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 text-sm font-medium text-white transition hover:bg-stone-800";
  return (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-white">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">{description}</p>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  placeholder,
  icon,
  type = "text",
  inputMode,
  required = false,
  value,
  readOnly = false,
}: {
  name?: string;
  label: string;
  placeholder: string;
  icon?: ReactNode;
  type?: "text" | "email" | "tel" | "password";
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "email" | "url";
  required?: boolean;
  value?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <div className="relative">
        {icon ? (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
            {icon}
          </div>
        ) : null}
        <input
          name={name}
          required={required}
          type={type}
          inputMode={inputMode}
          placeholder={placeholder}
          defaultValue={value}
          readOnly={readOnly}
          className={`h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition placeholder:text-stone-400 focus:border-stone-500 ${icon ? "pl-12" : ""} ${readOnly ? "bg-stone-100 text-stone-500" : ""}`}
        />
      </div>
    </label>
  );
}

function UrlField({
  name,
  label,
  placeholder,
  icon,
  required = false,
}: {
  name?: string;
  label: string;
  placeholder: string;
  icon?: ReactNode;
  required?: boolean;
}) {
  const [value, setValue] = useState("");
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <div className="relative">
        {icon ? (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
            {icon}
          </div>
        ) : null}
        <input
          name={name}
          required={required}
          type="text"
          inputMode="url"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onBlur={() => setValue((current) => normalizeUrl(current))}
          placeholder={placeholder}
          className={`h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition placeholder:text-stone-400 focus:border-stone-500 ${icon ? "pl-12" : ""}`}
        />
      </div>
      <p className="mt-2 text-xs text-stone-500">
        Skriv t.ex. makalosablommor.se — vi lägger till https:// automatiskt.
      </p>
    </label>
  );
}

function ControlledInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition placeholder:text-stone-400 focus:border-stone-500"
      />
    </label>
  );
}

function SmallTextarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition placeholder:text-stone-400 focus:border-stone-500"
      />
    </label>
  );
}

function Textarea({
  name,
  label,
  placeholder,
  required = false,
}: {
  name?: string;
  label: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div className="mt-8">
      <label className="mb-3 block text-sm font-semibold">{label}</label>
      <textarea
        name={name}
        required={required}
        rows={5}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-stone-500"
      />
    </div>
  );
}

function SelectField({
  name,
  label,
  options,
  required = false,
}: {
  name?: string;
  label: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <select
        name={name}
        required={required}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition focus:border-stone-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ControlledSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition focus:border-stone-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function PillButton({
  children,
  active,
  onClick,
  variant = "default",
}: {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
  variant?: "default" | "pink";
}) {
  const activeClass =
    variant === "pink"
      ? "border-pink-700 bg-pink-700 text-white"
      : "border-stone-900 bg-stone-900 text-white";
  const inactiveClass =
    variant === "pink"
      ? "border-stone-200 bg-white text-stone-700 hover:border-pink-300"
      : "border-stone-200 bg-white text-stone-700 hover:border-stone-400";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${active ? activeClass : inactiveClass}`}
    >
      {children}
    </button>
  );
}

function StatusItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={done ? "text-emerald-600" : "text-stone-300"}>
        <Check size={16} />
      </span>
      <span className={done ? "text-stone-800" : "text-stone-400"}>
        {label}
      </span>
    </div>
  );
}
