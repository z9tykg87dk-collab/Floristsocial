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
import WorkspaceGeoControl from "@/components/workspace/WorkspaceGeoControl";
import WorkspaceHero from "@/components/workspace/WorkspaceHero";
import { getWorkspaceFlorists } from "@/lib/workspace/getWorkspaceFlorists";

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
  { label: "FOS Timeline", href: "/workspace/event-store", icon: Activity },
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

export default async function WorkspacePage() {
  const florists = await getWorkspaceFlorists();
  const health = getFosSystemHealthReport();
  const recentEvents = [...listFosEvents()]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-10 text-stone-950 md:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <WorkspaceHero
              missionPanels={missionPanels}
              services={services}
            />

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

        <section className="mt-8">
          <WorkspaceGeoControl initialFlorists={florists} />
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
