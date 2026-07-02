import Link from "next/link";
import { Building2, MapPin, Pencil } from "lucide-react";

type ProfileHeroProps = {
  roleLabel: string;
  title: string;
  description?: string;
  city?: string;
  country?: string;
  editRole: string;
  logoUrl?: string;
  coverUrl?: string;
};

export default function ProfileHero({
  roleLabel,
  title,
  description,
  city,
  country,
  editRole,
  logoUrl,
  coverUrl,
}: ProfileHeroProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/80">
      <div
        className="relative h-32 bg-gradient-to-br from-pink-200 via-rose-100 to-emerald-100 bg-cover bg-center sm:h-52"
        style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : undefined}
      />

      <div className="relative px-6 pb-8 sm:px-10">
        <div className="-mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-[2rem] border-4 border-white bg-pink-100 text-pink-700 shadow-lg">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 size={52} />
              )}
            </div>

            <div className="pb-2">
              <div className="mb-2 inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-pink-700">
                {roleLabel}
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                {title}
              </h1>

              {(city || country) && (
                <p className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-500">
                  <MapPin size={16} />
                  {[city, country].filter(Boolean).join(", ")}
                </p>
              )}

              {description && (
                <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-slate-500">
                  {description}
                </p>
              )}
            </div>
          </div>

          <Link
            href={`/profile/edit?role=${editRole}`}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-pink-600 px-5 text-sm font-black text-white shadow-lg shadow-pink-100 hover:bg-pink-700"
          >
            <Pencil size={16} />
            Redigera profil
          </Link>
        </div>
      </div>
    </section>
  );
}
