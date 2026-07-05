#!/bin/bash
set -e

mkdir -p app/workspace/decision

cat > app/workspace/decision/page.tsx <<'TSX'
import Link from "next/link";
import { ArrowRight, BrainCircuit, CheckCircle2, Flag, ListChecks } from "lucide-react";
import { runFosDecisionEngine } from "@/lib/fos/decision";

export default function FosDecisionPage() {
  const decision = runFosDecisionEngine({
    eventType: "ORDER_CREATED",
    module: "order",
    payload: {
      orderId: "demo-order",
      floristId: "demo-florist",
    },
  });

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-8 text-stone-950 md:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[36px] bg-gradient-to-br from-stone-950 via-stone-900 to-pink-950 p-6 text-white shadow-xl md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black ring-1 ring-white/15">
                <BrainCircuit size={17} />
                FOS Decision Engine
              </div>
              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                Beslutsmotor & Action Queue
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 md:text-base">
                FOS analyserar händelser och skapar konkreta åtgärder för kalender, CRM, notifieringar, order och trust.
              </p>
            </div>

            <Link
              href="/workspace/intelligence"
              className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white transition hover:bg-pink-700"
            >
              Intelligence
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-600">
              Event
            </p>
            <h2 className="mt-2 text-2xl font-black">{decision.input.eventType}</h2>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-600">
              Modul
            </p>
            <h2 className="mt-2 text-2xl font-black">{decision.input.module}</h2>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-600">
              Åtgärder
            </p>
            <h2 className="mt-2 text-2xl font-black">{decision.actionCount}</h2>
          </div>
        </section>

        <section className="mt-8 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
          <div className="mb-6">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-pink-600">
              Action Queue
            </p>
            <h2 className="text-3xl font-black tracking-tight">
              FOS föreslagna åtgärder
            </h2>
          </div>

          <div className="grid gap-4">
            {decision.actions.map((action) => (
              <article
                key={action.id}
                className="rounded-[24px] bg-stone-50 p-5 ring-1 ring-stone-200"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-pink-600 shadow-sm ring-1 ring-stone-200">
                      {action.priority === "urgent" ? <Flag size={22} /> : <ListChecks size={22} />}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black">{action.title}</h3>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-stone-600 ring-1 ring-stone-200">
                          {action.priority}
                        </span>
                        <span className="rounded-full bg-pink-600 px-3 py-1 text-xs font-black text-white">
                          {action.targetModule}
                        </span>
                      </div>
                      <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-600">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  {action.href && (
                    <Link
                      href={action.href}
                      className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-black !text-white"
                    >
                      <CheckCircle2 size={16} />
                      Öppna
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
TSX

npm run build
