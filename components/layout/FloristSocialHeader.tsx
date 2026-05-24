import Link from "next/link";
import {
  Bell,
  Heart,
  History,
  LayoutDashboard,
  LogIn,
  Menu,
  MessageCircle,
  PackageCheck,
  Search,
  Sparkles,
  Store,
  UserRound,
} from "lucide-react";

type UserRole = "guest" | "customer" | "florist";

type FloristSocialHeaderProps = {
  role?: UserRole;
  country?: "SE" | "ES" | "FR" | "GB";
  active?: "feed" | "marketplace" | "florists" | "dashboard" | "orders" | "messages" | "profile";
};

const languageByCountry = {
  SE: ["Svenska", "English"],
  ES: ["Español", "English"],
  FR: ["Français", "English"],
  GB: ["English", "Svenska"],
};

function navClass(active: boolean) {
  return active
    ? "shrink-0 rounded-full bg-pink-600 px-4 py-2 text-sm font-black !text-white shadow-lg shadow-pink-600/20"
    : "shrink-0 rounded-full px-4 py-2 text-sm font-black text-stone-800 transition hover:bg-pink-50 hover:text-pink-700";
}

function iconLinkClass(active: boolean) {
  return active
    ? "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-600 !text-white shadow-lg shadow-pink-600/20 md:h-11 md:w-11"
    : "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-stone-800 ring-1 ring-stone-200 transition hover:bg-pink-50 hover:text-pink-700 md:h-11 md:w-11";
}

export default function FloristSocialHeader({ role = "guest", country = "SE", active }: FloristSocialHeaderProps) {
  const languages = languageByCountry[country] || languageByCountry.SE;

  return (
    <header className="sticky top-0 z-50 border-b border-pink-100/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-8 lg:px-12">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-pink-600 to-rose-500 text-white shadow-lg shadow-pink-600/20 md:h-12 md:w-12">
            <Sparkles size={22} />
          </div>
          <div className="min-w-0">
            <div className="truncate text-lg font-black tracking-tight text-stone-950 md:text-xl">FloristSocial</div>
            <div className="hidden truncate text-xs font-bold text-pink-600 sm:block">Där florister blomstrar tillsammans</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          <Link href="/feed" className={navClass(active === "feed")}>Feed</Link>
          <Link href="/marketplace" className={navClass(active === "marketplace")}>Marketplace</Link>
          <Link href="/florists" className={navClass(active === "florists")}>Florister</Link>
          <Link href="/company/register" className={navClass(false)}>Företag</Link>
        </nav>

        <div className="hidden min-w-[260px] max-w-[360px] flex-1 items-center rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-stone-200 lg:flex">
          <Search size={17} className="shrink-0 text-stone-400" />
          <input placeholder="Sök florist, bukett, stad..." className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-stone-400" />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center rounded-full bg-stone-50 p-1 ring-1 ring-stone-200 lg:flex">
            {languages.map((language) => (
              <button key={language} type="button" className="rounded-full px-3 py-1.5 text-xs font-black text-stone-600 transition first:bg-white first:text-pink-700 first:shadow-sm hover:text-pink-700">
                {language}
              </button>
            ))}
          </div>

          {role === "guest" && (
            <>
              <Link href="/login" className="hidden h-11 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-black text-stone-900 ring-1 ring-stone-200 transition hover:bg-stone-50 md:inline-flex">
                <LogIn size={17} /> Logga in
              </Link>
              <Link href="/florist/register" className="hidden h-11 items-center justify-center gap-2 rounded-full bg-pink-600 px-4 text-sm font-black !text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700 sm:inline-flex">
                <Store size={17} /> Registrera florist
              </Link>
            </>
          )}

          {role === "customer" && (
            <>
              <Link href="/messages" className={iconLinkClass(active === "messages")} aria-label="Meddelanden"><MessageCircle size={19} /></Link>
              <Link href="/favorites" className={iconLinkClass(false)} aria-label="Favoriter"><Heart size={19} /></Link>
              <Link href="/orders/history" className={iconLinkClass(active === "orders")} aria-label="Orderhistorik"><History size={19} /></Link>
              <Link href="/profile" className={iconLinkClass(active === "profile")} aria-label="Profil"><UserRound size={19} /></Link>
            </>
          )}

          {role === "florist" && (
            <>
              <Link href="/dashboard" className={iconLinkClass(active === "dashboard")} aria-label="Dashboard"><LayoutDashboard size={19} /></Link>
              <Link href="/dashboard/orders" className={iconLinkClass(active === "orders")} aria-label="Orders"><PackageCheck size={19} /></Link>
              <Link href="/messages" className={iconLinkClass(active === "messages")} aria-label="Meddelanden"><MessageCircle size={19} /></Link>
              <Link href="/notifications" className={iconLinkClass(false)} aria-label="Notiser"><Bell size={19} /></Link>
            </>
          )}

          <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-900 ring-1 ring-stone-200 xl:hidden">
            <Menu size={20} />
          </button>
        </div>
      </div>

      <div className="border-t border-pink-100/70 bg-white/95 px-4 py-2 xl:hidden">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto pb-1">
          <Link href="/feed" className={navClass(active === "feed")}>Feed</Link>
          <Link href="/marketplace" className={navClass(active === "marketplace")}>Marketplace</Link>
          <Link href="/florists" className={navClass(active === "florists")}>Florister</Link>
          <Link href="/company/register" className={navClass(false)}>Företag</Link>
          {role === "guest" && (
            <>
              <Link href="/login" className={navClass(false)}>Logga in</Link>
              <Link href="/florist/register" className={navClass(false)}>Registrera florist</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

