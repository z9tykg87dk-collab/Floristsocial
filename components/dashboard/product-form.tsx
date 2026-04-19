"use client";

import { useActionState } from "react";

import {
  createProductAction,
  type ProductFormState,
} from "@/app/dashboard/actions";

const initialState: ProductFormState = {
  status: "idle",
};

export function ProductForm() {
  const [state, formAction, isPending] = useActionState(
    createProductAction,
    initialState
  );

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Product title" name="title" required />
        <Field label="Public slug" name="slug" placeholder="spring-bouquet" />
        <Field label="Price (SEK)" name="priceAmount" type="number" required />
        <Field label="Category" name="category" placeholder="Bouquet" />
        <Field label="Occasion" name="occasion" placeholder="Birthday" />
        <Field
          label="Image URL"
          name="imageUrl"
          type="url"
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-600"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="w-full rounded-3xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-amber-600"
          placeholder="Describe the arrangement, color palette and delivery notes."
        />
      </div>
      <label className="flex items-center gap-3 text-sm text-stone-700">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked
          className="h-4 w-4 rounded border-stone-400"
        />
        <span>Publish immediately in the marketplace</span>
      </label>
      {state.message ? (
        <p
          className={`text-sm ${
            state.status === "error" ? "text-red-700" : "text-emerald-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-fit rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        {isPending ? "Saving..." : "Create product"}
      </button>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "url" | "number";
};

function Field({
  label,
  name,
  placeholder,
  required = false,
  type = "text",
}: FieldProps) {
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
        placeholder={placeholder}
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-amber-600"
      />
    </div>
  );
}
