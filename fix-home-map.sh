#!/bin/bash
set -e

cp app/page.tsx app/page.tsx.bak-home-map

python3 <<'PY'
from pathlib import Path

p = Path("app/page.tsx")
s = p.read_text()

old = '''            <div className="relative min-h-[420px] overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-100 via-sky-100 to-amber-50 ring-1 ring-stone-200">
              <div className="absolute inset-0 opacity-70">
                <div className="absolute left-[12%] top-[18%] h-40 w-40 rounded-full bg-emerald-300/40 blur-3xl" />
                <div className="absolute bottom-[10%] right-[12%] h-48 w-48 rounded-full bg-sky-300/40 blur-3xl" />
                <div className="absolute left-[38%] top-[45%] h-52 w-52 rounded-full bg-amber-200/50 blur-3xl" />
              </div>

              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.34)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.34)_1px,transparent_1px)] bg-[size:56px_56px]" />
'''

new = '''            <div className="relative min-h-[420px] overflow-hidden rounded-[28px] bg-[#dff3ec] ring-1 ring-stone-200">
              {/* Stiliserad karta */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.72)_0_9%,transparent_9%_100%),linear-gradient(35deg,transparent_0_39%,rgba(255,255,255,0.82)_39%_42%,transparent_42%_100%),linear-gradient(145deg,transparent_0_53%,rgba(255,255,255,0.72)_53%_56%,transparent_56%_100%)]" />

                <div className="absolute left-[6%] top-[8%] h-40 w-56 rounded-[42px] bg-emerald-300/45" />
                <div className="absolute right-[8%] top-[10%] h-32 w-44 rounded-[36px] bg-sky-200/55" />
                <div className="absolute bottom-[12%] left-[10%] h-36 w-48 rounded-[38px] bg-lime-200/55" />
                <div className="absolute bottom-[14%] right-[10%] h-44 w-52 rounded-[42px] bg-amber-200/55" />

                <div className="absolute left-[-8%] top-[30%] h-5 w-[130%] rotate-6 rounded-full bg-white/85 shadow-sm" />
                <div className="absolute left-[28%] top-[-12%] h-[135%] w-5 -rotate-12 rounded-full bg-white/85 shadow-sm" />
                <div className="absolute left-[-10%] top-[68%] h-4 w-[130%] -rotate-3 rounded-full bg-white/75 shadow-sm" />
                <div className="absolute left-[60%] top-[-12%] h-[130%] w-4 rotate-[24deg] rounded-full bg-white/65 shadow-sm" />

                <div className="absolute inset-0 opacity-25 bg-[linear-gradient(to_right,rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:56px_56px]" />
              </div>
'''

if old not in s:
    raise SystemExit("Kunde inte hitta exakt gamla karta-blocket. Ingen ändring gjord.")

s = s.replace(old, new, 1)
p.write_text(s)
print("Klart! Backup skapad: app/page.tsx.bak-home-map")
PY
