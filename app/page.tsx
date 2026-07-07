"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import HomeFloristMap from "@/components/HomeFloristMap";
import GuestAuthAction from "@/components/GuestAuthAction";
import {
  ArrowRight,
  Heart,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
  Star,
  Store,
} from "lucide-react";

const heroCards = [
  {
    icon: "📸",
    title: "Sociala Flödet",
    text: "Se nya inlägg, inspiration, buketter, bröllop, event och följ florister från hela Sverige.",
    href: "/feed",
    cta: "Öppna Sociala Flödet",
  },
  {
    icon: "📍",
    title: "Hitta florist nära dig",
    text: "Sök bland florister i ditt område, se deras arbeten, tjänster, recensioner och kontaktvägar.",
    href: "/florists/map",
    cta: "Hitta florist",
  },
  {
    icon: "🌸",
    title: "Beställ blommor",
    text: "Starta Beställningsstudion och skapa en bukett, dekoration, företagsorder eller gåva.",
    href: "/order/private/guest-v4",
    cta: "Starta beställning",
  },
];

const trending = [
  {
    title: "Romantisk bukett",
    florist: "Makalösa Blommor",
    city: "Stockholm",
    image: "/design-preview/buketter/bukett-romantisk-rosa-1000.jpg",
    likes: 245,
  },
  {
    title: "Bröllopsinspiration",
    florist: "FloristSocial",
    city: "Sverige",
    image: "/design-preview/buketter/bukett-floristens-val-pastell-750.jpg",
    likes: 198,
  },
  {
    title: "Företagsevent",
    florist: "Eventflorist",
    city: "Stockholm",
    image: "/design-preview/event/scendekoration-fargrik-6000.jpg",
    likes: 176,
  },
  {
    title: "Dekoration",
    florist: "Blomsterateljén",
    city: "Göteborg",
    image: "/design-preview/event/bordsdekoration-tradgarden-5000.jpg",
    likes: 152,
  },
];

const inspirationSections = [
  {
    title: "Buketter",
    icon: "🌸",
    text: "Romantiska, moderna, färgstarka och säsongsbaserade buketter.",
    image: "/design-preview/buketter/bukett-romantisk-pastell-1000.jpg",
  },
  {
    title: "Bröllop",
    icon: "💍",
    text: "Brudbuketter, bordsdekorationer och blomsterkoncept för livets största dagar.",
    image: "/design-preview/buketter/bukett-romantisk-rosa-1000.jpg",
  },
  {
    title: "Företagsevent",
    icon: "🏢",
    text: "Receptioner, invigningar, mässor, scener och företagsarrangemang.",
    image: "/design-preview/event/staende-dekoration-6000.jpg",
  },
  {
    title: "Dekorationer",
    icon: "🎨",
    text: "Entréer, bord, säsong, jul, event och kreativa speciallösningar.",
    image: "/design-preview/event/dekoration-unik-avancerad-10000.jpg",
  },
  {
    title: "Begravning",
    icon: "🕊️",
    text: "Kransar, hjärtan, kistdekorationer och respektfulla arrangemang.",
    image: "/design-preview/begravning/krans-sorg-natur-3200.jpg",
  },
  {
    title: "Växter",
    icon: "🪴",
    text: "Gröna växter, presentväxter, kontorsväxter och växtinspiration.",
    image: "/design-preview/buketter/bukett-naturlig-gron-tulpan.jpg",
  },
];

const featuredFlorists = [
  {
    name: "Makalösa Blommor",
    city: "Stockholm",
    rating: "4.9",
    image: "/design-preview/buketter/bukett-modern-orange-rosa.jpg",
  },
  {
    name: "Florist Anna",
    city: "Göteborg",
    rating: "4.8",
    image: "/design-preview/buketter/bukett-floristens-val-pastell-750.jpg",
  },
  {
    name: "Blomsterateljén",
    city: "Malmö",
    rating: "4.7",
    image: "/design-preview/event/golvarrangemang-4000.jpg",
  },
  {
    name: "Gröna Drömmar",
    city: "Uppsala",
    rating: "4.7",
    image: "/design-preview/buketter/bukett-naturlig-gron-tulpan.jpg",
  },
];

