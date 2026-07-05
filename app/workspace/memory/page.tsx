import Link from "next/link";
import { ArrowRight, Brain, Database, MemoryStick, ShieldCheck } from "lucide-react";
import { listFosMemory, seedDemoFosMemory } from "@/lib/fos/memory";

export default function FosMemoryPage() {
  seedDemoFosMemory();
  const memories = listFosMemory();

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-8 text-stone-950 md:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[36px] bg-gradient-to-br from-stone-950 via-stone-900 to-pink-950 p-6 text-white shadow-xl md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black ring-1 ring-white/15">
                <MemoryStick size={17} />
                FOS Memory Engine
              </div>
              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                FOS kunskapsminne
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 md:text-base">
                Memory Engine sparar vad FOS har lärt sig om kunder, florister, säsonger och affärsmönster.
              </p>
            </div>

            <Link
              href="/workspace/memory/test"
              className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white transition hover:bg-pink-700"
            >
              Test Center
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard title="Status" value="Aktiv" icon={<ShieldCheck size={22} />} />
          <StatCard title="Memory Records" value={String(memories.length)} icon={<Brain size={22} />} />
          <StatCard title="API" value="/api/fos/memory" icon={<Database size={22} />} />
          <StatCard title="Version" value="1.0" icon={<MemoryStick size={22} />} />
        </section>

        <section className="mt-8 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
          <div className="mb-6">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-pink-600">
              FOS Memory
            </p>
            <h2 className="text-3xl font-black tracking-tight">Sparad kunskap</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {memories.map((memory) => (
              <article key={memory.id} className="rounded-[24px] bg-stone-50 p-5 ring-1 ring-stone-200">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-black">{memory.key}</h3>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-stone-600 ring-1 ring-stone-200">
                    {memory.type}
                  </span>
                  <span className="rounded-full bg-pink-600 px-3 py-1 text-xs font-black text-white">
                    {memory.confidence}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-stone-600">{memory.value}</p>
                <p className="mt-3 text-xs font-bold text-stone-400">
                  Källa: {memory.source}
                </p>
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
