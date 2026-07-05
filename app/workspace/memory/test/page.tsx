import Link from "next/link";
import { ArrowLeft, MemoryStick, PlayCircle } from "lucide-react";
import { createFosMemory, listFosMemory, seedDemoFosMemory } from "@/lib/fos/memory";

export default function FosMemoryTestPage() {
  seedDemoFosMemory();

  const testMemory = createFosMemory({
    type: "customer",
    subjectId: "test-customer",
    key: "Testpreferens",
    value: "Gillar rosa buketter",
    confidence: "medium",
    source: "memory-test",
  });

  const memories = listFosMemory();

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-8 text-stone-950 md:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <Link href="/workspace/memory" className="mb-6 inline-flex items-center gap-2 text-sm font-black text-pink-700">
          <ArrowLeft size={16} />
          Tillbaka till Memory Engine
        </Link>

        <div className="rounded-[36px] bg-gradient-to-br from-stone-950 via-stone-900 to-pink-950 p-6 text-white shadow-xl md:p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black ring-1 ring-white/15">
            <PlayCircle size={17} />
            Memory Test Center
          </div>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Simulera FOS Memory
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 md:text-base">
            Testsidan skapar en minnespost och visar hur FOS kan spara lärdomar.
          </p>
        </div>

        <section className="mt-8 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-50 text-pink-600">
              <MemoryStick size={22} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-600">
                Testresultat
              </p>
              <h2 className="text-2xl font-black">Ny memory-post skapad</h2>
            </div>
          </div>

          <div className="rounded-[24px] bg-stone-950 p-5 text-white">
            <pre className="overflow-x-auto text-sm leading-7">{JSON.stringify(testMemory, null, 2)}</pre>
          </div>
        </section>

        <section className="mt-8 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
          <h2 className="text-3xl font-black tracking-tight">Alla memory-poster</h2>
          <div className="mt-5 grid gap-3">
            {memories.map((memory) => (
              <div key={memory.id} className="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200">
                <p className="font-black">{memory.key}</p>
                <p className="text-sm font-semibold text-stone-500">{memory.value}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
