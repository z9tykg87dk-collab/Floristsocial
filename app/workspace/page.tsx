import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  Brain,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Cpu,
  Database,
  HeartPulse,
  ListChecks,
  MemoryStick,
  Network,
  PackageCheck,
  PlugZap,
  RefreshCcw,
  Route,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";
import { getFosSystemHealthReport } from "@/lib/fos/system-health";

const engines = [
  {
    id: "FOS-01",
    title: "Core Snapshot",
    href: "/workspace",
    api: "/api/fos/snapshot",
    icon: Database,
    health: 100,
    jobs: 128,
    latency: "18 ms",
    description: "Samlar nuläget från hela FloristSocial.",
  },
  {
    id: "FOS-02",
    title: "Intelligence",
    href: "/superadmin/development/intelligence",
    api: "/api/fos/intelligence",
    icon: Brain,
    health: 92,
    jobs: 41,
    latency: "44 ms",
    description: "Analyserar data och skapar rekommendationer.",
  },
  {
    id: "FOS-03",
    title: "Decision Engine",
    href: "/superadmin/development/workflow",
    api: "/api/fos/decision",
    icon: Route,
    health: 98,
    jobs: 76,
    latency: "26 ms",
    description: "Fattar beslut baserat på order, kalender och händelser.",
  },
  {
    id: "FOS-04",
    title: "Event Store",
    href: "/superadmin/development/event-bus",
    api: "/api/fos/events",
    icon: Network,
    health: 100,
    jobs: 542,
    latency: "12 ms",
    description: "Sparar alla händelser i systemet.",
  },
  {
    id: "FOS-05",
    title: "Memory Engine",
    href: "/superadmin/development/fos-state",
    api: "/api/fos/memory",
    icon: MemoryStick,
    health: 88,
    jobs: 93,
    latency: "39 ms",
    description: "Kommer ihåg tidigare beslut och mönster.",
  },
  {
    id: "FOS-06",
    title: "Action Queue",
    href: "/superadmin/development/order-workflow",
    api: "/api/fos/action-queue",
    icon: ListChecks,
    health: 74,
    jobs: 18,
    latency: "71 ms",
    description: "Lägger åtgärder i kö för utförande.",
  },
  {
    id: "FOS-07",
    title: "Automation",
    href: "/superadmin/development/production",
    api: "/api/fos/automation",
    icon: Zap,
    health: 96,
    jobs: 64,
    latency: "31 ms",
    description: "Utför automatiserade arbetsflöden.",
  },
  {
    id: "FOS-08",
    title: "System Health",
    href: "/superadmin/development/security",
    api: "/api/fos/system-health",
    icon: HeartPulse,
    health: 100,
    jobs: 8,
    latency: "9 ms",
    description: "Övervakar plattformens hälsa.",
  },
];

const liveStats = [
  { label: "Aktiva florister", value: "328", icon: Users, tone: "emerald" },
  { label: "Aktiva order", value: "51", icon: PackageCheck, tone: "pink" },
  { label: "Leveranser idag", value: "19", icon: Truck, tone: "amber" },
  { label: "Notifieringar", value: "28", icon: Bell, tone: "sky" },
  { label: "Betalningar", value: "17", icon: WalletCards, tone: "violet" },
  { label: "Kalenderjobb", value: "43", icon: CalendarDays, tone: "rose" },
];

const services = [
  ["Platform", "Healthy"],
  ["API", "Healthy"],
  ["Database", "Healthy"],
  ["Stripe", "Healthy"],
  ["Chat", "Healthy"],
  ["Calendar", "Healthy"],
  ["CRM", "Healthy"],
  ["Workflow", "Healthy"],
];

const activities = [
  ["02:14", "Ny order skapad", "Order #8451 skickades till Production Engine."],
  ["02:13", "Produktion startad", "Floristens arbetsflöde aktiverades."],
  ["02:12", "Stripe betalning klar", "Betalning registrerad och verifierad."],
  ["02:11", "Kalender uppdaterad", "Leveransblock skapades automatiskt."],
  ["02:10", "CRM uppdaterad", "Kundprofil och orderhistorik synkades."],
];

const quickActions = [
  { label: "System Health", href: "/superadmin/development/security", icon: HeartPulse },
  { label: "Event Bus", href: "/superadmin/development/event-bus", icon: PlugZap },
  { label: "Workflow", href: "/superadmin/development/workflow", icon: Route },
  { label: "Calendar", href: "/workspace/calendar", icon: CalendarDays },
  { label: "Production", href: "/superadmin/development/production", icon: PackageCheck },
  { label: "Audit", href: "/superadmin/development/audit", icon: ShieldCheck },
];

