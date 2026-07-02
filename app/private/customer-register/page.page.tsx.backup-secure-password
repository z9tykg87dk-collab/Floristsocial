"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronDown,
  Flower2,
  Gift,
  Heart,
  ImagePlus,
  Leaf,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  User,
} from "lucide-react";

type InterestKey =
  | "bouquets"
  | "arrangements"
  | "plants"
  | "subscription"
  | "giftcards";

type StyleKey = "classic" | "romantic" | "modern" | "retro";

const cutFlowers = [
  "Ros",
  "Tulpan",
  "Lilja",
  "Nejlika",
  "Gerbera",
  "Orkidé",
  "Hortensia",
  "Pion",
  "Ranunkel",
  "Anemon",
  "Fresia",
  "Amaryllis",
  "Solros",
  "Dahlia",
  "Eustoma",
  "Iris",
  "Hyacint",
  "Alstroemeria",
  "Krysantemum",
  "Brudslöja",
  "Protea",
  "Luktärt",
  "Scabiosa",
  "Lejongap",
];

const interestOptions: Array<{
  key: InterestKey;
  label: string;
  icon: React.ReactNode;
}> = [
  { key: "bouquets", label: "Buketter", icon: <Flower2 size={18} /> },
  {
    key: "arrangements",
    label: "Blomsterarrangemang",
    icon: <Sparkles size={18} />,
  },
  { key: "plants", label: "Krukväxter", icon: <Leaf size={18} /> },
  { key: "subscription", label: "Prenumeration", icon: <Heart size={18} /> },
  { key: "giftcards", label: "Presentkort", icon: <Gift size={18} /> },
];

const styleOptions: Array<{ key: StyleKey; label: string }> = [
  { key: "classic", label: "Klassiskt" },
  { key: "romantic", label: "Romantiskt" },
  { key: "modern", label: "Modernt" },
  { key: "retro", label: "Retro" },
];

