#!/bin/bash
set -e

cp app/workspace/intelligence/page.tsx app/workspace/intelligence/page.tsx.bak-modular

mkdir -p components/fos

cat > components/fos/FosAssistant.tsx <<'TSX'
import { Brain } from "lucide-react";

export default function FosAssistant() {
  return (
    <div className="mt-6 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
      <div className="flex gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-pink-50 text-pink-600">
          <Brain size={26} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-600">
            FOS Assistant
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight">
            Dagens intelligenta sammanfattning
          </h2>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-stone-600">
            FOS ser stark tillväxt, hög kundnöjdhet och flera återkommande kunder.
            Prioritera obesvarade meddelanden och kontrollera kommande leveranser.
          </p>
        </div>
      </div>
    </div>
  );
}
TSX

cat > components/fos/FosSystemHealth.tsx <<'TSX'
function HealthCard({ label, status, value }: { label: string; status: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-stone-50 p-4 ring-1 ring-stone-200">
      <div className="mb-3 flex items-center justify-between">
        <span className="h-3 w-3 rounded-full bg-emerald-500" />
        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
          {value}
        </span>
      </div>
      <p className="font-black text-stone-950">{label}</p>
      <p className="mt-1 text-sm font-semibold text-stone-500">{status}</p>
    </div>
  );
}

export default function FosSystemHealth() {
  return (
    <section className="mt-8 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
      <div className="mb-5">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-pink-600">
          FOS System Health
        </p>
        <h2 className="text-3xl font-black tracking-tight">Systemets nuläge</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <HealthCard label="Order" status="Aktiv" value="OK" />
        <HealthCard label="CRM" status="Lyssnar" value="OK" />
        <HealthCard label="Kalender" status="Synkad" value="OK" />
        <HealthCard label="Notifieringar" status="Redo" value="OK" />
        <HealthCard label="Intelligence" status="Analyserar" value="LIVE" />
      </div>
    </section>
  );
}
TSX

cat > components/fos/FosActionPlan.tsx <<'TSX'
export default function FosActionPlan() {
  return (
    <section className="mt-8 grid gap-4 md:grid-cols-3">
      <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-600">Prioritet 1</p>
        <h3 className="mt-2 text-xl font-black">Svara på meddelanden</h3>
        <p className="mt-2 text-sm leading-7 text-stone-600">
          FOS ser obesvarade meddelanden. Börja här för att skydda servicekvaliteten.
        </p>
      </div>

      <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-600">Prioritet 2</p>
        <h3 className="mt-2 text-xl font-black">Kontrollera leveranser</h3>
        <p className="mt-2 text-sm leading-7 text-stone-600">
          Kalendern visar hög belastning. Kontrollera tider, rutter och kapacitet.
        </p>
      </div>

      <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-600">Prioritet 3</p>
        <h3 className="mt-2 text-xl font-black">Aktivera CRM</h3>
        <p className="mt-2 text-sm leading-7 text-stone-600">
          Återkommande kunder är en möjlighet. Skapa påminnelser och erbjudanden.
        </p>
      </div>
    </section>
  );
}
TSX

cat > components/fos/FosActivityTimeline.tsx <<'TSX'
function TimelineItem({ time, title, text }: { time: string; title: string; text: string }) {
  return (
    <div className="flex gap-4 rounded-[24px] bg-stone-50 p-4 ring-1 ring-stone-200">
      <div className="pt-1">
        <span className="block h-3 w-3 rounded-full bg-pink-600" />
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-600">{time}</p>
        <h3 className="mt-1 font-black text-stone-950">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-stone-600">{text}</p>
      </div>
    </div>
  );
}

export default function FosActivityTimeline() {
  return (
    <section className="mt-8 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
      <div className="mb-6">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-pink-600">
          FOS Activity Timeline
        </p>
        <h2 className="text-3xl font-black tracking-tight">Senaste systemhändelser</h2>
      </div>

      <div className="space-y-4">
        <TimelineItem time="Nu" title="Intelligence analyserade nuläget" text="FOS uppdaterade scores och rekommendationer." />
        <TimelineItem time="1 min sedan" title="Workflow kontrollerat" text="Order, CRM, Kalender, Notifiering och Ekonomi svarar korrekt." />
        <TimelineItem time="3 min sedan" title="Kalenderbelastning upptäckt" text="FOS markerade kommande leveranser som prioritet." />
        <TimelineItem time="5 min sedan" title="CRM-möjlighet hittad" text="Återkommande kunder identifierades som tillväxtmöjlighet." />
      </div>
    </section>
  );
}
TSX

npm run build
