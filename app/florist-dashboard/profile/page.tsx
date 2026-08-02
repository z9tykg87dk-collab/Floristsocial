"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Award,
  Check,
  ExternalLink,
  Flower2,
  Leaf,
  Loader2,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type FloristMarketingProfile = {
  id: string;
  name: string;
  specialties: string[];
  qualityBadges: string[];
  sustainabilityOptions: string[];
  sustainabilityText: string;
};

type ApiErrorResponse = {
  error?: string;
  details?: string;
};

const SPECIALTY_OPTIONS = [
  "Bröllopsspecialist",
  "Eventspecialist",
  "Prisbelönad florist",
] as const;

const QUALITY_OPTIONS = [
  "Utbildad florist",
  "Miljöcertifierad",
  "Delvis närodlade snittblommor och växter",
  "Välsorterade blommor",
  "Hundvänlig lokal",
] as const;

const SUSTAINABILITY_OPTIONS = [
  "Minskat blomstersvinn",
  "Plastfri paketering",
  "Återvinningsbara förpackningar",
  "Elbil",
  "Hybridbil",
  "Cykelleverans",
  "Fossilfria transporter",
  "Miljövänlig elinköp",
] as const;

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toggleSelection(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export default function FloristMarketingProfilePage() {
  const [profile, setProfile] = useState<FloristMarketingProfile | null>(null);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [qualityBadges, setQualityBadges] = useState<string[]>([]);
  const [sustainabilityOptions, setSustainabilityOptions] = useState<string[]>(
    [],
  );
  const [sustainabilityText, setSustainabilityText] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const publicProfileHref = profile ? `/florist/${profile.id}` : "/dashboard";

  const selectedCount = useMemo(
    () =>
      specialties.length +
      qualityBadges.length +
      sustainabilityOptions.length,
    [qualityBadges.length, specialties.length, sustainabilityOptions.length],
  );

  async function loadProfile() {
    setLoading(true);
    setLoadError("");
    setSaveError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/florists/me/profile", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
      });

      const result = (await response.json()) as {
        florist?: FloristMarketingProfile;
      } & ApiErrorResponse;

      if (!response.ok || !result.florist) {
        throw new Error(
          result.details || result.error || "Profilen kunde inte hämtas.",
        );
      }

      const florist = result.florist;

      setProfile(florist);
      setSpecialties(normalizeStringArray(florist.specialties));
      setQualityBadges(normalizeStringArray(florist.qualityBadges));
      setSustainabilityOptions(
        normalizeStringArray(florist.sustainabilityOptions),
      );
      setSustainabilityText(florist.sustainabilityText || "");
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Profilen kunde inte hämtas.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProfile();
  }, []);

  async function saveProfile() {
    setSaving(true);
    setSaveError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/florists/me/profile", {
        method: "PATCH",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          specialties,
          quality_badges: qualityBadges,
          sustainability_options: sustainabilityOptions,
          sustainability_text: sustainabilityText,
        }),
      });

      const result = (await response.json()) as {
        success?: boolean;
        florist?: FloristMarketingProfile;
      } & ApiErrorResponse;

      if (!response.ok || !result.success || !result.florist) {
        throw new Error(
          result.details ||
            result.error ||
            "Profiländringarna kunde inte sparas.",
        );
      }

      const florist = result.florist;

      setProfile(florist);
      setSpecialties(normalizeStringArray(florist.specialties));
      setQualityBadges(normalizeStringArray(florist.qualityBadges));
      setSustainabilityOptions(
        normalizeStringArray(florist.sustainabilityOptions),
      );
      setSustainabilityText(florist.sustainabilityText || "");
      setSuccessMessage("Profiluppgifterna är sparade.");
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Profiländringarna kunde inte sparas.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f2ea] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={publicProfileHref}
            className="inline-flex w-fit items-center gap-2 text-sm font-black text-slate-700 transition hover:text-pink-700"
          >
            <ArrowLeft size={18} />
            Tillbaka till profil
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {profile ? (
              <Link
                href={publicProfileHref}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm transition hover:border-pink-200 hover:text-pink-700"
              >
                <ExternalLink size={16} />
                Visa publik profil
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
              Publik floristprofil
            </div>

            <h1 className="mt-5 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
              Specialiteter, kvalitet och hållbarhet
            </h1>

            <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-slate-600">
              Välj de uppgifter som beskriver verksamheten. De valda
              uppgifterna visas på floristens publika profil och märks som
              angivna av floristen.
            </p>

            {profile ? (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-800 shadow-sm">
                  {profile.name}
                </div>
                <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-800">
                  {selectedCount} valda uppgifter
                </div>
              </div>
            ) : null}
          </div>

          {loading ? (
            <div className="grid min-h-[420px] place-items-center px-6 py-16">
              <div className="text-center">
                <Loader2
                  className="mx-auto animate-spin text-pink-600"
                  size={38}
                />
                <p className="mt-4 text-sm font-black text-slate-600">
                  Hämtar floristprofilen...
                </p>
              </div>
            </div>
          ) : loadError ? (
            <div className="px-6 py-12 sm:px-10">
              <div className="mx-auto max-w-2xl rounded-[1.75rem] border border-red-200 bg-red-50 p-6 text-red-900">
                <h2 className="text-xl font-black">
                  Profilen kunde inte öppnas
                </h2>
                <p className="mt-3 text-sm font-semibold leading-6">
                  {loadError}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void loadProfile()}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-red-700 px-5 text-sm font-black text-white transition hover:bg-red-800"
                  >
                    <RefreshCw size={16} />
                    Försök igen
                  </button>

                  <Link
                    href="/auth/sign-in?next=/florist-dashboard/profile"
                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-red-300 bg-white px-5 text-sm font-black text-red-800"
                  >
                    Logga in
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-7 px-6 py-8 sm:px-10 sm:py-10">
              <ChoiceSection
                id="specialties"
                title="Specialiteter"
                description="Välj specialistområden som är en tydlig del av verksamhetens erbjudande."
                icon={<Flower2 size={23} />}
                options={SPECIALTY_OPTIONS}
                selected={specialties}
                onToggle={(value) =>
                  setSpecialties((current) =>
                    toggleSelection(current, value),
                  )
                }
                tone="pink"
              />

              <ChoiceSection
                id="quality"
                title="Kvalitet och styrkor"
                description="Beskriv utbildning, certifiering, sortiment och andra styrkor som kunden kan ha nytta av."
                icon={<Award size={23} />}
                options={QUALITY_OPTIONS}
                selected={qualityBadges}
                onToggle={(value) =>
                  setQualityBadges((current) =>
                    toggleSelection(current, value),
                  )
                }
                tone="amber"
              />

              <ChoiceSection
                id="sustainability"
                title="Hållbarhetsarbete"
                description="Välj de hållbarhetsåtgärder som faktiskt används i verksamheten."
                icon={<Leaf size={23} />}
                options={SUSTAINABILITY_OPTIONS}
                selected={sustainabilityOptions}
                onToggle={(value) =>
                  setSustainabilityOptions((current) =>
                    toggleSelection(current, value),
                  )
                }
                tone="emerald"
              />

              <section className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50/40 p-5 sm:p-7">
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                    <Leaf size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-black">
                      Egen beskrivning av hållbarhetsarbetet
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
                      Beskriv konkreta arbetssätt. Undvik generella miljöpåståenden
                      som verksamheten inte kan styrka.
                    </p>
                  </div>
                </div>

                <textarea
                  value={sustainabilityText}
                  onChange={(event) =>
                    setSustainabilityText(event.target.value.slice(0, 2000))
                  }
                  rows={7}
                  placeholder="Exempel: Vi planerar inköp efter bokade uppdrag, återanvänder transportemballage och erbjuder cykelleverans i närområdet."
                  className="mt-5 w-full rounded-3xl border border-emerald-200 bg-white px-5 py-4 text-sm font-semibold leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />

                <div className="mt-2 text-right text-xs font-bold text-slate-500">
                  {sustainabilityText.length} / 2000 tecken
                </div>
              </section>

              <div className="rounded-[1.75rem] border border-blue-200 bg-blue-50 p-5">
                <div className="flex gap-3">
                  <ShieldCheck
                    className="mt-0.5 shrink-0 text-blue-700"
                    size={22}
                  />
                  <div>
                    <h2 className="font-black text-blue-950">
                      Floristens egna profiluppgifter
                    </h2>
                    <p className="mt-2 text-sm font-semibold leading-6 text-blue-900/80">
                      Dessa val är inte samma sak som en verifiering från
                      FloristSocial. Verifierade certifikat och kontrollerade
                      företagsuppgifter hanteras separat.
                    </p>
                  </div>
                </div>
              </div>

              {saveError ? (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold leading-6 text-red-800"
                >
                  {saveError}
                </div>
              ) : null}

              {successMessage ? (
                <div
                  role="status"
                  className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-black text-emerald-800"
                >
                  <Check size={19} />
                  {successMessage}
                </div>
              ) : null}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-7 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold leading-6 text-slate-500">
                  Ändringarna publiceras på floristprofilen när de sparas.
                </p>

                <button
                  type="button"
                  onClick={() => void saveProfile()}
                  disabled={saving}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-pink-600 px-7 text-sm font-black text-white shadow-lg shadow-pink-200 transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-pink-300"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Sparar...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Spara ändringar
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

type ChoiceSectionProps = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
  tone: "pink" | "amber" | "emerald";
};

function ChoiceSection({
  id,
  title,
  description,
  icon,
  options,
  selected,
  onToggle,
  tone,
}: ChoiceSectionProps) {
  const tones = {
    pink: {
      section: "border-pink-200 bg-pink-50/40",
      icon: "text-pink-700",
      active: "border-pink-500 bg-pink-600 text-white shadow-pink-100",
      inactive:
        "border-pink-100 bg-white text-slate-700 hover:border-pink-300 hover:bg-pink-50",
    },
    amber: {
      section: "border-amber-200 bg-amber-50/40",
      icon: "text-amber-700",
      active: "border-amber-500 bg-amber-500 text-white shadow-amber-100",
      inactive:
        "border-amber-100 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50",
    },
    emerald: {
      section: "border-emerald-200 bg-emerald-50/40",
      icon: "text-emerald-700",
      active:
        "border-emerald-600 bg-emerald-600 text-white shadow-emerald-100",
      inactive:
        "border-emerald-100 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50",
    },
  } as const;

  const palette = tones[tone];

  return (
    <section
      id={id}
      className={`scroll-mt-28 rounded-[1.75rem] border p-5 sm:p-7 ${palette.section}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white shadow-sm ${palette.icon}`}
        >
          {icon}
        </div>

        <div>
          <h2 className="text-xl font-black">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => {
          const active = selected.includes(option);

          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(option)}
              className={`flex min-h-14 items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-black shadow-sm transition ${
                active ? palette.active : palette.inactive
              }`}
            >
              <span>{option}</span>

              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
                  active
                    ? "border-white/70 bg-white/20 text-white"
                    : "border-slate-300 bg-slate-50 text-transparent"
                }`}
              >
                <Check size={15} strokeWidth={3} />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
