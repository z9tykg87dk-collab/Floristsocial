#!/bin/bash
set -e

echo "Skapar backup..."
cp app/workspace/intelligence/page.tsx app/workspace/intelligence/page.tsx.bak

python3 <<'PY'
from pathlib import Path

p = Path("app/workspace/intelligence/page.tsx")
text = p.read_text(encoding="utf-8")

old = 'className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-stone-950"'
new = 'className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white transition hover:bg-pink-700"'

if old not in text:
    print("Kunde inte hitta knappen. Ingen ändring gjord.")
    raise SystemExit(1)

text = text.replace(old, new, 1)

p.write_text(text, encoding="utf-8")
print("Klart! Development Center-knappen är nu rosa.")
PY

echo ""
echo "Startar build..."
npm run build

echo ""
echo "Färdigt!"
echo "Starta sedan appen med:"
echo "npm run dev"
