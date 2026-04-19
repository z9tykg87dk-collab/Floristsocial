"use client";

import { useActionState } from "react";

import {
  type AdminPayoutState,
  updatePayoutStatusAction,
} from "@/app/admin/actions";

const initialState: AdminPayoutState = {
  status: "idle",
};

const statuses = [
  { label: "Pending", value: "pending" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Paid", value: "paid" },
  { label: "Failed", value: "failed" },
  { label: "Reversed", value: "reversed" },
] as const;

export function PayoutStatusForm({
  payoutId,
  currentStatus,
}: {
  payoutId: string;
  currentStatus: string;
}) {
  const [state, formAction, isPending] = useActionState(
    updatePayoutStatusAction,
    initialState
  );

  return (
    <form action={formAction} className="mt-4 flex flex-wrap items-center gap-3">
      <input type="hidden" name="payoutId" value={payoutId} />
      <select
        name="status"
        defaultValue={currentStatus}
        className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm text-stone-900 outline-none"
      >
        {statuses.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        {isPending ? "Saving..." : "Update"}
      </button>
      {state.message ? (
        <p
          className={`text-xs ${
            state.status === "error" ? "text-red-700" : "text-emerald-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
