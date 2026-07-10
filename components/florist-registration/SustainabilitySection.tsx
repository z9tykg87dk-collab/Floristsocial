"use client";

import { Leaf, Recycle } from "lucide-react";
import { sustainabilityOptions } from "./options";

type SustainabilitySectionProps = {
  selectedSustainability: string[];
  sustainabilityText: string;
  onToggle: (value: string) => void;
  onTextChange: (value: string) => void;
};

export default function SustainabilitySection({
  selectedSustainability,
  sustainabilityText,
  onToggle,
  onTextChange,
}: SustainabilitySectionProps) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-2xl bg-lime-50 p-3 text-lime-700">
          <Leaf size={22} />
        </div>
        <div>
          <h2 className="text-xl font-black text-stone-950">
            Hållbarhetsarbete
          </h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            Berätta vilka hållbarhetsåtgärder ni arbetar med. Endast valda
            punkter och godkänd text visas publikt.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {sustainabilityOptions.map((item) => {
          const active = selectedSustainability.includes(item);

          return (
            <button
              key={item}
              type="button"
              onClick={() => onToggle(item)}
              className={[
                "flex min-h-[72px] items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-black transition",
                active
                  ? "border-lime-300 bg-lime-50 text-lime-900"
                  : "border-stone-200 bg-white text-stone-700 hover:border-lime-200 hover:bg-lime-50/60",
              ].join(" ")}
            >
              <Recycle
                size={18}
                className={active ? "text-lime-700" : "text-stone-400"}
              />
              <span>{item}</span>
            </button>
          );
        })}
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-black text-stone-800">
          Beskriv ert hållbarhetsarbete
        </span>
        <textarea
          value={sustainabilityText}
          onChange={(event) => onTextChange(event.target.value)}
          rows={5}
          placeholder="Ex. Vi arbetar med säsongsblommor, minskar svinn och använder återvinningsbara material där det är möjligt."
          className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-lime-300 focus:ring-4 focus:ring-lime-100"
        />
      </label>
    </section>
  );
}
