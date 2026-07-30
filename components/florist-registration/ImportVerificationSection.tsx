"use client";

import { Camera, CheckCircle2, Globe2, Info, MapPin, Search, ShieldCheck } from "lucide-react";

type ImportVerificationSectionProps = {
  googleBusinessQuery: string;
  instagramHandle: string;
  consentGoogleImport: boolean;
  consentGooglePublish: boolean;
  consentInstagramConnect: boolean;
  consentInstagramPublish: boolean;
  consentPublicProfile: boolean;
  confirmsBusinessOwnership: boolean;
  onGoogleBusinessQueryChange: (value: string) => void;
  onSearchGoogleBusiness: () => void;
  onInstagramHandleChange: (value: string) => void;
  onToggleGoogleImport: () => void;
  onToggleGooglePublish: () => void;
  onToggleInstagramConnect: () => void;
  onToggleInstagramPublish: () => void;
  onTogglePublicProfile: () => void;
  onToggleBusinessOwnership: () => void;
};

function CheckRow({
  checked,
  label,
  description,
  onToggle,
}: {
  checked: boolean;
  label: string;
  description?: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        "flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition",
        checked
          ? "border-emerald-300 bg-emerald-50"
          : "border-stone-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/50",
      ].join(" ")}
    >
      <span
        className={[
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
          checked
            ? "border-emerald-600 bg-emerald-600 text-white"
            : "border-stone-300 bg-white text-transparent",
        ].join(" ")}
      >
        <CheckCircle2 size={14} />
      </span>
      <span>
        <span className="block text-sm font-black text-stone-900">{label}</span>
        {description ? (
          <span className="mt-1 block text-xs leading-5 text-stone-500">
            {description}
          </span>
        ) : null}
      </span>
    </button>
  );
}

export default function ImportVerificationSection({
  googleBusinessQuery,
  instagramHandle,
  consentGoogleImport,
  consentGooglePublish,
  consentInstagramConnect,
  consentInstagramPublish,
  consentPublicProfile,
  confirmsBusinessOwnership,
  onGoogleBusinessQueryChange,
  onSearchGoogleBusiness,
  onInstagramHandleChange,
  onToggleGoogleImport,
  onToggleGooglePublish,
  onToggleInstagramConnect,
  onToggleInstagramPublish,
  onTogglePublicProfile,
  onToggleBusinessOwnership,
}: ImportVerificationSectionProps) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h2 className="text-xl font-black text-stone-950">
            3. Import & verifiering
          </h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            Förenkla registreringen med Google Places och Instagram, men publicera
            bara information som floristen själv har godkänt.
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-4">
          <div className="mb-4 flex items-center gap-2">
            <MapPin size={19} className="text-sky-700" />
            <h3 className="text-sm font-black text-stone-950">Google Places</h3>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-stone-500">
              Sök min butik
            </span>
            <div className="flex gap-2">
              <input
                value={googleBusinessQuery}
                onChange={(event) =>
                  onGoogleBusinessQueryChange(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key !== "Enter") {
                    return;
                  }

                  event.preventDefault();
                  onSearchGoogleBusiness();
                }}
                placeholder="Ex. Makalösa Blommor Stockholm"
                className="min-w-0 flex-1 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              />
              <button
                type="button"
                onClick={onSearchGoogleBusiness}
                disabled={!googleBusinessQuery.trim()}
                className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-sky-700 px-4 py-3 text-sm font-black text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-40"
                title="Sök butiken på Google Places-kartan"
              >
                <Search size={16} />
                Sök
              </button>
            </div>
            <span className="mt-2 block text-xs text-stone-500">
              Sökningen öppnas i butikskartan ovan. Välj rätt butik där
              och klicka sedan på ”Jag äger denna butik”.
            </span>
          </label>

          <div className="mt-4 grid gap-2">
            <CheckRow
              checked={confirmsBusinessOwnership}
              onToggle={onToggleBusinessOwnership}
              label="Jag bekräftar att jag representerar denna butik"
            />
            <CheckRow
              checked={consentGoogleImport}
              onToggle={onToggleGoogleImport}
              label="Jag godkänner import av offentlig företagsinformation"
              description="Exempel: företagsnamn, adress, koordinater och öppettider."
            />
            <CheckRow
              checked={consentGooglePublish}
              onToggle={onToggleGooglePublish}
              label="Jag godkänner publicering av importerad Google-information"
              description="Importerad information visas inte publikt utan detta godkännande."
            />
          </div>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-4">
          <div className="mb-4 flex items-center gap-2">
            <Camera size={19} className="text-pink-700" />
            <h3 className="text-sm font-black text-stone-950">Instagram</h3>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-stone-500">
              Instagramkonto
            </span>
            <input
              value={instagramHandle}
              onChange={(event) => onInstagramHandleChange(event.target.value)}
              placeholder="@butikensnamn"
              className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
            />
          </label>

          <div className="mt-4 grid gap-2">
            <CheckRow
              checked={consentInstagramConnect}
              onToggle={onToggleInstagramConnect}
              label="Jag vill koppla Instagram"
            />
            <CheckRow
              checked={consentInstagramPublish}
              onToggle={onToggleInstagramPublish}
              label="Jag godkänner visning av utvalda Instagram-bilder"
              description="Floristen ska själv kunna välja vilka bilder som visas publikt."
            />
            <CheckRow
              checked={consentPublicProfile}
              onToggle={onTogglePublicProfile}
              label="Jag vill att min publika profil kan visas efter e-postverifiering"
              description="Endast information som är ifylld eller godkänd för publicering visas."
            />
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-sky-100 bg-sky-50 p-4">
        <div className="flex gap-3">
          <Info size={20} className="mt-0.5 shrink-0 text-sky-700" />
          <div>
            <h3 className="text-sm font-black text-sky-950">
              Floristen har alltid kontroll över publiceringen
            </h3>
            <p className="mt-1 text-sm leading-6 text-sky-900">
              Google- och Instagram-information används för att förenkla
              registreringen, men visas aldrig publikt förrän floristen har
              godkänt det. Detta kan senare ändras från den interna floristprofilen.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-xs font-black text-stone-500 md:grid-cols-3">
        <div className="rounded-2xl bg-stone-50 px-4 py-3">
          <Globe2 size={15} className="mb-1 text-stone-400" />
          Publik profil: {consentPublicProfile ? "Förberedd" : "Ej godkänd ännu"}
        </div>
        <div className="rounded-2xl bg-stone-50 px-4 py-3">
          <MapPin size={15} className="mb-1 text-stone-400" />
          Google: {consentGooglePublish ? "Kan publiceras" : "Endast internt"}
        </div>
        <div className="rounded-2xl bg-stone-50 px-4 py-3">
          <Camera size={15} className="mb-1 text-stone-400" />
          Instagram: {consentInstagramPublish ? "Kan visas" : "Ej publicerat"}
        </div>
      </div>
    </section>
  );
}
