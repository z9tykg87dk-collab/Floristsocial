import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, Sparkles, Store } from "lucide-react";

export default function MarketplaceHero() {
  return (
    <section className="overflow-hidden rounded-[40px] bg-gradient-to-br from-white via-pink-50 to-emerald-50 p-6 shadow-xl ring-1 ring-stone-200/70 md:p-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_430px] lg:items-center">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-pink-700 shadow-sm ring-1 ring-pink-100">
            <ShoppingBag size={16} /> FloristSocial Marketplace
          </div>
          <h1 className="text-4xl font-black tracking-tight text-stone-950 md:text-6xl">
            Köp vackra blomsterarrangemang.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
            Upptäck köpbara buketter och arrangemang från FloristSocial-feed. Floristen skapar en liknande produkt utifrån bilden, säsong och tillgängliga blommor.
          </p>

          <div className="mt-6 max-w-2xl rounded-full bg-white p-2 shadow-sm ring-1 ring-stone-200">
            <div className="flex items-center gap-3 px-3">
              <Search size={18} className="text-stone-400" />
              <input className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-stone-400" placeholder="Sök bukett, florist, stad, stil..." />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/feed" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-pink-600 px-5 text-sm font-black !text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700">
              <Sparkles size={18} /> Visa feed
            </Link>
            <Link href="/feed/new" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-black !text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700">
              <Store size={18} /> Skapa ny feed
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1468327768560-75b778cbb551?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop",
          ].map((src, index) => (
            <div key={src} className={`relative overflow-hidden rounded-[28px] bg-stone-100 shadow-sm ${index === 0 ? "aspect-[4/5]" : "aspect-square"}`}>
              <Image src={src} alt="FloristSocial inspiration" fill className="object-cover" sizes="220px" unoptimized />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
