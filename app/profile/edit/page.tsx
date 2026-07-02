"use client";

import { useEffect, useState, type ReactNode } from "react";
import { canEditLockedProfileFields } from "@/lib/security/roles";
import { LOCKED_PROFILE_FIELDS } from "@/lib/security/locked-profile-fields";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Camera,
  Globe,
  ImagePlus,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UploadCloud,
  User,
} from "lucide-react";

const roleLabels: Record<string, string> = {
  florist: "Florist / Blomsterbutik",
  private: "Privatkund",
  company: "Företagskund",
  courier: "Budfirma",
  event: "Eventföretag",
  supplier: "Leverantör till florister",
};

const backLinks: Record<string, string> = {
  florist: "/florist/19eb5377-43e0-4285-8f9d-a1b1f5f0daf6",
  private: "/private/profile",
  company: "/company/profile",
  courier: "/courier/profile",
  event: "/event-company/profile",
  supplier: "/supplier/profile",
};

export default function ProfileEditPage() {
  const [role, setRole] = useState("florist");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRole(params.get("role") || "florist");
  }, []);
  const label = roleLabels[role] || "Profil";
  const backHref = backLinks[role] || "/dashboard";

  // Tillfälligt: läs adminroll från query under utveckling.
  // Exempel: /profile/edit?role=florist&viewerRole=admin
  // Senare ska viewerRole komma från Supabase Auth/session.
  const [viewerRole, setViewerRole] = useState("florist");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setViewerRole(params.get("viewerRole") || role);
  }, [role]);

  const adminCanEditLocked = canEditLockedProfileFields(viewerRole);
  const lockedFields = LOCKED_PROFILE_FIELDS.join(", ");

  return (
    <main className="min-h-screen bg-[#f7f2ea] px-4 pt-2 pb-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-black text-slate-700 hover:text-pink-700"
          >
            <ArrowLeft size={18} />
            Tillbaka till profil
          </Link>

          <div className="rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-black text-pink-700 shadow-sm">
            {label}
          </div>
        </div>

        <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/80">
          <div className="bg-gradient-to-br from-pink-50 via-white to-emerald-50 px-6 py-8 sm:px-10">
            <p className="mb-3 inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-pink-700">
              Redigera profil
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
              Profilinställningar
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Här kan profilägaren uppdatera bilder, presentation, kontakt,
              adress och sociala länkar. Låsta uppgifter kan endast ändras av
              FloristSocial Admin. Din nuvarande testroll avgör om fälten är låsta.
            </p>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              alert("Profiländringar sparade lokalt. Nästa steg är Supabase-koppling.");
            }}
            className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[1fr_340px]"
          >
            <div className="space-y-7">
              <div className="flex justify-end">
                <Link
                  href="/media-center"
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-pink-200 bg-white px-5 text-sm font-black text-pink-700 shadow-sm hover:bg-pink-50"
                >
                  Öppna Media Center
                </Link>
              </div>

              <EditSection title="Bilder" icon={<ImagePlus size={22} />}>
                <div className="grid gap-4 sm:grid-cols-3">
                  <UploadBox label="Logotyp" icon={<UploadCloud size={24} />} />
                  <UploadBox label="Profilbild" icon={<Camera size={24} />} />
                  <UploadBox label="Omslagsbild" icon={<ImagePlus size={24} />} />
                </div>
              </EditSection>

              <EditSection title="Byta lösenord" icon={<ShieldCheck size={22} />}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <PasswordField label="Nuvarande lösenord" />
                  <PasswordField label="Nytt lösenord" />
                  <PasswordField label="Bekräfta nytt lösenord" />
                </div>

                <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-900">
                  Av säkerhetsskäl behöver lösenordsbyte senare kopplas till Supabase Auth.
                </p>
              </EditSection>

              <EditSection title="Presentation" icon={<User size={22} />}>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-800">
                    Presentera profilen
                  </span>
                  <textarea
                    placeholder="Skriv en tydlig presentation..."
                    className="min-h-[180px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold leading-6 outline-none focus:border-pink-300"
                  />
                </label>
              </EditSection>

              <EditSection title="Kontakt och adress" icon={<Phone size={22} />}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Telefon" icon={<Phone size={18} />} />
                  <Field label="Webbplats" icon={<Globe size={18} />} />
                  <Field label="Adress" icon={<MapPin size={18} />} />
                  <Field label="Postnummer" />
                  <Field label="Ort" />
                  <Field label="Land" />
                </div>
              </EditSection>

              <EditSection title="Sociala medier" icon={<Globe size={22} />}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Instagram" icon={<Globe size={18} />} />
                  <Field label="Facebook" />
                  <Field label="TikTok" />
                  <Field label="YouTube" />
                  <Field label="LinkedIn" />
                </div>
              </EditSection>

              <EditSection title="Låsta uppgifter" icon={<Lock size={22} />}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <LockedField label="Företagsnamn / butiksnamn" value="Endast Admin" canEdit={adminCanEditLocked} />
                  <LockedField label="Registreringsnummer / organisationsnummer" value="Endast Admin" canEdit={adminCanEditLocked} />
                  <LockedField label="E-postadress" value="Endast Admin" canEdit={adminCanEditLocked} />
                  <LockedField label="Avsluta medlemskapet" value="Endast Admin" canEdit={adminCanEditLocked} />
                </div>
              </EditSection>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-pink-600 px-6 text-sm font-black text-white shadow-lg shadow-pink-100 hover:bg-pink-700"
                >
                  <Save size={16} />
                  Spara ändringar
                </button>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-[2rem] bg-slate-50 p-6">
                <ShieldCheck className="text-pink-700" size={32} />
                <h2 className="mt-4 text-xl font-black">Ändringsregler</h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                  Profilägaren kan ändra presentation, bilder, telefon, adress
                  och sociala länkar. Juridiska uppgifter och medlemskap är
                  låsta för Admin.
                </p>
              </div>

              <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-900">
                <strong>Viktigt:</strong> Företagsnamn, organisationsnummer,
                e-post och avslut av medlemskap ska hanteras av FloristSocial
                Admin för säkerhet och redovisning.

                <br /><br />
                <strong>Testa Admin-läge:</strong> öppna sidan med
                <br />
                <code>?role=florist&viewerRole=admin</code>
              </div>
            </aside>
          </form>
        </section>
      </div>
    </main>
  );
}

function EditSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 flex items-center gap-2 text-xl font-black">
        <span className="text-pink-700">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  icon,
}: {
  label: string;
  icon?: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-800">{label}</span>
      <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
        {icon}
        <input className="w-full bg-transparent text-sm font-bold outline-none" />
      </div>
    </label>
  );
}

function PasswordField({ label }: { label: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-800">{label}</span>
      <input
        type="password"
        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-pink-300"
      />
    </label>
  );
}

function LockedField({
  label,
  value,
  canEdit,
}: {
  label: string;
  value: string;
  canEdit: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-4 ${
        canEdit
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-800">
        <Lock size={16} className={canEdit ? "text-emerald-700" : "text-pink-700"} />
        {label}
      </div>

      {canEdit ? (
        <input
          placeholder="Admin kan ändra denna uppgift"
          className="h-12 w-full rounded-2xl border border-emerald-200 bg-white px-4 text-sm font-bold outline-none focus:border-emerald-400"
        />
      ) : (
        <div className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-400">
          {value}
        </div>
      )}

      <p className="mt-2 text-xs font-semibold text-slate-500">
        {canEdit
          ? "Admin/Superadmin kan ändra denna uppgift."
          : "Endast FloristSocial Admin kan ändra denna uppgift."}
      </p>
    </div>
  );
}

function UploadBox({
  label,
  icon,
}: {
  label: string;
  icon: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-800">{label}</span>
      <div className="grid min-h-[150px] cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-pink-200 bg-pink-50/40 px-4 py-5 text-center transition hover:bg-pink-50">
        <input type="file" className="hidden" />
        <div>
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-white text-pink-700 shadow-sm">
            {icon}
          </div>
          <p className="text-sm font-black text-slate-800">
            Dra & släpp eller ladda upp
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Bilden kopplas senare till Supabase Storage.
          </p>
        </div>
      </div>
    </label>
  );
}
