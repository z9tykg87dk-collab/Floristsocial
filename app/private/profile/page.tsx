"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flower2,
  Gift,
  Heart,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  PackageCheck,
  Pencil,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  User,
} from "lucide-react";

type CalendarEventType =
  | "order"
  | "delivery"
  | "giftcard"
  | "reminder"
  | "confirmation"
  | "holiday";

type CalendarActionType = "Händelse" | "Födelsedag" | "Årsdag" | "Påminna";

type SavedCalendarNote = {
  date: string;
  type: CalendarActionType;
  text: string;
};

const detectedCountryLanguage = "Svenska";
const languages = [detectedCountryLanguage, "English"];

const colors = [
  "Rosa",
  "Vit",
  "Beige",
  "Lila",
  "Röd",
  "Grön",
  "Blå",
  "Aprikos",
];

const holidays = [
  "Alla hjärtans dag",
  "Mors dag",
  "Fars dag",
  "Jul",
  "Påsk",
  "Nyår",
  "Student",
  "Midsommar",
  "Födelsedagar",
  "Årsdagar",
];

const customer = {
  firstName: "Anna",
  lastName: "Svensson",
  email: "anna.svensson@email.se",
  phone: "070-123 45 67",
  address: "Storgatan 18",
  postalCode: "114 55",
  city: "Stockholm",
  country: "Sverige",
  memberSince: "Maj 2026",
  favoriteFlower: "Ros",
  favoriteColor: "Rosa och vitt",
  language: "Svenska",
  newsletter: true,
  selectedHolidays: ["Alla hjärtans dag", "Mors dag", "Jul"],
  preferredStyle: "Romantiskt",
  interests: ["Buketter", "Blomsterarrangemang", "Presentkort"],
  pollenAllergy: true,
  fragranceAllergy: false,
  fastCheckout: true,
  orderHistory: true,
  calendarEnabled: true,
  emailMarketing: true,
  smsMarketing: false,
  wishes:
    "Jag tycker om romantiska buketter i rosa, vitt och grönt. Undvik starkt doftande blommor vid större arrangemang.",
  emailVerified: true,
  phoneVerified: false,
};

const orders = [
  {
    id: "FS-PR-2026-00128",
    date: "2026-05-28",
    recipient: "Erik Andersson",
    amount: "1 675 kr",
    status: "Levererad",
  },
  {
    id: "FS-PR-2026-00094",
    date: "2026-05-10",
    recipient: "Mamma",
    amount: "895 kr",
    status: "Levererad",
  },
  {
    id: "FS-PR-2026-00041",
    date: "2026-04-02",
    recipient: "Anna Svensson",
    amount: "495 kr",
    status: "Hämtad",
  },
];

const calendarEvents: Array<{
  date: string;
  title: string;
  type: CalendarEventType;
  time: string;
  description: string;
}> = [
  {
    date: "2026-05-14",
    title: "Order levererad",
    type: "order",
    time: "16:20",
    description: "FS-PR-2026-00094 levererades till Mamma.",
  },
  {
    date: "2026-05-20",
    title: "Presentkort användes",
    type: "giftcard",
    time: "11:10",
    description: "Presentkort drogs av vid checkout.",
  },
  {
    date: "2026-05-26",
    title: "Orderbekräftelse",
    type: "confirmation",
    time: "14:35",
    description: "Order FS-PR-2026-00128 skapades och bekräftades.",
  },
  {
    date: "2026-05-28",
    title: "Leverans idag",
    type: "delivery",
    time: "12:00-17:00",
    description: "Bukett till Erik Andersson, Storgatan 18.",
  },
  {
    date: "2026-05-31",
    title: "Mors dag",
    type: "holiday",
    time: "Heldag",
    description: "Påminnelse: beställ blommor i god tid.",
  },
  {
    date: "2026-06-04",
    title: "Följ upp leverans",
    type: "reminder",
    time: "09:00",
    description: "Kontrollera leveransbekräftelse och mottagarstatus.",
  },
  {
    date: "2026-06-12",
    title: "Eriks födelsedag",
    type: "reminder",
    time: "Heldag",
    description: "Sparad födelsedag i privatkundens kalender.",
  },
  {
    date: "2026-06-18",
    title: "Presentkort går ut snart",
    type: "giftcard",
    time: "10:00",
    description: "Påminnelse om oanvänt presentkort.",
  },
  {
    date: "2026-07-02",
    title: "Planerad prenumerationsbukett",
    type: "delivery",
    time: "13:00-16:00",
    description: "Kommande leverans från prenumeration.",
  },
];

