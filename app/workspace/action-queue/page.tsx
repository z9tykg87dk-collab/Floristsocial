import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, ListChecks, ShieldCheck } from "lucide-react";
import { listFosActions, seedDemoFosActions } from "@/lib/fos/action-queue";

export default function FosActionQueuePage() {
  seedDemoFosActions();
  const actions = listFosActions();

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-8 text-stone-950 md:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[36px] bg-gradient-to-br from-stone-950 via-stone-900 to-pink-950 p-6 text-white shadow-xl md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black ring-1 ring-white/15">
                <ListChecks size={17} />
                FOS Action Queue
              </div>
              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                Åtgärdskö för FOS
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 md:text-base">
                Action Queue tar emot beslut från FOS och placerar dem i en kö innan de utförs av Automation Engine.
              </p>
            </div>

            <Link
              href="/workspace/action-queue/test"
              className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white transition hover:bg-pink-700"
            >
              Test Center
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard title="Status" value="Aktiv" icon={<ShieldCheck size={22} />} />
          <StatCard title="Queued" value={String(actions.length)} icon={<Clock size={22} />} />
          <StatCard title="API" value="/api/fos/action-queue" icon={<ListChecks size={22} />} />
          <StatCard title="Version" value="1.0" icon={<CheckCircle2 size={22} />} />
        </section>

        <section className="mt-8 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
          <div className="mb-6">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-pink-600">
              Queue
            </p>
            <h2 className="text-3xl font-black tracking-tight">Aktiva åtgärder</h2>
          </div>

          <div className="grid gap-4">
            {actions.map((action) => (
              <article key={action.id} className="rounded-[24px] bg-stone-50 p-5 ring-1 ring-stone-200">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black">{action.title}</h3>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-stone-600 ring-1 ring-stone-200">
                        {action.targetModule}
                      </span>
                      <span className="rounded-full bg-pink-600 px-3 py-1 text-xs font-black text-white">
                        {action.priority}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                        {action.status}
                      </span>
                    </div>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-600">
                      {action.description}
                    </p>
                    <p className="mt-2 text-xs font-bold text-stone-400">
                      Källa: {action.source}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-pink-50 text-pink-600">
        {icon}
      </div>
      <p className="text-sm font-black text-stone-500">{title}</p>
      <p className="mt-1 text-2xl font-black break-words">{value}</p>
    </div>
  );
}
