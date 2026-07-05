from pathlib import Path
p = Path("app/page.tsx")
s = p.read_text()

s = s.replace('title: "Flöde av floristerinspiration",', 'title: "Sociala Flödet",')
s = s.replace(
    'text: "Upptäck buketter, bröllop, event, dekorationer och kreativa floristarbeten från florister.",',
    'text: "Se nya inlägg, inspiration, buketter, bröllop, event och följ florister från hela Sverige.",'
)
s = s.replace('cta: "Utforska inspiration",', 'cta: "Öppna Sociala Flödet",')

s = s.replace(
    'Riktig karta kopplas senare med Google Maps eller Mapbox.',
    'Kartan ska visa florister nära mottagaren och kopplas till söksidan.'
)

s = s.replace(
    'href="/florists"\n                      className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-stone-900 ring-1 ring-stone-200"',
    'href={`/public/florist/${florist.id ?? florist.slug ?? florist.name}`}\n                      className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-stone-900 ring-1 ring-stone-200"'
)

s = s.replace(
    'href="/florists"\n                  className="mt-4 inline-flex rounded-full bg-stone-950 px-4 py-2 text-sm font-black text-white"',
    'href={`/public/florist/${florist.id ?? florist.slug ?? florist.name}`}\n                  className="mt-4 inline-flex rounded-full bg-stone-950 px-4 py-2 text-sm font-black text-white"'
)

s = s.replace('bg-stone-950 px-5 py-3 text-sm font-black"', 'bg-stone-950 px-5 py-3 text-sm font-black text-white"')
s = s.replace('bg-black px-5 py-3 text-sm font-black"', 'bg-black px-5 py-3 text-sm font-black text-white"')

p.write_text(s)
