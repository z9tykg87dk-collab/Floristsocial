"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  UploadCloud,
  User,
} from "lucide-react";


function generatePartnerNumber(prefix: string) {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${year}-${random}`;
}

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!?#";
  const array = new Uint32Array(12);
  crypto.getRandomValues(array);
  return Array.from(array, (x) => chars[x % chars.length]).join("");
}

const supplierCategories = [
  "Snittblomsgrossist",
  "Växtgrossist",
  "Tillbehörsgrossist",
  "Krukor",
  "Oasis",
  "Band & dekoration",
  "Kylrum",
  "Butiksinredning",
  "Fordon",
  "Bank",
  "Försäkring",
  "Elleverantör",
  "IT / Kassasystem",
  "Marknadsföring",
  "Fastighetsmäklare",
  "Lokaluthyrning",
  "Utbildning",
  "Annat",
];

export default function SupplierRegisterPage() {
  const [selected, setSelected] = useState<string[]>(["Snittblomsgrossist"]);
  const [message, setMessage] = useState("");
  const [partnerNumber] = useState(() => generatePartnerNumber("FSLEV"));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [logoName, setLogoName] = useState("");
  const [coverName, setCoverName] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [presentation, setPresentation] = useState("");

  function toggle(value: string) {
    setSelected((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.setItem("floristsocial_fslev_profile", JSON.stringify({ partnerNumber, createdAt: new Date().toISOString(), profileRoute: "/supplier/profile" }));
    setMessage("✅ Leverantör registrerad lokalt. Nästa steg är Supabase-koppling, synlighet för florister och produktkatalog.");
  }

  return (
    <main className="min-h-screen bg-[#f7f2ea] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/register" className="inline-flex items-center gap-2 text-sm font-bold hover:text-pink-700">
            <ArrowLeft size={18} /> Till registrering
          </Link>
          <div className="rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-bold text-pink-700 shadow-sm">
            Leverantör registrering
          </div>
        </div>

        <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/80">
          <div className="bg-gradient-to-br from-pink-50 via-white to-emerald-50 px-6 py-8 sm:px-10">
            <p className="mb-3 inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-pink-700">
              Endast synlig för florister
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
              Registrera leverantör till florister
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Leverantörer kan sälja produkter, tjänster och förmåner till
              florister samt köpa annonser på FloristSocial.
            </p>
          </div>

          {message && <div className="mx-6 mt-6 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700 sm:mx-10">{message}</div>}

          <form onSubmit={submit} className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[1fr_340px]">
            <div className="space-y-6">
              <Card title="Konto" icon={<ShieldCheck size={20} />}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="E-post *" type="email" icon={<Mail size={18} />} />
                  <div className="sm:col-span-2 rounded-3xl bg-slate-50 p-4">
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-black text-slate-900">
                          Eget lösenord eller säkert lösenord *
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          Du kan skriva eget lösenord eller generera ett säkert lösenord.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const next = generatePassword();
                          setPassword(next);
                          setConfirmPassword(next);
                        }}
                        className="rounded-2xl bg-slate-900 px-4 py-3 text-xs font-black text-white hover:bg-slate-800"
                      >
                        Generera säkert lösenord
                      </button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-sm font-black">Lösenord *</span>
                        <input
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          type="password"
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-black">Bekräfta lösenord *</span>
                        <input
                          value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          type="password"
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Företagsuppgifter" icon={<Building2 size={20} />}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-black">Registreringsnummer</span>
                    <div className="flex h-12 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-pink-700">
                      {partnerNumber}
                    </div>
                  </label>
                  <Field label="Företagsnamn *" icon={<Building2 size={18} />} />
                  <Field label="Organisationsnummer *" />
                  <Field label="Kontaktperson *" icon={<User size={18} />} />
                  <Field label="Telefonnummer *" icon={<Phone size={18} />} />
                  <Field label="Adress *" icon={<MapPin size={18} />} />
                  <Field label="Webbplats" />
                </div>
              </Card>

              <Card title="Leverantörskategori" icon={<Leaf size={20} />}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {supplierCategories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggle(item)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm font-black ${
                        selected.includes(item)
                          ? "border-pink-300 bg-pink-50 text-pink-700"
                          : "border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </Card>

              <Card title="Profil och katalog" icon={<UploadCloud size={20} />}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <UploadBox label="Logotyp" fileName={logoName} onChange={setLogoName} />
                  <UploadBox label="Omslagsbild" fileName={coverName} onChange={setCoverName} />
                  <UploadBox label="Produktkatalog / PDF" fileName={pdfName} onChange={setPdfName} />
                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-black">Presentera ditt företag här</span>
                    <textarea
                      value={presentation}
                      onChange={(event) => setPresentation(event.target.value)}
                      placeholder="Skriv en tydlig presentation av företaget, tjänsterna, produkterna och varför florister eller kunder ska samarbeta med er."
                      className="min-h-[170px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold leading-6 outline-none focus:border-pink-300"
                    />
                  </label>
                </div>
              </Card>

              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-pink-600 px-6 text-sm font-black text-white hover:bg-pink-700">
                <Send size={16} /> Skicka registrering
              </button>
            </div>

            <aside className="rounded-[2rem] bg-slate-50 p-6">
              <Leaf className="text-pink-700" size={32} />
              <h2 className="mt-4 text-xl font-black">Synlighet</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                Leverantörer ska vara synliga för florister, kunna sälja
                produkter till florister och streama produkter endast till
                florister.
              </p>
            </aside>
          </form>
        </section>
      </div>
    </main>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"><h2 className="mb-5 flex items-center gap-2 text-xl font-black">{icon}{title}</h2>{children}</section>;
}

function Field({ label, type = "text", icon }: { label: string; type?: string; icon?: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-black">{label}</span><div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">{icon}<input type={type} className="w-full bg-transparent text-sm font-bold outline-none" /></div></label>;
}


function UploadBox({
  label,
  fileName,
  onChange,
}: {
  label: string;
  fileName: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">{label}</span>
      <div className="grid min-h-[140px] cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-pink-200 bg-pink-50/40 px-4 py-5 text-center transition hover:bg-pink-50">
        <input
          type="file"
          className="hidden"
          onChange={(event) => onChange(event.target.files?.[0]?.name || "")}
        />
        <div>
          <UploadCloud className="mx-auto mb-3 text-pink-700" size={28} />
          <p className="text-sm font-black text-slate-800">
            {fileName || "Dra & släpp eller ladda upp"}
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Bild, logotyp eller PDF beroende på fält.
          </p>
        </div>
      </div>
    </label>
  );
}
