"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  Gift,
  HeartHandshake,
  Home,
  Mail,
  MapPin,
  PackageCheck,
  Pencil,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Upload,
  Users,
  X,
} from "lucide-react";

type CalendarEventType =
  | "order"
  | "delivery"
  | "invoice"
  | "event"
  | "giftcard"
  | "subscription"
  | "reminder"
  | "approval";

type CalendarActionType =
  | "Beställa"
  | "Prenumerera"
  | "Event"
  | "Sorgbukett"
  | "Presentkort"
  | "Faktura"
  | "Påminna"
  | "Jubileum";

type SavedCalendarNote = {
  date: string;
  type: CalendarActionType;
  text: string;
};

const company = {
  name: "Nordic Design Group AB",
  orgNumber: "559123-4567",
  vatNumber: "SE559123456701",
  industry: "Inredning & design",
  companyEmail: "info@nordicdesign.se",
  invoiceEmail: "faktura@nordicdesign.se",
  phone: "08-123 456 78",
  address: "Birger Jarlsgatan 22",
  postalCode: "114 34",
  city: "Stockholm",
  country: "Sverige",
  customerSince: "Maj 2026",
  contactName: "Anna Lindholm",
  contactRole: "Office Manager",
  contactEmail: "anna@nordicdesign.se",
  contactPhone: "070-123 45 67",
  invoiceCustomerStatus: "Under granskning",
  aiCreditCheck: "Förkontroll godkänd",
  adminReview: "Väntar på Admin/Super Admin",
  paymentTerms: "30 dagar önskas",
  creditLimit: "25 000 kr önskas",
  costCenter: "OFFICE-2026",
  accountingReference: "Anna Lindholm",
  discount: "12%",
  activeSubscription: true,
  logoUploaded: false,
};

const wishes = [
  "Kontorsblommor",
  "Återkommande leveranser",
  "Eventblommor",
  "Sorgbukett",
  "Presentkort till anställda",
  "Företagsavtal",
  "Fakturabetalning",
  "Högtider & kalender",
];

const deliveryAddresses = [
  "Birger Jarlsgatan 22, Stockholm",
  "Kungsgatan 14, Stockholm",
  "Eventlokal enligt order",
];

const orders = [
  {
    id: "FS-CO-2026-00118",
    date: "2026-05-28",
    type: "Kontorsblommor",
    amount: "3 450 kr",
    status: "Levererad",
  },
  {
    id: "FS-CO-2026-00087",
    date: "2026-05-12",
    type: "Eventblommor",
    amount: "8 900 kr",
    status: "Fakturerad",
  },
  {
    id: "FS-CO-2026-00044",
    date: "2026-04-18",
    type: "Presentkort",
    amount: "5 000 kr",
    status: "Betald",
  },
];

const today = new Date("2026-05-28T12:00:00");

