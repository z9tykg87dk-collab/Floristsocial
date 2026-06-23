"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

const industries = [
  "Företag",
  "Organisation",
  "Statlig verksamhet",
  "Kommunal verksamhet",
  "Region",
  "Förening",
  "Hotell & restaurang",
  "Kontor",
  "Event & konferens",
  "Skola & utbildning",
  "Vård & omsorg",
  "Annat",
];

const interests = [
  "Kontorsblommor",
  "Återkommande leveranser",
  "Eventblommor",
  "Sorgbukett",
  "Presentkort till anställda",
  "Företagsavtal",
  "Fakturabetalning",
  "Högtider & företagskalender",
];

export default function CompanyInterestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [invoiceCustomer, setInvoiceCustomer] = useState(false);

  return (
    <main className="min-h-screen bg-[#f7f2ea] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <header className="mx-auto mb-6 max-w-6xl overflow-hidden rounded-[2rem] border border-pink-100 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-pink-100 via-rose-50 to-emerald-50 px-6 py-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-700">
            FloristSocial Business
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
            Intresseanmälan för företag
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Skicka en intresseanmälan till FloristSocial. Din förfrågan går
            vidare till Admin/Super Admin för kontakt, bearbetning och eventuell
            fakturakundsgranskning.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link
            href="/company/register"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-pink-700"
          >
            <ArrowLeft size={18} />
            Till företagsregistrering
          </Link>
        </div>

        {submitted ? (
          <section className="rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-slate-200/80">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 size={42} />
            </div>
            <h2 className="mt-5 text-3xl font-black">
              Intresseanmälan skickad
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              FloristSocial Admin tar emot ärendet och kontaktar företaget för
              vidare bearbetning. Om fakturabetalning önskas görs först en enkel
              AI-förkontroll och därefter en fördjupad manuell granskning.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/company/profile"
                className="rounded-full bg-pink-600 px-6 py-3 text-sm font-black text-white hover:bg-pink-700"
              >
                Gå till företagsprofil
              </Link>
              <Link
                href="/company/register"
                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-slate-800"
              >
                Skapa företagsorder
              </Link>
            </div>
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
              className="rounded-[2rem] bg-white p-5 shadow-xl shadow-slate-200/80 sm:p-7"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-50 text-pink-700">
                  <Building2 />
                </div>
                <div>
                  <h2 className="text-2xl font-black">Företagsuppgifter</h2>
                  <p className="text-sm font-semibold text-slate-500">
                    Fullständigt företagsnamn och organisationsnummer krävs.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Fullständigt företagsnamn *"
                  placeholder="Ex. Nordic Design Group AB"
                />
                <Field
                  label="Organisationsnummer *"
                  placeholder="Ex. 559123-4567"
                />
                <Field
                  label="Bransch / verksamhet *"
                  asSelect
                  options={industries}
                />
                <Field
                  label="Företagets e-post *"
                  placeholder="info@foretag.se"
                />
                <Field
                  label="Faktura-e-post *"
                  placeholder="faktura@foretag.se"
                />
                <Field label="Telefon" placeholder="08-123 456 78" />
                <Field label="Adress" placeholder="Gatuadress" />
                <Field label="Ort" placeholder="Stockholm" />
              </div>

              <div className="mt-8">
                <h3 className="mb-4 text-xl font-black">Kontaktperson</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Namn *" placeholder="För- och efternamn" />
                  <Field
                    label="Kontaktpersonens e-post *"
                    placeholder="namn@foretag.se"
                  />
                  <Field label="Telefon direkt" placeholder="070-123 45 67" />
                  <Field
                    label="Roll"
                    placeholder="Ex. Office Manager, HR, VD"
                  />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="mb-4 text-xl font-black">
                  Jag är intresserad av
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {interests.map((item) => (
                    <label
                      key={item}
                      className="flex cursor-pointer items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 hover:bg-pink-50 hover:text-pink-700"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-pink-600"
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-5">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={invoiceCustomer}
                    onChange={(event) =>
                      setInvoiceCustomer(event.target.checked)
                    }
                    className="mt-1 h-4 w-4 accent-pink-600"
                  />
                  <span>
                    <span className="block text-sm font-black text-amber-900">
                      Företaget vill ansöka om att bli fakturakund
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-amber-800">
                      FloristSocial gör en enkel AI-förkontroll av företaget och
                      kreditrating. Därefter granskas ärendet av Admin/Super
                      Admin.
                    </span>
                  </span>
                </label>
              </div>

              {invoiceCustomer && (
                <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 flex items-center gap-2 text-sm font-black text-slate-900">
                    <ShieldCheck size={18} className="text-emerald-700" />
                    Fakturakundsunderlag
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Önskad kreditgräns"
                      placeholder="Ex. 25 000 kr"
                    />
                    <Field
                      label="Betalningsvillkor önskas"
                      placeholder="Ex. 30 dagar"
                    />
                    <Field
                      label="Referens / kostnadsställe"
                      placeholder="Ex. OFFICE-2026"
                    />
                    <Field
                      label="Fakturareferens"
                      placeholder="Ex. Anna Svensson"
                    />
                  </div>
                </div>
              )}

              <div className="mt-8">
                <label className="text-sm font-black text-slate-800">
                  Meddelande till FloristSocial
                </label>
                <textarea
                  rows={5}
                  placeholder="Berätta kort vad företaget behöver hjälp med, till exempel kontorsblommor, event, sorgbuketter, återkommande leveranser eller fakturakund."
                  className="mt-2 w-full resize-none rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none placeholder:text-slate-400 focus:border-pink-500"
                />
              </div>

              <button
                type="submit"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-pink-200 hover:bg-pink-700"
              >
                <Send size={18} />
                Skicka intresseanmälan
              </button>
            </form>

            <aside className="space-y-6">
              <InfoCard
                icon={<Sparkles />}
                title="Vad händer sedan?"
                text="Admin kontaktar företaget och kan skapa företagsprofil, koppla kalender, aktivera orderflöden och starta fakturakundsprocess."
              />
              <InfoCard
                icon={<FileText />}
                title="Faktura & bokföring"
                text="Företagsprofilen kan innehålla faktura-e-post, organisationsnummer, orderhistorik, inköpsunderlag, referenser och kostnadsställen."
              />
              <InfoCard
                icon={<User />}
                title="Viktig kontaktperson"
                text="Kontaktpersonens e-post är viktig eftersom Admin behöver kunna följa upp intresseanmälan och eventuella fakturafrågor."
              />
              <InfoCard
                icon={<MapPin />}
                title="Kalender som nav"
                text="Företaget ska kunna navigera från kalendern till beställning, prenumeration, event, sorgbukett, presentkort och påminnelser."
              />
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  placeholder,
  asSelect,
  options = [],
}: {
  label: string;
  placeholder?: string;
  asSelect?: boolean;
  options?: string[];
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-800">{label}</span>
      {asSelect ? (
        <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-pink-500">
          <option value="">Välj alternativ</option>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          placeholder={placeholder}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none placeholder:text-slate-400 focus:border-pink-500"
        />
      )}
    </label>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.75rem] bg-white p-5 shadow-sm">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-pink-50 text-pink-700">
        {icon}
      </div>
      <h3 className="text-lg font-black">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
        {text}
      </p>
    </div>
  );
}
