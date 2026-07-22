import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  Brain,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Cpu,
  Database,
  HeartPulse,
  ListChecks,
  MapPinned,
  MemoryStick,
  Network,
  PackageCheck,
  PlugZap,
  Route,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";
import { listFosEvents } from "@/lib/fos/event-store";
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
  { label: "Aktiva florister", value: "328", icon: Users },
  { label: "Aktiva order", value: "51", icon: PackageCheck },
  { label: "Leveranser idag", value: "19", icon: Truck },
  { label: "Notifieringar", value: "28", icon: Bell },
  { label: "Betalningar", value: "17", icon: WalletCards },
  { label: "Kalenderjobb", value: "43", icon: CalendarDays },
];

const services = [
  "Platform",
  "API",
  "Database",
  "Stripe",
  "Chat",
  "Calendar",
  "CRM",
  "Workflow",
];

const quickActions = [
  { label: "FOS Timeline", href: "/workspace#fos-timeline", icon: Activity },
  { label: "System Health", href: "/workspace/system-health", icon: HeartPulse },
  { label: "Orders", href: "/orders", icon: PackageCheck },
  { label: "Calendar", href: "/workspace/calendar", icon: CalendarDays },
  { label: "Florists", href: "/florists", icon: Users },
  { label: "Map", href: "/florists/map", icon: MapPinned },
  { label: "Chat", href: "/florist-chat", icon: Bell },
  { label: "Economy", href: "/superadmin/development/economy", icon: WalletCards },
  { label: "Event Store", href: "/workspace/event-store", icon: Network },
  { label: "Memory", href: "/workspace/memory", icon: MemoryStick },
  { label: "Intelligence", href: "/workspace/intelligence", icon: Brain },
  { label: "Decision", href: "/workspace/decision", icon: Route },
  { label: "Action Queue", href: "/workspace/action-queue", icon: ListChecks },
  { label: "Prioritetscenter", href: "/workspace/priority-center", icon: AlertTriangle },
  { label: "Automation", href: "/workspace/automation", icon: Zap },
  { label: "Workflow", href: "/superadmin/development/workflow", icon: PlugZap },
  { label: "Audit", href: "/superadmin/development/audit", icon: ShieldCheck },
];

const missionPanels = [
  { label: "Orderflöde", value: "Aktivt", icon: PackageCheck },
  { label: "Floristnätverk", value: "Online", icon: Users },
  { label: "Geosökning", value: "Förbereds", icon: MapPinned },
  { label: "FOS AI", value: "Redo", icon: Sparkles },
];