const calendarEvents: Array<{
  date: string;
  title: string;
  type: CalendarEventType;
  time: string;
  description: string;
}> = [
  {
    date: "2026-05-28",
    title: "Kontorsblommor levereras",
    type: "delivery",
    time: "10:00-14:00",
    description: "Återkommande leverans till huvudkontoret.",
  },
  {
    date: "2026-05-30",
    title: "Fakturakund under granskning",
    type: "approval",
    time: "09:00",
    description: "Admin/Super Admin granskar företaget för fakturabetalning.",
  },
  {
    date: "2026-06-03",
    title: "Faktura förfaller",
    type: "invoice",
    time: "Heldag",
    description: "Faktura FS-INV-2026-00087 ska betalas.",
  },
  {
    date: "2026-06-07",
    title: "Sommar-event",
    type: "event",
    time: "16:00",
    description: "Eventblommor till företagets kundmingel.",
  },
  {
    date: "2026-06-14",
    title: "Presentkort till anställda",
    type: "giftcard",
    time: "10:00",
    description: "Planerad utskick av digitala presentkort.",
  },
  {
    date: "2026-06-20",
    title: "Prenumerationsbuketter",
    type: "subscription",
    time: "13:00-16:00",
    description: "Nästa återkommande kontorsleverans.",
  },
];

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDay(date: Date) {
  return new Intl.DateTimeFormat("sv-SE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

function getCalendarDays() {
  return Array.from({ length: 57 }, (_, index) => addDays(today, index - 14));
}

function getEventStyle(type: CalendarEventType) {
  switch (type) {
    case "order":
      return "border-blue-200 bg-blue-50 text-blue-800";
    case "delivery":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "invoice":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "event":
      return "border-violet-200 bg-violet-50 text-violet-800";
    case "giftcard":
      return "border-pink-200 bg-pink-50 text-pink-800";
    case "subscription":
      return "border-teal-200 bg-teal-50 text-teal-800";
    case "approval":
      return "border-slate-300 bg-slate-100 text-slate-800";
    default:
      return "border-slate-200 bg-slate-50 text-slate-800";
  }
}

const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-pink-700 hover:shadow-xl";

const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:text-pink-700 hover:ring-pink-200 hover:shadow-md";

export default function CompanyProfilePage() {
  const calendarDays = getCalendarDays();
  const upcomingEvents = calendarEvents.filter(
    (event) => event.date >= toDateKey(today),
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState<
    typeof calendarEvents
  >([]);
  const [activeAction, setActiveAction] = useState<CalendarActionType | null>(
    null,
  );
  const [noteText, setNoteText] = useState("");
  const [savedNotes, setSavedNotes] = useState<SavedCalendarNote[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  function openCalendarPopup(dateKey: string, events: typeof calendarEvents) {
    setSelectedDate(dateKey);
    setSelectedDayEvents(events);
    setActiveAction(null);
    setNoteText("");
  }

  function saveCalendarNote() {
    if (!selectedDate || !activeAction || !noteText.trim()) return;

    setSavedNotes((current) => [
      ...current,
      { date: selectedDate, type: activeAction, text: noteText.trim() },
    ]);

    setActiveAction(null);
    setNoteText("");
  }

  const selectedDateNotes = savedNotes.filter(
    (note) => note.date === selectedDate,
  );

  return (
    <main className="min-h-screen bg-[#f7f2ea] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <header className="mx-auto mb-6 max-w-7xl overflow-hidden rounded-[2rem] border border-pink-100 bg-white shadow-sm">
        <div className="flex flex-col gap-5 bg-gradient-to-r from-pink-100 via-rose-50 to-emerald-50 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-700">
              FloristSocial Business
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Företagskund profil
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Kalendern är navet för beställningar, prenumerationer, fakturor,
              event, sorgbuketter, presentkort och företagsärenden.
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-3 lg:max-w-2xl">
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
              <Search size={18} className="text-pink-700" />
              <input
                placeholder="Sök order, faktura, leverans, event eller kalenderhändelse..."
                className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <HeaderAction
                icon={<Bell size={17} />}
                label="Notiser"
                count="5"
              />
              <HeaderAction
                icon={<FileText size={17} />}
                label="Fakturor"
                count="2"
              />
              <HeaderAction icon={<Users size={17} />} label="Team" count="3" />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/company/register"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-pink-700"
          >
            <ArrowLeft size={18} />
            Till företagsregistrering
          </Link>

          <button
            type="button"
            onClick={() => setIsEditing((value) => !value)}
            className={primaryButtonClass}
          >
            <Pencil size={16} />
            {isEditing ? "Klar med ändringar" : "Redigera företagsprofil"}
          </button>
        </div>

        <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/80">
          <div className="relative h-40 bg-gradient-to-br from-pink-200 via-rose-100 to-emerald-100">
            <div className="absolute bottom-6 right-6 rounded-3xl bg-white/80 p-4 text-pink-700 shadow-sm backdrop-blur">
              <Building2 size={44} />
            </div>
          </div>

          <div className="relative px-6 pb-8 sm:px-10">
            <div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="grid h-32 w-32 place-items-center rounded-[2rem] border-4 border-white bg-pink-100 text-pink-700 shadow-lg">
                  {company.logoUploaded ? (
                    <Building2 size={58} />
                  ) : (
                    <Upload size={50} />
                  )}
                </div>

                <div className="pb-2">
                  <div className="mb-2 inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-pink-700">
                    Företagskund
                  </div>
                  <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                    {company.name}
                  </h1>
                  <p className="mt-2 flex flex-wrap items-center gap-3 text-sm font-bold text-slate-500">
                    <span>Org.nr {company.orgNumber}</span>
                    <span>
                      {company.city}, {company.country}
                    </span>
                    <span>Kund sedan {company.customerSince}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <StatusBadge label="E-post" value="Verifierad" />
                <StatusBadge label="SMS" value="Verifiera" />
                <StatusBadge label="Checkout" value="Aktiv" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-6">
          <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-700">
                Företagskalender
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Kalendern styr företagets beställningar
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Härifrån kan företaget navigera till order, prenumeration,
                event, sorgbukett, presentkort, faktura och påminnelser.
              </p>
            </div>
          </div>

          <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <CalendarShortcut
              href="#orderhistorik"
              label="Order"
              icon={<ShoppingBag size={17} />}
            />
            <CalendarShortcut
              href="#leveransadresser"
              label="Leverans"
              icon={<Truck size={17} />}
            />
            <CalendarShortcut
              href="#presentkort"
              label="Presentkort"
              icon={<Gift size={17} />}
            />
            <CalendarShortcut
              href="#bekraftelse"
              label="Bekräftelse"
              icon={<CheckCircle2 size={17} />}
            />
            <CalendarShortcut
              href="#hogtid"
              label="Högtid"
              icon={<Star size={17} />}
            />
          </div>

          <div className="mb-4 flex flex-col gap-3 rounded-[2rem] bg-pink-50/70 px-4 py-3 ring-1 ring-pink-100 md:flex-row md:items-center md:justify-between">
            <button className={secondaryButtonClass}>
              <ChevronLeft size={16} />
              Föregående period
            </button>
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-pink-500">
                Visar period
              </p>
              <p className="font-black text-slate-900">
                14 maj 2026 - 9 juli 2026
              </p>
            </div>
            <button className={secondaryButtonClass}>
              Nästa period
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid gap-3 xl:grid-cols-[1fr_360px]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
              {calendarDays.map((day) => {
                const key = toDateKey(day);
                const events = calendarEvents.filter(
                  (event) => event.date === key,
                );
                const isToday = key === toDateKey(today);
                const isPast = day < today && !isToday;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => openCalendarPopup(key, events)}
                    className={`min-h-[150px] rounded-[1.75rem] border p-3 text-left transition hover:-translate-y-0.5 hover:border-pink-300 hover:shadow-lg ${
                      isToday
                        ? "border-pink-400 bg-pink-50 shadow-md shadow-pink-100"
                        : isPast
                          ? "border-slate-200 bg-slate-50/70"
                          : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                          {formatDay(day)}
                        </p>
                        {isToday && (
                          <p className="mt-1 inline-flex rounded-full bg-pink-600 px-2 py-0.5 text-[10px] font-black text-white">
                            Idag
                          </p>
                        )}
                      </div>
                      <CalendarDays size={16} className="text-pink-300" />
                    </div>

                    <div className="space-y-2">
                      {events.length === 0 ? (
                        <p className="text-xs font-bold text-slate-300">
                          Inga händelser
                        </p>
                      ) : (
                        events.map((event) => (
                          <div
                            key={`${event.date}-${event.title}`}
                            className={`rounded-2xl border px-3 py-2 text-xs font-bold ${getEventStyle(event.type)}`}
                          >
                            <p className="font-black">{event.title}</p>
                            <p className="mt-1 flex items-center gap-1 opacity-80">
                              <Clock size={12} /> {event.time}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <aside className="rounded-[1.75rem] border border-pink-100 bg-pink-50/50 p-4">
              <h3 className="text-xl font-black">Kommande företagsärenden</h3>
              <div className="mt-5 space-y-3">
                {upcomingEvents.slice(0, 6).map((event) => (
                  <div
                    key={`${event.date}-${event.title}`}
                    className="rounded-3xl bg-white p-4 shadow-sm"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="font-black">{event.title}</p>
                      <span
                        className={`rounded-full border px-2 py-1 text-xs font-black ${getEventStyle(event.type)}`}
                      >
                        {event.date.slice(5)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold leading-6 text-slate-600">
                      {event.description}
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <QuickCard
                icon={<ShoppingBag />}
                title="Företagsordrar"
                value="3 ordrar"
              />
              <QuickCard
                icon={<FileText />}
                title="Fakturor"
                value="2 aktiva"
              />
              <QuickCard
                icon={<Truck />}
                title="Leveranser"
                value="3 adresser"
              />
              <QuickCard
                icon={<CalendarDays />}
                title="Kalender"
                value="57 dagar"
              />
            </section>

            <ProfileCard
              id="foretagsuppgifter"
              title="Företagsuppgifter"
              icon={<Building2 size={22} />}
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <InfoTile
                  label="Företagsnamn"
                  value={company.name}
                  editable={isEditing}
                />
                <InfoTile
                  label="Organisationsnummer"
                  value={company.orgNumber}
                  editable={isEditing}
                />
                <InfoTile
                  label="VAT-nummer"
                  value={company.vatNumber}
                  editable={isEditing}
                />
                <InfoTile
                  label="Bransch"
                  value={company.industry}
                  editable={isEditing}
                />
                <InfoTile
                  label="Företagsrabatt"
                  value={company.discount}
                  editable={isEditing}
                />
                <InfoTile
                  label="Prenumeration"
                  value={company.activeSubscription ? "Aktiv" : "Ej aktiv"}
                  editable={isEditing}
                />
              </div>
            </ProfileCard>

            <ProfileCard
              id="bekraftelse"
              title="Faktura & bokföring"
              icon={<FileText size={22} />}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoTile
                  label="Faktura-e-post"
                  value={company.invoiceEmail}
                  editable={isEditing}
                />
                <InfoTile
                  label="Betalningsvillkor"
                  value={company.paymentTerms}
                  editable={isEditing}
                />
                <InfoTile
                  label="Kreditgräns"
                  value={company.creditLimit}
                  editable={isEditing}
                />
                <InfoTile
                  label="Kostnadsställe"
                  value={company.costCenter}
                  editable={isEditing}
                />
                <InfoTile
                  label="Fakturareferens"
                  value={company.accountingReference}
                  editable={isEditing}
                />
                <InfoTile
                  label="Admin-status"
                  value={company.adminReview}
                  editable={isEditing}
                />
              </div>
            </ProfileCard>

            <ProfileCard
              id="hogtid"
              title="Jag önskar att beställa"
              icon={<Sparkles size={22} />}
            >
              <div className="flex flex-wrap gap-2">
                {wishes.map((wish) => (
                  <span
                    key={wish}
                    className="rounded-full bg-pink-50 px-4 py-2 text-sm font-black text-pink-700"
                  >
                    {wish}
                  </span>
                ))}
              </div>
            </ProfileCard>

            <ProfileCard
              id="orderhistorik"
              title="Orderhistorik"
              icon={<PackageCheck size={22} />}
            >
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-black">{order.id}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {order.date} · {order.type} · {order.amount}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </ProfileCard>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <ProfileCard title="Kontaktperson" icon={<Users size={22} />}>
              <div className="space-y-3 text-sm">
                <ContactRow
                  icon={<Users size={17} />}
                  value={`${company.contactName}, ${company.contactRole}`}
                />
                <ContactRow
                  icon={<Mail size={17} />}
                  value={company.contactEmail}
                />
                <ContactRow
                  icon={<Phone size={17} />}
                  value={company.contactPhone}
                />
              </div>
            </ProfileCard>

            <ProfileCard title="Företagets kontakt" icon={<Home size={22} />}>
              <div className="space-y-3 text-sm">
                <ContactRow
                  icon={<Mail size={17} />}
                  value={company.companyEmail}
                />
                <ContactRow icon={<Phone size={17} />} value={company.phone} />
                <ContactRow
                  icon={<MapPin size={17} />}
                  value={`${company.address}, ${company.postalCode} ${company.city}`}
                />
              </div>
            </ProfileCard>

            <ProfileCard
              id="presentkort"
              title="Fakturakund"
              icon={<ShieldCheck size={22} />}
            >
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                <p className="font-black">{company.invoiceCustomerStatus}</p>
                <p className="mt-1">
                  AI-förkontroll är markerad som: {company.aiCreditCheck}.
                  Fördjupad kontroll sker via Admin/Super Admin.
                </p>
              </div>
              <Link
                href="/company/interest"
                className={`mt-4 w-full ${primaryButtonClass}`}
              >
                Skicka intresseanmälan
              </Link>
            </ProfileCard>

            <ProfileCard
              id="leveransadresser"
              title="Leveransadresser"
              icon={<Truck size={22} />}
            >
              <div className="space-y-2">
                {deliveryAddresses.map((address) => (
                  <div
                    key={address}
                    className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-700"
                  >
                    {address}
                  </div>
                ))}
              </div>
            </ProfileCard>
          </aside>
        </div>

        {selectedDate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-pink-100 bg-[#fffaf7] p-5 shadow-2xl sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4 rounded-[1.5rem] bg-gradient-to-r from-pink-100 via-rose-50 to-emerald-50 p-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-pink-700">
                    Företagskalender
                  </p>
                  <h3 className="mt-1 text-2xl font-black">{selectedDate}</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Välj vad företaget vill göra denna dag.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDate(null)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-pink-100 transition hover:bg-pink-600 hover:text-white"
                  aria-label="Stäng kalenderpopup"
                >
                  <X size={18} />
                </button>
              </div>

              {selectedDayEvents.length > 0 && (
                <div className="mb-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-pink-100">
                  <p className="mb-3 text-sm font-black">Händelser denna dag</p>
                  <div className="space-y-2">
                    {selectedDayEvents.map((event) => (
                      <div
                        key={`${event.date}-${event.title}`}
                        className={`rounded-2xl border px-4 py-3 text-sm font-bold ${getEventStyle(event.type)}`}
                      >
                        <p className="font-black">{event.title}</p>
                        <p className="mt-1 text-xs opacity-80">{event.time}</p>
                        <p className="mt-1 text-xs leading-5">
                          {event.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedDateNotes.length > 0 && (
                <div className="mb-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="mb-3 text-sm font-black text-emerald-900">
                    Sparade företagsanteckningar
                  </p>
                  <div className="space-y-3">
                    {selectedDateNotes.map((note, index) => (
                      <div
                        key={`${note.date}-${note.type}-${index}`}
                        className="rounded-2xl bg-white p-4 shadow-sm"
                      >
                        <p className="text-sm font-black">
                          {note.type}: {note.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {(
                  [
                    "Beställa",
                    "Prenumerera",
                    "Event",
                    "Sorgbukett",
                    "Presentkort",
                    "Faktura",
                    "Påminna",
                    "Jubileum",
                  ] as CalendarActionType[]
                ).map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => setActiveAction(action)}
                    className={`rounded-3xl border p-4 text-left text-sm font-black transition hover:-translate-y-0.5 ${
                      activeAction === action
                        ? "border-pink-500 bg-pink-600 text-white shadow-lg shadow-pink-200"
                        : "border-pink-100 bg-white text-slate-800 shadow-sm hover:border-pink-300 hover:text-pink-700 hover:shadow-md"
                    }`}
                  >
                    {action}
                    <span
                      className={`mt-1 block text-xs font-semibold ${activeAction === action ? "text-pink-100" : "text-slate-500"}`}
                    >
                      Lägg till eller navigera
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Link
                  href="/company/register"
                  className="rounded-full bg-pink-600 p-4 text-center text-sm font-black text-white shadow-lg shadow-pink-200 hover:bg-pink-700"
                >
                  Gå till beställning
                </Link>
                <Link
                  href="/company/interest"
                  className="rounded-full bg-pink-600 p-4 text-center text-sm font-black text-white shadow-lg shadow-pink-200 hover:bg-pink-700"
                >
                  Intresseanmälan
                </Link>
                <Link
                  href="/company/register"
                  className="rounded-full bg-emerald-600 p-4 text-center text-sm font-black text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700"
                >
                  Gäst-checkout med kort
                </Link>
              </div>

              {activeAction && (
                <div className="mt-5 rounded-3xl border border-pink-200 bg-pink-50 p-4">
                  <p className="text-sm font-black text-pink-900">
                    {activeAction} - skriv anteckning
                  </p>
                  <textarea
                    value={noteText}
                    onChange={(event) => setNoteText(event.target.value)}
                    rows={3}
                    placeholder="Ex. Beställ sorgbukett till kund, planera eventblommor eller påminn om faktura..."
                    className="mt-3 w-full resize-none rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm font-bold outline-none placeholder:text-slate-400 focus:border-pink-500"
                  />
                  <button
                    type="button"
                    onClick={saveCalendarNote}
                    className={primaryButtonClass}
                  >
                    Spara i kalendern
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-8 px-6 py-8 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-black">FloristSocial Business</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Företagsprofil för beställningar, fakturor, kalender, event och
                återkommande blomsterleveranser.
              </p>
            </div>
            <FooterCol
              title="Företag"
              items={["Profil", "Orderhistorik", "Fakturor", "Bokföring"]}
            />
            <FooterCol
              title="Beställningar"
              items={["Kontorsblommor", "Event", "Sorgbukett", "Presentkort"]}
            />
            <FooterCol
              title="Support"
              items={["Admin kontakt", "Fakturakund", "Villkor", "Integritet"]}
            />
          </div>
        </footer>
      </div>
    </main>
  );
}

function HeaderAction({
  icon,
  label,
  count,
}: {
  icon: React.ReactNode;
  label: string;
  count: string;
}) {
  return (
    <button className="flex items-center justify-center gap-2 rounded-full bg-white px-3 py-3 text-xs font-black text-slate-800 shadow-sm ring-1 ring-pink-100 transition hover:bg-pink-600 hover:text-white">
      {icon}
      <span className="hidden sm:inline">{label}</span>
      <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] text-pink-700">
        {count}
      </span>
    </button>
  );
}

function StatusBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-emerald-700">{value}</p>
    </div>
  );
}

function QuickCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <button className="flex items-center gap-4 rounded-[1.5rem] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-50 text-pink-700">
        {icon}
      </div>
      <div>
        <p className="text-sm font-black">{title}</p>
        <p className="mt-1 text-xs font-bold text-slate-500">{value}</p>
      </div>
    </button>
  );
}

function ProfileCard({
  id,
  title,
  icon,
  children,
}: {
  id?: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-[1.75rem] bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-pink-50 text-pink-700">
          {icon}
        </div>
        <h2 className="text-xl font-black tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function InfoTile({
  label,
  value,
  editable = false,
}: {
  label: string;
  value: string;
  editable?: boolean;
}) {
  return (
    <div className="rounded-3xl bg-slate-50 p-5">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      {editable ? (
        <input
          defaultValue={value}
          className="mt-2 w-full rounded-2xl border border-pink-100 bg-white px-3 py-2 text-sm font-black outline-none focus:border-pink-500"
        />
      ) : (
        <p className="mt-2 text-base font-black">{value}</p>
      )}
    </div>
  );
}

function CalendarShortcut({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-800 shadow-sm ring-1 ring-pink-100 transition hover:-translate-y-0.5 hover:bg-pink-600 hover:text-white hover:shadow-lg hover:shadow-pink-100"
    >
      {icon}
      {label}
    </Link>
  );
}

function ContactRow({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 font-bold text-slate-700">
      <span className="mt-0.5 text-pink-700">{icon}</span>
      <span>{value}</span>
    </div>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-400">
        {title}
      </p>
      <div className="mt-3 space-y-2 text-sm font-bold text-slate-700">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}
