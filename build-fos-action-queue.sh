#!/bin/bash
set -e

mkdir -p lib/fos/action-queue
mkdir -p app/api/fos/action-queue
mkdir -p app/workspace/action-queue
mkdir -p app/workspace/action-queue/test

cat > lib/fos/action-queue/types.ts <<'TS'
export type FosActionStatus = "queued" | "in_progress" | "completed" | "failed";
export type FosActionPriority = "low" | "medium" | "high" | "urgent";

export type FosQueuedAction = {
  id: string;
  title: string;
  description: string;
  targetModule: string;
  priority: FosActionPriority;
  status: FosActionStatus;
  source: string;
  payload: Record<string, any>;
  createdAt: string;
  updatedAt: string;
};
TS

cat > lib/fos/action-queue/store.ts <<'TS'
import type { FosActionPriority, FosQueuedAction } from "./types";

const actions: FosQueuedAction[] = [];

function now() {
  return new Date().toISOString();
}

function createId() {
  return `fos_act_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createFosAction(input: {
  title: string;
  description: string;
  targetModule: string;
  priority?: FosActionPriority;
  source?: string;
  payload?: Record<string, any>;
}) {
  const action: FosQueuedAction = {
    id: createId(),
    title: input.title,
    description: input.description,
    targetModule: input.targetModule,
    priority: input.priority || "medium",
    status: "queued",
    source: input.source || "manual",
    payload: input.payload || {},
    createdAt: now(),
    updatedAt: now(),
  };

  actions.unshift(action);
  return action;
}

export function listFosActions() {
  return actions;
}

export function seedDemoFosActions() {
  if (actions.length > 0) return actions;

  createFosAction({
    title: "Skapa kalenderpost",
    description: "Ny order behöver kopplas till leveranskalendern.",
    targetModule: "calendar",
    priority: "high",
    source: "decision-engine",
  });

  createFosAction({
    title: "Skicka ordernotis",
    description: "Kund och florist bör få bekräftelse.",
    targetModule: "notification",
    priority: "medium",
    source: "decision-engine",
  });

  createFosAction({
    title: "Skapa CRM-påminnelse",
    description: "Återkommande kund bör följas upp.",
    targetModule: "crm",
    priority: "medium",
    source: "memory-engine",
  });

  return actions;
}
TS

cat > lib/fos/action-queue/index.ts <<'TS'
export * from "./types";
export * from "./store";
TS

cat > app/api/fos/action-queue/route.ts <<'TS'
import { NextResponse } from "next/server";
import { createFosAction, listFosActions, seedDemoFosActions } from "@/lib/fos/action-queue";

export async function GET() {
  seedDemoFosActions();

  return NextResponse.json({
    ok: true,
    module: "fos-action-queue",
    actions: listFosActions(),
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const action = createFosAction({
    title: body.title,
    description: body.description,
    targetModule: body.targetModule,
    priority: body.priority || "medium",
    source: body.source || "api",
    payload: body.payload || {},
  });

  return NextResponse.json({
    ok: true,
    module: "fos-action-queue",
    action,
  });
}
TS

cat > app/workspace/action-queue/page.tsx <<'TSX'
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
TSX

cat > app/workspace/action-queue/test/page.tsx <<'TSX'
import Link from "next/link";
import { ArrowLeft, ListChecks, PlayCircle } from "lucide-react";
import { createFosAction, listFosActions, seedDemoFosActions } from "@/lib/fos/action-queue";

export default function FosActionQueueTestPage() {
  seedDemoFosActions();

  const testAction = createFosAction({
    title: "Testa Action Queue",
    description: "Detta är en teståtgärd skapad från Action Queue Test Center.",
    targetModule: "automation",
    priority: "high",
    source: "action-queue-test",
    payload: {
      test: true,
    },
  });

  const actions = listFosActions();

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-8 text-stone-950 md:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <Link href="/workspace/action-queue" className="mb-6 inline-flex items-center gap-2 text-sm font-black text-pink-700">
          <ArrowLeft size={16} />
          Tillbaka till Action Queue
        </Link>

        <div className="rounded-[36px] bg-gradient-to-br from-stone-950 via-stone-900 to-pink-950 p-6 text-white shadow-xl md:p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black ring-1 ring-white/15">
            <PlayCircle size={17} />
            Action Queue Test Center
          </div>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Simulera åtgärdskö
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 md:text-base">
            Testsidan skapar en åtgärd och visar hur FOS placerar den i kön.
          </p>
        </div>

        <section className="mt-8 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-50 text-pink-600">
              <ListChecks size={22} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-600">
                Testresultat
              </p>
              <h2 className="text-2xl font-black">Ny åtgärd skapad</h2>
            </div>
          </div>

          <div className="rounded-[24px] bg-stone-950 p-5 text-white">
            <pre className="overflow-x-auto text-sm leading-7">{JSON.stringify(testAction, null, 2)}</pre>
          </div>
        </section>

        <section className="mt-8 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
          <h2 className="text-3xl font-black tracking-tight">Alla åtgärder i kön</h2>
          <div className="mt-5 grid gap-3">
            {actions.map((action) => (
              <div key={action.id} className="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200">
                <p className="font-black">{action.title}</p>
                <p className="text-sm font-semibold text-stone-500">{action.targetModule} · {action.status}</p>
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