export default function PrivateCustomerRegisterPage() {
  const [selectedInterests, setSelectedInterests] = useState<InterestKey[]>([
    "bouquets",
  ]);
  const [selectedStyle, setSelectedStyle] = useState<StyleKey>("romantic");
  const [favoriteFlower, setFavoriteFlower] = useState("Ros");
  const [country, setCountry] = useState("Sverige");
  const [profileImageName, setProfileImageName] = useState("");
  const [coverImageName, setCoverImageName] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  function saveForm(status: "created" | "draft") {
    const profileData = {
      accountType: "private_customer",
      status,
      favoriteFlower,
      country,
      selectedStyle,
      selectedInterests,
      profileImageName,
      coverImageName,
      savedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(
      "floristsocial_private_customer_profile_draft",
      JSON.stringify(profileData),
    );

    setSavedMessage(
      status === "created"
        ? "Privatkund konto sparat lokalt. Nästa steg är att koppla detta till Supabase."
        : "Utkast sparat lokalt i webbläsaren.",
    );
  }

  const selectedInterestLabels = useMemo(
    () =>
      interestOptions
        .filter((item) => selectedInterests.includes(item.key))
        .map((item) => item.label),
    [selectedInterests],
  );

  function toggleInterest(key: InterestKey) {
    setSelectedInterests((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f2ea] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/private/register"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-pink-700"
          >
            <ArrowLeft size={18} />
            Till privat orderformulär
          </Link>

          <div className="rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-bold text-pink-700 shadow-sm">
            Privatkund konto registrering
          </div>
        </div>

        <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/80">
          <div className="relative bg-gradient-to-br from-pink-50 via-white to-emerald-50 px-6 py-8 sm:px-10">
            <div className="absolute right-8 top-8 hidden rounded-full bg-white/70 p-5 text-pink-600 shadow-sm lg:block">
              <Flower2 size={46} />
            </div>

            <div className="max-w-3xl">
              <p className="mb-3 inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-pink-700">
                FloristSocial privatkund
              </p>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Skapa privatkund konto
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Spara dina uppgifter, följ orderhistorik, få snabbare checkout
                och skapa en personlig blomsterprofil som kan användas vid
                framtida köp.
              </p>
            </div>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              saveForm("created");
            }}
            className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[1fr_340px]"
          >
            <div className="space-y-8">
              <FormSection
                number="1"
                title="Konto"
                description="Dessa uppgifter används för inloggning, orderhistorik och verifiering."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    label="E-post *"
                    type="email"
                    placeholder="namn@email.se"
                    icon={<Mail size={18} />}
                  />
                  <InputField
                    label="Lösenord *"
                    type="password"
                    placeholder="Minst 8 tecken"
                    icon={<ShieldCheck size={18} />}
                  />
                  <InputField
                    label="Bekräfta lösenord *"
                    type="password"
                    placeholder="Upprepa lösenord"
                    icon={<ShieldCheck size={18} />}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <UploadBox
                    label="Profilbild"
                    helper="Dra och släpp eller ladda upp bild"
                    fileName={profileImageName}
                    onChange={setProfileImageName}
                    icon={<Camera size={24} />}
                  />
                  <UploadBox
                    label="Bakgrundsbild"
                    helper="Dra och släpp eller ladda upp bild"
                    fileName={coverImageName}
                    onChange={setCoverImageName}
                    icon={<ImagePlus size={24} />}
                  />
                </div>
              </FormSection>

              <FormSection
                number="2"
                title="Personuppgifter"
                description="Uppgifterna speglas till privatkundens profil och används vid framtida beställningar."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    label="Förnamn *"
                    placeholder="Anna"
                    icon={<User size={18} />}
                  />
                  <InputField
                    label="Efternamn *"
                    placeholder="Andersson"
                    icon={<User size={18} />}
                  />
                  <InputField
                    label="Telefonnummer *"
                    placeholder="070-123 45 67"
                    icon={<Phone size={18} />}
                  />
                  <InputField
                    label="Adress *"
                    placeholder="Storgatan 18"
                    icon={<MapPin size={18} />}
                  />
                  <InputField label="Postnummer *" placeholder="114 55" />
                  <InputField label="Ort *" placeholder="Stockholm" />

                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-sm font-black text-slate-800">
                      Land
                    </span>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <MapPin size={18} className="text-pink-600" />
                      <input
                        value={country}
                        onChange={(event) => setCountry(event.target.value)}
                        className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                        placeholder="Genereras automatiskt via internet location"
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Land kan föreslås automatiskt via webbläsarens plats/IP,
                      men kunden ska alltid kunna ändra manuellt.
                    </p>
                  </label>
                </div>
              </FormSection>

              <FormSection
                number="3"
                title="Jag är intresserad av"
                description="Dessa val hjälper FloristSocial att anpassa kundens upplevelse och rekommendationer."
              >
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {interestOptions.map((item) => {
                    const active = selectedInterests.includes(item.key);

                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => toggleInterest(item.key)}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${
                          active
                            ? "border-pink-500 bg-pink-50 text-pink-800"
                            : "border-slate-200 bg-white text-slate-700 hover:border-pink-200"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {item.icon}
                          {item.label}
                        </span>
                        {active && <Check size={18} />}
                      </button>
                    );
                  })}
                </div>
              </FormSection>

              <FormSection
                number="4"
                title="Min profil"
                description="Profilinformationen kan ändras senare, men viktiga ändringar bör verifieras via e-post eller SMS."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm font-black text-slate-800">
                      Min favoritblomma är
                    </span>
                    <div className="relative">
                      <select
                        value={favoriteFlower}
                        onChange={(event) =>
                          setFavoriteFlower(event.target.value)
                        }
                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-pink-400 focus:bg-white"
                      >
                        {cutFlowers.map((flower) => (
                          <option key={flower} value={flower}>
                            {flower}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={18}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                    </div>
                  </label>

                  <InputField
                    label="Min favoritfärg är"
                    placeholder="Ex. rosa, vitt, grönt"
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm font-black text-slate-800">
                    Jag föredrar
                  </p>
                  <div className="grid gap-3 sm:grid-cols-4">
                    {styleOptions.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setSelectedStyle(item.key)}
                        className={`rounded-2xl border px-4 py-3 text-sm font-black transition ${
                          selectedStyle === item.key
                            ? "border-pink-500 bg-pink-50 text-pink-800"
                            : "border-slate-200 bg-white text-slate-700 hover:border-pink-200"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <CheckboxField label="Jag har pollenallergi" />
                  <CheckboxField label="Jag har allergi till doftande blommor" />
                  <CheckboxField
                    label="Jag vill spara mina uppgifter för snabbare checkout"
                    defaultChecked
                  />
                  <CheckboxField
                    label="Jag vill kunna se orderhistorik"
                    defaultChecked
                  />
                  <CheckboxField label="Jag vill spara födelsedagar, årsdagar och högtider i kalender" />
                  <CheckboxField label="Jag godkänner villkor och integritetspolicy *" />
                  <CheckboxField label="Jag vill få erbjudanden via e-post" />
                  <CheckboxField label="Jag vill få erbjudanden via SMS" />
                </div>

                <label className="block">
                  <span className="mb-1 block text-sm font-black text-slate-800">
                    Mina önskemål
                  </span>
                  <textarea
                    rows={5}
                    placeholder="Skriv till exempel favoritstil, blommor du inte vill ha, viktiga datum eller andra önskemål."
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:bg-white"
                  />
                </label>
              </FormSection>

              <div className="flex flex-col gap-3 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900 sm:flex-row sm:items-start">
                <ShieldCheck className="mt-0.5 shrink-0" size={22} />
                <div>
                  <p className="font-black">Verifiering vid ändringar</p>
                  <p className="mt-1 leading-6">
                    Kunden kan ändra all profilinformation. Ändring av e-post
                    ska verifieras via ny e-postadress. Ändring av telefonnummer
                    ska verifieras via SMS-kod. Lösenordsändring bekräftas via
                    e-post.
                  </p>
                </div>
              </div>

              {savedMessage && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800">
                  {savedMessage}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="inline-flex h-13 items-center justify-center rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:bg-pink-700"
                >
                  Skapa privatkund konto
                </button>
                <button
                  type="button"
                  onClick={() => saveForm("draft")}
                  className="inline-flex h-13 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-4 text-sm font-black text-slate-800 transition hover:border-pink-300 hover:text-pink-700"
                >
                  Spara som utkast
                </button>
              </div>
            </div>

            <aside className="lg:sticky lg:top-6 lg:self-start">
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <div className="h-28 bg-gradient-to-br from-pink-200 via-rose-100 to-emerald-100" />
                <div className="px-5 pb-5">
                  <div className="-mt-10 grid h-20 w-20 place-items-center rounded-3xl border-4 border-white bg-pink-100 text-pink-700 shadow-sm">
                    {profileImageName ? (
                      <Camera size={30} />
                    ) : (
                      <User size={30} />
                    )}
                  </div>

                  <h2 className="mt-4 text-xl font-black tracking-tight">
                    Profilförhandsvisning
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Informationen från registreringen ska speglas till kundens
                    privata profil i plattformen.
                  </p>

                  <div className="mt-5 space-y-3 text-sm">
                    <PreviewRow label="Favoritblomma" value={favoriteFlower} />
                    <PreviewRow
                      label="Stil"
                      value={
                        styleOptions.find((item) => item.key === selectedStyle)
                          ?.label || "Ej valt"
                      }
                    />
                    <PreviewRow
                      label="Intressen"
                      value={
                        selectedInterestLabels.length
                          ? selectedInterestLabels.join(", ")
                          : "Ej valt"
                      }
                    />
                    <PreviewRow label="Land" value={country || "Ej valt"} />
                  </div>
                </div>
              </div>
            </aside>
          </form>
        </section>
      </div>
    </main>
  );
}

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-pink-600 text-lg font-black text-white">
          {number}
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-950">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>

      <div className="space-y-5">{children}</div>
    </section>
  );
}

function InputField({
  label,
  placeholder,
  type = "text",
  icon,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-black text-slate-800">
        {label}
      </span>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-pink-400 focus-within:bg-white">
        {icon && <span className="text-pink-600">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
        />
      </div>
    </label>
  );
}

function UploadBox({
  label,
  helper,
  fileName,
  onChange,
  icon,
}: {
  label: string;
  helper: string;
  fileName: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
}) {
  return (
    <label className="block cursor-pointer rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-center transition hover:border-pink-300 hover:bg-pink-50/40">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => onChange(event.target.files?.[0]?.name || "")}
      />
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-pink-600 shadow-sm">
        {icon}
      </div>
      <p className="mt-3 text-sm font-black text-slate-900">{label}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{helper}</p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black text-pink-700 shadow-sm">
        <UploadCloud size={14} />
        {fileName || "Välj bild"}
      </p>
    </label>
  );
}

function CheckboxField({
  label,
  defaultChecked = false,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-800 transition hover:border-pink-200 hover:bg-white">
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 accent-pink-600"
      />
      <span>{label}</span>
    </label>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-black text-slate-900">{value}</p>
    </div>
  );
}
