#!/bin/bash
set -e

cp app/workspace/intelligence/page.tsx app/workspace/intelligence/page.tsx.bak-system-health

python3 <<'PY'
from pathlib import Path

p = Path("app/workspace/intelligence/page.tsx")
s = p.read_text(encoding="utf-8")

marker = '''        <section className="mt-8 grid gap-4 md:grid-cols-3">'''

insert = '''        <section className="mt-8 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
          <div className="mb-5">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-pink-600">
              FOS System Health
            </p>
            <h2 className="text-3xl font-black tracking-tight">
              Systemets nuläge
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            <HealthCard label="Order" status="Aktiv" value="OK" />
            <HealthCard label="CRM" status="Lyssnar" value="OK" />
            <HealthCard label="Kalender" status="Synkad" value="OK" />
            <HealthCard label="Notifieringar" status="Redo" value="OK" />
            <HealthCard label="Intelligence" status="Analyserar" value="LIVE" />
          </div>
        </section>

'''

if marker not in s:
    raise SystemExit("Kunde inte hitta platsen för System Health.")

s = s.replace(marker, insert + marker, 1)

append = '''
function HealthCard({
  label,
  status,
  value,
}: {
  label: string;
  status: string;
  value: string;
}) {
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
'''

if "function HealthCard(" not in s:
    s = s + append

p.write_text(s, encoding="utf-8")
print("Klart! FOS System Health tillagd.")
PY

npm run build
