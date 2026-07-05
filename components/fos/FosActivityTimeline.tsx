function TimelineItem({ time, title, text }: { time: string; title: string; text: string }) {
  return (
    <div className="flex gap-4 rounded-[24px] bg-stone-50 p-4 ring-1 ring-stone-200">
      <div className="pt-1">
        <span className="block h-3 w-3 rounded-full bg-pink-600" />
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-600">{time}</p>
        <h3 className="mt-1 font-black text-stone-950">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-stone-600">{text}</p>
      </div>
    </div>
  );
}

export default function FosActivityTimeline() {
  return (
    <section className="mt-8 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
      <div className="mb-6">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-pink-600">
          FOS Activity Timeline
        </p>
        <h2 className="text-3xl font-black tracking-tight">Senaste systemhändelser</h2>
      </div>

      <div className="space-y-4">
        <TimelineItem time="Nu" title="Intelligence analyserade nuläget" text="FOS uppdaterade scores och rekommendationer." />
        <TimelineItem time="1 min sedan" title="Workflow kontrollerat" text="Order, CRM, Kalender, Notifiering och Ekonomi svarar korrekt." />
        <TimelineItem time="3 min sedan" title="Kalenderbelastning upptäckt" text="FOS markerade kommande leveranser som prioritet." />
        <TimelineItem time="5 min sedan" title="CRM-möjlighet hittad" text="Återkommande kunder identifierades som tillväxtmöjlighet." />
      </div>
    </section>
  );
}
