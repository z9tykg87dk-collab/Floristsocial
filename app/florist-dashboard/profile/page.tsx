"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Check,
  CircleAlert,
  Clock,
  ExternalLink,
  Flower2,
  Globe2,
  ImagePlus,
  Leaf,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  UploadCloud,
  UserRound,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";

type OpeningHour = {
  id: number;
  dayLabel: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  note: string;
};

type DeliveryArea = {
  id: number;
  city: string;
  area: string;
  postalCode: string;
  radius: number;
  price: string;
};

type FloristProfile = {
  id: string;
  name: string;

  shopName: string;
  floristName: string;
  bio: string;
  description: string;
  phone: string;
  publicEmail: string;
  website: string;
  instagram: string;

  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  municipality: string;
  county: string;
  country: string;
  deliveryRadiusKm: number | null;
  deliveryModel: string;
  deliveryAreas: DeliveryArea[];

  services: string[];
  styles: string[];
  priceLevel: string;
  minimumBookingValue: string;
  yearsInBusiness: string;
  teamSize: string;
  openingHours: OpeningHour[];

  profileImageUrl: string;
  logoUrl: string;
  coverImageUrl: string;

  specialties: string[];
  qualityBadges: string[];
  sustainabilityOptions: string[];
  sustainabilityText: string;
};

type ProfileResponse = {
  florist?: FloristProfile;
  error?: string;
  details?: string;
};

type FormState = {
  shopName: string;
  floristName: string;
  bio: string;
  description: string;
  phone: string;
  publicEmail: string;
  website: string;
  instagram: string;

  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  municipality: string;
  county: string;
  country: string;
  deliveryRadiusKm: string;
  deliveryModel: string;
  deliveryAreas: DeliveryArea[];

  services: string[];
  styles: string[];
  priceLevel: string;
  minimumBookingValue: string;
  yearsInBusiness: string;
  teamSize: string;
  openingHours: OpeningHour[];

  profileImageUrl: string;
  logoUrl: string;
  coverImageUrl: string;

  specialties: string[];
  qualityBadges: string[];
  sustainabilityOptions: string[];
  sustainabilityText: string;
};

