import Link from "next/link";
import { getFosSystemHealthReport } from "@/lib/fos/system-health";

export default function SystemHealthPage() {
  const report = getFosSystemHealthReport();

  return (
    <main className="mx-auto max-w-7xl p-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-widest text-pink-600">
          FOS-08
        </p>

        <h1 className="mt-2 text-4xl font-black">System Health</h1>

        <p className="mt-3 text-stone-600">
          System Health övervakar status för alla FOS-motorer och visar om
          kärnan är frisk, varnad eller kritisk.
        </p>
      </div>

      <section className="grid gap-6 md:grid-cols-5">
        <Stat title="Total" value={report.summary.total} />
        <Stat title="Healthy" value={report.summary.healthy} />
        <Stat title="Warning" value={report.summary.warning} />
        <Stat title="Critical" value={report.summary.critical} />
        <Stat title="Offline" value={report.summary.offline} />
      </section>

      <section className="mt-8 rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">FOS Kernel Status</h2>

        <div className="mt-5 grid gap-4">
          {report.engines.map((engine) => (
            <div
              key={engine.id}
              className="rounded-2xl bg-stone-50 p-5 ring-1 ring-stone-200"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-pink-600">
                    {engine.id}
                  </p>
                  <h3 className="text-lg font-black">{engine.name}</h3>
                  <p className="mt-1 text-sm text-stone-600">
                    {engine.message}
                  </p>
                </div>

                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">
                  {engine.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {engine.dashboardPath && (
                  <Link
                    href={engine.dashboardPath}
                    className="rounded-full bg-pink-600 px-4 py-2 text-sm font-black text-white"
                  >
                    Dashboard
                  </Link>
                )}

                {engine.testPath && (
                  <Link
                    href={engine.testPath}
                    className="rounded-full border px-4 py-2 text-sm font-black"
                  >
                    Test Center
                  </Link>
                )}

                {engine.apiPath && (
                  <a
                    href={engine.apiPath}
                    target="_blank"
                    className="rounded-full border px-4 py-2 text-sm font-black"
                  >
                    API
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-stone-500">{title}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}
