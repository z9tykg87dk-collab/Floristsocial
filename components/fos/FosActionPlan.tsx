export default function FosActionPlan() {
  return (
    <section className="mt-8 grid gap-4 md:grid-cols-3">
      <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-600">Prioritet 1</p>
        <h3 className="mt-2 text-xl font-black">Svara på meddelanden</h3>
        <p className="mt-2 text-sm leading-7 text-stone-600">
          FOS ser obesvarade meddelanden. Börja här för att skydda servicekvaliteten.
        </p>
      </div>

      <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-600">Prioritet 2</p>
        <h3 className="mt-2 text-xl font-black">Kontrollera leveranser</h3>
        <p className="mt-2 text-sm leading-7 text-stone-600">
          Kalendern visar hög belastning. Kontrollera tider, rutter och kapacitet.
        </p>
      </div>

      <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-600">Prioritet 3</p>
        <h3 className="mt-2 text-xl font-black">Aktivera CRM</h3>
        <p className="mt-2 text-sm leading-7 text-stone-600">
          Återkommande kunder är en möjlighet. Skapa påminnelser och erbjudanden.
        </p>
      </div>
    </section>
  );
}
