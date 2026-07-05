#!/bin/bash
set -e

cp app/workspace/intelligence/page.tsx app/workspace/intelligence/page.tsx.bak-dashboard

python3 <<'PY'
from pathlib import Path

p = Path("app/workspace/intelligence/page.tsx")
s = p.read_text(encoding="utf-8")

s = s.replace(
'''        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <ScoreCard title="Growth Score" value={scores.growthScore} icon={<LineChart size={22} />} />
          <ScoreCard title="Service Score" value={scores.serviceScore} icon={<CalendarDays size={22} />} />
          <ScoreCard title="Trust Score" value={scores.trustScore} icon={<ShieldCheck size={22} />} />
          <ScoreCard title="Business Score" value={scores.businessScore} icon={<Sparkles size={22} />} />
        </div>''',
'''        <div className="mt-6 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
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
                FOS ser stark tillväxt, hög kundnöjdhet och flera återkommande kunder. Prioritera obesvarade meddelanden och kontrollera kommande leveranser för att skydda servicekvaliteten.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <ScoreCard title="Growth Score" value={scores.growthScore} icon={<LineChart size={22} />} />
          <ScoreCard title="Service Score" value={scores.serviceScore} icon={<CalendarDays size={22} />} />
          <ScoreCard title="Trust Score" value={scores.trustScore} icon={<ShieldCheck size={22} />} />
          <ScoreCard title="Business Score" value={scores.businessScore} icon={<Sparkles size={22} />} />
        </div>'''
)

s = s.replace(
'''                className="rounded-[24px] bg-stone-50 p-5 ring-1 ring-stone-200"''',
'''                className={`rounded-[24px] p-5 ring-1 ${
                  item.level === "critical"
                    ? "bg-red-50 ring-red-200"
                    : item.level === "warning"
                      ? "bg-amber-50 ring-amber-200"
                      : item.level === "opportunity"
                        ? "bg-emerald-50 ring-emerald-200"
                        : "bg-stone-50 ring-stone-200"
                }`}'''
)

s = s.replace(
'''                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-stone-600 ring-1 ring-stone-200">
                          {item.module}
                        </span>
                        <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-black text-pink-700">
                          Score {item.score}
                        </span>''',
'''                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-stone-600 ring-1 ring-stone-200">
                          {item.module}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-stone-600 ring-1 ring-stone-200">
                          {item.level}
                        </span>
                        <span className="rounded-full bg-pink-600 px-3 py-1 text-xs font-black text-white">
                          Score {item.score}
                        </span>'''
)

p.write_text(s, encoding="utf-8")
print("Klart! Dashboard förbättrad.")
PY

npm run build
