import Link from "next/link";

export default function AutomationPage() {
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
    </main>
  );
}
