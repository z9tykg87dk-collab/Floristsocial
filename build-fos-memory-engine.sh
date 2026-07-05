#!/bin/bash
set -e

mkdir -p lib/fos/memory
mkdir -p app/api/fos/memory
mkdir -p app/workspace/memory
mkdir -p app/workspace/memory/test

cat > lib/fos/memory/types.ts <<'TS'
export type FosMemoryType =
  | "customer"
  | "florist"
  | "business"
  | "season"
  | "system";

export type FosMemoryConfidence = "low" | "medium" | "high";

export type FosMemoryRecord = {
  id: string;
  type: FosMemoryType;
  subjectId: string;
  key: string;
  value: string;
  confidence: FosMemoryConfidence;
  source: string;
  createdAt: string;
  updatedAt: string;
};
TS

cat > lib/fos/memory/store.ts <<'TS'
import type { FosMemoryRecord, FosMemoryType, FosMemoryConfidence } from "./types";

const memoryRecords: FosMemoryRecord[] = [];

function now() {
  return new Date().toISOString();
}

function createId() {
  return `fos_mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createFosMemory(input: {
  type: FosMemoryType;
  subjectId: string;
  key: string;
  value: string;
  confidence?: FosMemoryConfidence;
  source?: string;
}) {
  const record: FosMemoryRecord = {
    id: createId(),
    type: input.type,
    subjectId: input.subjectId,
    key: input.key,
    value: input.value,
    confidence: input.confidence || "medium",
    source: input.source || "manual",
    createdAt: now(),
    updatedAt: now(),
  };

  memoryRecords.unshift(record);
  return record;
}

export function listFosMemory() {
  return memoryRecords;
}

export function seedDemoFosMemory() {
  if (memoryRecords.length > 0) return memoryRecords;

  createFosMemory({
    type: "customer",
    subjectId: "demo-customer",
    key: "Favoritblomma",
    value: "Rosor",
    confidence: "high",
    source: "order-history",
  });

  createFosMemory({
    type: "customer",
    subjectId: "demo-customer",
    key: "Vanlig ordernivå",
    value: "1000-1500 kr",
    confidence: "medium",
    source: "order-history",
  });

  createFosMemory({
    type: "florist",
    subjectId: "demo-florist",
    key: "Starkaste kategori",
    value: "Bröllop",
    confidence: "high",
    source: "sales-pattern",
  });

  createFosMemory({
    type: "season",
    subjectId: "sweden-spring",
    key: "Säsongsmönster",
    value: "Tulpaner och ljusa buketter ökar under våren",
    confidence: "medium",
    source: "season-analysis",
  });

  return memoryRecords;
}
TS

cat > lib/fos/memory/index.ts <<'TS'
export * from "./types";
export * from "./store";
TS

cat > app/api/fos/memory/route.ts <<'TS'
import { NextResponse } from "next/server";
import { createFosMemory, listFosMemory, seedDemoFosMemory } from "@/lib/fos/memory";

export async function GET() {
  seedDemoFosMemory();

  return NextResponse.json({
    ok: true,
    module: "fos-memory-engine",
    memories: listFosMemory(),
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const memory = createFosMemory({
    type: body.type,
    subjectId: body.subjectId || "unknown",
    key: body.key,
    value: body.value,
    confidence: body.confidence || "medium",
    source: body.source || "api",
  });

  return NextResponse.json({
    ok: true,
    module: "fos-memory-engine",
    memory,
  });
}
TS

cat > app/workspace/memory/page.tsx <<'TSX'
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
TSX

cat > app/workspace/memory/test/page.tsx <<'TSX'
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
TSX

npm run build
