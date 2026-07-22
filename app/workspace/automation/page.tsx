import Link from "next/link";
import { listAutomationJobs } from "@/lib/fos/automation";

export default function AutomationPage() {
  const jobs = listAutomationJobs();
  const summary = {
    total: jobs.length,
    queued: jobs.filter((job) => job.status === "queued").length,
    running: jobs.filter((job) => job.status === "running").length,
    completed: jobs.filter((job) => job.status === "completed").length,
    failed: jobs.filter((job) => job.status === "failed").length,
  };

  return (
    <main className="mx-auto max-w-7xl p-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-widest text-pink-600">
          FOS-07
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Automation Engine
        </h1>

        <p className="mt-3 text-stone-600">
          Automation Engine ansvarar för att utföra automatiska åtgärder
          baserat på beslut från FOS.
        </p>
      </div>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard title="Total Automations" value={String(summary.total)} />
        <SummaryCard title="Queued" value={String(summary.queued)} />
        <SummaryCard title="Running" value={String(summary.running)} />
        <SummaryCard title="Completed" value={String(summary.completed)} />
        <SummaryCard title="Failed" value={String(summary.failed)} />
      </section>

      <div className="grid gap-6 md:grid-cols-2">

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">
            Status
          </h2>

          <div className="mt-5 space-y-3 text-sm">

            <div className="flex justify-between">
              <span>Version</span>
              <strong>1.0.0</strong>
            </div>

            <div className="flex justify-between">
              <span>Status</span>
              <strong className="text-green-600">
                Active
              </strong>
            </div>

            <div className="flex justify-between">
              <span>Motor-ID</span>
              <strong>FOS-07</strong>
            </div>

          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">

          <h2 className="text-xl font-black">
            Verktyg
          </h2>

          <div className="mt-5 flex flex-col gap-3">

            <Link
              href="/workspace/automation/test"
              className="rounded-xl bg-pink-600 px-4 py-3 font-bold text-white"
            >
              Öppna Test Center
            </Link>

            <a
              href="/api/fos/automation"
              target="_blank"
              className="rounded-xl border px-4 py-3 font-bold"
            >
              Visa API
            </a>

          </div>

        </div>

      </div>

      <section className="mt-8 rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">Automation Monitor</h2>

        {jobs.length === 0 ? (
          <p className="mt-4 text-sm text-stone-600">No automations available.</p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200 text-sm">
              <thead>
                <tr className="text-left text-stone-500">
                  <th className="px-3 py-2 font-bold">Automation ID</th>
                  <th className="px-3 py-2 font-bold">Event</th>
                  <th className="px-3 py-2 font-bold">Handler</th>
                  <th className="px-3 py-2 font-bold">Status</th>
                  <th className="px-3 py-2 font-bold">Started</th>
                  <th className="px-3 py-2 font-bold">Finished</th>
                  <th className="px-3 py-2 font-bold">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {jobs.map((job) => {
                  const event =
                    typeof job.payload?.eventType === "string"
                      ? job.payload.eventType
                      : job.title;

                  return (
                    <tr key={job.id}>
                      <td className="px-3 py-3 font-mono text-xs text-stone-700">{job.id}</td>
                      <td className="px-3 py-3 text-stone-700">{event}</td>
                      <td className="px-3 py-3 text-stone-700">{job.targetModule}</td>
                      <td className="px-3 py-3">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-3 py-3 text-stone-700">{formatDate(job.startedAt)}</td>
                      <td className="px-3 py-3 text-stone-700">{formatDate(job.finishedAt)}</td>
                      <td className="px-3 py-3 text-stone-700">
                        {formatDuration(job.startedAt, job.finishedAt, job.status)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-stone-500">{title}</p>
      <p className="mt-2 text-2xl font-black text-stone-900">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: "queued" | "running" | "completed" | "failed" }) {
  const classes = {
    queued: "bg-stone-100 text-stone-700",
    running: "bg-blue-100 text-blue-700",
    completed: "bg-emerald-100 text-emerald-700",
    failed: "bg-red-100 text-red-700",
  }[status];

  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${classes}`}>{status}</span>;
}

function formatDate(value?: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("sv-SE");
}

function formatDuration(startedAt: string | undefined, finishedAt: string | undefined, status: "queued" | "running" | "completed" | "failed") {
  if (!startedAt) {
    return "-";
  }

  const start = new Date(startedAt).getTime();
  const end = finishedAt ? new Date(finishedAt).getTime() : status === "running" ? Date.now() : NaN;

  if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
    return "-";
  }

  const totalSeconds = Math.floor((end - start) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}m ${seconds}s`;
}
