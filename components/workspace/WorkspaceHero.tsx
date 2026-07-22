import Link from "next/link";
import { Activity, ArrowRight, CheckCircle2 } from "lucide-react";

type MissionPanel = {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

interface WorkspaceHeroProps {
  missionPanels: MissionPanel[];
  services: string[];
}

export default function WorkspaceHero({
  missionPanels,
  services,
}: WorkspaceHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-stone-950 via-stone-900 to-pink-950 p-8 text-white shadow-2xl ring-1 ring-white/10 md:p-11">
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-pink-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 right-8 h-44 w-44 rounded-full bg-sky-300/10 blur-3xl" />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black ring-1 ring-white/15">
            <Activity size={17} />
            FloristSocial Operating System
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">
            FOS-Aktivitetskontroll
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/75 md:text-base">
            Kontrollrum för orderflöden, florister, leveranser, kalender,
            produktion, ekonomi, notifieringar och FOS-motorer.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/superadmin/development/security"
            className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white hover:bg-pink-700"
          >
            System Health
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/workspace/action-queue"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-black text-white ring-1 ring-white/15 hover:bg-white/15"
          >
            Action Queue
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/workspace/priority-center"
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-black text-white hover:bg-red-700"
          >
            Prioritetscenter
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {missionPanels.map((panel) => {
          const Icon = panel.icon;

          return (
            <div
              key={panel.label}
              className="rounded-3xl bg-white/[0.11] p-5 ring-1 ring-white/15"
            >
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-pink-200">
                  <Icon size={21} />
                </div>

                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-200">
                  Live
                </span>
              </div>

              <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-white/45">
                {panel.label}
              </p>

              <p className="mt-1 text-2xl font-black">
                {panel.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-9 grid gap-3 md:grid-cols-4">
        {services.map((service) => (
          <div
            key={service}
            className="rounded-2xl bg-white/[0.09] p-4 ring-1 ring-white/15"
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/50">
              {service}
            </p>

            <div className="mt-2 flex items-center gap-2 text-sm font-black text-emerald-300">
              <CheckCircle2 size={16} />
              Healthy
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

