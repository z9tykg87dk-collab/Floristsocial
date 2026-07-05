import Link from "next/link";
import {
  Activity,
  Bell,
  Brain,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Flower2,
  GitBranch,
  Package,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { bootstrapFOS } from "@/core/bootstrap/FOSBootstrap";
import { getFOSEngines } from "@/core/bootstrap/EngineRegistry";

const iconMap: Record<string, React.ReactNode> = {
  order: <Package size={24} />,
  workflow: <GitBranch size={24} />,
  production: <Flower2 size={24} />,
  calendar: <CalendarDays size={24} />,
  workspace: <ClipboardList size={24} />,
  trust: <ShieldCheck size={24} />,
  crm: <Users size={24} />,
  notification: <Bell size={24} />,
  intelligence: <Brain size={24} />,
  security: <ShieldCheck size={24} />,
  audit: <Activity size={24} />,
};

const tests = [
  ["Order Workflow", "/superadmin/development/order-workflow"],
  ["Production", "/superadmin/development/production"],
  ["Calendar", "/superadmin/development/calendar"],
  ["Workspace", "/superadmin/development/workspace"],
  ["Trust", "/superadmin/development/trust"],
  ["Event Viewer", "/superadmin/development/events"],
  ["Audit Log", "/superadmin/development/audit"],
];

const latestEvents = [
  "ORDER_CREATED",
  "PRODUCTION_JOB_CREATED",
  "CALENDAR_EVENT_CREATED",
  "WORKSPACE_TASK_CREATED",
  "TRUST_REQUEST_SCHEDULED",
];

export default function SuperAdminDevelopmentPage() {
  const bootstrap = bootstrapFOS();
  const engines = getFOSEngines();

  return (
    <main className="min-h-screen bg-[#f7f2ea] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[2.25rem] bg-white p-8 shadow-xl shadow-slate-200/70">
          <p className="inline-flex rounded-full bg-pink-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-pink-700">
            SuperAdmin
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
            FOS Development Center
          </h1>

          <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-slate-600">
            Intern kontrollpanel för att testa Engines, workflow och FOS-integrationer.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[2.25rem] bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
            <div className="mb-6 flex items-center gap-4">
              <Activity className="text-pink-700" size={30} />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-700">
                  FOS Health
                </p>
                <h2 className="text-2xl font-black tracking-tight">
                  {bootstrap.version}
                </h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Health label="Engines" value={`${bootstrap.enginesActive}/${bootstrap.enginesTotal}`} />
              <Health label="Subscribers" value={`${bootstrap.subscribersActive}/${bootstrap.subscribersTotal}`} />
              <Health label="Status" value={bootstrap.status} />
              <Health label="Started" value="Active" />
              <Health label="Event Bus" value="OK" />
              <Health label="State" value="OK" />
            </div>
          </div>

          <aside className="rounded-[2.25rem] bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-700">
              Senaste Events
            </p>

            <div className="mt-5 space-y-3">
              {latestEvents.map((event) => (
                <div
                  key={event}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700"
                >
                  {event}
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="rounded-[2.25rem] bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-700">
            Engine Status
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {engines.map((engine) => (
              <Link
                key={engine.id}
                href={`/superadmin/development/${engine.id}`}
                className="block rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-50 text-pink-700">
                    {iconMap[engine.id] || <Sparkles size={24} />}
                  </div>
                  <CheckCircle2 className="text-emerald-600" size={22} />
                </div>

                <h3 className="text-lg font-black">{engine.name}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  {engine.description}
                </p>

                <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                  {engine.category} · {engine.status} · v{engine.version}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[2.25rem] bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-700">
            Tester
          </p>

          <div className="mt-5 flex flex-wrap gap-4">
            {tests.map(([title, href]) => (
              <Link
                key={title}
                href={href}
                className="inline-flex items-center gap-3 rounded-2xl bg-pink-50 px-5 py-4 text-sm font-black text-pink-700 hover:bg-pink-100"
              >
                <Sparkles size={18} />
                {title}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Health({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}
