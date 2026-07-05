import Link from "next/link";
import {
  completeAutomation,
  createAutomationJob,
  listAutomationJobs,
  startAutomation,
} from "@/lib/fos/automation";

export default function AutomationTestPage() {
  const job = createAutomationJob({
    title: "Testa automation",
    description: "Simulerar att FOS skapar en kalenderbokning från en order.",
    sourceEngine: "Automation Test Center",
    targetModule: "Calendar",
    priority: "high",
    payload: {
      eventType: "ORDER_CREATED",
      orderId: "test-order-automation",
    },
  });

  startAutomation(job);
  completeAutomation(job);

  const jobs = listAutomationJobs();

  return (
    <main className="mx-auto max-w-7xl p-8">
      <Link
        href="/workspace/automation"
        className="text-sm font-black text-pink-600"
      >
        ← Tillbaka till Automation
      </Link>

      <div className="mt-8">
        <p className="text-sm font-bold uppercase tracking-widest text-pink-600">
          FOS-07 Test Center
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Automation Test Center
        </h1>

        <p className="mt-3 text-stone-600">
          Denna sida simulerar en automation från start till färdig åtgärd.
        </p>
      </div>

      <section className="mt-8 rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">Senaste testjobb</h2>

        <pre className="mt-5 overflow-x-auto rounded-2xl bg-stone-950 p-5 text-sm text-white">
          {JSON.stringify(job, null, 2)}
        </pre>
      </section>

      <section className="mt-8 rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">Alla automation-jobb</h2>

        <div className="mt-5 grid gap-3">
          {jobs.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200"
            >
              <p className="font-black">{item.title}</p>
              <p className="text-sm text-stone-600">
                {item.targetModule} · {item.status} · {item.priority}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
