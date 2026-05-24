import Link from "next/link";
import { Heart, Mail, MapPin, MessageCircle, ShieldCheck, Sparkles, Store } from "lucide-react";

const footerGroups = [
  {
    title: "FloristSocial",
    links: [
      { label: "Om oss", href: "/about" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Feed", href: "/feed" },
      { label: "Florister", href: "/florists" },
    ],
  },
  {
    title: "För florister",
    links: [
      { label: "Registrera florist", href: "/florist/register" },
      { label: "Florist-dashboard", href: "/dashboard" },
      { label: "Orderhantering", href: "/dashboard/orders" },
      { label: "Florist-chat", href: "/florist-chat" },
    ],
  },
  {
    title: "För kunder",
    links: [
      { label: "Orderhistorik", href: "/orders/history" },
      { label: "Favoriter", href: "/favorites" },
      { label: "Företagsregistrering", href: "/company/register" },
      { label: "Hjälpcenter", href: "/help" },
    ],
  },
  {
    title: "Trygghet",
    links: [
      { label: "Villkor", href: "/terms" },
      { label: "Integritet / GDPR", href: "/privacy" },
      { label: "Cookies", href: "/cookies" },
      { label: "Kontakt", href: "/contact" },
    ],
  },
];

export default function FloristSocialFooter() {
  return (
    <footer className="border-t border-pink-100 bg-white text-stone-900">
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-pink-600 to-rose-500 text-white shadow-lg shadow-pink-600/20">
                <Sparkles size={24} />
              </div>
              <div>
                <div className="text-xl font-black tracking-tight">FloristSocial</div>
                <div className="text-sm font-bold text-pink-600">Där florister blomstrar tillsammans</div>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-stone-600">
              FloristSocial är en social marketplace för florister, kunder och företag. Upptäck inspiration, hitta florister och beställ vackra blomsterarrangemang tryggt via plattformen.
            </p>

            <div className="mt-6 grid gap-3 text-sm text-stone-600">
              <div className="flex items-center gap-2"><MapPin size={16} className="text-pink-600" /> Stockholm / Sweden</div>
              <div className="flex items-center gap-2"><Mail size={16} className="text-pink-600" /> Kontakt via FloristSocial</div>
              <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-pink-600" /> Trygg kommunikation, orderhistorik och betalning</div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-black uppercase tracking-wide text-stone-950">{group.title}</h3>
                <div className="mt-4 grid gap-3">
                  {group.links.map((link) => (
                    <Link key={link.href} href={link.href} className="text-sm font-semibold text-stone-500 transition hover:text-pink-700">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-stone-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-stone-500">
            © {new Date().getFullYear()} FloristSocial. Alla rättigheter förbehållna.
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/messages" className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-pink-50 px-4 text-sm font-bold text-pink-700 transition hover:bg-pink-100">
              <MessageCircle size={16} /> Meddelanden
            </Link>
            <Link href="/marketplace" className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-stone-50 px-4 text-sm font-bold text-stone-700 transition hover:bg-stone-100">
              <Store size={16} /> Marketplace
            </Link>
            <Link href="/favorites" className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-stone-50 px-4 text-sm font-bold text-stone-700 transition hover:bg-stone-100">
              <Heart size={16} /> Favoriter
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
}
