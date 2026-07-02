import { CalendarDays, ChevronRight } from "lucide-react";

type CalendarItem = {
  date: string;
  title: string;
  type: string;
};

type ProfileCalendarProps = {
  roleLabel: string;
  description: string;
  items?: CalendarItem[];
};

const defaultItems: CalendarItem[] = [
  { date: "Idag", title: "Ny aktivitet", type: "Aktivitet" },
  { date: "Imorgon", title: "Kommande händelse", type: "Planerat" },
  { date: "Denna vecka", title: "Uppföljning", type: "Påminnelse" },
];

export default function ProfileCalendar({
  roleLabel,
  description,
  items = defaultItems,
}: ProfileCalendarProps) {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/70">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-700">
            Kalender / Aktiviteter
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight">
            {roleLabel}
          </h2>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
            {description}
          </p>
        </div>

        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-50 text-pink-700">
          <CalendarDays size={24} />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <div
            key={`${item.date}-${item.title}`}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
          >
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              {item.date}
            </p>
            <h3 className="mt-2 text-base font-black text-slate-950">
              {item.title}
            </h3>
            <p className="mt-1 text-sm font-semibold text-pink-700">
              {item.type}
            </p>
          </div>
        ))}
      </div>

      <button className="mt-5 inline-flex items-center gap-2 text-sm font-black text-pink-700">
        Öppna hela kalendern
        <ChevronRight size={16} />
      </button>
    </section>
  );
}
