"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Globe, Heart, Menu, MessageCircle, Palette, Search, ShieldAlert, ShoppingBag, X } from "lucide-react";
import HeaderGuestAuthIcon from "@/components/HeaderGuestAuthIcon";

type LoggedInFlorist = {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
};

export default function GlobalHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("cerise");
  const [language, setLanguage] = useState("sv");
  const [openPanel, setOpenPanel] = useState<"search" | "language" | "theme" | "menu" | null>(null);
  const [loggedInFlorist, setLoggedInFlorist] =
    useState<LoggedInFlorist | null>(null);

  const isPublicShop =
    pathname.startsWith("/shop/") || pathname.startsWith("/public/florist/");

  const isFloristInternalArea =
    pathname.startsWith("/florist/") ||
    pathname.startsWith("/florist-dashboard") ||
    pathname === "/dashboard";

  const showFloristAccountMenu =
    Boolean(loggedInFlorist?.id) &&
    isFloristInternalArea &&
    !isPublicShop;

  useEffect(() => {
    let active = true;

    async function loadLoggedInFlorist() {
      try {
        const response = await fetch("/api/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          if (active) setLoggedInFlorist(null);
          return;
        }

        const data = (await response.json()) as {
          authenticated?: boolean;
          florist?: LoggedInFlorist;
        };

        if (active && data.authenticated && data.florist?.id) {
          setLoggedInFlorist(data.florist);
        } else if (active) {
          setLoggedInFlorist(null);
        }
      } catch {
        if (active) setLoggedInFlorist(null);
      }
    }

    void loadLoggedInFlorist();

    return () => {
      active = false;
    };
  }, [pathname]);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanQuery = query.trim();

    if (!cleanQuery) {
      router.push("/florists/map");
      return;
    }

    localStorage.setItem("globalSearchQuery", cleanQuery);
    router.push(`/florists/map?q=${encodeURIComponent(cleanQuery)}`);
  }

  function changeTheme(nextTheme: string) {
    setTheme(nextTheme);
    localStorage.setItem("floristSocialTheme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    setOpenPanel(null);
  }

  function changeLanguage(nextLanguage: string) {
    setLanguage(nextLanguage);
    localStorage.setItem("floristSocialLanguage", nextLanguage);
    document.documentElement.lang = nextLanguage;
    setOpenPanel(null);
  }

  const publicMenuLinks = [
    { label: "Beställa blommor", href: "/order/private/guest-v4" },
    { label: "Hitta florist", href: "/florists/map" },
    { label: "Sociala flödet", href: "/feed" },
    { label: "Om oss", href: "/about" },
    { label: "Villkor", href: "/terms" },
    { label: "Integritet / GDPR", href: "/privacy" },
    { label: "Cookies", href: "/cookies" },
    { label: "Kontakt", href: "/contact" },
  ];

  const accountMenuLinks = showFloristAccountMenu
    ? [
        {
          label: "Redigera företagsprofil",
          href: "/florist-dashboard/profile",
        },
        {
          label: "Floristens dashboard",
          href: "/dashboard",
        },
      ]
    : [];

  const guestMenuLinks = loggedInFlorist
    ? []
    : [
        { label: "Login", href: "/auth/sign-in" },
        { label: "Registrera", href: "/register" },
      ];

  const menuLinks = [
    ...accountMenuLinks,
    ...publicMenuLinks,
    ...guestMenuLinks,
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-rose-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-[84px] w-full max-w-[1450px] items-center gap-4 px-3 py-3 md:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-4">
          <Image
            src="/images/floristsocial-logo.png"
            alt="FloristSocial Logo"
            width={58}
            height={58}
            priority
            className="h-[52px] w-[52px] shrink-0 object-contain md:h-[58px] md:w-[58px]"
          />

          <div className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="truncate text-2xl font-black text-rose-600">
              FloristSocial
            </span>
            <span className="hidden truncate text-sm font-semibold text-gray-500 lg:block">
              Där florister blomstrar tillsammans
            </span>
          </div>
        </Link>

        <form onSubmit={submitSearch} className="hidden min-w-0 flex-1 lg:flex">
          <div className="flex w-full items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-5 py-3 text-base text-gray-600 transition focus-within:border-rose-300 focus-within:bg-white">
            <Search size={22} className="shrink-0 text-rose-600" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Sök florist, stad, adress eller blommor..."
              className="w-full bg-transparent text-base font-semibold outline-none placeholder:text-gray-400"
            />
          </div>
        </form>

        <nav className="ml-auto flex items-center gap-2">
          <div className="relative lg:hidden">
            <button
              type="button"
              onClick={() => setOpenPanel(openPanel === "search" ? null : "search")}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-stone-700 hover:bg-rose-50"
              aria-label="Sök"
              title="Sök"
            >
              <Search size={23} />
            </button>

            {openPanel === "search" ? (
              <form
                onSubmit={submitSearch}
                className="fixed left-3 right-3 top-[92px] z-50 rounded-[28px] bg-white p-3 shadow-2xl ring-1 ring-stone-200 sm:left-auto sm:right-6 sm:w-[360px]"
              >
                <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 py-3">
                  <Search size={18} className="shrink-0 text-rose-600" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Sök florist, stad eller adress..."
                    className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-stone-400"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-3 w-full rounded-full bg-pink-600 px-4 py-3 text-sm font-black !text-white"
                >
                  Sök
                </button>
              </form>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenPanel(openPanel === "language" ? null : "language")}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-stone-700 transition hover:bg-rose-50"
              aria-label="Språk"
              title="Språk"
            >
              <Globe size={23} />
            </button>

            {openPanel === "language" ? (
              <div className="absolute right-0 top-14 z-50 w-60 rounded-3xl bg-white p-3 shadow-2xl ring-1 ring-stone-200">
                {[
                  ["sv", "Svenska"],
                  ["en", "English"],
                  ["fr", "Français"],
                  ["ar", "العربية"],
                ].map(([code, label]) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => changeLanguage(code)}
                    className={`mb-1 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-black transition hover:bg-rose-50 ${
                      language === code ? "bg-rose-50 text-rose-700" : "text-stone-800"
                    }`}
                  >
                    {label}
                    <span className="text-xs uppercase text-stone-400">{code}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenPanel(openPanel === "theme" ? null : "theme")}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-stone-700 transition hover:bg-rose-50"
              aria-label="Färgtema"
              title="Färgtema"
            >
              <Palette size={23} />
            </button>

            {openPanel === "theme" ? (
              <div className="absolute right-0 top-14 z-50 w-60 rounded-3xl bg-white p-3 shadow-2xl ring-1 ring-stone-200">
                {[
                  ["lavender", "Lavendel", "bg-violet-500"],
                  ["cerise", "Cerise", "bg-pink-600"],
                  ["green", "Grön", "bg-emerald-600"],
                  ["orange", "Orange", "bg-orange-500"],
                ].map(([code, label, colorClass]) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => changeTheme(code)}
                    className={`mb-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition hover:bg-stone-50 ${
                      theme === code ? "bg-stone-50 text-stone-950" : "text-stone-800"
                    }`}
                  >
                    <span className={`h-5 w-5 rounded-full ${colorClass}`} />
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {!isPublicShop && !loggedInFlorist ? (
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href="/login"
                className="rounded-full bg-white px-5 py-3 text-sm font-black text-stone-900 ring-1 ring-stone-200 hover:bg-stone-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-pink-600 px-5 py-3 text-sm font-black !text-white hover:bg-pink-700"
              >
                Registrera
              </Link>
            </div>
          ) : null}

          <HeaderGuestAuthIcon label="Meddelanden" icon={<MessageCircle size={23} />} />
          <HeaderGuestAuthIcon label="Säkerhet" icon={<ShieldAlert size={24} />} />
          <HeaderGuestAuthIcon label="Notiser" icon={<Bell size={23} />} />
          <HeaderGuestAuthIcon label="Favoriter" icon={<Heart size={23} />} />
          <HeaderGuestAuthIcon label="Orderhistorik" icon={<ShoppingBag size={23} />} />

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenPanel(openPanel === "menu" ? null : "menu")}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-stone-700 transition hover:bg-rose-50"
              aria-label="Meny"
              title="Meny"
            >
              {openPanel === "menu" ? <X size={25} /> : <Menu size={26} />}
            </button>

            {openPanel === "menu" ? (
              <div className="fixed left-3 right-3 top-[92px] z-50 rounded-[28px] bg-white p-3 shadow-2xl ring-1 ring-stone-200 sm:left-auto sm:right-6 sm:w-[360px]">
                <div className="grid gap-1">
                  {menuLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpenPanel(null)}
                      className="rounded-2xl px-4 py-3 text-sm font-black text-stone-800 transition hover:bg-rose-50 hover:text-rose-700"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </nav>
      </div>
    </header>
  );
}
