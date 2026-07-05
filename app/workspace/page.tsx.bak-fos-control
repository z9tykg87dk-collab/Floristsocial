import Link from "next/link";
import {
  CalendarDays,
  CreditCard,
  Package,
  Truck,
  Users,
  FileText,
  PlusCircle,
  ShieldCheck,
  Flower2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  getMorningBriefing,
  getWorkspaceCards,
  getWorkspaceTasks,
} from "@/engines/workspace/services/WorkspaceService";
import type { WorkspaceCard, WorkspaceTask } from "@/engines/workspace/types";
import FloristFlower from "@/components/brand/FloristFlower";

const iconMap: Record<string, React.ReactNode> = {
  orders: <Package size={24} />,
  calendar: <CalendarDays size={24} />,
  production: <Flower2 size={24} />,
  "yesterday-production": <CalendarDays size={24} />,
  deliveries: <Truck size={24} />,
  courier: <Truck size={24} />,
  trust: <FloristFlower size={26} />,
  crm: <Users size={24} />,
};

const toneMap: Record<string, string> = {
  urgent: "border-rose-200 bg-rose-50 text-rose-700",
  today: "border-amber-200 bg-amber-50 text-amber-700",
  planned: "border-emerald-200 bg-emerald-50 text-emerald-700",
  done: "border-slate-200 bg-slate-50 text-slate-500",
};

