"use client";

import { useActionState } from "react";

import {
  startDirectCheckoutAction,
  type CheckoutState,
} from "@/app/checkout/actions";
import type { Database } from "@/lib/database.types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type FloristProfileRow = Database["public"]["Tables"]["florist_profiles"]["Row"];

const initialState: CheckoutState = {
  status: "idle",
};

type CheckoutFormProps = {
  floristProfile: FloristProfileRow;
  product: ProductRow;
  sellerFlorist: FloristProfileRow | null;
};

export function CheckoutForm({
  floristProfile,
  product,
  sellerFlorist,
}: CheckoutFormProps) {
  const [state, formAction, isPending] = useActionState(
    startDirectCheckoutAction,
    initialState
  );

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="productId" value={product.id} />
      <input
        type="hidden"
        name="sellerFloristProfileId"
        value={sellerFlorist?.id ?? ""}
      />

      <div className="rounded-[2rem] border border-stone-300 bg-stone-50 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
          Order summary
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-stone-900">
          {product.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Florist: {floristProfile.shop_name}. This first checkout flow creates
          a {sellerFlorist ? "referral" : "direct"} order and sends the
          customer to Stripe Checkout.
        </p>
        <div className="mt-4 flex items-center justify-between gap-4 text-sm">
          <span className="text-stone-600">{product.category || "Bouquet"}</span>
          <span className="font-semibold text-stone-900">
            {product.price_amount} SEK
          </span>
        </div>
        {sellerFlorist ? (
          <p className="mt-3 text-sm text-stone-600">
            Seller florist: {sellerFlorist.shop_name}
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Recipient name" name="recipientName" required />
        <Field label="Recipient phone" name="recipientPhone" />
        <Field label="Delivery address" name="deliveryAddress" required />
        <Field label="Postal code" name="deliveryPostalCode" />
        <Field label="City" name="deliveryCity" required />
        <Field label="Delivery date" name="deliveryDate" type="date" />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="cardMessage"
          className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-600"
        >
          Card message
        </label>
        <textarea
          id="cardMessage"
          name="cardMessage"
          rows={4}
          className="w-full rounded-3xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-amber-600"
          placeholder="Write the card text for the bouquet."
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="notes"
          className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-600"
        >
          Delivery notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          className="w-full rounded-3xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-amber-600"
          placeholder="Door code, preferred time window or other helpful notes."
        />
      </div>

      {state.message ? (
        <p className="text-sm text-red-700">{state.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-fit rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        {isPending ? "Starting checkout..." : "Continue to Stripe Checkout"}
      </button>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  required?: boolean;
  type?: "text" | "date";
};

function Field({ label, name, required = false, type = "text" }: FieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-600"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-amber-600"
      />
    </div>
  );
}
