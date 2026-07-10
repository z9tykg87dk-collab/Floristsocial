"use client";

import { Award, Sparkles } from "lucide-react";
import { specialtyOptions } from "./options";

type SpecialtiesSectionProps = {
  selectedSpecialties: string[];
  onToggle: (value: string) => void;
};

export default function SpecialtiesSection({
  selectedSpecialties,
  onToggle,
}: SpecialtiesSectionProps) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-2xl bg-pink-50 p-3 text-pink-600">
          <Sparkles size={22} />
        </div>
        <div>
          <h2 className="text-xl font-black text-stone-950">
            Specialiteter
          </h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            Välj endast de specialiteter som stämmer för er butik. Dessa kan visas
            på den publika profilsidan och användas i Sök Florist.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {specialtyOptions.map((item) => {
          const active = selectedSpecialties.includes(item);

          return (
            <button
              key={item}
              type="button"
              onClick={() => onToggle(item)}
              className={[
                "flex min-h-[76px] items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-black transition",
                active
                  ? "border-pink-300 bg-pink-50 text-pink-800"
                  : "border-stone-200 bg-white text-stone-700 hover:border-pink-200 hover:bg-pink-50/60",
              ].join(" ")}
            >
              <Award
                size={19}
                className={active ? "text-pink-600" : "text-stone-400"}
              />
              <span>{item}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
