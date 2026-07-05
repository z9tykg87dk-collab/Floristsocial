import Link from "next/link";
import { Activity, ArrowRight, Database, Network, ShieldCheck } from "lucide-react";
import { listFosEvents, seedDemoFosEvents } from "@/lib/fos/event-store";

export default function EventStorePage() {
  seedDemoFosEvents();
  const events = listFosEvents();

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-8 text-stone-950 md:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[36px] bg-gradient-to-br from-stone-950 via-stone-900 to-pink-950 p-6 text-white shadow-xl md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black ring-1 ring-white/15">
                <Database size={17} />
                FOS Event Store
              </div>
              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                Händelselager för hela FOS
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 md:text-base">
                Event Store sparar allt som händer i FloristSocial så att Intelligence, Memory, Decision och Automation kan förstå historiken.
              </p>
            </div>

            <Link
              href="/workspace/event-store/test"
              className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white transition hover:bg-pink-700"
            >
              Test Center
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard title="Status" value="Aktiv" icon={<ShieldCheck size={22} />} />
          <StatCard title="Events" value={String(events.length)} icon={<Activity size={22} />} />
          <StatCard title="API" value="/api/fos/events" icon={<Network size={22} />} />
          <StatCard title="Version" value="1.0" icon={<Database size={22} />} />
        </section>

        <section className="mt-8 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
          <div className="mb-6">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-pink-600">
              Live Feed
            </p>
            <h2 className="text-3xl font-black tracking-tight">Senaste FOS-händelser</h2>
          </div>

          <div className="grid gap-4">
            {events.map((event) => (
              <article key={event.id} className="rounded-[24px] bg-stone-50 p-5 ring-1 ring-stone-200">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black">{event.type}</h3>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-stone-600 ring-1 ring-stone-200">
                        {event.sourceModule}
                      </span>
                      <span className="rounded-full bg-pink-600 px-3 py-1 text-xs font-black text-white">
                        {event.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-stone-500">
                      {event.createdAt}
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
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}