export default function WorkspacePage() {
  const health = getFosSystemHealthReport();
  const recentEvents = [...listFosEvents()]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-10 text-stone-950 md:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-stone-950 via-stone-900 to-pink-950 p-8 text-white shadow-2xl ring-1 ring-white/10 md:p-11">
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-pink-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 right-8 h-44 w-44 rounded-full bg-sky-300/10 blur-3xl" />
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
                        <div className="mt-9 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black ring-1 ring-white/15">
                <Activity size={17} />
                FloristSocial Operating System
              </div>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
                FOS-Aktivitetskontroll
              </h1>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-white/75 md:text-base">
                Kontrollrum för orderflöden, florister, leveranser, kalender,
                produktion, ekonomi, notifieringar och FOS-motorer.
              </p>
            </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/superadmin/development/security"
                className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-5 py-3 text-sm font-black !text-white transition hover:bg-pink-700"
              >
                System Health
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/workspace/action-queue"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-black !text-white ring-1 ring-white/15 transition hover:bg-white/15"
              >
                Action Queue
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/workspace/priority-center"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-black !text-white transition hover:bg-red-700"
              >
                Prioritetscenter
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {missionPanels.map((panel) => {
              const Icon = panel.icon;

              return (
                <div
                  key={panel.label}
                  className="rounded-3xl bg-white/[0.11] p-5 shadow-lg shadow-black/10 ring-1 ring-white/15"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-pink-200">
                      <Icon size={21} />
                    </div>
                    <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-200 ring-1 ring-emerald-300/20">
                      Live
                    </span>
                  </div>
                  <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-white/45">
                    {panel.label}
                  </p>
                  <p className="mt-1 text-2xl font-black">{panel.value}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-9 grid gap-3 md:grid-cols-4">
            {services.map((name) => (
              <div
                key={name}
                className="rounded-2xl bg-white/[0.09] p-4 shadow-md shadow-black/10 ring-1 ring-white/15"
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/50">
                  {name}
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm font-black text-emerald-300">
                  <CheckCircle2 size={16} />
                  Healthy
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
                className="rounded-[28px] bg-white p-5 shadow-md shadow-stone-200/60 ring-1 ring-stone-200/80 transition hover:-translate-y-0.5 hover:shadow-lg"
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

        <section className="mt-9 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-[34px] bg-white p-6 shadow-md shadow-stone-200/60 ring-1 ring-stone-200/80 md:p-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
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
                    className="rounded-[28px] bg-stone-50 p-5 shadow-sm shadow-stone-200/40 ring-1 ring-stone-200 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
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
                        className="rounded-full bg-stone-950 px-4 py-2 text-sm font-black !text-white"
                      >
                        Dashboard
                      </Link>
                      <a
                        href={engine.api}
                        target="_blank"
                        rel="noreferrer"
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
            <div id="fos-timeline" className="rounded-[34px] bg-white p-6 shadow-md shadow-stone-200/60 ring-1 ring-stone-200/80">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-pink-600">
                FOS Timeline
              </p>
              <h2 className="text-2xl font-black">Orderns väg genom FOS</h2>

              {recentEvents.length === 0 ? (
                <p className="mt-5 text-sm leading-6 text-stone-500">
                  Inga händelser i Event Store ännu.
                </p>
              ) : (
                <div className="mt-5 space-y-0">
                  {recentEvents.map((event, index) => (
                    <div key={event.id} className="relative rounded-2xl px-2 py-1.5 transition hover:bg-stone-50/80">
                      {index < recentEvents.length - 1 ? (
                        <div className="absolute left-7 top-12 h-[calc(100%-2.85rem)] w-px bg-stone-200" />
                      ) : null}

                      <div className="z-10 mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-pink-50 text-pink-600 ring-4 ring-white">
                        <Clock3 size={18} />
                      </div>

                      <div className="min-w-0 pt-0.5">
                        <p className="text-xs font-black text-stone-400">
                          {new Date(event.createdAt).toLocaleString("sv-SE")}
                        </p>
                        <p className="font-black">{event.type}</p>
                        <p className="text-sm leading-6 text-stone-500">
                          {describeEvent(event.sourceModule, event.status, event.payload)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[34px] bg-stone-50/70 p-6 shadow-md shadow-stone-200/60 ring-1 ring-stone-200/80 backdrop-blur-sm">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-pink-600">
                FOS Launchpad
              </p>
              <h2 className="text-2xl font-black">Snabbkommandon</h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 font-black shadow-sm shadow-stone-200/40 ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:bg-pink-50 hover:shadow-md"
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

        <section className="mt-9 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-[34px] bg-stone-950 p-6 text-white shadow-md shadow-stone-300/40 ring-1 ring-white/10 md:p-8">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-pink-600">
              FOS Monitor
            </p>
            <h2 className="text-3xl font-black tracking-tight">Systemlast</h2>

            <div className="mt-6 space-y-5">
              <Metric label="CPU" value={63} icon={Cpu} />
              <Metric label="Memory" value={81} icon={MemoryStick} />
              <Metric label="Database" value={48} icon={Database} />
              <Metric label="Queue" value={72} icon={ListChecks} />
              <Metric label="API" value={39} icon={PlugZap} />
              <Metric label="Network" value={54} icon={Network} />
              <Metric label="Stripe" value={28} icon={WalletCards} />
              <Metric label="Automation" value={67} icon={Zap} />
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
                  className="rounded-2xl bg-white/[0.12] p-4 shadow-md shadow-black/15 ring-1 ring-white/15"
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

        <section className="mt-8 rounded-[34px] bg-white p-6 shadow-sm ring-1 ring-stone-200/70 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-pink-600">
                Geo Control
              </p>
              <h2 className="text-3xl font-black tracking-tight">
                Karta & floristmatchning
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-500">
                Förberedande kontrollpanel för florist nära mottagare,
                postnummer, adressökning, leveransområde och framtida live-karta.
              </p>
            </div>

            <Link
              href="/florists/map"
              className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-black !text-white transition hover:bg-stone-800"
            >
              Öppna karta
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative min-h-[320px] overflow-hidden rounded-[30px] bg-gradient-to-br from-emerald-50 via-sky-50 to-pink-50 p-6 ring-1 ring-stone-200">
              <div className="absolute inset-0 opacity-50">
                <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-pink-200 blur-3xl" />
                <div className="absolute bottom-8 right-12 h-40 w-40 rounded-full bg-emerald-200 blur-3xl" />
                <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-200 blur-3xl" />
              </div>

              <div className="relative grid h-full min-h-[270px] place-items-center rounded-[24px] border border-dashed border-stone-300 bg-white/45 p-6 text-center">
                <div>
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-pink-600 text-white shadow-lg">
                    <MapPinned size={30} />
                  </div>
                  <h3 className="mt-5 text-2xl font-black">
                    Live-karta kommer här
                  </h3>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-stone-600">
                    Nästa geo-steg blir att koppla postnummer, adress,
                    stadsdel, nära mig och floristens leveransradie till samma
                    sökflöde.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                ["Postnummer", "Sökning via svenskt postnummer"],
                ["Adress + nr", "Exakt mottagaradress"],
                ["Stadsdel", "Matchning inom område"],
                ["Nära mig", "IP/geolocation-knapp"],
                ["Land", "Val för internationell leverans"],
              ].map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-3xl bg-stone-50 p-5 shadow-sm shadow-stone-200/40 ring-1 ring-stone-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-pink-50 text-pink-600">
                      <MapPinned size={18} />
                    </div>
                    <div>
                      <p className="font-black">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-stone-500">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function describeEvent(sourceModule: string, status: string, payload: Record<string, any>) {
  if (typeof payload.orderId === "string") {
    return `${sourceModule}: Order ${payload.orderId} (${status}).`;
  }

  if (typeof payload.conversationId === "string") {
    return `${sourceModule}: Konversation ${payload.conversationId} (${status}).`;
  }

  if (typeof payload.rating === "number") {
    return `${sourceModule}: Ny rating ${payload.rating} (${status}).`;
  }

  return `${sourceModule}: Händelse registrerad (${status}).`;
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
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
