"use client";

import {
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  User,
  Mail,
  Phone,
  Camera,
  Building2,
  Store,
  Globe,
  MapPin,
  Clock,
  Truck,
  Plus,
  Trash2,
  Flower2,
  ImagePlus,
  UploadCloud,
  Eye,
  CreditCard,
  ShieldCheck,
  Check,
  CalendarDays,
  X,
  Save,
} from "lucide-react";

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return "https://" + trimmed;
}

const swedishCities = [
  "Stockholm", "Göteborg", "Malmö", "Uppsala", "Västerås", "Örebro",
  "Linköping", "Helsingborg", "Jönköping", "Norrköping", "Lund",
  "Umeå", "Gävle", "Borås", "Eskilstuna", "Södertälje", "Karlstad",
  "Täby", "Växjö", "Halmstad", "Sundsvall", "Luleå", "Annan stad",
];

const cityAreas: Record<string, string[]> = {
  Stockholm: [
    "Södermalm", "Östermalm", "Vasastan", "Kungsholmen", "Norrmalm",
    "Gamla stan", "Liljeholmen", "Hammarby Sjöstad", "Årsta", "Enskede",
    "Bromma", "Solna", "Sundbyberg", "Nacka", "Lidingö", "Täby",
    "Danderyd", "Sollentuna", "Huddinge", "Farsta", "Annat område",
  ],
  Göteborg: ["Centrum", "Linné", "Majorna", "Hisingen", "Mölndal", "Partille", "Annat område"],
  Malmö: ["Centrum", "Limhamn", "Västra Hamnen", "Triangeln", "Hyllie", "Annat område"],
};

const serviceOptions = [
  "Bröllop", "Begravning", "Event", "Företagsblommor", "Buketter", "Blombud",
  "Prenumerationer", "Workshops", "Hemleverans", "Samma dag-leverans",
  "Hotell & restaurang", "Skyltfönster & installationer",
];

const styleOptions = [
  "Romantiskt", "Modernt", "Vilt & organiskt", "Klassiskt", "Nordiskt",
  "Lyxigt", "Färgstarkt", "Minimalistiskt", "Säsongsbaserat", "Exklusivt",
];

const swedishHolidays = [
  "Nyårsdagen",
  "Trettondedag jul",
  "Långfredagen",
  "Påskafton",
  "Påskdagen",
  "Annandag påsk",
  "Första maj",
  "Kristi himmelsfärdsdag",
  "Nationaldagen",
  "Midsommarafton",
  "Midsommardagen",
  "Alla helgons dag",
  "Julafton",
  "Juldagen",
  "Annandag jul",
  "Nyårsafton",
];

const priceLevels = ["Budget", "Mellan", "Premium", "Lyx", "Varierar per uppdrag"];

const deliveryTypes = [
  "Lokal leverans",
  "Regional leverans",
  "Nationella uppdrag",
  "Endast upphämtning",
  "Ingen leverans",
];

const statusOptions = ["Ny ansökan", "Under granskning", "Godkänd", "Behöver kompletteras", "Pausad"];
const planOptions = ["Free", "Starter", "Pro", "Premium", "Partner"];

type CoverageArea = {
  id: number;
  city: string;
  area: string;
  postalCode: string;
  radius: number;
  price: string;
};

type UploadedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

type PortfolioDraftItem = UploadedImage & {
  title: string;
  price: string;
  description: string;
  hashtags: string;
  isSaved: boolean;
};