const favoriteFlorists = [
  "Makalösa Blommor",
  "Blomsterateljén Stockholm",
  "FloristSocial Premium Florist",
];

const today = new Date("2026-05-28T12:00:00");

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
    case "giftcard":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "confirmation":
      return "border-violet-200 bg-violet-50 text-violet-800";
    case "holiday":
      return "border-pink-200 bg-pink-50 text-pink-800";
    default:
      return "border-slate-200 bg-slate-50 text-slate-800";
  }
}

function getEventIcon(type: CalendarEventType) {
  switch (type) {
    case "order":
      return <ShoppingBag size={14} />;
    case "delivery":
      return <Truck size={14} />;
    case "giftcard":
      return <Gift size={14} />;
    case "confirmation":
      return <CheckCircle2 size={14} />;
    case "holiday":
      return <Flower2 size={14} />;
    default:
      return <Bell size={14} />;
  }
}

export default function PrivateCustomerProfilePage() {
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

  function openCalendarPopup(dateKey: string, events: typeof calendarEvents) {
    setSelectedDate(dateKey);
    setSelectedDayEvents(events);
    setActiveAction(null);
    setNoteText("");
  }

  function closeCalendarPopup() {
    setSelectedDate(null);
    setSelectedDayEvents([]);
    setActiveAction(null);
    setNoteText("");
  }

  function saveCalendarNote() {
    if (!selectedDate || !activeAction || !noteText.trim()) return;

    setSavedNotes((current) => [
      ...current,
      {
        date: selectedDate,
        type: activeAction,
        text: noteText.trim(),
      },
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
              FloristSocial Private
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Privatkund profil
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Kalendern är navet för order, leveranser, presentkort,
              bekräftelser, högtider och personliga påminnelser.
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-3 lg:max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white/80 px-4 py-3 shadow-sm">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                Språk
              </span>
              {languages.map((language) => (
                <button
                  key={language}
                  type="button"
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    language === detectedCountryLanguage
                      ? "bg-pink-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-pink-100 hover:text-pink-700"
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
              <Search size={18} className="text-pink-700" />
              <input
                placeholder="Sök order, leverans, florist, presentkort eller kalenderhändelse..."
                className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <HeaderAction
                icon={<MessageCircle size={17} />}
                label="Meddelanden"
                count="2"
              />
              <HeaderAction
                icon={<Bell size={17} />}
                label="Notiser"
                count="5"
              />
              <HeaderAction
                icon={<Heart size={17} />}
                label="Favoriter"
                count="3"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/private/customer-register"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-pink-700"
          >
            <ArrowLeft size={18} />
            Till privatkund registrering
          </Link>

          <Link
            href="/private/profile/edit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-pink-200 transition hover:bg-pink-700"
          >
            <Pencil size={16} />
            Redigera profil
          </Link>
        </div>

        <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/80">
          <div className="relative h-40 bg-gradient-to-br from-pink-200 via-rose-100 to-emerald-100 sm:h-72">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute left-10 top-10 h-24 w-24 rounded-full bg-white/70 blur-xl" />
              <div className="absolute right-16 top-20 h-32 w-32 rounded-full bg-pink-300/40 blur-2xl" />
              <div className="absolute bottom-8 left-1/2 h-24 w-24 rounded-full bg-emerald-200/50 blur-xl" />
            </div>
            <div className="absolute bottom-6 right-6 rounded-3xl bg-white/80 p-4 text-pink-700 shadow-sm backdrop-blur">
              <Flower2 size={40} />
            </div>
          </div>

          <div className="relative px-6 pb-8 sm:px-10">
            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="grid h-32 w-32 place-items-center rounded-[2rem] border-4 border-white bg-pink-100 text-pink-700 shadow-lg">
                  <User size={58} />
                </div>

                <div className="pb-2">
                  <div className="mb-2 inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-pink-700">
                    Privatkund
                  </div>
                  <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                    {customer.firstName} {customer.lastName}
                  </h1>
                  <p className="mt-2 flex flex-wrap items-center gap-3 text-sm font-bold text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={16} />
                      {customer.city}, {customer.country}
                    </span>
                    <span>Medlem sedan {customer.memberSince}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <StatusBadge
                  label="E-post"
                  active={customer.emailVerified}
                  activeText="Verifierad"
                  inactiveText="Ej verifierad"
                />
                <StatusBadge
                  label="SMS"
                  active={customer.phoneVerified}
                  activeText="Verifierad"
                  inactiveText="Verifiera"
                />
                <StatusBadge
                  label="Checkout"
                  active={customer.fastCheckout}
                  activeText="Aktiv"
                  inactiveText="Av"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-6">
          <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-700">
                Central kalender
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                2 veckor bakåt och 6 veckor framåt
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Här samlas order, leveranser, händelser, presentkort,
                bekräftelser, högtider och privata påminnelser.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <CalendarLegend label="Order" type="order" />
              <CalendarLegend label="Leverans" type="delivery" />
              <CalendarLegend label="Presentkort" type="giftcard" />
              <CalendarLegend label="Bekräftelse" type="confirmation" />
              <CalendarLegend label="Högtid" type="holiday" />
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-3 rounded-3xl bg-slate-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
            <button className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm hover:text-pink-700">
              <ChevronLeft size={16} />
              Föregående period
            </button>
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                Visar period
              </p>
              <p className="font-black text-slate-900">
                14 maj 2026 - 9 juli 2026
              </p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm hover:text-pink-700">
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
                    className={`min-h-[150px] rounded-3xl border p-3 text-left transition hover:-translate-y-0.5 hover:border-pink-300 hover:shadow-lg ${
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
                      <CalendarDays size={16} className="text-slate-300" />
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
                            className={`rounded-2xl border px-3 py-2 text-xs font-bold whitespace-normal break-words [overflow-wrap:anywhere] ${getEventStyle(event.type)}`}
                          >
                            <div className="mb-1 flex min-w-0 items-start gap-1 font-black leading-tight [overflow-wrap:anywhere]">
                              <span className="mt-0.5 shrink-0">
                                {getEventIcon(event.type)}
                              </span>
                              <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                                {event.title}
                              </span>
                            </div>
                            <p className="flex items-center gap-1 break-words opacity-80 [overflow-wrap:anywhere]">
                              <Clock size={12} className="shrink-0" />
                              <span className="min-w-0">{event.time}</span>
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <aside className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-xl font-black tracking-tight text-slate-950">
                Kommande viktiga händelser
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Snabb överblick över det kunden behöver agera på.
              </p>

              <div className="mt-5 space-y-3">
                {upcomingEvents.slice(0, 6).map((event) => (
                  <div
                    key={`${event.date}-${event.title}`}
                    className="rounded-3xl bg-white p-4 shadow-sm"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="font-black text-slate-950">{event.title}</p>
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
                title="Mina ordrar"
                value="3 ordrar"
              />
              <QuickCard
                icon={<Heart />}
                title="Sparade florister"
                value="3 favoriter"
              />
              <QuickCard icon={<Gift />} title="Presentkort" value="0 aktiva" />
              <QuickCard
                icon={<CalendarDays />}
                title="Kalender"
                value="57 dagar"
              />
            </section>

            <ProfileCard
              title="Min blomsterprofil"
              icon={<Sparkles size={22} />}
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <InfoTile
                  label="Favoritblomma"
                  value={customer.favoriteFlower}
                />
                <InfoTile label="Favoritfärg" value={customer.favoriteColor} />
                <InfoTile label="Språk" value={customer.language} />
                <InfoTile
                  label="Jag föredrar"
                  value={customer.preferredStyle}
                />
                <InfoTile
                  label="Nyhetsbrev"
                  value={customer.newsletter ? "Prenumererar" : "Inte aktiv"}
                />
                <InfoTile
                  label="Kalender"
                  value={customer.calendarEnabled ? "Aktiv" : "Av"}
                />
              </div>

              <div className="mt-5">
                <p className="mb-3 text-sm font-black text-slate-800">
                  Valda färger
                </p>
                <div className="mb-5 flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <span
                      key={color}
                      className="rounded-full bg-rose-100 px-4 py-2 text-sm font-black text-rose-700"
                    >
                      {color}
                    </span>
                  ))}
                </div>

                <p className="mb-3 text-sm font-black text-slate-800">
                  Jag är intresserad av
                </p>
                <div className="flex flex-wrap gap-2">
                  {customer.interests.map((interest) => (
                    <span
                      key={interest}
                      className="rounded-full bg-pink-50 px-4 py-2 text-sm font-black text-pink-700"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </ProfileCard>

            <ProfileCard
              title="Allergier & önskemål"
              icon={<ShieldCheck size={22} />}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <CheckRow
                  label="Pollenallergi"
                  active={customer.pollenAllergy}
                />
                <CheckRow
                  label="Allergi till doftande blommor"
                  active={customer.fragranceAllergy}
                />
              </div>

              <div className="mt-5 rounded-3xl bg-slate-50 p-5">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                  Mina önskemål
                </p>
                <p className="mt-2 text-sm font-semibold leading-7 text-slate-700">
                  {customer.wishes}
                </p>
              </div>
            </ProfileCard>

            <ProfileCard
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
                      <p className="font-black text-slate-950">{order.id}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {order.date} · {order.recipient} · {order.amount}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                        {order.status}
                      </span>
                      <button className="rounded-full border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 hover:border-pink-300 hover:text-pink-700">
                        Beställ igen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </ProfileCard>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <ProfileCard title="Kontaktuppgifter" icon={<Home size={22} />}>
              <div className="space-y-3 text-sm">
                <ContactRow icon={<Mail size={17} />} value={customer.email} />
                <ContactRow icon={<Phone size={17} />} value={customer.phone} />
                <ContactRow
                  icon={<MapPin size={17} />}
                  value={`${customer.address}, ${customer.postalCode} ${customer.city}, ${customer.country}`}
                />
              </div>

              <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                <p className="font-black">Verifiering vid ändringar</p>
                <p className="mt-1">
                  Ny e-post verifieras via länk. Nytt telefonnummer verifieras
                  via SMS-kod.
                </p>
              </div>
            </ProfileCard>

            <ProfileCard
              title="Högtidskalender"
              icon={<CalendarDays size={22} />}
            >
              <div className="mb-5 flex flex-wrap gap-2">
                {customer.selectedHolidays.map((holiday) => (
                  <span
                    key={holiday}
                    className="rounded-full bg-pink-50 px-4 py-2 text-sm font-black text-pink-700"
                  >
                    {holiday}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {holidays.map((holiday) => (
                  <div
                    key={holiday}
                    className="rounded-2xl bg-slate-50 px-3 py-2 text-xs font-black text-slate-700"
                  >
                    {holiday}
                  </div>
                ))}
              </div>
            </ProfileCard>

            <ProfileCard title="Sparade florister" icon={<Star size={22} />}>
              <div className="space-y-2">
                {favoriteFlorists.map((florist) => (
                  <button
                    key={florist}
                    className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm font-black text-slate-800 hover:bg-pink-50 hover:text-pink-700"
                  >
                    {florist}
                    <ChevronRight size={16} />
                  </button>
                ))}
              </div>
            </ProfileCard>

            <ProfileCard title="Kommunikation" icon={<Bell size={22} />}>
              <div className="mb-5 rounded-3xl border border-pink-100 bg-pink-50 p-5">
                <p className="text-sm font-black text-pink-800">
                  Prenumerera på vårt nyhetsbrev
                </p>
                <p className="mt-2 text-sm leading-6 text-pink-700">
                  Få inspiration, erbjudanden, säsongsbuketter och exklusiva
                  floristkampanjer direkt från FloristSocial.
                </p>
              </div>
              <div className="space-y-3">
                <CheckRow
                  label="Erbjudanden via e-post"
                  active={customer.emailMarketing}
                />
                <CheckRow
                  label="Erbjudanden via SMS"
                  active={customer.smsMarketing}
                />
                <CheckRow
                  label="Orderhistorik aktiverad"
                  active={customer.orderHistory}
                />
                <CheckRow
                  label="Snabb checkout aktiverad"
                  active={customer.fastCheckout}
                />
              </div>
            </ProfileCard>
          </aside>
        </div>

        {selectedDate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-pink-700">
                    Kalenderdag
                  </p>
                  <h3 className="mt-1 text-2xl font-black text-slate-950">
                    {selectedDate}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Välj vad kunden vill göra denna dag.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeCalendarPopup}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 hover:bg-pink-100 hover:text-pink-700"
                >
                  Stäng
                </button>
              </div>

              {selectedDayEvents.length > 0 && (
                <div className="mb-5 rounded-3xl bg-slate-50 p-4">
                  <p className="mb-3 text-sm font-black text-slate-800">
                    Händelser denna dag
                  </p>
                  <div className="space-y-2">
                    {selectedDayEvents.map((event) => (
                      <div
                        key={`${event.date}-${event.title}`}
                        className={`rounded-2xl border px-4 py-3 text-sm font-bold [overflow-wrap:anywhere] ${getEventStyle(event.type)}`}
                      >
                        <div className="flex items-start gap-2 font-black">
                          <span className="mt-0.5 shrink-0">
                            {getEventIcon(event.type)}
                          </span>
                          <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                            {event.title}
                          </span>
                        </div>
                        <p className="mt-1 text-xs opacity-80">{event.time}</p>
                        <p className="mt-1 text-xs leading-5 [overflow-wrap:anywhere]">
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
                    Sparade privata händelser
                  </p>
                  <div className="space-y-3">
                    {selectedDateNotes.map((note, index) => (
                      <div
                        key={`${note.date}-${note.type}-${index}`}
                        className="rounded-2xl bg-white p-4 shadow-sm"
                      >
                        <p className="text-sm font-black text-slate-950">
                          {note.type}: {note.text}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          Nästa steg: beställ blommor eller starta prenumeration
                          kopplat till denna händelse.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Link
                            href="/private/register"
                            className="rounded-full bg-pink-600 px-4 py-2 text-xs font-black text-white hover:bg-pink-700"
                          >
                            Beställa
                          </Link>
                          <Link
                            href="/private/subscription"
                            className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-700"
                          >
                            Prenumerera
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  href="/private/register"
                  className="rounded-3xl bg-pink-600 p-4 text-sm font-black text-white shadow-lg shadow-pink-100 hover:bg-pink-700"
                >
                  Beställa
                  <span className="mt-1 block text-xs font-semibold text-pink-100">
                    Gå till privat order-sida
                  </span>
                </Link>

                <Link
                  href="/private/subscription"
                  className="rounded-3xl bg-emerald-600 p-4 text-sm font-black text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700"
                >
                  Prenumerera
                  <span className="mt-1 block text-xs font-semibold text-emerald-100">
                    Gå till blomsterprenumeration
                  </span>
                </Link>

                {(
                  [
                    "Händelse",
                    "Födelsedag",
                    "Årsdag",
                    "Påminna",
                  ] as CalendarActionType[]
                ).map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => setActiveAction(action)}
                    className={`rounded-3xl border p-4 text-left text-sm font-black transition ${
                      activeAction === action
                        ? "border-pink-500 bg-pink-50 text-pink-800"
                        : "border-slate-200 bg-white text-slate-800 hover:border-pink-300 hover:text-pink-700"
                    }`}
                  >
                    {action}
                    <span className="mt-1 block text-xs font-semibold text-slate-500">
                      Skriv några ord
                    </span>
                  </button>
                ))}
              </div>

              {activeAction && (
                <div className="mt-5 rounded-3xl border border-pink-200 bg-pink-50 p-4">
                  <p className="text-sm font-black text-pink-900">
                    {activeAction} - skriv några ord
                  </p>
                  <textarea
                    value={noteText}
                    onChange={(event) => setNoteText(event.target.value)}
                    rows={3}
                    placeholder="Ex. Mamma fyller år, påminn mig att beställa rosa rosor..."
                    className="mt-3 w-full resize-none rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400 focus:border-pink-500"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={saveCalendarNote}
                      className="rounded-full bg-slate-950 px-5 py-2 text-sm font-black text-white hover:bg-pink-700"
                    >
                      Spara i kalendern
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveAction(null);
                        setNoteText("");
                      }}
                      className="rounded-full bg-white px-5 py-2 text-sm font-black text-slate-700 hover:text-pink-700"
                    >
                      Avbryt
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-8 px-6 py-8 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-black text-slate-950">
                FloristSocial
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                En modern blomsterplattform för privata kunder, florister och
                premium blomsterupplevelser.
              </p>
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-400">
                Konto
              </p>
              <div className="mt-3 space-y-2 text-sm font-bold text-slate-700">
                <p>Min profil</p>
                <p>Orderhistorik</p>
                <p>Inställningar</p>
                <p>Verifiering</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-400">
                Högtider
              </p>
              <div className="mt-3 space-y-2 text-sm font-bold text-slate-700">
                {holidays.slice(0, 4).map((holiday) => (
                  <p key={holiday}>{holiday}</p>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-400">
                Support
              </p>
              <div className="mt-3 space-y-2 text-sm font-bold text-slate-700">
                <p>Hjälpcenter</p>
                <p>Kontakta support</p>
                <p>Villkor</p>
                <p>Integritet</p>
              </div>
            </div>
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
    <button className="flex items-center justify-center gap-2 rounded-2xl bg-white px-3 py-3 text-xs font-black text-slate-800 shadow-sm transition hover:bg-pink-600 hover:text-white">
      {icon}
      <span className="hidden sm:inline">{label}</span>
      <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] text-pink-700">
        {count}
      </span>
    </button>
  );
}

function CalendarLegend({
  label,
  type,
}: {
  label: string;
  type: CalendarEventType;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black ${getEventStyle(type)}`}
    >
      {getEventIcon(type)}
      {label}
    </span>
  );
}

function StatusBadge({
  label,
  active,
  activeText,
  inactiveText,
}: {
  label: string;
  active: boolean;
  activeText: string;
  inactiveText: string;
}) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p
        className={`mt-1 text-sm font-black ${active ? "text-emerald-700" : "text-amber-700"}`}
      >
        {active ? activeText : inactiveText}
      </p>
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
        <p className="text-sm font-black text-slate-900">{title}</p>
        <p className="mt-1 text-xs font-bold text-slate-500">{value}</p>
      </div>
    </button>
  );
}

function ProfileCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-pink-50 text-pink-700">
          {icon}
        </div>
        <h2 className="text-xl font-black tracking-tight text-slate-950">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-5">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}

function CheckRow({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800">
      <span>{label}</span>
      {active ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-black text-emerald-700">
          <CheckCircle2 size={14} /> Ja
        </span>
      ) : (
        <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-black text-slate-600">
          Nej
        </span>
      )}
    </div>
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
