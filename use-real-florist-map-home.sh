#!/bin/bash
set -e

cp app/page.tsx app/page.tsx.bak-real-map

python3 <<'PY'
from pathlib import Path

p = Path("app/page.tsx")
s = p.read_text()

if 'import FloristsHeroSearch from "@/components/FloristsHeroSearch";' not in s:
    s = s.replace(
        'import Link from "next/link";',
        'import Link from "next/link";\nimport FloristsHeroSearch from "@/components/FloristsHeroSearch";'
    )

start_marker = '      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-10">'
start = s.find(start_marker)

if start == -1:
    raise SystemExit("Kunde inte hitta florist-karta section.")

next_marker = '      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 lg:px-10">'
end = s.find(next_marker, start)

if end == -1:
    raise SystemExit("Kunde inte hitta slutet på florist-karta section.")

new_block = '''      <FloristsHeroSearch />

'''

s = s[:start] + new_block + s[end:]

p.write_text(s)
print("Klart! Startsidan använder nu samma fungerande karta/sök som /florists.")
print("Backup: app/page.tsx.bak-real-map")
PY

npm run dev
