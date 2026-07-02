"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  ImagePlus,
  Search,
  UploadCloud,
  Video,
} from "lucide-react";

type MediaCategory =
  | "Alla"
  | "Logotyp"
  | "Profilbild"
  | "Omslagsbild"
  | "Produktbilder"
  | "Blomsterinspiration"
  | "Sociala Flödet"
  | "PDF"
  | "Video";

type MediaItem = {
  id: string;
  name: string;
  category: MediaCategory;
  type: "image" | "pdf" | "video";
  size: string;
  uploadedAt: string;
  usedOn: string[];
};

const categories: MediaCategory[] = [
  "Alla",
  "Logotyp",
  "Profilbild",
  "Omslagsbild",
  "Produktbilder",
  "Blomsterinspiration",
  "Sociala Flödet",
  "PDF",
  "Video",
];

const demoFiles: MediaItem[] = [
  {
    id: "1",
    name: "pionbukett.jpg",
    category: "Produktbilder",
    type: "image",
    size: "1.8 MB",
    uploadedAt: "Idag",
    usedOn: ["Produkt", "Sociala Flödet"],
  },
  {
    id: "2",
    name: "butik-omslag.jpg",
    category: "Omslagsbild",
    type: "image",
    size: "2.4 MB",
    uploadedAt: "Igår",
    usedOn: ["Profil"],
  },
  {
    id: "3",
    name: "produktkatalog.pdf",
    category: "PDF",
    type: "pdf",
    size: "4.2 MB",
    uploadedAt: "3 dagar sedan",
    usedOn: ["Leverantörsprofil"],
  },
];

export default function MediaCenterPage() {
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory>("Alla");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<MediaItem[]>(demoFiles);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const categoryMatch =
        selectedCategory === "Alla" || item.category === selectedCategory;

      const searchMatch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.usedOn.join(" ").toLowerCase().includes(search.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [items, selectedCategory, search]);

  function addLocalFile(file: File, category: MediaCategory) {
    const type =
      file.type.includes("pdf")
        ? "pdf"
        : file.type.includes("video")
          ? "video"
          : "image";

    setItems((current) => [
      {
        id: crypto.randomUUID(),
        name: file.name,
        category,
        type,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadedAt: "Nyss",
        usedOn: ["Ej använd ännu"],
      },
      ...current,
    ]);
  }

  return (
    <main className="min-h-screen bg-[#f7f2ea] px-4 pt-2 pb-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Link
            href="/profile/edit?role=florist"
            className="inline-flex items-center gap-2 text-sm font-black text-slate-700 hover:text-pink-700"
          >
            <ArrowLeft size={18} />
            Tillbaka till profilredigering
          </Link>

          <div className="rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-black text-pink-700 shadow-sm">
            Media Center
          </div>
        </div>

        <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/80">
          <div className="bg-gradient-to-br from-pink-50 via-white to-emerald-50 px-6 py-8 sm:px-10">
            <p className="mb-3 inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-pink-700">
              FloristSocial Media Center
            </p>

            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
              Samla bilder, PDF och videor på ett ställe.
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Här laddas filer upp en gång och kan senare användas i profil,
              produkter, Blomsterinspiration, Sociala Flödet, kataloger och kampanjer.
            </p>
          </div>

          <div className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[360px_1fr]">
            <aside className="space-y-6">
              <UploadPanel
                title="Ladda upp media"
                description="Dra & släpp bilder, PDF eller video."
                onFile={(file) => addLocalFile(file, selectedCategory === "Alla" ? "Produktbilder" : selectedCategory)}
              />

              <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-black">Kategorier</h2>

                <div className="mt-4 grid gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-2xl px-4 py-3 text-left text-sm font-black transition ${
                        selectedCategory === category
                          ? "bg-pink-600 text-white"
                          : "bg-slate-50 text-slate-700 hover:bg-pink-50 hover:text-pink-700"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </section>
            </aside>

            <section>
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">
                    Senast uppladdade
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {filteredItems.length} filer visas
                  </p>
                </div>

                <div className="flex h-12 min-w-[280px] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
                  <Search size={18} className="text-pink-700" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Sök fil, kategori eller användning..."
                    className="w-full bg-transparent text-sm font-bold outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item) => (
                  <MediaCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function UploadPanel({
  title,
  description,
  onFile,
}: {
  title: string;
  description: string;
  onFile: (file: File) => void;
}) {
  return (
    <label className="block rounded-[1.75rem] border-2 border-dashed border-pink-200 bg-pink-50/40 p-6 text-center shadow-sm transition hover:bg-pink-50">
      <input
        type="file"
        className="hidden"
        multiple
        onChange={(event) => {
          Array.from(event.target.files || []).forEach(onFile);
          event.currentTarget.value = "";
        }}
      />

      <UploadCloud className="mx-auto text-pink-700" size={40} />

      <h2 className="mt-4 text-xl font-black">{title}</h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
        {description}
      </p>

      <div className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-pink-600 px-5 text-sm font-black text-white">
        Välj filer
      </div>
    </label>
  );
}

function MediaCard({ item }: { item: MediaItem }) {
  const icon =
    item.type === "pdf" ? (
      <FileText size={34} />
    ) : item.type === "video" ? (
      <Video size={34} />
    ) : (
      <ImagePlus size={34} />
    );

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="grid h-44 place-items-center bg-gradient-to-br from-slate-50 to-pink-50 text-pink-700">
        {icon}
      </div>

      <div className="p-5">
        <div className="mb-3 inline-flex rounded-full bg-pink-50 px-3 py-1 text-xs font-black text-pink-700">
          {item.category}
        </div>

        <h3 className="truncate text-base font-black">{item.name}</h3>

        <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-600">
          <Info label="Storlek" value={item.size} />
          <Info label="Uppladdad" value={item.uploadedAt} />
        </div>

        <div className="mt-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
            Används på
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {item.usedOn.map((usage) => (
              <span
                key={usage}
                className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-700"
              >
                {usage}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span>{label}</span>
      <strong className="text-slate-900">{value}</strong>
    </div>
  );
}
