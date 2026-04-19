"use client";

import { useActionState } from "react";

import {
  saveFloristOnboardingAction,
  type FloristOnboardingState,
} from "@/app/onboarding/florist/actions";
import type { Database } from "@/lib/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type FloristProfileRow = Database["public"]["Tables"]["florist_profiles"]["Row"];

const initialState: FloristOnboardingState = {
  status: "idle",
};

type FloristOnboardingFormProps = {
  profile: ProfileRow | null;
  floristProfile: FloristProfileRow | null;
};

export function FloristOnboardingForm({
  profile,
  floristProfile,
}: FloristOnboardingFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveFloristOnboardingAction,
    initialState
  );

  return (
    <form action={formAction} className="mt-8 grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Shop name"
          name="shopName"
          required
          defaultValue={floristProfile?.shop_name ?? ""}
        />
        <Field
          label="Public slug"
          name="slug"
          defaultValue={floristProfile?.slug ?? ""}
          placeholder="blomster-huset"
        />
        <Field
          label="Contact name"
          name="fullName"
          required
          defaultValue={profile?.full_name ?? ""}
        />
        <Field
          label="Phone"
          name="phone"
          defaultValue={profile?.phone ?? floristProfile?.phone ?? ""}
        />
        <Field
          label="City"
          name="city"
          required
          defaultValue={floristProfile?.city ?? profile?.city ?? ""}
        />
        <Field
          label="Postal code"
          name="postalCode"
          defaultValue={floristProfile?.postal_code ?? ""}
        />
        <Field
          label="Street address"
          name="streetAddress"
          defaultValue={floristProfile?.street_address ?? ""}
        />
        <Field
          label="Delivery radius (km)"
          name="deliveryRadiusKm"
          type="number"
          defaultValue={String(floristProfile?.delivery_radius_km ?? "")}
        />
        <Field
          label="Instagram handle"
          name="instagramHandle"
          defaultValue={floristProfile?.instagram_handle ?? ""}
        />
        <Field
          label="Website URL"
          name="websiteUrl"
          type="url"
          defaultValue={floristProfile?.website_url ?? ""}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="bio"
          className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-600"
        >
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={5}
          defaultValue={floristProfile?.bio ?? ""}
          className="w-full rounded-3xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-amber-600"
          placeholder="Describe your style, delivery area and what makes your shop different."
        />
      </div>

      <div className="grid gap-3 rounded-3xl border border-stone-300 bg-stone-50 p-5">
        <Checkbox
          name="fulfillsOrders"
          label="I can execute orders as a florist"
          defaultChecked={floristProfile?.fulfills_orders ?? true}
        />
        <Checkbox
          name="acceptsReferrals"
          label="I also want to receive referral orders"
          defaultChecked={floristProfile?.accepts_referrals ?? true}
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
        {isPending ? "Saving..." : "Save florist profile"}
      </button>
    </form>
  );
}

type FieldProps = {
  defaultValue?: string;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "url" | "number";
};

function Field({
  defaultValue,
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
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-amber-600"
      />
    </div>
  );
}

type CheckboxProps = {
  defaultChecked: boolean;
  label: string;
  name: string;
};

function Checkbox({ defaultChecked, label, name }: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 text-sm text-stone-700">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-stone-400"
      />
      <span>{label}</span>
    </label>
  );
}