export default function FloristSocialRegistrationPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [deliveryRadius, setDeliveryRadius] = useState(15);
  const [closedDates, setClosedDates] = useState<string[]>([]);
  const [serviceUploadPrompt, setServiceUploadPrompt] = useState<string | null>(null);
  const [servicePortfolioItems, setServicePortfolioItems] = useState<Record<string, PortfolioDraftItem[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [coverageAreas, setCoverageAreas] = useState<CoverageArea[]>([
    { id: 1, city: "Stockholm", area: "Södermalm", postalCode: "", radius: 15, price: "" },
  ]);

  const portfolioCount = Object.values(servicePortfolioItems).reduce(
    (total, items) => total + items.filter((item) => item.isSaved).length,
    0
  );

  const completionScore = useMemo(() => {
    let score = 25;
    if (selectedServices.length > 0) score += 20;
    if (deliveryRadius >= 10) score += 15;
    if (coverageAreas.length > 0) score += 25;
    if (coverageAreas.some((item) => item.city && item.area && item.price)) score += 15;
    return Math.min(score, 100);
  }, [selectedServices, deliveryRadius, coverageAreas]);

  function toggleItem(value: string, list: string[], setter: Dispatch<SetStateAction<string[]>>) {
    const exists = list.includes(value);
    setter(exists ? list.filter((item) => item !== value) : [...list, value]);

    if (!exists && setter === setSelectedServices) {
      setServiceUploadPrompt(value);
    }
  }

  function toggleClosedDate(date: string) {
    setClosedDates((dates) =>
      dates.includes(date) ? dates.filter((item) => item !== date) : [...dates, date]
    );
  }

  function updateCoverageArea(id: number, field: keyof CoverageArea, value: string | number) {
    setCoverageAreas((areas) =>
      areas.map((area) => {
        if (area.id !== id) return area;

        if (field === "city") {
          const nextCity = String(value);
          const nextArea = cityAreas[nextCity]?.[0] || "Annat område";
          return { ...area, city: nextCity, area: nextArea };
        }

        return { ...area, [field]: value };
      })
    );
  }

  function addCoverageArea() {
    setCoverageAreas((areas) => [
      ...areas,
      {
        id: Date.now(),
        city: "Stockholm",
        area: "Södermalm",
        postalCode: "",
        radius: deliveryRadius,
        price: "",
      },
    ]);
  }

  function removeCoverageArea(id: number) {
    setCoverageAreas((areas) => areas.filter((area) => area.id !== id));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const formData = new FormData(event.currentTarget);

      const payload = {
        firstName: String(formData.get("firstName") || ""),
        lastName: String(formData.get("lastName") || ""),
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
        shopName: String(formData.get("shopName") || ""),
        phone: String(formData.get("phone") || ""),
        city: String(formData.get("city") || ""),
        postalCode: String(formData.get("postalCode") || ""),
        streetAddress: String(formData.get("streetAddress") || ""),
        websiteUrl: normalizeUrl(String(formData.get("websiteUrl") || "")),
        instagramHandle: String(formData.get("instagramHandle") || ""),
        bio: String(formData.get("bio") || ""),
        deliveryRadiusKm: deliveryRadius,
        stripeAccountId: String(formData.get("stripeAccountId") || ""),
        selectedServices,
        coverageAreas,
        servicePortfolioItems,
        closedDates,
      };

      const response = await fetch("/api/florists/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitError(result.error || "Något gick fel vid registreringen.");
        setSubmitting(false);
        return;
      }

      setSubmitSuccess("✅ Registreringen skickades och floristkontot skapades.");
    } catch (error) {
      console.error(error);
      setSubmitError("Serverfel vid registrering.");
    }

    setSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-[#fbf7f2] text-stone-900">
      {serviceUploadPrompt && (
        <ServiceUploadModal
          service={serviceUploadPrompt}
          initialItems={servicePortfolioItems[serviceUploadPrompt] || []}
          onClose={() => setServiceUploadPrompt(null)}
          onSave={(items) => {
            setServicePortfolioItems((current) => ({
              ...current,
              [serviceUploadPrompt]: items,
            }));
            setServiceUploadPrompt(null);
          }}
        />
      )}

      <section className="relative overflow-hidden px-5 py-10 md:px-10 lg:px-16">
        <div className="absolute right-[-160px] top-[-160px] h-96 w-96 rounded-full bg-pink-200/50 blur-3xl" />
        <div className="absolute bottom-[-180px] left-[-140px] h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <header className="mb-8 max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm">
                <Flower2 size={16} />
                FloristSocial floristregistrering
              </div>
              <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
                Registrera florist till FloristSocial.
              </h1>
              <p className="mt-5 text-lg leading-8 text-stone-600">
                Komplett registerformulär för floristens personuppgifter, butik, leverans,
                tjänster, öppettider och profilstatus.
              </p>
            </header>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <Card>
                <SectionHeader icon={<User size={20} />} title="1. Floristens information" description="Kontaktpersonen som ansvarar för ansökan och profilen." />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field required name="firstName" label="Förnamn" placeholder="Ex. Nick" />
                  <Field required name="lastName" label="Efternamn" placeholder="Ex. Hojjati" />
                  <Field required name="email" label="E-post" placeholder="namn@foretag.se" type="email" icon={<Mail size={18} />} />
                  <Field required name="phone" label="Mobilnummer" placeholder="+46 70 000 00 00" type="tel" icon={<Phone size={18} />} />
                  <Field required name="password" label="Lösenord" placeholder="Minst 8 tecken" type="password" />
                  <Field required label="Roll i företaget" placeholder="Ex. Ägare, huvudflorist, butikschef" />
                  <Field label="Personligt Instagram-konto (Valfritt)" placeholder="@floristnamn" icon={<Camera size={18} />} />
                </div>
              </Card>

              <Card>
                <SectionHeader icon={<Building2 size={20} />} title="2. Företagsinformation" description="Grunduppgifter om blomsterbutiken, studion eller frilansfloristen." />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field required name="shopName" label="Florist namn / Butikanamn" placeholder="Ex. Makalösa Blommor" icon={<Store size={18} />} />
                  <Field required label="Juridiskt företagsnamn" placeholder="Ex. Makalösa Blommor AB" />
                  <Field required label="Organisationsnummer" placeholder="XXXXXX-XXXX" />
                  <SelectField required label="Momsregistrerad" options={["Ja", "Nej", "Ej angivet"]} />
                  <UrlField name="websiteUrl" label="Webbplats (Valfritt)" placeholder="makalosablommor.se" icon={<Globe size={18} />} />
                  <Field name="instagramHandle" label="Instagram företag (Valfritt)" placeholder="@dinblomsterbutik" icon={<Camera size={18} />} />
                  <Field required label="Telefon butik" placeholder="08-000 00 00" type="tel" icon={<Phone size={18} />} />
                  <Field required label="E-post företag" placeholder="info@dinbutik.se" type="email" icon={<Mail size={18} />} />
                </div>
              </Card>

              <Card>
                <SectionHeader icon={<MapPin size={20} />} title="3. Butiksadress, stad & område" description="Den primära adressen som visas eller används för lokal matchning." />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field required name="streetAddress" label="Gatuadress" placeholder="Ex. Hornsgatan 12" icon={<MapPin size={18} />} />
                  <Field label="Adressrad 2 (Valfritt)" placeholder="Lokal, våning, c/o" />
                  <Field required name="postalCode" label="Postnummer" placeholder="118 20" inputMode="numeric" />
                  <SelectField required name="city" label="Stad" options={swedishCities} />
                  <SelectField label="Område / Stadsdel (Valfritt)" options={cityAreas.Stockholm} />
                  <Field label="Kommun (Valfritt)" placeholder="Ex. Stockholms kommun" />
                  <Field label="Län (Valfritt)" placeholder="Ex. Stockholms län" />
                  <Field required label="Land" placeholder="Sverige" />
                </div>
              </Card>

              <Card>
                <SectionHeader icon={<Clock size={20} />} title="4. Öppettider" description="Ange butikens öppettider och markera dagar då butiken är stängd." />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field required label="Måndag – Fredag" placeholder="Ex. 10:00 – 18:00" />
                  <Field required label="Lördag" placeholder="Ex. 10:00 – 16:00" />
                  <Field required label="Söndag" placeholder="Ex. 11:00 – 15:00" />
                  <Field label="Avvikande öppettider (Valfritt)" placeholder="Ex. Sommartider eller semesterstängt" />
                </div>

                <ClosedDaysCalendar selectedDates={closedDates} onToggleDate={toggleClosedDate} />
                <SwedishHolidayClosedList selectedDates={closedDates} onToggleDate={toggleClosedDate} />
              </Card>

              <Card>
                <SectionHeader icon={<Truck size={20} />} title="5. Leveransradie & täckningsområden" description="Ange städer, områden, postnummer, radie och pris för varje täckningsområde." />
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField required label="Leveransmodell" options={deliveryTypes} />
                  <Field required label="Primärt leveransområde" placeholder="Ex. Stockholm med omnejd" />
                  <Field required label="Samma dag-leverans senast kl." placeholder="Ex. 13:00" />
                  <Field required label="Dagar för leverans" placeholder="Ex. Mån-lör" />
                  <Field required label="Minsta ordervärde" placeholder="Ex. 450 kr" inputMode="numeric" />
                  <Field required label="Leveransavgift från" placeholder="Ex. 99 kr" inputMode="numeric" />
                  <Field label="Express leverans + kr" placeholder="Ex. 149" inputMode="numeric" />
                  <Field label="Especial leverans + kr" placeholder="Ex. 199" inputMode="numeric" />
                </div>

                <div className="mt-8 rounded-3xl bg-stone-50 p-5">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <label htmlFor="delivery-radius" className="text-sm font-semibold">
                      Standardradie för leverans
                    </label>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-medium shadow-sm">
                      {deliveryRadius} km
                    </span>
                  </div>
                  <input
                    id="delivery-radius"
                    type="range"
                    min="1"
                    max="150"
                    value={deliveryRadius}
                    onChange={(event) => setDeliveryRadius(Number(event.target.value))}
                    className="w-full accent-stone-900"
                  />
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold">Städer, områden, pris och radie</h3>
                      <p className="mt-1 text-sm text-stone-600">
                        Varje område kan ha egen leveransavgift.
                      </p>
                    </div>
                    <Button type="button" onClick={addCoverageArea}>
                      <Plus size={16} />
                      Lägg till område
                    </Button>
                  </div>

                  {coverageAreas.map((coverage, index) => {
                    const areas = cityAreas[coverage.city] || ["Centrum", "Annat område"];

                    return (
                      <div key={coverage.id} className="rounded-3xl border border-stone-200 bg-white p-4">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <h4 className="font-semibold">Täckningsområde {index + 1}</h4>
                          {coverageAreas.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCoverageArea(coverage.id)}
                              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Ta bort
                            </button>
                          )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-5">
                          <ControlledSelect label="Stad" value={coverage.city} options={swedishCities} onChange={(value) => updateCoverageArea(coverage.id, "city", value)} />
                          <ControlledSelect label="Område" value={coverage.area} options={areas} onChange={(value) => updateCoverageArea(coverage.id, "area", value)} />
                          <ControlledInput label="Postnummer / gräns" value={coverage.postalCode} onChange={(value) => updateCoverageArea(coverage.id, "postalCode", value)} placeholder="Ex. 118 20" />
                          <ControlledInput label="Pris kr" value={coverage.price} onChange={(value) => updateCoverageArea(coverage.id, "price", value)} placeholder="Ex. 99" />

                          <label className="block">
                            <span className="mb-2 block text-sm font-semibold">Radie: {coverage.radius} km</span>
                            <input
                              type="range"
                              min="1"
                              max="150"
                              value={coverage.radius}
                              onChange={(event) => updateCoverageArea(coverage.id, "radius", Number(event.target.value))}
                              className="mt-4 w-full accent-stone-900"
                            />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card>
                <SectionHeader icon={<Flower2 size={20} />} title="6. Tjänster & specialiteter" description="Välj vad floristen erbjuder kunder i FloristSocial." />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {serviceOptions.map((service) => {
                    const savedCount = servicePortfolioItems[service]?.filter((item) => item.isSaved).length || 0;

                    return (
                      <div key={service} className="space-y-2">
                        <PillButton active={selectedServices.includes(service)} onClick={() => toggleItem(service, selectedServices, setSelectedServices)}>
                          {service}
                        </PillButton>

                        {selectedServices.includes(service) && (
                          <button
                            type="button"
                            onClick={() => setServiceUploadPrompt(service)}
                            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-left text-xs font-medium text-stone-600 transition hover:border-stone-400 hover:bg-stone-50"
                          >
                            {savedCount > 0 ? `✅ ${savedCount} portfolio-bild(er) sparade` : "Lägg till portfolio, pris och hashtags"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <SelectField required label="Prisnivå" options={priceLevels} />
                  <Field required label="Minsta bokningsvärde för event/bröllop" placeholder="Ex. 8 000 kr" inputMode="numeric" />
                  <Field required label="Antal år i branschen" placeholder="Ex. 8 år" inputMode="numeric" />
                  <Field required label="Antal florister i teamet" placeholder="Ex. 3" inputMode="numeric" />
                </div>

                <Textarea required name="bio" label="Beskriv floristen" placeholder="Berätta om stil, erfarenhet, typiska kunder, sortiment och vad som gör floristen unik." />
              </Card>

              <Card>
                <SectionHeader icon={<ImagePlus size={20} />} title="7. Bilder, logotyp & portfolio" description="Ladda upp profilbild, logotyp, omslagsbild och portfolio-bilder." />
                <div className="grid gap-4 md:grid-cols-2">
                  <ImageDropzone label="Profilbild" description="Dra in profilbild här eller klicka för att välja." />
                  <ImageDropzone label="Logotyp" description="Dra in logotyp här eller klicka för att välja." />
                  <ImageDropzone label="Omslagsbild" description="Dra in omslagsbild här eller klicka för att välja." />
                  <ImageDropzone label="Portfolio-bilder" description="Dra in flera exempelbilder från tidigare jobb." multiple />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <UrlField label="Portfolio URL (Valfritt)" placeholder="portfolio.dinbutik.se" />
                  <UrlField label="Google Business Profile (Valfritt)" placeholder="g.page/dinbutik" />
                </div>
              </Card>

              <Card>
                <SectionHeader icon={<Eye size={20} />} title="8. Stil, profil & synlighet" description="Hjälp kunder att förstå floristens uttryck, nivå och profil." />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {styleOptions.map((style) => (
                    <PillButton key={style} active={selectedStyles.includes(style)} variant="pink" onClick={() => toggleItem(style, selectedStyles, setSelectedStyles)}>
                      {style}
                    </PillButton>
                  ))}
                </div>
              </Card>

              <Card>
                <SectionHeader icon={<CreditCard size={20} />} title="9. Stripe & utbetalningar" description="Koppla floristens Stripe-konto för betalningar och utbetalningar." />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
                    <label className="flex items-center gap-3">
                      <input type="radio" name="stripe_option" defaultChecked />
                      <strong>Har redan Stripe-konto</strong>
                    </label>

                    <div className="mt-4">
                      <Field name="stripeAccountId" label="Stripe kontonummer" placeholder="Ex. acct_..." />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
                    <label className="flex items-center gap-3">
                      <input type="radio" name="stripe_option" />
                      <strong>Starta Stripe-registrering</strong>
                    </label>

                    <p className="mt-3 text-sm leading-6 text-stone-600">
                      Den här knappen kopplas till Stripe onboarding senare.
                    </p>

                    <div className="mt-4">
                      <Button type="button">Starta Stripe-registrering</Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <SectionHeader icon={<ShieldCheck size={20} />} title="10. Admin & godkännande" description="Intern information för granskning innan publicering." />
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField required label="Status" options={statusOptions} />
                  <SelectField required label="Plan" options={planOptions} />
                  <Field required label="Ansvarig admin" placeholder="Ex. Nick" />
                  <SelectField required label="Prioritet" options={["Låg", "Normal", "Hög"]} />
                  <div className="md:col-span-2">
                    <Textarea required label="Intern anteckning" placeholder="Anteckningar för FloristSocial-teamet." />
                  </div>
                </div>

                <label className="mt-6 flex items-start gap-3 rounded-2xl bg-stone-50 p-4 text-sm text-stone-700">
                  <input required type="checkbox" className="mt-1 h-4 w-4 accent-stone-900" />
                  <span>
                    Floristen godkänner att FloristSocial lagrar uppgifterna och kontaktar företaget
                    för verifiering innan profilen publiceras.
                  </span>
                </label>
              </Card>

              {submitError && (
                <div className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
                  {submitError}
                </div>
              )}

              {submitSuccess && (
                <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                  {submitSuccess}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline">Spara som utkast</Button>
                <Button type="submit">{submitting ? "Skickar..." : "Skicka registrering"}</Button>
              </div>
            </form>
          </div>

          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <div className="rounded-3xl border-none bg-white p-6 shadow-xl">
              <h2 className="text-xl font-semibold">Profilstatus</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Fyll i stad, område, leveransradie och tjänster för att göra profilen sökbar i FloristSocial.
              </p>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">Komplett profil</span>
                  <span>{completionScore}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-stone-100">
                  <div className="h-full rounded-full bg-stone-900 transition-all" style={{ width: `${completionScore}%` }} />
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-stone-600">
                <StatusItem done label="Kontaktuppgifter" />
                <StatusItem done label="Företagsuppgifter" />
                <StatusItem done={coverageAreas.length > 0} label="Stad & område" />
                <StatusItem done={deliveryRadius > 1} label={`Standardradie ${deliveryRadius} km`} />
                <StatusItem done={selectedServices.length > 0} label="Tjänster valda" />
                <StatusItem done={portfolioCount > 0} label={`${portfolioCount} portfolio-bild(er) sparade`} />
                <StatusItem done={closedDates.length > 0} label={`${closedDates.length} stängda dagar markerade`} />
              </div>

              <div className="mt-6 rounded-2xl bg-[#fbf7f2] p-4 text-sm leading-6 text-stone-600">
                Täckningsområden: {coverageAreas.length}. Varje område kan ha egen stad,
                stadsdel, postnummer, pris och radie.
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function ClosedDaysCalendar({
  selectedDates,
  onToggleDate,
}: {
  selectedDates: string[];
  onToggleDate: (date: string) => void;
}) {
  const days = Array.from({ length: 35 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date;
  });

  return (
    <div className="mt-6 rounded-3xl bg-stone-50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays size={18} />
        <h3 className="font-semibold">Markera stängda dagar</h3>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:grid-cols-7">
        {days.map((date) => {
          const value = date.toISOString().slice(0, 10);
          const active = selectedDates.includes(value);

          return (
            <button
              key={value}
              type="button"
              onClick={() => onToggleDate(value)}
              className={`rounded-2xl border p-3 text-sm transition ${
                active
                  ? "border-red-500 bg-red-500 text-white"
                  : "border-stone-200 bg-white hover:border-stone-400"
              }`}
            >
              <div className="font-semibold">{date.getDate()}</div>
              <div className="text-[11px] opacity-80">
                {date.toLocaleDateString("sv-SE", { month: "short" })}
              </div>
            </button>
          );
        })}
      </div>

      {selectedDates.length > 0 && (
        <p className="mt-4 text-sm text-stone-600">
          Markerade stängda dagar: {selectedDates.join(", ")}
        </p>
      )}
    </div>
  );
}

function SwedishHolidayClosedList({
  selectedDates,
  onToggleDate,
}: {
  selectedDates: string[];
  onToggleDate: (date: string) => void;
}) {
  return (
    <div className="mt-6 rounded-3xl bg-stone-50 p-5">
      <h3 className="mb-3 font-semibold">Stängda svenska helgdagar</h3>

      <div className="grid gap-2 sm:grid-cols-2">
        {swedishHolidays.map((holiday) => {
          const active = selectedDates.includes(holiday);

          return (
            <button
              key={holiday}
              type="button"
              onClick={() => onToggleDate(holiday)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                active
                  ? "border-red-500 bg-red-500 text-white"
                  : "border-stone-200 bg-white hover:border-stone-400"
              }`}
            >
              {holiday}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ServiceUploadModal({
  service,
  initialItems,
  onClose,
  onSave,
}: {
  service: string;
  initialItems: PortfolioDraftItem[];
  onClose: () => void;
  onSave: (items: PortfolioDraftItem[]) => void;
}) {
  const [items, setItems] = useState<PortfolioDraftItem[]>(initialItems);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;

    const nextItems = Array.from(fileList)
      .filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"))
      .map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        title: "",
        price: "",
        description: "",
        hashtags: service ? `#${service.replaceAll(" ", "")}` : "",
        isSaved: false,
      }));

    setItems((current) => [...current, ...nextItems]);
  }

  function updateItem(id: string, field: keyof PortfolioDraftItem, value: string | boolean) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  function removeItem(id: string) {
    setItems((current) => {
      const imageToRemove = current.find((item) => item.id === id);
      if (imageToRemove) URL.revokeObjectURL(imageToRemove.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Portfolio för {service}</h2>
            <p className="mt-2 text-sm text-stone-600">
              Lägg till bild, titel, pris, beskrivning och hashtags. Klicka på “Spara bild” per bild och sedan “Spara och fortsätt”.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-stone-100">
            <X size={18} />
          </button>
        </div>

        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            addFiles(event.dataTransfer.files);
          }}
          className="rounded-3xl border-2 border-dashed border-stone-300 bg-stone-50 p-5 transition hover:border-stone-500"
        >
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl bg-white px-4 py-8 text-center text-sm text-stone-600 transition hover:bg-stone-100">
            <UploadCloud size={32} />
            Klicka eller dra in bild/video för {service}
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(event) => addFiles(event.target.files)}
              className="hidden"
            />
          </label>
        </div>

        {items.length > 0 && (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
                {item.file.type.startsWith("video/") ? (
                  <video src={item.previewUrl} controls className="h-56 w-full object-cover" />
                ) : (
                  <img src={item.previewUrl} alt={item.file.name} className="h-56 w-full object-cover" />
                )}

                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-xs font-medium text-stone-600">{item.file.name}</p>
                    {item.isSaved ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <Check size={14} />
                        Sparad
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        Ej sparad
                      </span>
                    )}
                  </div>

                  <ControlledInput
                    label="Titel"
                    value={item.title}
                    onChange={(value) => updateItem(item.id, "title", value)}
                    placeholder="Ex. Bröllopsbukett i ljusa toner"
                  />

                  <ControlledInput
                    label="Pris"
                    value={item.price}
                    onChange={(value) => updateItem(item.id, "price", value)}
                    placeholder="Ex. 1 250 kr"
                  />

                  <SmallTextarea
                    label="Beskrivning"
                    value={item.description}
                    onChange={(value) => updateItem(item.id, "description", value)}
                    placeholder="Beskriv material, stil, säsong och passande tillfälle."
                  />

                  <ControlledInput
                    label="Hashtags"
                    value={item.hashtags}
                    onChange={(value) => updateItem(item.id, "hashtags", value)}
                    placeholder="#Bukett #Bröllop #Sommarblommor"
                  />

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      type="button"
                      onClick={() => updateItem(item.id, "isSaved", true)}
                    >
                      <Save size={16} />
                      Spara bild
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={16} />
                      Ta bort
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>Stäng utan att fortsätta</Button>
          <Button type="button" onClick={() => onSave(items)}>
            Spara och fortsätt
          </Button>
        </div>
      </div>
    </div>
  );
}

function ImageDropzone({
  label,
  description,
  multiple = false,
  allowVideo = false,
}: {
  label: string;
  description: string;
  multiple?: boolean;
  allowVideo?: boolean;
}) {
  const [images, setImages] = useState<(UploadedImage & { isSaved: boolean })[]>([]);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;

    const selectedImages = Array.from(fileList)
      .filter((file) => file.type.startsWith("image/") || (allowVideo && file.type.startsWith("video/")))
      .map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        isSaved: false,
      }));

    if (multiple) {
      setImages((current) => [...current, ...selectedImages]);
    } else {
      images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
      setImages(selectedImages.slice(0, 1));
    }
  }

  function removeImage(id: string) {
    setImages((current) => {
      const imageToRemove = current.find((image) => image.id === id);
      if (imageToRemove) URL.revokeObjectURL(imageToRemove.previewUrl);
      return current.filter((image) => image.id !== id);
    });
  }

  function saveImage(id: string) {
    setImages((current) =>
      current.map((image) =>
        image.id === id ? { ...image, isSaved: true } : image
      )
    );
  }

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        addFiles(event.dataTransfer.files);
      }}
      className="rounded-3xl border-2 border-dashed border-stone-300 bg-white p-5 transition hover:border-stone-500"
    >
      <h3 className="text-sm font-semibold">{label}</h3>
      <p className="mt-1 text-sm text-stone-500">{description}</p>

      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl bg-stone-50 px-4 py-6 text-center text-sm text-stone-600 transition hover:bg-stone-100">
        <UploadCloud size={28} />
        Klicka eller dra in fil här
        <input
          type="file"
          accept={allowVideo ? "image/*,video/*" : "image/*"}
          multiple={multiple}
          onChange={(event) => addFiles(event.target.files)}
          className="hidden"
        />
      </label>

      {images.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {images.map((image) => (
            <div key={image.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
              {image.file.type.startsWith("video/") ? (
                <video src={image.previewUrl} controls className="h-32 w-full object-cover" />
              ) : (
                <img src={image.previewUrl} alt={image.file.name} className="h-32 w-full object-cover" />
              )}
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-medium text-stone-700">{image.file.name}</p>
                  {image.isSaved ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                      Sparad
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => saveImage(image.id)}
                    className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700"
                  >
                    Spara bild
                  </button>

                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="rounded-xl px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Ta bort
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-3xl border-none bg-white/90 p-6 shadow-sm backdrop-blur md:p-8">
      {children}
    </section>
  );
}

function Button({
  children,
  onClick,
  type = "button",
  variant = "default",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "outline";
}) {
  const className =
    variant === "outline"
      ? "inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white px-6 text-sm font-medium text-stone-900 transition hover:bg-stone-50"
      : "inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 text-sm font-medium text-white transition hover:bg-stone-800";

  return <button type={type} onClick={onClick} className={className}>{children}</button>;
}

function SectionHeader({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="mb-6 flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-white">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">{description}</p>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  placeholder,
  icon,
  type = "text",
  inputMode,
  required = false,
}: {
  name?: string;
  label: string;
  placeholder: string;
  icon?: ReactNode;
  type?: "text" | "email" | "tel" | "password";
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "email" | "url";
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <div className="relative">
        {icon ? <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">{icon}</div> : null}
        <input
          name={name}
          required={required}
          type={type}
          inputMode={inputMode}
          placeholder={placeholder}
          className={`h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition placeholder:text-stone-400 focus:border-stone-500 ${icon ? "pl-12" : ""}`}
        />
      </div>
    </label>
  );
}

function UrlField({
  name,
  label,
  placeholder,
  icon,
  required = false,
}: {
  name?: string;
  label: string;
  placeholder: string;
  icon?: ReactNode;
  required?: boolean;
}) {
  const [value, setValue] = useState("");

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <div className="relative">
        {icon ? <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">{icon}</div> : null}
        <input
          name={name}
          required={required}
          type="text"
          inputMode="url"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onBlur={() => setValue((current) => normalizeUrl(current))}
          placeholder={placeholder}
          className={`h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition placeholder:text-stone-400 focus:border-stone-500 ${icon ? "pl-12" : ""}`}
        />
      </div>
      <p className="mt-2 text-xs text-stone-500">
        Skriv t.ex. makalosablommor.se — vi lägger till https:// automatiskt. Om din hemsida saknar SSL, skriv http:// själv.
      </p>
    </label>
  );
}

function ControlledInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition placeholder:text-stone-400 focus:border-stone-500"
      />
    </label>
  );
}

function SmallTextarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition placeholder:text-stone-400 focus:border-stone-500"
      />
    </label>
  );
}

function Textarea({
  name,
  label,
  placeholder,
  required = false,
}: {
  name?: string;
  label: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div className="mt-8">
      <label className="mb-3 block text-sm font-semibold">{label}</label>
      <textarea
        name={name}
        required={required}
        rows={5}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-stone-500"
      />
    </div>
  );
}

function SelectField({
  name,
  label,
  options,
  required = false,
}: {
  name?: string;
  label: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <select name={name} required={required} className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition focus:border-stone-500">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function ControlledSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition focus:border-stone-500"
      >
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function PillButton({
  children,
  active,
  onClick,
  variant = "default",
}: {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
  variant?: "default" | "pink";
}) {
  const activeClass = variant === "pink"
    ? "border-pink-700 bg-pink-700 text-white"
    : "border-stone-900 bg-stone-900 text-white";

  const inactiveClass = variant === "pink"
    ? "border-stone-200 bg-white text-stone-700 hover:border-pink-300"
    : "border-stone-200 bg-white text-stone-700 hover:border-stone-400";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${active ? activeClass : inactiveClass}`}
    >
      {children}
    </button>
  );
}

function StatusItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={done ? "text-emerald-600" : "text-stone-300"}>
        <Check size={16} />
      </span>
      <span className={done ? "text-stone-800" : "text-stone-400"}>{label}</span>
    </div>
  );
}
