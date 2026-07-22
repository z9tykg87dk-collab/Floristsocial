import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Flag,
  ListChecks,
  RefreshCw,
  ShieldAlert,
  Users,
} from "lucide-react";
import { listFosActions, seedDemoFosActions } from "@/lib/fos/action-queue";
import type { FosActionPriority } from "@/lib/fos/action-queue/types";

const operationalPriorities = [
  {
    title: "Order väntar på florist",
    description: "Kontrollera att ordern accepteras innan nästa leveransfönster.",
    status: "Kritisk",
    module: "Order",
    href: "/orders",
    icon: ClipboardCheck,
    tone: "critical",
  },
  {
    title: "Leveransfönster behöver följas upp",
    description: "Hög belastning i kalendern kan påverka dagens leveranser.",
    status: "Varning",
    module: "Kalender",
    href: "/workspace/calendar",
    icon: CalendarClock,
    tone: "warning",
  },
  {
    title: "Floristregistreringar väntar på granskning",
    description: "Verifiera nya florister så att nätverket kan fortsätta växa.",
    status: "Granska",
    module: "Florister",
    href: "/florists",
    icon: Users,
    tone: "review",
  },
  {
    title: "Ekonomisk händelse kräver kontroll",
    description: "Kontrollera Stripe-utbetalningen och stäng uppföljningen.",
    status: "Kontroll",
    module: "Ekonomi",
    href: "/superadmin/development/economy",
    icon: CircleDollarSign,
    tone: "critical",
  },
] as const;

const priorityLabels: Record<FosActionPriority, string> = {
  urgent: "Akut",
  high: "Hög",
  medium: "Normal",
  low: "Låg",
};

const priorityStyles: Record<FosActionPriority, string> = {
  urgent: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-stone-100 text-stone-600",
};