const mapPins = [
  {
    name: "Makalösa",
    x: "23%",
    y: "28%",
    img: "/design-preview/buketter/bukett-modern-orange-rosa.jpg",
  },
  {
    name: "Anna",
    x: "58%",
    y: "22%",
    img: "/design-preview/buketter/bukett-floristens-val-pastell-750.jpg",
  },
  {
    name: "Blomsterateljén",
    x: "45%",
    y: "55%",
    img: "/design-preview/event/golvarrangemang-4000.jpg",
  },
  {
    name: "Gröna Drömmar",
    x: "70%",
    y: "63%",
    img: "/design-preview/buketter/bukett-naturlig-gron-tulpan.jpg",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fff8f6] text-stone-950">
      <section className="bg-[#fff8f6] px-3 py-6 md:px-6">
        <div className="relative mx-auto max-w-[1450px] overflow-hidden rounded-[2.25rem] shadow-2xl ring-1 ring-stone-200/70">
          <div className="absolute inset-0">
            <img
              src="/landing-hero.png"
              alt=""
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/72 via-white/28 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/22" />
          </div>

          <div className="relative min-h-[700px] px-6 py-10 md:px-12 lg:px-16">
            <div className="max-w-3xl pt-10 md:pt-16">
              <h1 className="font-serif text-5xl font-black tracking-tight text-[#223a25] drop-shadow-sm md:text-7xl lg:text-8xl">
                FLORISTSOCIAL
              </h1>

              <p className="mt-4 font-serif text-3xl italic leading-tight text-pink-700 md:text-5xl">
                Välkommen till ditt floristnätverk
              </p>

              <p className="mt-5 max-w-2xl text-xl font-black leading-8 text-stone-900 md:text-2xl">
                Här blomstrar florister, företag och blomsterälskare tillsammans
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <div className="flex -space-x-3">
                  {trending.map((item) => (
                    <img
                      key={item.title}
                      src={item.image}
                      alt=""
                      className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-black text-stone-900">
                    5.0 av 5 i betyg från våra medlemmar
                  </p>
                  <p className="text-lg leading-none text-amber-400">★★★★★</p>
                </div>
              </div>

              </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {heroCards.map((card, index) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className={`group min-h-[235px] rounded-[32px] p-7 shadow-2xl ring-1 ring-white/70 backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,0.18)] ${
                    index === 0
                      ? "bg-pink-50/88"
                      : index === 1
                        ? "bg-emerald-50/88"
                        : "bg-orange-50/88"
                  }`}
                >
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-white text-3xl shadow-sm ring-1 ring-stone-200/70">
                    {card.icon}
                  </div>
                  <h2 className="mt-5 max-w-[270px] text-2xl font-black leading-tight text-stone-950">
                    {card.title}
                  </h2>
                  <p className="mt-4 max-w-sm text-sm leading-7 text-stone-700">
                    {card.text}
                  </p>
                  <div className="mt-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-900 shadow-sm ring-1 ring-stone-200 transition group-hover:translate-x-1">
                    <ArrowRight size={20} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1450px] px-1 py-10 md:px-2">
        <div className="rounded-[36px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-7">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-pink-600">
                Hitta florist nära dig
              </p>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                Hitta florist
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 md:text-base">
                Sök lokala florister, öppna deras profiler och gå vidare till
                beställning direkt.
              </p>
            </div>
            <Link
              href="/florists/map"
              className="rounded-full bg-stone-950 !text-white px-5 py-3 text-sm font-black !text-white text-white"
            >
              Se alla florister
            </Link>
          </div>

          <HomeFloristMap homeFlorists={featuredFlorists} />
        </div>
      </section>

      <ContentSection
        eyebrow="Inspirationsvärlden"
        title="Utforska blommor efter känsla och tillfälle"
        subtitle="Prioriteringen på startsidan börjar med buketter, sedan bröllop, företagsevent, dekorationer, begravning och växter."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {inspirationSections.map((item) => (
            <Link
              key={item.title}
              href="/feed"
              className="group overflow-hidden rounded-[36px] bg-white shadow-sm ring-1 ring-stone-200/70 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="h-72">
                <img
                  src={item.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="text-3xl">{item.icon}</div>
                <h3 className="mt-3 text-2xl font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {item.text}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Florister i fokus"
        title="Upptäck florister och deras arbeten"
        subtitle="När besökaren klickar på en florist öppnas floristens profilsida med portfolio, feed, tjänster, recensioner och beställning."
      >
        <div className="grid gap-5 md:grid-cols-4">
          {featuredFlorists.map((florist) => (
            <article
              key={florist.name}
              className="overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-stone-200/70"
            >
              <div className="h-56">
                <img
                  src={florist.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-black">{florist.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-stone-500">
                  <MapPin size={15} className="text-pink-600" />
                  {florist.city}
                </p>
                <p className="mt-2 flex items-center gap-1 text-sm font-black text-amber-600">
                  <Star size={15} fill="currentColor" />
                  {florist.rating}
                </p>
                <Link
                  href={`/public/florist/${encodeURIComponent(florist.name)}`}
                  className="mt-4 inline-flex rounded-full bg-stone-950 !text-white px-4 py-2 text-sm font-black !text-white text-white"
                >
                  Visa profil
                </Link>
              </div>
            </article>
          ))}
        </div>
      </ContentSection>

      <section className="mx-auto max-w-[1450px] px-1 py-10 md:px-2">
        <div className="rounded-[34px] bg-white p-7 shadow-sm ring-1 ring-stone-200/70 md:p-9">
          <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-center">
            <div>
              <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-3xl ring-1 ring-emerald-100">
                🌿
              </div>
              <h2 className="mt-5 text-3xl font-black tracking-tight">
                För florister
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-7 text-stone-600">
                Visa upp dina arbeten, hitta nya kunder och nätverka med andra
                florister.
              </p>
              <Link
                href="/florist/register"
                className="mt-5 inline-flex rounded-full bg-pink-600 !text-white px-5 py-3 text-sm font-black text-white transition hover:bg-pink-700"
              >
                Skapa floristkonto
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [
                  "📸",
                  "Visa upp ditt arbete",
                  "Bygg din portfolio och dela din kreativitet.",
                ],
                ["🌸", "Nya kunder", "Nå ut till fler kunder och företag."],
                ["🤝", "Nätverka", "Knyt kontakter och inspireras av andra."],
                [
                  "🛒",
                  "Ta emot beställningar",
                  "Få förfrågningar och öka din försäljning.",
                ],
              ].map(([icon, title, text]) => (
                <div
                  key={title}
                  className="rounded-[24px] bg-stone-50 p-5 ring-1 ring-stone-200"
                >
                  <div className="text-3xl">{icon}</div>
                  <h3 className="mt-4 font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <ContentSection
        eyebrow="Dynamiskt flöde"
        title="Populärt just nu"
        subtitle="Här kan vi senare visa trendande inlägg, mest gillade buketter, sparade bröllopsbilder och florister som syns mycket just nu."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {trending.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-stone-200/70"
            >
              <div className="h-64">
                <img
                  src={item.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-black">{item.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-stone-500">
                      {item.florist} · {item.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-pink-50 px-3 py-1 text-sm font-black text-pink-700">
                    <Heart size={15} /> {item.likes}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <GuestAuthAction
                    icon={<MessageCircle size={14} />}
                  >
                    Fråga
                  </GuestAuthAction>
                  <Link
                    href="/order/private/guest-v4"
                    className="inline-flex items-center justify-center rounded-full bg-pink-600 px-3 py-2 text-center text-xs font-black !text-white"
                  >
                    Beställ liknande
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </ContentSection>

    </main>
  );
}

function ContentSection({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1450px] px-1 py-10 md:px-2">
      <div className="mb-7">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-pink-600">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-black tracking-tight md:text-4xl">
          {title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600 md:text-base">
          {subtitle}
        </p>
      </div>
      {children}
    </section>
  );
}
