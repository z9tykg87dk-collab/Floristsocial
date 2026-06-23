"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Building2,
  CalendarDays,
  CreditCard,
  FileText,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";

const invoiceMethods = ["E-post", "E-faktura", "Brev"];
const swedishCities = [
  "Stockholm",
  "Göteborg",
  "Malmö",
  "Uppsala",
  "Örebro",
  "Linköping",
  "Annan ort",
];

function generateCustomerNumber() {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(100000 + Math.random() * 900000);
  return `FSF-${year}-${random}`;
}

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!?#";
  const array = new Uint32Array(12);
  crypto.getRandomValues(array);
  return Array.from(array, (x) => chars[x % chars.length]).join("");
}

function nowStamp() {
  return new Date().toLocaleString("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CompanyRegisterPage() {
  const [customerNumber, setCustomerNumber] = useState(
    "Skapas när sidan laddas",
  );
  const [createdAt, setCreatedAt] = useState("Skapas när sidan laddas");
  const [registrationCity, setRegistrationCity] = useState("Stockholm");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    setCustomerNumber(generateCustomerNumber());
    setCreatedAt(nowStamp());
  }, []);

  function handleRegistrationSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitMessage(
      `✅ Företagsregistrering skapad för kundnummer ${customerNumber}. Faktura sätts som pending_review tills manuell kontroll är godkänd.`,
    );
  }

  return (
    <main className="min-h-screen bg-[#fbf7f2] text-stone-900">
      {" "}
      <section className="relative overflow-hidden px-5 py-10 md:px-10 lg:px-16">
        {" "}
        <div className="absolute right-[-160px] top-[-160px] h-96 w-96 rounded-full bg-pink-200/50 blur-3xl" />{" "}
        <div className="absolute bottom-[-180px] left-[-140px] h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="relative mx-auto max-w-7xl space-y-8">
          <header className="max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm">
              <Building2 size={16} /> FloristSocial företagskund
            </div>

            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Registrera ditt företag hos FloristSocial.
            </h1>

            <p className="mt-5 text-lg leading-8 text-stone-600">
              Skapa ett företagskonto för återkommande beställningar,
              fakturakund, företagskalender och enklare hantering av blommor
              till kontor, event, kunder och personal.
            </p>

            <p className="mt-3 text-base leading-7 text-stone-600">
              Faktura aktiveras först efter manuell kontroll och godkännande.
              Företag kan alltid beställa med direktbetalning via gästorder.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/company/guest-order"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-stone-300 bg-white px-6 text-sm font-semibold text-stone-900 transition hover:bg-stone-50"
              >
                Beställ som företagsgäst
              </Link>
            </div>
          </header>

          {submitMessage && (
            <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
              {submitMessage}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <form onSubmit={handleRegistrationSubmit} className="space-y-6">
              <Card>
                <SectionHeader
                  icon={<Building2 size={20} />}
                  title="Företagsregistrering"
                  description="Alla fält med röd stjärna är obligatoriska. Datum, tid, ort och kundnummer genereras på formuläret. Faktura kan väljas först efter att FloristSocial har kontrollerat och godkänt företaget."
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <ReadOnlyField
                    label="Datum och tid"
                    value={createdAt}
                    icon={<CalendarDays size={18} />}
                  />

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">
                      Ort <Required />
                    </span>
                    <select
                      value={registrationCity}
                      onChange={(event) =>
                        setRegistrationCity(event.target.value)
                      }
                      className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition focus:border-stone-500"
                    >
                      {swedishCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </label>

                  <ReadOnlyField
                    label="Kundnummer"
                    value={customerNumber}
                    icon={<FileText size={18} />}
                  />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Field
                    required
                    name="companyName"
                    label="Företagsnamn"
                    placeholder="Till ex.: företagets juridiska namn"
                    icon={<Building2 size={18} />}
                  />
                  <Field
                    required
                    name="organizationNumber"
                    label="Organisationsnummer"
                    placeholder="Till ex.: XXXXXX-XXXX"
                  />
                  <Field
                    required
                    name="companyAddress"
                    label="Företagsadress"
                    placeholder="Till ex.: företagets fysiska adress"
                    icon={<MapPin size={18} />}
                  />
                  <SelectField
                    required
                    name="invoiceMethod"
                    label="Faktureringssätt"
                    options={invoiceMethods}
                  />
                  <Field
                    required
                    name="invoiceAddress"
                    label="Fakturaadress"
                    placeholder="Till ex.: e-post eller fysisk adress"
                    icon={<CreditCard size={18} />}
                  />
                  <Field
                    required
                    name="contactPerson"
                    label="Kontaktperson"
                    placeholder="Till ex.: Namn + Efternamn"
                    icon={<User size={18} />}
                  />
                  <Field
                    required
                    name="contactEmail"
                    label="E-post"
                    placeholder="E-post kontaktperson"
                    type="email"
                    icon={<Mail size={18} />}
                  />
                  <Field
                    required
                    name="contactPhone"
                    label="Telefonnummer"
                    placeholder="Telefonnummer kontaktperson"
                    type="tel"
                    icon={<Phone size={18} />}
                  />
                  <PasswordFields
                    generatedPassword={generatedPassword}
                    onGenerated={setGeneratedPassword}
                  />
                </div>

                <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                  <ShieldCheck size={16} className="mr-1 inline" />
                  Fakturaköp aktiveras först efter manuell kontroll av
                  företaget. Företag kan alltid välja direktbetalning via
                  företags-gästorder.
                </div>

                <div className="mt-6 flex justify-end">
                  <Button type="submit">
                    <Send size={16} /> Skicka företagsregistrering
                  </Button>
                </div>
              </Card>
            </form>

            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <div className="rounded-3xl bg-white p-6 shadow-xl">
                <h2 className="text-xl font-semibold">Vad händer sedan?</h2>

                <div className="mt-5 space-y-4 text-sm leading-6 text-stone-700">
                  <SummaryRow label="Kundnummer" value={customerNumber} />
                  <SummaryRow label="Status" value="Pending review" />
                  <SummaryRow label="Faktura" value="Manuell kontroll krävs" />
                  <SummaryRow
                    label="Direktbetalning"
                    value="Alltid möjligt via gästorder"
                  />
                </div>

                <div className="mt-6 rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-stone-600">
                  <strong>Tips:</strong> Om företaget vill beställa direkt utan
                  konto kan ni använda företags-gästorder.
                </div>

                <Link
                  href="/company/guest-order"
                  className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-stone-900 px-6 text-sm font-medium text-white transition hover:bg-stone-800"
                >
                  Gå till företags-gästorder
                </Link>
              </div>
            </aside>
          </div>
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
    <div className="rounded-3xl bg-stone-50 p-4 md:col-span-2">
      {" "}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {" "}
        <div>
          {" "}
          <h3 className="font-semibold">
            Eget lösenord eller säkert lösenord <Required />{" "}
          </h3>{" "}
          <p className="text-sm text-stone-600">
            Företagskunden kan skriva eget lösenord eller generera ett säkert
            lösenord.
          </p>{" "}
        </div>
        <Button type="button" onClick={generate}>
          <KeyRound size={16} /> Generera säkert lösen
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">
            Lösenord <Required />
          </span>
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
            Bekräfta lösenord <Required />
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
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 text-sm font-medium text-white transition hover:bg-stone-800"
    >
      {children}{" "}
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
      {" "}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-white">
        {icon}
      </div>{" "}
      <div>
        {" "}
        <h2 className="text-xl font-semibold">{title}</h2>{" "}
        <p className="mt-1 text-sm leading-6 text-stone-600">
          {description}
        </p>{" "}
      </div>{" "}
    </div>
  );
}

function Required() {
  return <span className="text-red-600">*</span>;
}

function Field({
  name,
  label,
  placeholder,
  icon,
  type = "text",
  required = false,
}: {
  name?: string;
  label: string;
  placeholder: string;
  icon?: ReactNode;
  type?: "text" | "email" | "tel";
  required?: boolean;
}) {
  return (
    <label className="block">
      {" "}
      <span className="mb-2 block text-sm font-semibold">
        {label} {required && <Required />}{" "}
      </span>{" "}
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
          placeholder={placeholder}
          className={`h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition placeholder:text-stone-400 focus:border-stone-500 ${icon ? "pl-12" : ""}`}
        />{" "}
      </div>{" "}
    </label>
  );
}

function ReadOnlyField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <label className="block">
      {" "}
      <span className="mb-2 block text-sm font-semibold">{label}</span>{" "}
      <div className="relative">
        {icon ? (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
            {icon}
          </div>
        ) : null}
        <input
          readOnly
          value={value}
          className={`h-12 w-full rounded-2xl border border-stone-200 bg-stone-100 px-4 text-stone-700 outline-none ${icon ? "pl-12" : ""}`}
        />{" "}
      </div>{" "}
    </label>
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
      {" "}
      <span className="mb-2 block text-sm font-semibold">
        {label} {required && <Required />}{" "}
      </span>{" "}
      <select
        name={name}
        required={required}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition focus:border-stone-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}{" "}
          </option>
        ))}{" "}
      </select>{" "}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
      {" "}
      <span className="text-stone-500">{label}</span>{" "}
      <strong className="text-right text-stone-900">{value}</strong>{" "}
    </div>
  );
}
