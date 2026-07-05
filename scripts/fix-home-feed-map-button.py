from pathlib import Path

# 1) Startsidan: karttext + rosa Skapa floristkonto
p = Path("app/page.tsx")
s = p.read_text()

s = s.replace(
    "Riktig karta kopplas senare med Google Maps eller Mapbox.",
    "Klicka här för att öppna floristkartan och hitta florister nära mottagaren."
)

s = s.replace(
    "Kartan ska visa florister nära mottagaren och kopplas till söksidan.",
    "Klicka här för att öppna floristkartan och hitta florister nära mottagaren."
)

s = s.replace(
    'className="mt-5 inline-flex rounded-full bg-[#223a25] px-5 py-3 text-sm font-black text-white"',
    'className="mt-5 inline-flex rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white transition hover:bg-pink-700"'
)

p.write_text(s)

# 2) Feed-sidan: namnbyte
p = Path("app/feed/page.tsx")
s = p.read_text()
s = s.replace("Upptäck floristinspiration", "Sociala Flödet")
p.write_text(s)