export default function WorkspacePage() {
  const health = getFosSystemHealthReport();

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-8 text-stone-950 md:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[38px] bg-gradient-to-br from-stone-950 via-stone-900 to-pink-950 p-7 text-white shadow-2xl md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black ring-1 ring-white/15">
                <Activity size={17} />
                FloristSocial Mission Control
              </div>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
                Övervaka hela FloristSocial i realtid
              </h1>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-white/75 md:text-base">
                Kontrollpanel för FOS-motorer, orderflöden, kalender, produktion,
                ekonomi, notifieringar och systemhälsa.
              </p>
            </div>

            <Link
              href="/superadmin/development/security"
              className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white transition hover:bg-pink-700"
            >
              System Health
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-4">
            {services.map(([name, status]) => (
              <div
                key={name}
                className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10"
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/50">
                  {name}
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm font-black text-emerald-300">
                  <CheckCircle2 size={16} />
                  {status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {liveStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-pink-50 text-pink-600">
                    <Icon size={21} />
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
                    Live
                  </span>
                </div>
                <p className="mt-5 text-3xl font-black">{stat.value}</p>
                <p className="mt-1 text-sm font-bold text-stone-500">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-[34px] bg-white p-6 shadow-sm ring-1 ring-stone-200/70 md:p-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-pink-600">
                  FOS Engines
                </p>
                <h2 className="text-3xl font-black tracking-tight">
                  Aktiva motorer
                </h2>
              </div>
              <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                {health.summary.healthy}/{health.summary.total} healthy
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {engines.map((engine) => {
                const Icon = engine.icon;
                return (
                  <article
                    key={engine.id}
                    className="rounded-[28px] bg-stone-50 p-5 ring-1 ring-stone-200 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-50 text-pink-600">
                        <Icon size={22} />
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                        Active
                      </span>
                    </div>

                    <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-600">
                      {engine.id}
                    </p>
                    <h3 className="mt-1 text-lg font-black">{engine.title}</h3>
                    <p className="mt-2 min-h-[56px] text-sm leading-6 text-stone-600">
                      {engine.description}
                    </p>

                    <div className="mt-4">
                      <div className="mb-1 flex justify-between text-xs font-black text-stone-500">
                        <span>Health</span>
                        <span>{engine.health}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                        <div
                          className="h-full rounded-full bg-pink-600"
                          style={{ width: `${engine.health}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-stone-600">
                      <span>Jobs: {engine.jobs}</span>
                      <span>{engine.latency}</span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Link
                        href={engine.href}
                        className="rounded-full bg-stone-950 px-4 py-2 text-sm font-black text-white"
                      >
                        Dashboard
                      </Link>
                      <a
                        href={engine.api}
                        target="_blank"
                        className="rounded-full bg-white px-4 py-2 text-sm font-black text-stone-900 ring-1 ring-stone-200"
                      >
                        API
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="grid gap-6">
            <div className="rounded-[34px] bg-white p-6 shadow-sm ring-1 ring-stone-200/70">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-pink-600">
                Live Activity
              </p>
              <h2 className="text-2xl font-black">Senaste händelser</h2>

              <div className="mt-5 space-y-4">
                {activities.map(([time, title, text]) => (
                  <div key={`${time}-${title}`} className="flex gap-3">
                    <div className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-pink-50 text-pink-600">
                      <Clock3 size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-stone-400">{time}</p>
                      <p className="font-black">{title}</p>
                      <p className="text-sm leading-6 text-stone-500">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] bg-white p-6 shadow-sm ring-1 ring-stone-200/70">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-pink-600">
                Quick Actions
              </p>
              <h2 className="text-2xl font-black">Kontroller</h2>

              <div className="mt-5 grid gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3 font-black ring-1 ring-stone-200 transition hover:bg-pink-50"
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={18} className="text-pink-600" />
                        {action.label}
                      </span>
                      <ArrowRight size={16} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-[34px] bg-white p-6 shadow-sm ring-1 ring-stone-200/70 md:p-8">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-pink-600">
              Performance
            </p>
            <h2 className="text-3xl font-black tracking-tight">Systemlast</h2>

            <div className="mt-6 space-y-5">
              <Metric label="CPU" value={63} icon={Cpu} />
              <Metric label="Memory" value={81} icon={MemoryStick} />
              <Metric label="Database" value={48} icon={Database} />
              <Metric label="Queue" value={72} icon={ListChecks} />
            </div>
          </div>

          <div className="rounded-[34px] bg-stone-950 p-6 text-white shadow-sm md:p-8">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-pink-400">
              Kernel Flow
            </p>
            <h2 className="text-3xl font-black tracking-tight">
              Så arbetar FOS
            </h2>

            <div className="mt-6 grid gap-3 md:grid-cols-4">
              {[
                "Event",
                "Event Store",
                "Memory",
                "Intelligence",
                "Decision",
                "Action Queue",
                "Automation",
                "Calendar / CRM / Economy",
              ].map((step, index) => (
                <div
                  key={step}
                  className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10"
                >
                  <p className="text-xs font-black text-pink-300">
                    Steg {index + 1}
                  </p>
                  <p className="mt-2 font-black">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Activity;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-black">
        <span className="flex items-center gap-2">
          <Icon size={17} className="text-pink-600" />
          {label}
        </span>
        <span>{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-stone-100">
        <div
          className="h-full rounded-full bg-pink-600"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
