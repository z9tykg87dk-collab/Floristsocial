"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Globe,
  Menu,
  MessageCircle,
  Palette,
  Search,
  ShieldAlert,
} from "lucide-react";

function HeaderIcon({
  href,
  children,
  count,
  important = false,
}: {
  href: string;
  children: React.ReactNode;
  count?: number;
  important?: boolean;
}) {
  return (
    <Link
      href={href}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition hover:bg-rose-50"
    >
      {children}
      {count && count > 0 ? (
        <span
          className={`absolute -right-0.5 -top-0.5 rounded-full bg-white px-1.5 text-[10px] font-black ${
            important ? "text-red-600" : "text-rose-600"
          }`}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}

export default function GlobalHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("cerise");
  const [language, setLanguage] = useState("sv");
  const [openPanel, setOpenPanel] = useState<"language" | "theme" | null>(null);

  const isPublicShop =
    pathname.startsWith("/shop/") || pathname.startsWith("/public/florist/");

  const messageCount = 2;
  const actionCount = 1;
  const notificationCount = 14;

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

  return (
    <header className="sticky top-0 z-50 border-b border-rose-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-[1450px] items-center gap-3 px-3 py-2 md:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/images/floristsocial-logo.png"
            alt="FloristSocial Logo"
            width={44}
            height={44}
            priority
            className="h-10 w-10 shrink-0 object-contain md:h-11 md:w-11"
          />

          <div className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="truncate text-lg font-black text-rose-600 md:text-xl">
              FloristSocial
            </span>
            <span className="hidden truncate text-xs text-gray-500 lg:block">
              Där florister blomstrar tillsammans
            </span>
          </div>
        </Link>

        <form
          onSubmit={submitSearch}
          className="hidden min-w-0 flex-1 md:flex"
        >
          <div className="flex w-full items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600 transition focus-within:border-rose-300 focus-within:bg-white">
            <Search size={18} className="shrink-0 text-rose-600" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Sök florist, stad, adress eller blommor..."
              className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-gray-400"
            />
          </div>
        </form>

        <nav className="ml-auto flex items-center gap-1 md:gap-2">
          <form onSubmit={submitSearch} className="md:hidden">
            <button
              type="submit"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-700 hover:bg-rose-50"
              aria-label="Sök"
            >
              <Search size={20} />
            </button>
          </form>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenPanel(openPanel === "language" ? null : "language")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition hover:bg-rose-50"
              aria-label="Språk"
            >
              <Globe size={20} />
            </button>

            {openPanel === "language" ? (
              <div className="absolute right-0 top-12 z-50 w-56 rounded-3xl bg-white p-3 shadow-2xl ring-1 ring-stone-200">
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
                <p className="mt-2 rounded-2xl bg-stone-50 p-3 text-xs font-semibold leading-5 text-stone-500">
                  Språk efter land byggs stegvis. Engelska används som extra språk globalt.
                </p>
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenPanel(openPanel === "theme" ? null : "theme")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition hover:bg-rose-50"
              aria-label="Färgtema"
            >
              <Palette size={20} />
            </button>

            {openPanel === "theme" ? (
              <div className="absolute right-0 top-12 z-50 w-60 rounded-3xl bg-white p-3 shadow-2xl ring-1 ring-stone-200">
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
                <p className="mt-2 rounded-2xl bg-stone-50 p-3 text-xs font-semibold leading-5 text-stone-500">
                  Nästa steg: färgvalet ersätter rosa globalt på hela sidan.
                </p>
              </div>
            ) : null}
          </div>

          {isPublicShop ? (
            <HeaderIcon href="/messages">
              <MessageCircle size={20} />
            </HeaderIcon>
          ) : (
            <>
              <div className="hidden items-center gap-1 md:flex">
                <HeaderIcon href="/messages" count={messageCount}>
                  <MessageCircle size={20} />
                </HeaderIcon>

                <HeaderIcon href="/actions" count={actionCount} important>
                  <ShieldAlert size={21} />
                </HeaderIcon>

                <HeaderIcon href="/notifications" count={notificationCount}>
                  <Bell size={20} />
                </HeaderIcon>
              </div>

              <div className="md:hidden">
                <HeaderIcon href="/actions" count={actionCount} important>
                  <ShieldAlert size={21} />
                </HeaderIcon>
              </div>

              <HeaderIcon href="/menu">
                <Menu size={24} />
              </HeaderIcon>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
