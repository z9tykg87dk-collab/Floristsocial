import Link from "next/link";
import {
  Bell,
  Brain,
  CalendarDays,
  CreditCard,
  Heart,
  MessageCircle,
  Package,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { getWorkspaceCards } from "@/engines/workspace/services/WorkspaceService";
import type { WorkspaceCard } from "@/engines/workspace/types";

const iconMap: Record<string, React.ReactNode> = {
  calendar: <CalendarDays size={26} />,
  crm: <Users size={26} />,
  orders: <Package size={26} />,
  economy: <CreditCard size={26} />,
  notifications: <Bell size={26} />,
  intelligence: <Brain size={26} />,
  social: <Heart size={26} />,
  supplier: <Sparkles size={26} />,
};

export default async function WorkspacePage() {
  const role = "florist";
  const cards = await getWorkspaceCards(role);

  return (
    <main className="min-h-screen bg-[#f7f2ea] px-4 pt-2 pb-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/80">
          <div className="bg-gradient-to-br from-pink-50 via-white to-emerald-50 px-6 py-8 sm:px-10">
            <p className="mb-3 inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-pink-700">
              FloristSocial Arbetsyta
            </p>

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
              God morgon 🌸
            </h1>

            <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-slate-600">
              Här samlas dagens viktigaste aktiviteter, relationer, order,
              ekonomi och smarta förslag från FloristSocials Engines.
            </p>

            <div className="mt-6 flex h-13 max-w-2xl items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm">
              <Search size={18} className="text-pink-700" />
              <input
                placeholder="Sök i FloristSocial..."
                className="w-full bg-transparent text-sm font-bold outline-none"
              />
              <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                ⌘ K
              </span>
            </div>
          </div>

          <div className="grid gap-5 p-6 sm:p-8 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <WorkspaceCardView key={card.id} card={card} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function WorkspaceCardView({ card }: { card: WorkspaceCard }) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-pink-50 text-pink-700">
          {iconMap[card.type] || <MessageCircle size={26} />}
        </div>

        {card.value && (
          <div className="rounded-full bg-slate-50 px-4 py-2 text-sm font-black text-slate-900">
            {card.value}
          </div>
        )}
      </div>

      <h2 className="text-xl font-black tracking-tight">{card.title}</h2>

      {card.subtitle && (
        <p className="mt-2 min-h-[48px] text-sm font-semibold leading-6 text-slate-600">
          {card.subtitle}
        </p>
      )}

      {card.href && (
        <Link
          href={card.href}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-pink-600 px-5 text-sm font-black text-white hover:bg-pink-700"
        >
          {card.actionLabel || "Öppna"}
        </Link>
      )}
    </section>
  );
}