const SERVICE_OPTIONS = [
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

const STYLE_OPTIONS = [
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

const DELIVERY_MODEL_OPTIONS = [
  "Lokal leverans",
  "Regional leverans",
  "Nationella uppdrag",
  "Endast upphämtning",
  "Ingen leverans",
];

const PRICE_LEVEL_OPTIONS = [
  "Budget",
  "Mellan",
  "Premium",
  "Lyx",
  "Varierar per uppdrag",
];

const DEFAULT_OPENING_HOURS: OpeningHour[] = [
  { id: 1, dayLabel: "Måndag", openTime: "10:00", closeTime: "18:00", isClosed: false, note: "" },
  { id: 2, dayLabel: "Tisdag", openTime: "10:00", closeTime: "18:00", isClosed: false, note: "" },
  { id: 3, dayLabel: "Onsdag", openTime: "10:00", closeTime: "18:00", isClosed: false, note: "" },
  { id: 4, dayLabel: "Torsdag", openTime: "10:00", closeTime: "18:00", isClosed: false, note: "" },
  { id: 5, dayLabel: "Fredag", openTime: "10:00", closeTime: "18:00", isClosed: false, note: "" },
  { id: 6, dayLabel: "Lördag", openTime: "10:00", closeTime: "16:00", isClosed: false, note: "" },
  { id: 7, dayLabel: "Söndag", openTime: "11:00", closeTime: "15:00", isClosed: false, note: "" },
];

const SPECIALTY_OPTIONS = [
  "Bröllopsspecialist",
  "Eventspecialist",
  "Prisbelönad florist",
];

const QUALITY_OPTIONS = [
  "Utbildad florist",
  "Miljöcertifierad",
  "Delvis närodlade snittblommor och växter",
  "Välsorterade blommor",
  "Hundvänlig lokal",
];

const SUSTAINABILITY_OPTIONS = [
  "Minskat blomstersvinn",
  "Plastfri paketering",
  "Återvinningsbara förpackningar",
  "Elbil",
  "Hybridbil",
  "Cykelleverans",
  "Fossilfria transporter",
  "Miljövänlig elinköp",
];

const EMPTY_FORM: FormState = {
  shopName: "",
  floristName: "",
  bio: "",
  description: "",
  phone: "",
  publicEmail: "",
  website: "",
  instagram: "",

  addressLine1: "",
  addressLine2: "",
  postalCode: "",
  city: "",
  municipality: "",
  county: "",
  country: "Sverige",
  deliveryRadiusKm: "",
  deliveryModel: "",
  deliveryAreas: [],

  services: [],
  styles: [],
  priceLevel: "",
  minimumBookingValue: "",
  yearsInBusiness: "",
  teamSize: "",
  openingHours: DEFAULT_OPENING_HOURS,

  profileImageUrl: "",
  logoUrl: "",
  coverImageUrl: "",

  specialties: [],
  qualityBadges: [],
  sustainabilityOptions: [],
  sustainabilityText: "",
};

function profileToForm(profile: FloristProfile): FormState {
  return {
    shopName: profile.shopName || "",
    floristName: profile.floristName || "",
    bio: profile.bio || "",
    description: profile.description || "",
    phone: profile.phone || "",
    publicEmail: profile.publicEmail || "",
    website: profile.website || "",
    instagram: profile.instagram || "",

    addressLine1: profile.addressLine1 || "",
    addressLine2: profile.addressLine2 || "",
    postalCode: profile.postalCode || "",
    city: profile.city || "",
    municipality: profile.municipality || "",
    county: profile.county || "",
    country: profile.country || "Sverige",
    deliveryRadiusKm:
      profile.deliveryRadiusKm === null
        ? ""
        : String(profile.deliveryRadiusKm),
    deliveryModel: profile.deliveryModel || "",
    deliveryAreas: profile.deliveryAreas || [],

    services: profile.services || [],
    styles: profile.styles || [],
    priceLevel: profile.priceLevel || "",
    minimumBookingValue: profile.minimumBookingValue || "",
    yearsInBusiness: profile.yearsInBusiness || "",
    teamSize: profile.teamSize || "",
    openingHours:
      profile.openingHours && profile.openingHours.length > 0
        ? profile.openingHours
        : DEFAULT_OPENING_HOURS,

    profileImageUrl: profile.profileImageUrl || "",
    logoUrl: profile.logoUrl || "",
    coverImageUrl: profile.coverImageUrl || "",

    specialties: profile.specialties || [],
    qualityBadges: profile.qualityBadges || [],
    sustainabilityOptions: profile.sustainabilityOptions || [],
    sustainabilityText: profile.sustainabilityText || "",
  };
}

function toggleArrayValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export default function FloristProfileEditorPage() {
  const [profile, setProfile] = useState<FloristProfile | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const response = await fetch("/api/florists/me/profile", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = (await response.json()) as ProfileResponse;

      if (!response.ok || !data.florist) {
        throw new Error(
          data.details
            ? `${data.error || "Profilen kunde inte hämtas."} ${data.details}`
            : data.error || "Profilen kunde inte hämtas.",
        );
      }

      setProfile(data.florist);
      setForm(profileToForm(data.florist));
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Profilen kunde inte hämtas.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const selectedCount = useMemo(
    () =>
      form.specialties.length +
      form.qualityBadges.length +
      form.sustainabilityOptions.length,
    [
      form.specialties.length,
      form.qualityBadges.length,
      form.sustainabilityOptions.length,
    ],
  );

  const setField = <Key extends keyof FormState>(
    key: Key,
    value: FormState[Key],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setSaveError("");
    setSuccessMessage("");
  };

  function updateOpeningHour(
    id: number,
    field: keyof OpeningHour,
    value: string | boolean,
  ) {
    setForm((current) => ({
      ...current,
      openingHours: current.openingHours.map((row) =>
        row.id === id ? { ...row, [field]: value } : row,
      ),
    }));

    setSaveError("");
    setSuccessMessage("");
  }

  function updateDeliveryArea(
    id: number,
    field: keyof DeliveryArea,
    value: string | number,
  ) {
    setForm((current) => ({
      ...current,
      deliveryAreas: current.deliveryAreas.map((area) => {
        if (area.id !== id) return area;

        if (field === "city") {
          return {
            ...area,
            city: String(value),
            area: "Annat område",
          };
        }

        return {
          ...area,
          [field]: value,
        };
      }),
    }));

    setSaveError("");
    setSuccessMessage("");
  }

  function addDeliveryArea() {
    setForm((current) => ({
      ...current,
      deliveryAreas: [
        ...current.deliveryAreas,
        {
          id: Date.now(),
          city: current.city || "Stockholm",
          area: "Annat område",
          postalCode: "",
          radius: Number(current.deliveryRadiusKm) || 15,
          price: "",
        },
      ],
    }));

    setSaveError("");
    setSuccessMessage("");
  }

  function removeDeliveryArea(id: number) {
    setForm((current) => ({
      ...current,
      deliveryAreas: current.deliveryAreas.filter((area) => area.id !== id),
    }));

    setSaveError("");
    setSuccessMessage("");
  }

  async function uploadMedia() {
    setSaveError("");
    setSuccessMessage("");

    const selectedFiles: Array<{
      field: "profileImage" | "logo" | "coverImage";
      file: File;
    }> = [];

    if (profileImageFile) {
      selectedFiles.push({
        field: "profileImage",
        file: profileImageFile,
      });
    }

    if (logoFile) {
      selectedFiles.push({
        field: "logo",
        file: logoFile,
      });
    }

    if (coverImageFile) {
      selectedFiles.push({
        field: "coverImage",
        file: coverImageFile,
      });
    }

    if (selectedFiles.length === 0) {
      setSaveError("Välj minst en bild att ladda upp.");
      return;
    }

    setUploadingMedia(true);

    try {
      let nextMedia = {
        profileImageUrl: form.profileImageUrl,
        logoUrl: form.logoUrl,
        coverImageUrl: form.coverImageUrl,
      };

      /*
       * Varje bild skickas i en egen request.
       * Därmed kan profilbild, logotyp och omslagsbild
       * aldrig råka följa med under samma FormData-nyckel.
       */
      for (const selected of selectedFiles) {
        const mediaFormData = new FormData();
        mediaFormData.append(selected.field, selected.file);

        const response = await fetch(
          "/api/florists/me/profile/media",
          {
            method: "POST",
            credentials: "include",
            body: mediaFormData,
          },
        );

        const data = (await response.json()) as {
          success?: boolean;
          error?: string;
          details?: string;
          media?: {
            profileImageUrl?: string;
            logoUrl?: string;
            coverImageUrl?: string;
          };
        };

        if (!response.ok || !data.success || !data.media) {
          throw new Error(
            data.details
              ? `${data.error || "Bilden kunde inte laddas upp."} ${data.details}`
              : data.error || "Bilden kunde inte laddas upp.",
          );
        }

        nextMedia = {
          profileImageUrl:
            data.media.profileImageUrl ||
            nextMedia.profileImageUrl,
          logoUrl:
            data.media.logoUrl ||
            nextMedia.logoUrl,
          coverImageUrl:
            data.media.coverImageUrl ||
            nextMedia.coverImageUrl,
        };
      }

      setForm((current) => ({
        ...current,
        ...nextMedia,
      }));

      setProfile((current) =>
        current
          ? {
              ...current,
              ...nextMedia,
            }
          : current,
      );

      setProfileImageFile(null);
      setLogoFile(null);
      setCoverImageFile(null);

      setSuccessMessage(
        "Bilderna är uppladdade och sparade på rätt platser.",
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Bilderna kunde inte laddas upp.",
      );
    } finally {
      setUploadingMedia(false);
    }
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaveError("");
    setSuccessMessage("");

    if (!form.shopName.trim()) {
      setSaveError("Butiksnamn måste anges.");
      document.getElementById("shopName")?.focus();
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/florists/me/profile", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shop_name: form.shopName,
          florist_name: form.floristName,
          bio: form.bio,
          description: form.description,
          phone: form.phone,
          public_email: form.publicEmail,
          website: form.website,
          instagram: form.instagram,

          address_line_1: form.addressLine1,
          address_line_2: form.addressLine2,
          postal_code: form.postalCode,
          city: form.city,
          municipality: form.municipality,
          county: form.county,
          country: form.country,
          delivery_radius_km: form.deliveryRadiusKm,
          delivery_model: form.deliveryModel,
          delivery_areas: form.deliveryAreas,

          services: form.services,
          styles: form.styles,
          price_level: form.priceLevel,
          minimum_booking_value: form.minimumBookingValue,
          years_in_business: form.yearsInBusiness,
          team_size: form.teamSize,
          opening_hours: form.openingHours,

          specialties: form.specialties,
          quality_badges: form.qualityBadges,
          sustainability_options: form.sustainabilityOptions,
          sustainability_text: form.sustainabilityText,
        }),
      });

      const data = (await response.json()) as ProfileResponse;

      if (!response.ok || !data.florist) {
        throw new Error(
          data.details
            ? `${data.error || "Profilen kunde inte sparas."} ${data.details}`
            : data.error || "Profilen kunde inte sparas.",
        );
      }

      setProfile(data.florist);
      setForm(profileToForm(data.florist));
      setSuccessMessage("Profiluppgifterna är sparade.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Profilen kunde inte sparas.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f2ea] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/dashboard"
            className="inline-flex w-fit items-center gap-2 text-sm font-black text-slate-700 transition hover:text-pink-700"
          >
            <ArrowLeft size={18} />
            Tillbaka till dashboard
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {profile?.id ? (
              <Link
                href={`/public/florist/${profile.id}`}
                target="_blank"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-800 transition hover:border-pink-300 hover:text-pink-700"
              >
                Visa publik profil
                <ExternalLink size={17} />
              </Link>
            ) : null}

            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-slate-800"
            >
              Dashboard
            </Link>
          </div>
        </header>

        <section className="overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-xl shadow-slate-200/70">
          <div className="bg-gradient-to-br from-pink-50 via-white to-emerald-50 px-6 py-8 sm:px-10 sm:py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-pink-700 shadow-sm">
              <Sparkles size={15} />
              Redigera floristprofil
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">
                  Hantera floristens publika uppgifter
                </h1>

                <p className="mt-4 max-w-4xl text-base font-semibold leading-7 text-slate-600">
                  Uppgifterna på denna sida kan ändras av den inloggade
                  floristen. Juridiska företagsuppgifter, verifiering, Stripe
                  och administrativa inställningar hanteras separat.
                </p>
              </div>

              <div className="rounded-2xl border border-white bg-white/80 px-5 py-4 shadow-sm">
                <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Valda profilmarkeringar
                </div>
                <div className="mt-1 text-3xl font-black text-pink-700">
                  {selectedCount}
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid min-h-[420px] place-items-center px-6 py-16">
              <div className="text-center">
                <LoaderCircle
                  size={38}
                  className="mx-auto animate-spin text-pink-600"
                />
                <p className="mt-4 text-sm font-black text-slate-600">
                  Hämtar floristprofilen...
                </p>
              </div>
            </div>
          ) : loadError ? (
            <div className="px-6 py-12 sm:px-10">
              <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
                <div className="flex items-start gap-3">
                  <CircleAlert
                    size={22}
                    className="mt-0.5 shrink-0 text-red-600"
                  />
                  <div>
                    <h2 className="font-black text-red-950">
                      Profilen kunde inte laddas
                    </h2>
                    <p className="mt-2 text-sm font-semibold leading-6 text-red-800">
                      {loadError}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => void loadProfile()}
                        className="rounded-xl bg-red-700 px-4 py-2 text-sm font-black text-white"
                      >
                        Försök igen
                      </button>

                      <Link
                        href="/auth/sign-in?next=/florist-dashboard/profile"
                        className="rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-black text-red-800"
                      >
                        Logga in
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={saveProfile}>
              <div className="grid gap-8 px-6 py-8 sm:px-10 sm:py-10">
                {successMessage ? (
                  <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-950">
                    <ShieldCheck
                      size={22}
                      className="mt-0.5 shrink-0 text-emerald-700"
                    />
                    <div>
                      <div className="font-black">{successMessage}</div>
                      <div className="mt-1 text-sm font-semibold text-emerald-800">
                        Den publika floristprofilen använder de sparade
                        uppgifterna.
                      </div>
                    </div>
                  </div>
                ) : null}

                {saveError ? (
                  <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-950">
                    <CircleAlert
                      size={22}
                      className="mt-0.5 shrink-0 text-red-700"
                    />
                    <div>
                      <div className="font-black">
                        Ändringarna kunde inte sparas
                      </div>
                      <div className="mt-1 text-sm font-semibold text-red-800">
                        {saveError}
                      </div>
                    </div>
                  </div>
                ) : null}

                <ProfileSection
                  icon={<Store size={22} />}
                  title="1. Grunduppgifter"
                  description="Butiksnamn och floristnamn som visas utåt."
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <TextField
                      id="shopName"
                      label="Butiksnamn"
                      value={form.shopName}
                      required
                      maxLength={200}
                      placeholder="Exempel: Makalösa Blommor"
                      onChange={(value) => setField("shopName", value)}
                    />

                    <TextField
                      id="floristName"
                      label="Floristnamn eller visningsnamn"
                      value={form.floristName}
                      maxLength={200}
                      placeholder="Namn som visas på profilen"
                      onChange={(value) => setField("floristName", value)}
                    />
                  </div>
                </ProfileSection>

                <ProfileSection
                  icon={<UserRound size={22} />}
                  title="2. Presentation"
                  description="Beskriv verksamheten och vad kunderna kan förvänta sig."
                >
                  <div className="grid gap-5">
                    <TextAreaField
                      id="bio"
                      label="Kort presentation"
                      value={form.bio}
                      maxLength={2000}
                      rows={5}
                      placeholder="En kort presentation av butiken och floristerna..."
                      onChange={(value) => setField("bio", value)}
                    />

                    <TextAreaField
                      id="description"
                      label="Utförlig beskrivning"
                      value={form.description}
                      maxLength={4000}
                      rows={8}
                      placeholder="Beskriv sortiment, arbetssätt, erfarenhet och vad som gör verksamheten unik..."
                      onChange={(value) => setField("description", value)}
                    />
                  </div>
                </ProfileSection>

                <ProfileSection
                  icon={<Mail size={22} />}
                  title="3. Kontakt och digitala kanaler"
                  description="Kontaktuppgifter som får visas på floristens profil."
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <TextField
                      id="phone"
                      label="Telefon"
                      value={form.phone}
                      maxLength={100}
                      placeholder="+46 8 123 45 67"
                      icon={<Phone size={18} />}
                      onChange={(value) => setField("phone", value)}
                    />

                    <TextField
                      id="publicEmail"
                      label="Publik e-postadress"
                      type="email"
                      value={form.publicEmail}
                      maxLength={320}
                      placeholder="kontakt@blommor.se"
                      icon={<Mail size={18} />}
                      onChange={(value) => setField("publicEmail", value)}
                    />

                    <TextField
                      id="website"
                      label="Webbplats"
                      value={form.website}
                      maxLength={1000}
                      placeholder="https://exempel.se"
                      icon={<Globe2 size={18} />}
                      onChange={(value) => setField("website", value)}
                    />

                    <TextField
                      id="instagram"
                      label="Instagram"
                      value={form.instagram}
                      maxLength={300}
                      placeholder="@butiksnamn eller profillänk"
                      icon={<Sparkles size={18} />}
                      onChange={(value) => setField("instagram", value)}
                    />
                  </div>
                </ProfileSection>

                <ProfileSection
                  icon={<MapPin size={22} />}
                  title="4. Adress och leveransområde"
                  description="Butikens publika adress och normala leveransradie."
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <TextField
                        id="addressLine1"
                        label="Gatuadress och nummer"
                        value={form.addressLine1}
                        maxLength={300}
                        placeholder="Sveavägen 102"
                        onChange={(value) =>
                          setField("addressLine1", value)
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <TextField
                        id="addressLine2"
                        label="Adressrad 2"
                        value={form.addressLine2}
                        maxLength={300}
                        placeholder="Våning, lokal eller annan adressinformation"
                        onChange={(value) =>
                          setField("addressLine2", value)
                        }
                      />
                    </div>

                    <TextField
                      id="postalCode"
                      label="Postnummer"
                      value={form.postalCode}
                      maxLength={30}
                      placeholder="113 50"
                      onChange={(value) => setField("postalCode", value)}
                    />

                    <TextField
                      id="city"
                      label="Stad"
                      value={form.city}
                      maxLength={150}
                      placeholder="Stockholm"
                      onChange={(value) => setField("city", value)}
                    />

                    <TextField
                      id="municipality"
                      label="Kommun"
                      value={form.municipality}
                      maxLength={150}
                      placeholder="Stockholms kommun"
                      onChange={(value) => setField("municipality", value)}
                    />

                    <TextField
                      id="county"
                      label="Län eller region"
                      value={form.county}
                      maxLength={150}
                      placeholder="Stockholms län"
                      onChange={(value) => setField("county", value)}
                    />

                    <TextField
                      id="country"
                      label="Land"
                      value={form.country}
                      maxLength={150}
                      placeholder="Sverige"
                      onChange={(value) => setField("country", value)}
                    />

                    <TextField
                      id="deliveryRadiusKm"
                      label="Normal leveransradie i kilometer"
                      type="number"
                      value={form.deliveryRadiusKm}
                      min="0"
                      max="500"
                      step="0.5"
                      placeholder="10"
                      onChange={(value) =>
                        setField("deliveryRadiusKm", value)
                      }
                    />
                  </div>
                </ProfileSection>

                <ProfileSection
                  icon={<Clock size={22} />}
                  title="5. Veckoöppettider"
                  description="Ordinarie öppettider för måndag till söndag."
                >
                  <OpeningHoursFields
                    openingHours={form.openingHours}
                    onChange={updateOpeningHour}
                  />
                </ProfileSection>

                <ProfileSection
                  icon={<Truck size={22} />}
                  title="6. Leveransradie och täckningsområden"
                  description="Ange leveransmodell och särskilda områden med radie och pris."
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <SelectField
                      id="deliveryModel"
                      label="Leveransmodell"
                      value={form.deliveryModel}
                      options={DELIVERY_MODEL_OPTIONS}
                      placeholder="Välj leveransmodell"
                      onChange={(value) => setField("deliveryModel", value)}
                    />

                    <TextField
                      id="deliveryRadiusKm"
                      label="Standardradie i kilometer"
                      type="number"
                      value={form.deliveryRadiusKm}
                      min="0"
                      max="500"
                      step="0.5"
                      placeholder="15"
                      onChange={(value) =>
                        setField("deliveryRadiusKm", value)
                      }
                    />
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="font-black text-slate-950">
                        Särskilda leveransområden
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-slate-600">
                        Lägg till stad, område, postnummer, pris och radie.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addDeliveryArea}
                      className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                    >
                      Lägg till område
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4">
                    {form.deliveryAreas.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-semibold text-slate-600">
                        Inga särskilda leveransområden har lagts till.
                      </div>
                    ) : (
                      form.deliveryAreas.map((area, index) => (
                        <div
                          key={area.id}
                          className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                        >
                          <div className="mb-4 flex items-center justify-between gap-4">
                            <h3 className="font-black text-slate-950">
                              Leveransområde {index + 1}
                            </h3>

                            <button
                              type="button"
                              onClick={() => removeDeliveryArea(area.id)}
                              className="rounded-xl px-3 py-2 text-sm font-black text-red-700 hover:bg-red-50"
                            >
                              Ta bort
                            </button>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                            <TextField
                              id={`deliveryCity-${area.id}`}
                              label="Stad"
                              value={area.city}
                              placeholder="Stockholm"
                              onChange={(value) =>
                                updateDeliveryArea(area.id, "city", value)
                              }
                            />

                            <TextField
                              id={`deliveryArea-${area.id}`}
                              label="Område"
                              value={area.area}
                              placeholder="Annat område"
                              onChange={(value) =>
                                updateDeliveryArea(area.id, "area", value)
                              }
                            />

                            <TextField
                              id={`deliveryPostalCode-${area.id}`}
                              label="Postnummer"
                              value={area.postalCode}
                              placeholder="113 50"
                              onChange={(value) =>
                                updateDeliveryArea(
                                  area.id,
                                  "postalCode",
                                  value,
                                )
                              }
                            />

                            <TextField
                              id={`deliveryPrice-${area.id}`}
                              label="Pris kr"
                              value={area.price}
                              placeholder="99"
                              onChange={(value) =>
                                updateDeliveryArea(area.id, "price", value)
                              }
                            />

                            <TextField
                              id={`deliveryRadius-${area.id}`}
                              label="Radie km"
                              type="number"
                              value={String(area.radius)}
                              min="1"
                              max="150"
                              step="1"
                              onChange={(value) =>
                                updateDeliveryArea(
                                  area.id,
                                  "radius",
                                  Number(value) || 1,
                                )
                              }
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ProfileSection>

                <ChoiceSection
                  icon={<Flower2 size={22} />}
                  title="7. Tjänster och verksamhetsprofil"
                  description="Välj tjänster och ange verksamhetens omfattning."
                  options={SERVICE_OPTIONS}
                  selected={form.services}
                  palette="pink"
                  onToggle={(option) =>
                    setField(
                      "services",
                      toggleArrayValue(form.services, option),
                    )
                  }
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <SelectField
                      id="priceLevel"
                      label="Prisnivå"
                      value={form.priceLevel}
                      options={PRICE_LEVEL_OPTIONS}
                      placeholder="Välj prisnivå"
                      onChange={(value) => setField("priceLevel", value)}
                    />

                    <TextField
                      id="minimumBookingValue"
                      label="Minsta bokningsvärde"
                      value={form.minimumBookingValue}
                      placeholder="Exempel: 8 000 kr"
                      onChange={(value) =>
                        setField("minimumBookingValue", value)
                      }
                    />

                    <TextField
                      id="yearsInBusiness"
                      label="Antal år i branschen"
                      value={form.yearsInBusiness}
                      placeholder="Exempel: 8 år"
                      onChange={(value) =>
                        setField("yearsInBusiness", value)
                      }
                    />

                    <TextField
                      id="teamSize"
                      label="Antal florister i teamet"
                      value={form.teamSize}
                      placeholder="Exempel: 3"
                      onChange={(value) => setField("teamSize", value)}
                    />
                  </div>
                </ChoiceSection>

                <ChoiceSection
                  icon={<Sparkles size={22} />}
                  title="8. Stil och synlighet"
                  description="Välj de stilar som bäst beskriver floristens uttryck."
                  options={STYLE_OPTIONS}
                  selected={form.styles}
                  palette="amber"
                  onToggle={(option) =>
                    setField(
                      "styles",
                      toggleArrayValue(form.styles, option),
                    )
                  }
                />

                <ChoiceSection
                  icon={<Sparkles size={22} />}
                  title="9. Specialiteter"
                  description="Välj det som tydligt beskriver floristens inriktning."
                  options={SPECIALTY_OPTIONS}
                  selected={form.specialties}
                  palette="pink"
                  onToggle={(option) =>
                    setField(
                      "specialties",
                      toggleArrayValue(form.specialties, option),
                    )
                  }
                />

                <ChoiceSection
                  icon={<ShieldCheck size={22} />}
                  title="10. Kvalitet och styrkor"
                  description="Uppgifterna visas som angivna av floristen."
                  options={QUALITY_OPTIONS}
                  selected={form.qualityBadges}
                  palette="amber"
                  onToggle={(option) =>
                    setField(
                      "qualityBadges",
                      toggleArrayValue(form.qualityBadges, option),
                    )
                  }
                />

                <ChoiceSection
                  icon={<Leaf size={22} />}
                  title="11. Hållbarhet"
                  description="Välj de alternativ som verksamheten faktiskt arbetar med."
                  options={SUSTAINABILITY_OPTIONS}
                  selected={form.sustainabilityOptions}
                  palette="emerald"
                  onToggle={(option) =>
                    setField(
                      "sustainabilityOptions",
                      toggleArrayValue(
                        form.sustainabilityOptions,
                        option,
                      ),
                    )
                  }
                >
                  <TextAreaField
                    id="sustainabilityText"
                    label="Beskriv hållbarhetsarbetet"
                    value={form.sustainabilityText}
                    maxLength={2000}
                    rows={6}
                    placeholder="Beskriv konkreta arbetssätt, material, leveranser eller andra hållbarhetsåtgärder..."
                    onChange={(value) =>
                      setField("sustainabilityText", value)
                    }
                  />
                </ChoiceSection>

                <ProfileSection
                  icon={<ImagePlus size={22} />}
                  title="12. Bilder, logotyp & omslagsbild"
                  description="Ladda upp bilder som används på floristprofilen, kartan och i andra delar av FloristSocial."
                >
                  <div className="grid gap-5 lg:grid-cols-3">
                    <MediaPicker
                      id="profileImage"
                      label="Profilbild"
                      description="Visas som floristens eller butikens profilbild."
                      existingUrl={form.profileImageUrl}
                      file={profileImageFile}
                      aspect="square"
                      onChange={setProfileImageFile}
                    />

                    <MediaPicker
                      id="logo"
                      label="Logotyp"
                      description="Används som varumärke och kan visas som kartmarkör."
                      existingUrl={form.logoUrl}
                      file={logoFile}
                      aspect="square"
                      onChange={setLogoFile}
                    />

                    <MediaPicker
                      id="coverImage"
                      label="Omslagsbild"
                      description="Stor bild som visas överst på floristprofilen."
                      existingUrl={form.coverImageUrl}
                      file={coverImageFile}
                      aspect="wide"
                      onChange={setCoverImageFile}
                    />
                  </div>

                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-black text-slate-950">
                          Spara valda bilder
                        </h3>
                        <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                          Bilder sparas separat från övriga profiluppgifter.
                          Tillåtna format är JPG, PNG, WebP, GIF och AVIF.
                          Högsta filstorlek är 10 MB per bild.
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={
                          uploadingMedia ||
                          (!profileImageFile && !logoFile && !coverImageFile)
                        }
                        onClick={() => void uploadMedia()}
                        className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-pink-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {uploadingMedia ? (
                          <>
                            <LoaderCircle size={19} className="animate-spin" />
                            Laddar upp...
                          </>
                        ) : (
                          <>
                            <UploadCloud size={19} />
                            Ladda upp bilder
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </ProfileSection>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <Building2
                      size={22}
                      className="mt-0.5 shrink-0 text-slate-700"
                    />
                    <div>
                      <h2 className="font-black text-slate-950">
                        Skyddade företagsuppgifter
                      </h2>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                        Juridiskt företagsnamn, organisationsnummer,
                        verifieringsnivå, kontoägarskap, Stripe-uppgifter,
                        status och administrativa fält kan inte ändras genom
                        detta formulär.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur sm:px-10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-slate-500">
                    Ändringarna publiceras på floristprofilen efter att de
                    sparats.
                  </p>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-pink-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <LoaderCircle size={19} className="animate-spin" />
                        Sparar...
                      </>
                    ) : (
                      <>
                        <Save size={19} />
                        Spara profiländringar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

function ProfileSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-pink-50 text-pink-700">
          {icon}
        </div>

        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-950">
            {title}
          </h2>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  maxLength,
  min,
  max,
  step,
  placeholder,
  icon,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "number";
  required?: boolean;
  maxLength?: number;
  min?: string;
  max?: string;
  step?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-black text-slate-800">
        {label}
        {required ? <span className="ml-1 text-pink-600">*</span> : null}
      </span>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition focus-within:border-pink-400 focus-within:ring-4 focus-within:ring-pink-100">
        {icon ? (
          <span className="shrink-0 text-slate-400">{icon}</span>
        ) : null}

        <input
          id={id}
          type={type}
          value={value}
          required={required}
          maxLength={maxLength}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-12 w-full bg-transparent py-3 text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
        />
      </div>
    </label>
  );
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-black text-slate-800">
        {label}
      </span>

      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
      >
        <option value="">{placeholder || "Välj alternativ"}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function OpeningHoursFields({
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
    <div className="grid gap-4">
      {openingHours.map((row) => (
        <div
          key={row.id}
          className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[150px_1fr_1fr_1.4fr_auto] md:items-end"
        >
          <div>
            <div className="text-sm font-black text-slate-950">
              {row.dayLabel}
            </div>
          </div>

          <TextField
            id={`opening-${row.id}`}
            label="Öppnar"
            value={row.openTime}
            placeholder="10:00"
            onChange={(value) => onChange(row.id, "openTime", value)}
          />

          <TextField
            id={`closing-${row.id}`}
            label="Stänger"
            value={row.closeTime}
            placeholder="18:00"
            onChange={(value) => onChange(row.id, "closeTime", value)}
          />

          <TextField
            id={`opening-note-${row.id}`}
            label="Notering"
            value={row.note}
            placeholder="Exempel: Lunchstängt 12–13"
            onChange={(value) => onChange(row.id, "note", value)}
          />

          <label className="flex min-h-12 cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-800">
            <input
              type="checkbox"
              checked={row.isClosed}
              onChange={(event) =>
                onChange(row.id, "isClosed", event.target.checked)
              }
              className="h-5 w-5 rounded border-slate-300 text-pink-600"
            />
            Stängt
          </label>
        </div>
      ))}
    </div>
  );
}

function TextAreaField({
  id,
  label,
  value,
  onChange,
  rows,
  maxLength,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  maxLength: number;
  placeholder?: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="text-sm font-black text-slate-800">{label}</span>
        <span className="text-xs font-bold text-slate-400">
          {value.length}/{maxLength}
        </span>
      </div>

      <textarea
        id={id}
        value={value}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
      />
    </label>
  );
}

function MediaPicker({
  id,
  label,
  description,
  existingUrl,
  file,
  aspect,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  existingUrl: string;
  file: File | null;
  aspect: "square" | "wide";
  onChange: (file: File | null) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dragDepth = useRef(0);

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : existingUrl),
    [file, existingUrl],
  );

  useEffect(() => {
    return () => {
      if (file && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file, previewUrl]);

  /*
   * Förhindrar att Safari eller Chrome öppnar en bild
   * över hela sidan när filen släpps utanför dropzonen.
   */
  useEffect(() => {
    function preventBrowserFileOpen(event: DragEvent) {
      if (event.dataTransfer?.types.includes("Files")) {
        event.preventDefault();
      }
    }

    window.addEventListener(
      "dragover",
      preventBrowserFileOpen,
    );

    window.addEventListener(
      "drop",
      preventBrowserFileOpen,
    );

    return () => {
      window.removeEventListener(
        "dragover",
        preventBrowserFileOpen,
      );

      window.removeEventListener(
        "drop",
        preventBrowserFileOpen,
      );
    };
  }, []);

  function validateAndSelect(selectedFile: File | undefined) {
    if (!selectedFile) return;

    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
    ]);

    if (!allowedTypes.has(selectedFile.type)) {
      window.alert(
        "Bilden måste vara JPG, PNG, WebP, GIF eller AVIF.",
      );
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      window.alert("Bilden får vara högst 10 MB.");
      return;
    }

    onChange(selectedFile);
  }

  function handleDragEnter(
    event: React.DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();
    event.stopPropagation();

    dragDepth.current += 1;
    setIsDragging(true);
  }

  function handleDragOver(
    event: React.DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();
    event.stopPropagation();

    event.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  }

  function handleDragLeave(
    event: React.DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();
    event.stopPropagation();

    dragDepth.current = Math.max(
      0,
      dragDepth.current - 1,
    );

    if (dragDepth.current === 0) {
      setIsDragging(false);
    }
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();
    event.stopPropagation();

    dragDepth.current = 0;
    setIsDragging(false);

    validateAndSelect(
      event.dataTransfer.files?.[0],
    );
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-3xl border p-4 transition ${
        isDragging
          ? "border-pink-500 bg-pink-50 ring-4 ring-pink-100"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border bg-white ${
          isDragging
            ? "border-pink-500"
            : "border-slate-200"
        } ${
          aspect === "square"
            ? "aspect-square"
            : "aspect-[16/9]"
        }`}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={`${label} förhandsvisning`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center px-5 text-center">
            <div>
              <ImagePlus
                size={34}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm font-black text-slate-500">
                Ingen bild uppladdad
              </p>
            </div>
          </div>
        )}

        {isDragging ? (
          <div className="absolute inset-0 grid place-items-center bg-pink-600/90 p-5 text-center text-white">
            <div>
              <UploadCloud
                size={42}
                className="mx-auto"
              />

              <p className="mt-3 text-lg font-black">
                Släpp {label.toLowerCase()} här
              </p>

              <p className="mt-1 text-sm font-semibold text-pink-100">
                Filen placeras endast i detta bildfält
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        <div className="font-black text-slate-950">
          {label}
        </div>

        <p className="mt-1 min-h-12 text-sm font-semibold leading-6 text-slate-600">
          {description}
        </p>
      </div>

      <label
        htmlFor={id}
        className="mt-4 flex min-h-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 text-center transition hover:border-pink-400"
      >
        <span className="flex items-center gap-2 text-sm font-black text-slate-800">
          <UploadCloud size={18} />

          {file
            ? "Byt vald bild"
            : existingUrl
              ? "Byt bild"
              : "Välj bild"}
        </span>

        <span className="text-xs font-semibold text-slate-500">
          eller dra och släpp här
        </span>
      </label>

      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="sr-only"
        onChange={(event) => {
          validateAndSelect(
            event.target.files?.[0],
          );

          event.target.value = "";
        }}
      />

      {file ? (
        <div className="mt-3 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-600">
          <div className="truncate">
            {file.name}
          </div>

          <div className="mt-1 text-slate-400">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </div>

          <button
            type="button"
            onClick={() => onChange(null)}
            className="mt-2 font-black text-red-700 hover:text-red-800"
          >
            Ta bort vald fil
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ChoiceSection({
  icon,
  title,
  description,
  options,
  selected,
  palette,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  options: string[];
  selected: string[];
  palette: "pink" | "amber" | "emerald";
  onToggle: (option: string) => void;
  children?: React.ReactNode;
}) {
  const palettes = {
    pink: {
      icon: "bg-pink-50 text-pink-700",
      active: "border-pink-600 bg-pink-600 text-white",
      inactive:
        "border-pink-100 bg-pink-50/60 text-pink-950 hover:border-pink-300",
    },
    amber: {
      icon: "bg-amber-50 text-amber-700",
      active: "border-amber-600 bg-amber-600 text-white",
      inactive:
        "border-amber-100 bg-amber-50/60 text-amber-950 hover:border-amber-300",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-700",
      active: "border-emerald-700 bg-emerald-700 text-white",
      inactive:
        "border-emerald-100 bg-emerald-50/60 text-emerald-950 hover:border-emerald-300",
    },
  } as const;

  const currentPalette = palettes[palette];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex items-start gap-3">
        <div
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${currentPalette.icon}`}
        >
          {icon}
        </div>

        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-950">
            {title}
          </h2>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
            {description}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => {
          const active = selected.includes(option);

          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(option)}
              className={`flex min-h-14 items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left text-sm font-black shadow-sm transition ${
                active
                  ? currentPalette.active
                  : currentPalette.inactive
              }`}
            >
              <span>{option}</span>

              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
                  active
                    ? "border-white/70 bg-white/20 text-white"
                    : "border-slate-300 bg-white text-transparent"
                }`}
              >
                <Check size={15} strokeWidth={3} />
              </span>
            </button>
          );
        })}
      </div>

      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  );
}
