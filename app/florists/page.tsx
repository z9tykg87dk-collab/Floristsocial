import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Flower2,
  MapPin,
  MessageCircle,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import FloristsHeroSearch from "@/components/FloristsHeroSearch";

type Florist = {
  id: string;
  shop_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  city?: string | null;
  municipality?: string | null;
  county?: string | null;
  bio?: string | null;
  description?: string | null;
  logo_url?: string | null;
  profile_image_url?: string | null;
  created_at?: string | null;
};

const filters = [
  "Alla",
  "Buketter",
  "Bröllop",
  "Begravning",
  "Företag",
  "Event",
  "Växter",
];

const fallbackImages = [
  "/design-preview/buketter/bukett-romantisk-rosa-1000.jpg",
  "/design-preview/buketter/bukett-floristens-val-pastell-750.jpg",
  "/design-preview/event/staende-dekoration-6000.jpg",
  "/design-preview/buketter/bukett-modern-orange-rosa.jpg",
];

function floristName(f: Florist) {
  return (
    f.shop_name ||
    `${f.first_name || ""} ${f.last_name || ""}`.trim() ||
    f.email ||
    "Florist"
  );
}

function floristCity(f: Florist) {
  return f.city || f.municipality || f.county || "Sverige";
}

function floristBio(f: Florist) {
  return (
    f.bio ||
    f.description ||
    "Florist på FloristSocial med buketter, arrangemang och personliga blomsterlösningar."
  );
}

function floristImage(f: Florist, index: number) {
  return (
    f.logo_url ||
    f.profile_image_url ||
    fallbackImages[index % fallbackImages.length]
  );
}

export default async function FloristsPage() {
  const { data } = await supabase
    .from("florists")
    .select("*")
    .order("created_at", { ascending: false });

  const florists = (data || []) as unknown as Florist[];
  const visibleFlorists = florists.length > 0 ? florists : [];

  return (
    <main className="min-h-screen bg-[#fbf7f2] text-stone-950">
      <FloristsHeroSearch />

      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8 lg:px-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-pink-600">
              Föreslagna florister
            </p>
            <h2 className="text-3xl font-black tracking-tight">
              Florister att upptäcka
            </h2>
          </div>

          <Link
            href="/feed"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-stone-900 ring-1 ring-stone-200"
          >
            Se inspiration
            <ArrowRight size={16} />
          </Link>
        </div>

        {visibleFlorists.length === 0 ? (
          <EmptyFlorists />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleFlorists.map((florist, index) => (
              <FloristCard key={florist.id} florist={florist} index={index} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:px-10">
        <div className="grid gap-5 md:grid-cols-3">
          <InfoCard
            icon={<Flower2 size={24} />}
            title="Buketter & inspiration"
            text="Hitta florister med rätt känsla, stil och färg för din beställning."
          />
          <InfoCard
            icon={<Building2 size={24} />}
            title="Företag & event"
            text="Upptäck florister som kan hjälpa företag med receptioner, event och dekorationer."
          />
          <InfoCard
            icon={<ShoppingBag size={24} />}
            title="Beställ direkt"
            text="Gå från floristprofil till chatt eller beställningsstudio på ett klick."
          />
        </div>
      </section>
    </main>
  );
}

function MapPreview({ florists }: { florists: Florist[] }) {
  const pins = florists.slice(0, 4);

  return (
    <div className="relative min-h-[380px] overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-100 via-sky-100 to-amber-50 shadow-xl ring-1 ring-stone-200">
      <div className="absolute inset-0 opacity-80">
        <div className="absolute left-[12%] top-[18%] h-40 w-40 rounded-full bg-emerald-300/40 blur-3xl" />
        <div className="absolute bottom-[10%] right-[12%] h-48 w-48 rounded-full bg-sky-300/40 blur-3xl" />
        <div className="absolute left-[38%] top-[45%] h-52 w-52 rounded-full bg-amber-200/50 blur-3xl" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.36)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.36)_1px,transparent_1px)] bg-[size:56px_56px]" />

      {(pins.length ? pins : [null, null, null, null]).map((item, index) => {
        const positions = [
          ["22%", "30%"],
          ["58%", "22%"],
          ["44%", "58%"],
          ["72%", "66%"],
        ];
        const [left, top] = positions[index];

        return (
          <div
            key={index}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left, top }}
          >
            <div className="relative">
              <span className="absolute inset-0 animate-ping rounded-full bg-pink-500/30" />
              <div className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-full border-4 border-white bg-pink-100 text-xl shadow-xl">
                {item ? (
                  <img
                    src={floristImage(item, index)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "🌸"
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-5 left-5 right-5 rounded-[24px] bg-white/90 p-5 shadow-lg backdrop-blur">
        <p className="text-sm font-black text-stone-900">
          Karta över florister
        </p>
        <p className="mt-1 text-xs font-semibold text-stone-500">
          Riktig karta kopplas senare med Google Maps eller Mapbox.
        </p>
      </div>
    </div>
  );
}

function FloristCard({ florist, index }: { florist: Florist; index: number }) {
  const name = floristName(florist);
  const city = floristCity(florist);
  const bio = floristBio(florist);
  const image = floristImage(florist, index);

  return (
    <article className="overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-stone-200/70 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 bg-stone-100">
        <img src={image} alt={name} className="h-full w-full object-cover" />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-pink-700 shadow-sm">
          FloristSocial florist
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-black">{name}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-stone-500">
              <MapPin size={15} className="text-pink-600" />
              {city}
            </p>
          </div>

          <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-black text-amber-700">
            <Star size={14} className="mr-1 inline" fill="currentColor" />
            4.9
          </div>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-7 text-stone-600">
          {bio}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-black text-pink-700">
            Buketter
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            Event
          </span>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">
            Leverans
          </span>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <Link
            href={`/florist/${florist.id}`}
            className="rounded-full bg-stone-950 px-4 py-2 text-center text-sm font-black !text-white"
          >
            Profil
          </Link>
          <Link
            href={`/florist-chat`}
            className="inline-flex items-center justify-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-black text-stone-900 ring-1 ring-stone-200"
          >
            <MessageCircle size={15} />
            Chatta
          </Link>
          <Link
            href={`/orders/new?floristId=${florist.id}`}
            className="rounded-full bg-pink-600 px-4 py-2 text-center text-sm font-black !text-white"
          >
            Beställ
          </Link>
        </div>
      </div>
    </article>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-stone-200/70">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-pink-50 text-pink-700">
        {icon}
      </div>
      <h3 className="mt-5 text-xl font-black">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-stone-600">{text}</p>
    </div>
  );
}

function EmptyFlorists() {
  return (
    <div className="rounded-[32px] bg-white p-8 text-center shadow-sm ring-1 ring-stone-200/70">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-pink-50 text-3xl">
        🌸
      </div>
      <h2 className="mt-4 text-2xl font-black">Inga florister ännu</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-stone-600">
        När florister registrerar sig visas de här med profil, stad,
        specialiteter och beställningslänkar.
      </p>
      <Link
        href="/florist/register"
        className="mt-5 inline-flex rounded-full bg-pink-600 px-5 py-3 text-sm font-black !text-white"
      >
        Registrera florist
      </Link>
    </div>
  );
}
