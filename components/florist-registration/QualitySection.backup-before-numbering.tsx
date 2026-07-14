"use client";

import { BadgeCheck, ShieldCheck } from "lucide-react";
import { qualityBadgeOptions } from "./options";

type QualitySectionProps = {
  selectedQualityBadges: string[];
  onToggle: (value: string) => void;
};

export default function QualitySection({
  selectedQualityBadges,
  onToggle,
}: QualitySectionProps) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h2 className="text-xl font-black text-stone-950">
            Kvalitetsmärken
          </h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            Välj kvalitetsmärken som passar er butik. Bara valda märken visas
            publikt, så en florist som inte valt något får ingen negativ visning.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {qualityBadgeOptions.map((item) => {
          const active = selectedQualityBadges.includes(item);

          return (
            <button
              key={item}
              type="button"
              onClick={() => onToggle(item)}
              className={[
                "flex min-h-[76px] items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-black transition",
                active
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-stone-200 bg-white text-stone-700 hover:border-emerald-200 hover:bg-emerald-50/60",
              ].join(" ")}
            >
              <BadgeCheck
                size={19}
                className={active ? "text-emerald-600" : "text-stone-400"}
              />
              <span>{item}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