export default async function WorkspacePage() {
  const briefing = await getMorningBriefing();
  const cards = (await getWorkspaceCards()).slice(0, 8);
  const tasks = await getWorkspaceTasks();
  const visibleTasks = tasks.slice(0, 8);
  const nextTask = tasks[0];
  const hiddenCount = Math.max(tasks.length - visibleTasks.length, 0);

  return (
    <main className="min-h-screen bg-[#f7f2ea] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[2.25rem] bg-white shadow-xl shadow-slate-200/70">
          <div className="relative min-h-[300px] bg-gradient-to-br from-pink-50 via-white to-emerald-50 p-7 sm:p-10">
            <div className="relative z-10 max-w-4xl">
              <p className="mb-4 inline-flex rounded-full bg-pink-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-pink-700">
                FloristSocial Arbetsyta
              </p>

              <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
                {briefing.greeting}
              </h1>

              <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-600">
                FOS visar vad som är viktigast nu och hjälper dig vidare steg för steg.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-4">
                {briefing.messages.slice(0, 4).map((message) => (
                  <div
                    key={message}
                    className="rounded-3xl border border-slate-200 bg-white/90 px-5 py-4 text-sm font-bold leading-6 text-slate-800 shadow-sm"
                  >
                    {message}
                  </div>
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-0 right-0 hidden h-72 w-72 items-center justify-center rounded-tl-[5rem] bg-pink-100/40 lg:flex">
              <Flower2 size={150} className="text-pink-500" />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <section className="rounded-[2.25rem] bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-700">
                    Nästa steg
                  </p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight">
                    {nextTask.title}
                  </h2>
                  <p className="mt-2 text-sm font-semibold text-slate-600">
                    {nextTask.description}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button className="inline-flex h-12 items-center justify-center rounded-2xl bg-pink-600 px-5 text-sm font-black text-white">
                    Starta arbete
                  </button>
                  <button className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-100 px-5 text-sm font-black text-slate-700">
                    Klar
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-pink-100 bg-pink-50/50 p-5">
                <div className="grid gap-4 md:grid-cols-3">
                  <Info label="Tid" value={nextTask.time || "Nu"} />
                  <Info label="Kategori" value={nextTask.group} />
                  <Info label="Beräknad tid" value={`${nextTask.estimatedMinutes || 10} min`} />
                </div>
              </div>
            </section>

            <section className="rounded-[2.25rem] bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-700">
                    FOS överblick
                  </p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight">
                    Din arbetsdag
                  </h2>
                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    8 av {tasks.length} uppgifter visas • Sorterade efter prioritet
                  </p>
                </div>

                <button className="rounded-full bg-pink-50 px-4 py-2 text-sm font-black text-pink-700">
                  Visa alla uppgifter {hiddenCount > 0 ? `(+${hiddenCount})` : ""}
                </button>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {visibleTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </section>

            <section className="rounded-[2.25rem] bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-700">
                  FOS kort
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  Översikt
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                  <WorkspaceCardView key={card.id} card={card} />
                ))}
              </div>
            </section>
          </div>

          <aside className="rounded-[2.25rem] bg-white p-6 shadow-xl shadow-slate-200/70">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-pink-50 text-pink-700">
                <CalendarDays size={28} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-700">
                  Dagens agenda
                </p>
                <h2 className="text-2xl font-black tracking-tight">Idag</h2>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              {tasks
                .filter((task) => task.time)
                .map((task) => (
                  <AgendaItem
                    key={task.id}
                    time={task.time || ""}
                    title={task.title}
                    text={task.group}
                  />
                ))}
            </div>

            <Link
              href="/workspace/calendar"
              className="mt-8 inline-flex h-13 w-full items-center justify-center rounded-2xl bg-pink-600 px-5 text-sm font-black text-white hover:bg-pink-700"
            >
              Öppna kalendern
            </Link>
          </aside>
        </section>

        <section className="rounded-[2rem] bg-white px-6 py-4 shadow-xl shadow-slate-200/70">
          <div className="flex flex-wrap items-center gap-4">
            <p className="mr-3 text-xs font-black uppercase tracking-[0.18em] text-pink-700">
              Snabba åtkomster
            </p>

            <QuickAction title="Ny order" icon={<PlusCircle size={22} />} href="/orders" />
            <QuickAction title="Ny leverans" icon={<Truck size={22} />} href="/workspace/calendar" />
            <QuickAction title="Ny kund" icon={<Users size={22} />} href="/workspace" />
            <QuickAction title="Ny offert" icon={<FileText size={22} />} href="/workspace" />
            <QuickAction title="Trust Rating" icon={<ShieldCheck size={22} />} href="/trust/rating" />
            <QuickAction title="Kalender" icon={<CalendarDays size={22} />} href="/workspace/calendar" />
          </div>
        </section>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-pink-700">
        {label}
      </p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

function TaskCard({ task }: { task: WorkspaceTask }) {
  return (
    <section className="flex min-h-[190px] flex-col justify-between rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className={`rounded-full border px-3 py-1 text-xs font-black ${toneMap[task.status]}`}>
            {task.status === "urgent" ? "Brådskande" : task.status === "today" ? "Idag" : "Planerad"}
          </span>
          {task.time && (
            <span className="inline-flex items-center gap-1 text-xs font-black text-slate-500">
              <Clock size={14} />
              {task.time}
            </span>
          )}
        </div>

        <h3 className="text-base font-black leading-6">{task.title}</h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
          {task.description || task.group}
        </p>
      </div>

      <button className="mt-5 inline-flex h-10 w-fit items-center gap-2 rounded-2xl bg-slate-50 px-4 text-sm font-black text-slate-700">
        <CheckCircle2 size={16} />
        Klar
      </button>
    </section>
  );
}

function WorkspaceCardView({ card }: { card: WorkspaceCard }) {
  return (
    <section className="flex min-h-[170px] flex-col justify-between rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-pink-50 text-pink-700">
            {iconMap[card.id] || <CalendarDays size={24} />}
          </div>

          {card.value !== undefined && (
            <div className="rounded-full bg-pink-50 px-4 py-2 text-sm font-black text-pink-700">
              {card.value}
            </div>
          )}
        </div>

        <h3 className="text-lg font-black tracking-tight">{card.title}</h3>

        {card.subtitle && (
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
            {card.subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

function AgendaItem({ time, title, text }: { time: string; title: string; text: string }) {
  return (
    <div className="grid grid-cols-[58px_1fr] gap-4">
      <p className="text-sm font-black text-slate-600">{time}</p>
      <div>
        <p className="font-black text-slate-950">{title}</p>
        <p className="mt-1 text-sm font-semibold text-slate-500">{text}</p>
      </div>
    </div>
  );
}

function QuickAction({ title, icon, href }: { title: string; icon: React.ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-900 hover:bg-pink-50"
    >
      <span className="text-pink-700">{icon}</span>
      {title}
    </Link>
  );
}
