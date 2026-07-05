import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f7f2ea] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2.25rem] bg-white p-8 shadow-xl shadow-slate-200/70">
        <Link href="/superadmin/development" className="text-sm font-black text-pink-700">
          ← Tillbaka till Development Center
        </Link>

        <p className="mt-8 inline-flex rounded-full bg-pink-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-pink-700">
          FOS Engine
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-tight">Fos State</h1>

        <p className="mt-4 text-base font-semibold leading-7 text-slate-600">
          Test- och statussida för Fos State. Här kopplas senare riktig Engine Health, events, state och tester.
        </p>
      </div>
    </main>
  );
}
