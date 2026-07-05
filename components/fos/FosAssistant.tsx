import { Brain } from "lucide-react";

export default function FosAssistant() {
  return (
    <div className="mt-6 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
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
            FOS ser stark tillväxt, hög kundnöjdhet och flera återkommande kunder.
            Prioritera obesvarade meddelanden och kontrollera kommande leveranser.
          </p>
        </div>
      </div>
    </div>
  );
}
