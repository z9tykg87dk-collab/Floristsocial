const timelineSteps = [
  { label: "Pending payment", value: "pending_payment" },
  { label: "Paid", value: "paid" },
  { label: "Accepted", value: "accepted" },
  { label: "In production", value: "in_production" },
  { label: "Out for delivery", value: "out_for_delivery" },
  { label: "Completed", value: "completed" },
] as const;

const cancelledStatuses = new Set(["cancelled", "refunded"]);

export function OrderStatusTimeline({ status }: { status: string }) {
  if (cancelledStatuses.has(status)) {
    return (
      <div className="rounded-[2rem] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-800">
        This order is {status}.
      </div>
    );
  }

  const activeIndex = timelineSteps.findIndex((step) => step.value === status);

  return (
    <div className="grid gap-3 md:grid-cols-6">
      {timelineSteps.map((step, index) => {
        const completed = activeIndex >= index;

        return (
          <div
            key={step.value}
            className={`rounded-[1.5rem] border px-4 py-4 text-sm ${
              completed
                ? "border-stone-900 bg-stone-950 text-stone-50"
                : "border-stone-300 bg-white text-stone-500"
            }`}
          >
            {step.label}
          </div>
        );
      })}
    </div>
  );
}
