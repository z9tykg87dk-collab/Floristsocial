"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  Globe,
  Palette,
  Menu,
  MessageCircle,
  ShieldAlert,
  Bell,
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
    <Link href={href} className="flex items-center gap-1 rounded-full p-2 hover:bg-rose-50">
      {children}

      {count && count > 0 ? (
        <span
          className={`text-xs font-bold ${
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

  const isPublicShop =
    pathname.startsWith("/shop/") || pathname.startsWith("/public/florist/");

  const messageCount = 2;
  const actionCount = 1;
  const notificationCount = 14;

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-rose-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-full w-[1440px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/floristsocial-logo.png"
            alt="FloristSocial Logo"
            width={44}
            height={44}
            priority
            className="h-11 w-11 object-contain"
          />

          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-xl font-bold text-rose-600">
              FloristSocial
            </span>
            <span className="hidden text-xs text-gray-500 lg:block">
              Där florister blomstrar tillsammans
            </span>
          </div>
        </Link>

        <div className="hidden max-w-md flex-1 md:mx-6 md:flex">
          <Link
            href="/search"
            className="flex w-full items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500 hover:bg-gray-100"
          >
            <Search size={18} />
            Sök...
          </Link>
        </div>

        <nav className="flex items-center gap-2">
          <HeaderIcon href="/search">
            <Search size={20} />
          </HeaderIcon>

          <HeaderIcon href="/language">
            <Globe size={20} />
          </HeaderIcon>

          <HeaderIcon href="/theme">
            <Palette size={20} />
          </HeaderIcon>

          {isPublicShop ? (
            <>
              <HeaderIcon href="/messages">
                <MessageCircle size={20} />
              </HeaderIcon>
            </>
          ) : (
            <>
              <div className="hidden items-center gap-2 md:flex">
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