export default function PriorityCenterPage() {
  seedDemoFosActions();
  const actions = [...listFosActions()].sort((a, b) => priorityRank(b.priority) - priorityRank(a.priority));
  const urgentCount = actions.filter((action) => action.priority === "urgent" || action.priority === "high").length;

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-8 text-stone-950 md:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[36px] bg-gradient-to-br from-stone-950 via-stone-900 to-red-950 p-6 text-white shadow-xl md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black ring-1 ring-white/15">
                <Flag size={17} />
                FOS Prioritetscenter
              </div>
              <h1 className="text-4xl font-black tracking-tight md:text-5xl">Rätt sak först</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 md:text-base">
                Samlad vy över det som kräver uppmärksamhet just nu. Prioriteringar från FOS, orderflödet och den operativa verksamheten finns på samma plats.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/workspace" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-black text-white ring-1 ring-white/15 transition hover:bg-white/15">
                Workspace
                <ArrowRight size={16} />
              </Link>
              <Link href="/workspace/action-queue" className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700">
                Åtgärdskö
                <ListChecks size={16} />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <SummaryCard label="Kräver åtgärd" value={String(operationalPriorities.length)} icon={<ShieldAlert size={20} />} />
            <SummaryCard label="Hög prioritet i kö" value={String(urgentCount)} icon={<Flag size={20} />} />
            <SummaryCard label="Senast uppdaterad" value="Nu" icon={<RefreshCw size={20} />} />
          </div>
        </div>

        <section className="mt-8 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-red-600">Operativ vy</p>
              <h2 className="text-3xl font-black tracking-tight">Kräver uppmärksamhet</h2>
            </div>
            <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-700 ring-1 ring-red-100">{operationalPriorities.length} öppna</span>
          </div>

          <div className="grid gap-3">
            {operationalPriorities.map((priority) => {
              const Icon = priority.icon;
              const styles = {
                critical: "bg-red-50/70 ring-red-100 hover:bg-red-50",
                warning: "bg-amber-50/70 ring-amber-100 hover:bg-amber-50",
                review: "bg-sky-50/70 ring-sky-100 hover:bg-sky-50",
              }[priority.tone];

              return (
                <Link key={priority.title} href={priority.href} className={`group flex flex-col gap-4 rounded-3xl p-5 ring-1 transition sm:flex-row sm:items-center sm:justify-between ${styles}`}>
                  <div className="flex items-start gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-red-700 shadow-sm ring-1 ring-stone-200/60">
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black">{priority.title}</h3>
                        <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-black text-stone-600">{priority.module}</span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-stone-600">{priority.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-black text-stone-700">{priority.status}</span>
                    <ChevronRight size={18} className="text-stone-400 transition group-hover:translate-x-1 group-hover:text-stone-950" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-8 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-pink-600">FOS Action Queue</p>
              <h2 className="text-3xl font-black tracking-tight">Nästa automatiserade steg</h2>
            </div>
            <Link href="/workspace/action-queue" className="inline-flex items-center gap-2 text-sm font-black text-pink-700">Visa hela kön <ArrowRight size={16} /></Link>
          </div>

          <div className="grid gap-3">
            {actions.map((action) => (
              <article key={action.id} className="flex flex-col gap-4 rounded-3xl bg-stone-50 p-5 ring-1 ring-stone-200 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-pink-600 shadow-sm ring-1 ring-stone-200"><Bell size={19} /></div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black">{action.title}</h3>
                      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black uppercase text-stone-600 ring-1 ring-stone-200">{action.targetModule}</span>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${priorityStyles[action.priority]}`}>{priorityLabels[action.priority]}</span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-stone-600">{action.description}</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {action.category && (
                        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black uppercase text-stone-600 ring-1 ring-stone-200">
                          Kategori: {action.category}
                        </span>
                      )}
                      {action.severity && (
                        <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-black uppercase text-red-700 ring-1 ring-red-100">
                          Severity: {action.severity}
                        </span>
                      )}
                      {typeof action.impactScore === "number" && (
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-black text-amber-700 ring-1 ring-amber-100">
                          Impact: {action.impactScore}
                        </span>
                      )}
                      {action.source && (
                        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-stone-600 ring-1 ring-stone-200">
                          Källa: {action.source}
                        </span>
                      )}
                    </div>

                    {(action.ownerName || action.ownerId || action.createdAt || action.eta || action.slaDeadline || action.relatedOrderId || action.relatedFloristId) && (
                      <div className="mt-3 grid gap-1 text-xs font-semibold text-stone-500">
                        {(action.ownerName || action.ownerId) && (
                          <p>
                            Ansvarig: {action.ownerName || action.ownerId}
                          </p>
                        )}
                        {action.createdAt && <p>Skapad: {formatTime(action.createdAt)}</p>}
                        {action.eta && <p>ETA: {formatTime(action.eta)}</p>}
                        {action.slaDeadline && <p>SLA deadline: {formatTime(action.slaDeadline)}</p>}
                        {action.relatedOrderId && <p>Relaterad order: {action.relatedOrderId}</p>}
                        {action.relatedFloristId && <p>Relaterad florist: {action.relatedFloristId}</p>}
                      </div>
                    )}

                    {action.runbookUrl && (
                      <a
                        href={action.runbookUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-black text-stone-700 ring-1 ring-stone-200 transition hover:bg-stone-100"
                      >
                        Runbook
                        <ArrowRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-2 text-xs font-black text-emerald-700"><CheckCircle2 size={16} /> {action.status === "queued" ? "I kö" : action.status}</span>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function priorityRank(priority: FosActionPriority) {
  return { urgent: 4, high: 3, medium: 2, low: 1 }[priority];
}

function SummaryCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
      <div className="flex items-center justify-between text-white/70"><span className="text-xs font-black uppercase tracking-[0.15em]">{label}</span>{icon}</div>
      <p className="mt-3 text-2xl font-black">{value}</p>
    </div>
  );
}
