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
  const [theme, setTheme] = useState("pink");
  const [language, setLanguage] = useState("sv");

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
  }

  function changeLanguage(nextLanguage: string) {
    setLanguage(nextLanguage);
    localStorage.setItem("floristSocialLanguage", nextLanguage);
    document.documentElement.lang = nextLanguage;
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

          <select
            value={language}
            onChange={(event) => changeLanguage(event.target.value)}
            className="hidden rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-black text-stone-700 outline-none sm:block"
            aria-label="Språk"
          >
            <option value="sv">SV</option>
            <option value="en">EN</option>
            <option value="no">NO</option>
            <option value="da">DA</option>
            <option value="fi">FI</option>
          </select>

          <select
            value={theme}
            onChange={(event) => changeTheme(event.target.value)}
            className="hidden rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-black text-stone-700 outline-none lg:block"
            aria-label="Färgtema"
          >
            <option value="pink">Rosa</option>
            <option value="green">Grön</option>
            <option value="gold">Guld</option>
          </select>

          <HeaderIcon href="/language">
            <Globe size={20} />
          </HeaderIcon>

          <HeaderIcon href="/theme">
            <Palette size={20} />
          </HeaderIcon>

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
