import CalendarEngine from "@/components/calendar/CalendarEngine";

export default function WorkspaceCalendarPage() {
  return (
    <main className="min-h-screen bg-[#f7f2ea] px-4 pt-2 pb-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/70">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-700">
            FloristSocial Arbetsyta
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Dagens kalender
          </h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
            Order, leveranser, uppföljningar och arbetsflöden samlade i FOS Kalender.
          </p>

          <div className="mt-6">
            <CalendarEngine role="florist" floristId="internal-profile" />
          </div>
        </section>
      </div>
    </main>
  );
}
