"use client";

import Link from "next/link";
import {
  Building2,
  Flower2,
  Heart,
  PartyPopper,
  Truck,
  Leaf,
  ArrowRight,
} from "lucide-react";

const roles = [
  {
    title: "Florist / Blomsterbutik",
    text: "Sälj blommor, ta emot beställningar och samarbeta med andra florister.",
    href: "/florist/register",
    icon: Flower2,
  },
  {
    title: "Privatkund",
    text: "Beställ blommor, spara favoriter och skapa personliga påminnelser.",
    href: "/private/customer-register",
    icon: Heart,
  },
  {
    title: "Företagskund",
    text: "Beställ blommor med faktura, referensperson och ekonomisk översikt.",
    href: "/company/register",
    icon: Building2,
  },
  {
    title: "Budfirma",
    text: "Beställ blommor åt era kunder och få partnerersättning via FloristSocial.",
    href: "/courier/register",
    icon: Truck,
  },
  {
    title: "Eventföretag",
    text: "Beställ blommor till bröllop, event, konferenser och företagsuppdrag.",
    href: "/event-company/register",
    icon: PartyPopper,
  },
  {
    title: "Leverantör till florister",
    text: "Sälj produkter, tjänster och förmåner till florister på FloristSocial.",
    href: "/supplier/register",
    icon: Leaf,
  },
];

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#f7f2ea] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/80">
          <div className="bg-gradient-to-br from-pink-50 via-white to-emerald-50 px-6 py-10 sm:px-10">
            <p className="mb-3 inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-pink-700">
              FloristSocial registrering
            </p>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
              Välj hur du vill registrera dig.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Alla börjar här. FloristSocial skickar dig vidare till rätt
              registreringsformulär och skapar rätt typ av profil.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/company/interest"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-pink-600 px-6 text-sm font-black text-white shadow-lg shadow-pink-100 transition hover:bg-pink-700"
              >
                Intresseanmälan
              </Link>
              <Link
                href="/company/register-preview"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-pink-200 bg-white px-6 text-sm font-black text-pink-700 transition hover:bg-pink-50"
              >
                Företagsregistrering preview
              </Link>
            </div>
          </div>

          <div className="grid gap-5 p-6 sm:p-8 md:grid-cols-2 xl:grid-cols-3">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Link
                  key={role.title}
                  href={role.href}
                  className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-xl"
                >
                  <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-pink-50 text-pink-700 group-hover:bg-pink-600 group-hover:text-white">
                    <Icon size={26} />
                  </div>
                  <h2 className="text-xl font-black tracking-tight">
                    {role.title}
                  </h2>
                  <p className="mt-3 min-h-[72px] text-sm font-semibold leading-6 text-slate-600">
                    {role.text}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-pink-700">
                    Registrera <ArrowRight size={16} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
