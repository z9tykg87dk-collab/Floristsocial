import Link from "next/link";
import { Grid2X2, Heart, ImageIcon, MoreHorizontal, ShoppingBag, UserRound } from "lucide-react";

type ActiveTab = "overview" | "products" | "portfolio" | "favorites" | "profile" | "more";

type Props = {
  active?: ActiveTab;
};

function itemClass(active: boolean) {
  return active ? "text-pink-600" : "text-stone-500";
}

export default function FloristSocialMobileBottomNav({ active = "overview" }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-200 bg-white/95 px-3 py-2 shadow-[0_-10px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-5 gap-1">
        <Link href="/feed" className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black ${itemClass(active === "overview")}`}>
          <Grid2X2 size={20} />
          Översikt
        </Link>
        <Link href="/marketplace" className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black ${itemClass(active === "products")}`}>
          <ShoppingBag size={20} />
          Produkter
        </Link>
        <Link href="/portfolio" className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black ${itemClass(active === "portfolio")}`}>
          <ImageIcon size={20} />
          Portfolio
        </Link>
        <Link href="/favorites" className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black ${itemClass(active === "favorites")}`}>
          <Heart size={20} />
          Favoriter
        </Link>
        <Link href="/profile" className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black ${itemClass(active === "profile")}`}>
          <UserRound size={20} />
          Profil
        </Link>
      </div>
    </nav>
  );
}
