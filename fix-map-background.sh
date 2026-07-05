#!/bin/bash
set -e

cp app/page.tsx app/page.tsx.bak-map

python3 <<'PY'
from pathlib import Path

p = Path("app/page.tsx")
s = p.read_text()

if "Karta bakgrund - FloristSocial" in s:
    print("Karta-bakgrunden finns redan. Ingen ändring gjord.")
    raise SystemExit

marker = '<div className="absolute bottom-5 left-5 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur">'
idx = s.find(marker)

if idx == -1:
    raise SystemExit("Kunde inte hitta Karta över florister-rutan.")

start = s.rfind('<div className="relative', 0, idx)
if start == -1:
    raise SystemExit("Kunde inte hitta kartans huvud-div.")

open_end = s.find(">", start)
if open_end == -1:
    raise SystemExit("Kunde inte hitta slutet på kartans huvud-div.")

new_open = '<div className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-emerald-100 via-sky-100 to-stone-100 shadow-inner">'
s = s[:start] + new_open + s[open_end+1:]

insert_at = start + len(new_open)

bg = '''
                {/* Karta bakgrund - FloristSocial */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute left-8 top-8 h-36 w-52 rounded-full bg-emerald-200/50 blur-3xl" />
                  <div className="absolute bottom-16 right-10 h-40 w-60 rounded-full bg-lime-200/50 blur-3xl" />
                  <div className="absolute left-1/3 top-1/2 h-32 w-44 rounded-full bg-cyan-200/40 blur-3xl" />

                  <div className="absolute left-[-10%] top-[22%] h-4 w-[140%] rotate-6 rounded-full bg-white/75 shadow-sm" />
                  <div className="absolute left-[20%] top-[-10%] h-[140%] w-4 -rotate-12 rounded-full bg-white/75 shadow-sm" />
                  <div className="absolute left-[5%] top-[68%] h-4 w-[120%] -rotate-3 rounded-full bg-white/65 shadow-sm" />
                  <div className="absolute left-[55%] top-[-15%] h-[135%] w-3 rotate-[22deg] rounded-full bg-white/55 shadow-sm" />

                  <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.85)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.85)_1px,transparent_1px)] [background-size:48px_48px]" />
                </div>
'''

s = s[:insert_at] + bg + s[insert_at:]

p.write_text(s)
print("Klart! Backup skapad: app/page.tsx.bak-map")
PY
