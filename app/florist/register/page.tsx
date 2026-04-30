"use client";

import {
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

const swedishCities = [
  "Stockholm", "Göteborg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping",
  "Helsingborg", "Jönköping", "Norrköping", "Lund", "Umeå", "Gävle", "Borås",
  "Eskilstuna", "Södertälje", "Karlstad", "Täby", "Växjö", "Halmstad", "Sundsvall",
  "Luleå", "Trollhättan", "Östersund", "Borlänge", "Falun", "Kalmar", "Kristianstad",
  "Skövde", "Nyköping", "Annan stad",
];

const areaOptions = [
  "Södermalm", "Östermalm", "Vasastan", "Kungsholmen", "Norrmalm", "Gamla stan",
  "Liljeholmen", "Hammarby Sjöstad", "Årsta", "Enskede", "Bromma", "Solna",
  "Sundbyberg", "Nacka", "Lidingö", "Täby", "Danderyd", "Sollentuna", "Huddinge",
  "Farsta", "Annat område",
];

const serviceOptions = [
  "Bröllop", "Begravning", "Event", "Företagsblommor", "Buketter", "Blombud",
  "Prenumerationer", "Workshops", "Hemleverans", "Samma dag-leverans",
  "Hotell & restaurang", "Skyltfönster & installationer",
];

const styleOptions = [
  "Romantiskt", "Modernt", "Vilt & organiskt", "Klassiskt", "Nordiskt", "Lyxigt",
  "Färgstarkt", "Minimalistiskt", "Säsongsbaserat", "Exklusivt",
];

const priceLevels = ["Budget", "Mellan", "Premium", "Lyx", "Varierar per uppdrag"];
const deliveryTypes = ["Ingen leverans", "Lokal leverans", "Regional leverans", "Nationella uppdrag", "Endast upphämtning"];
const statusOptions = ["Ny ansökan", "Under granskning", "Godkänd", "Behöver kompletteras", "Pausad"];
const planOptions = ["Free", "Starter", "Pro", "Premium", "Partner"];

const swedishHolidays = `Nyårsdagen
Trettondedag jul
Långfredagen
Påskafton
Påskdagen
Annandag påsk
Första maj
Kristi himmelsfärdsdag
Nationaldagen
Midsommarafton
Midsommardagen
Alla helgons dag
Julafton
Juldagen
Annandag jul
Nyårsafton`;

type CoverageArea = {
  id: number;
  city: string;
  area: string;
  postalCode: string;
  radius: number;
};

type UploadedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

export default function FloristSocialRegistrationPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [deliveryRadius, setDeliveryRadius] = useState(15);
  const [coverageAreas, setCoverageAreas] = useState<CoverageArea[]>([
    { id: 1, city: "Stockholm", area: "Södermalm", postalCode: "", radius: 15 },
  ]);

  const completionScore = useMemo(() => {
    let score = 20;
    if (selectedServices.length > 0) score += 20;
    if (selectedStyles.length > 0) score += 15;
    if (deliveryRadius >= 10) score += 15;
    if (coverageAreas.length > 0) score += 20;
    if (coverageAreas.some((item) => item.city && item.area)) score += 10;
    return Math.min(score, 100);
  }, [selectedServices, selectedStyles, deliveryRadius, coverageAreas]);

  function toggleItem(value: string, list: string[], setter: Dispatch<SetStateAction<string[]>>) {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  function updateCoverageArea(id: number, field: keyof CoverageArea, value: string | number) {
    setCoverageAreas((areas) =>
      areas.map((area) => (area.id === id ? { ...area, [field]: value } : area))
    );
  }

  function addCoverageArea() {
    setCoverageAreas((areas) => [
      ...areas,
      {
        id: Date.now(),
        city: "Stockholm",
        area: "Annat område",
        postalCode: "",
        radius: deliveryRadius,
      },
    ]);
  }

  function removeCoverageArea(id: number) {
    setCoverageAreas((areas) => areas.filter((area) => area.id !== id));
  }

  return (
    <main className="min-h-screen bg-[#fbf7f2] text-stone-900">
      <section className="relative overflow-hidden px-5 py-10 md:px-10 lg:px-16">
        <div className="absolute right-[-160px] top-[-160px] h-96 w-96 rounded-full bg-pink-200/50 blur-3xl" />
        <div className="absolute bottom-[-180px] left-[-140px] h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <header className="mb-8 max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm">
                🌸 FloristSocial floristregistrering
              </div>
              <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
                Registrera florist till FloristSocial.
              </h1>
              <p className="mt-5 text-lg leading-8 text-stone-600">
                Komplett registerformulär för floristens personuppgifter, företag, stad, område,
                leveransradie, tjänster, bilder, öppettider och profilstatus.
              </p>
            </header>

            <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
              <Card>
                <SectionHeader icon="👤" title="1. Floristens information" description="Kontaktpersonen som ansvarar för ansökan och profilen." />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Förnamn" placeholder="Ex. Nick" />
                  <Field label="Efternamn" placeholder="Ex. Hojjati" />
                  <Field label="E-post" placeholder="namn@foretag.se" type="email" icon="✉️" />
                  <Field label="Mobilnummer" placeholder="+46 70 000 00 00" type="tel" icon="📞" />
                  <Field label="Roll i företaget" placeholder="Ex. Ägare, huvudflorist, butikschef" />
                  <Field label="Personligt Instagram-konto" placeholder="@floristnamn" icon="📷" />
                </div>
              </Card>

              <Card>
                <SectionHeader icon="🏢" title="2. Företagsinformation" description="Grunduppgifter om blomsterbutiken, studion eller frilansfloristen." />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Företagsnamn / butiksnamn" placeholder="Ex. Makalösa Blommor" icon="🏬" />
                  <Field label="Juridiskt företagsnamn" placeholder="Ex. Makalösa Blommor AB" />
                  <Field label="Organisationsnummer" placeholder="XXXXXX-XXXX" />
                  <SelectField label="Momsregistrerad" options={["Ja", "Nej", "Ej angivet"]} />
                  <Field label="Webbplats" placeholder="https://www.dinbutik.se" type="url" icon="🌐" />
                  <Field label="Instagram företag" placeholder="@dinblomsterbutik" icon="📷" />
                  <Field label="Telefon butik" placeholder="08-000 00 00" type="tel" icon="📞" />
                  <Field label="E-post företag" placeholder="info@dinbutik.se" type="email" icon="✉️" />
                </div>
              </Card>

              <Card>
                <SectionHeader icon="📍" title="3. Butiksadress, stad & område" description="Den primära adressen som visas eller används för lokal matchning." />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Gatuadress" placeholder="Ex. Hornsgatan 12" icon="📍" />
                  <Field label="Adressrad 2" placeholder="Lokal, våning, c/o" />
                  <Field label="Postnummer" placeholder="118 20" inputMode="numeric" />
                  <SelectField label="Stad" options={swedishCities} />
                  <SelectField label="Område / stadsdel" options={areaOptions} />
                  <Field label="Kommun" placeholder="Ex. Stockholms kommun" />
                  <Field label="Län" placeholder="Ex. Stockholms län" />
                  <Field label="Land" placeholder="Sverige" />
                </div>
              </Card>

              <Card>
                <SectionHeader icon="🕒" title="4. Öppettider" description="Ange butikens öppettider och stängda helgdagar." />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Måndag – Fredag" placeholder="Ex. 10:00 – 18:00" />
                  <Field label="Lördag" placeholder="Ex. 10:00 – 16:00" />
                  <Field label="Söndag" placeholder="Ex. 11:00 – 15:00" />
                  <Field label="Avvikande öppettider" placeholder="Ex. Sommartider eller semesterstängt" />
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold">Stängda helgdagar</label>
                  <p className="mb-3 text-sm text-stone-600">
                    Förifylld lista över vanliga svenska helgdagar. Floristen kan ändra listan vid behov.
                  </p>
                  <textarea
                    rows={8}
                    defaultValue={swedishHolidays}
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                  />
                </div>
              </Card>

              <Card>
                <SectionHeader icon="🚚" title="5. Leveransradie & täckningsområden" description="Ange exakt vilka städer, områden och postnummer floristen täcker." />
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField label="Leveransmodell" options={deliveryTypes} />
                  <Field label="Primärt leveransområde" placeholder="Ex. Stockholm med omnejd" />
                  <Field label="Samma dag-leverans senast kl." placeholder="Ex. 13:00" />
                  <Field label="Dagar för leverans" placeholder="Ex. Mån-lör" />
                  <Field label="Minsta ordervärde" placeholder="Ex. 450 kr" inputMode="numeric" />
                  <Field label="Leveransavgift från" placeholder="Ex. 99 kr" inputMode="numeric" />
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
                      <h3 className="font-semibold">Städer, områden och radie</h3>
                      <p className="mt-1 text-sm text-stone-600">
                        Lägg till flera täckningsområden, varje rad med egen radie i km.
                      </p>
                    </div>
                    <Button type="button" onClick={addCoverageArea}>＋ Lägg till område</Button>
                  </div>

                  {coverageAreas.map((coverage, index) => (
                    <div key={coverage.id} className="rounded-3xl border border-stone-200 bg-white p-4">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <h4 className="font-semibold">Täckningsområde {index + 1}</h4>
                        {coverageAreas.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCoverageArea(coverage.id)}
                            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            🗑 Ta bort
                          </button>
                        )}
                      </div>

                      <div className="grid gap-4 md:grid-cols-4">
                        <ControlledSelect label="Stad" value={coverage.city} options={swedishCities} onChange={(value) => updateCoverageArea(coverage.id, "city", value)} />
                        <ControlledSelect label="Område" value={coverage.area} options={areaOptions} onChange={(value) => updateCoverageArea(coverage.id, "area", value)} />

                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold">Postnummer</span>
                          <input
                            value={coverage.postalCode}
                            onChange={(event) => updateCoverageArea(coverage.id, "postalCode", event.target.value)}
                            placeholder="Ex. 118 20"
                            inputMode="numeric"
                            className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition placeholder:text-stone-400 focus:border-stone-500"
                          />
                        </label>

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
                  ))}
                </div>
              </Card>

              <Card>
                <SectionHeader icon="🌷" title="6. Tjänster & specialiteter" description="Välj vad floristen erbjuder kunder i FloristSocial." />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {serviceOptions.map((service) => (
                    <PillButton key={service} active={selectedServices.includes(service)} onClick={() => toggleItem(service, selectedServices, setSelectedServices)}>
                      {service}
                    </PillButton>
                  ))}
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <SelectField label="Prisnivå" options={priceLevels} />
                  <Field label="Minsta bokningsvärde för event/bröllop" placeholder="Ex. 8 000 kr" inputMode="numeric" />
                  <Field label="Antal år i branschen" placeholder="Ex. 8 år" inputMode="numeric" />
                  <Field label="Antal florister i teamet" placeholder="Ex. 3" inputMode="numeric" />
                </div>

                <Textarea label="Beskriv floristen" placeholder="Berätta om stil, erfarenhet, typiska kunder, sortiment och vad som gör floristen unik." />
              </Card>

              <Card>
                <SectionHeader icon="🖼️" title="7. Bilder, logotyp & portfolio" description="Ladda upp profilbild, logotyp, omslagsbild och portfolio-bilder." />

                <div className="grid gap-4 md:grid-cols-2">
                  <ImageDropzone label="Profilbild" description="Dra in profilbild här eller klicka för att välja." />
                  <ImageDropzone label="Logotyp" description="Dra in logotyp här eller klicka för att välja." />
                  <ImageDropzone label="Omslagsbild" description="Dra in omslagsbild här eller klicka för att välja." />
                  <ImageDropzone label="Portfolio-bilder" description="Dra in flera exempelbilder från tidigare jobb." multiple />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Field label="Portfolio URL" placeholder="https://..." type="url" />
                  <Field label="Google Business Profile URL" placeholder="https://..." type="url" />
                </div>
              </Card>

              <Card>
                <SectionHeader icon="✅" title="8. Stil, profil & synlighet" description="Hjälp kunder att förstå floristens uttryck, nivå och profil." />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {styleOptions.map((style) => (
                    <PillButton key={style} active={selectedStyles.includes(style)} variant="pink" onClick={() => toggleItem(style, selectedStyles, setSelectedStyles)}>
                      {style}
                    </PillButton>
                  ))}
                </div>
              </Card>

              <Card>
                <SectionHeader icon="💳" title="9. Stripe & utbetalningar" description="Koppla floristens Stripe-konto för betalningar och utbetalningar." />
                <div className="rounded-3xl bg-stone-50 p-5">
                  <p className="text-sm leading-6 text-stone-600">
                    Stripe onboarding öppnas här när floristprofilen är sparad och ett connected account har skapats.
                  </p>
                  <div className="mt-4">
                    <Button type="button">Starta Stripe-registrering</Button>
                  </div>
                </div>
              </Card>

              <Card>
                <SectionHeader icon="🛠" title="10. Admin & godkännande" description="Intern information för granskning innan publicering." />
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField label="Status" options={statusOptions} />
                  <SelectField label="Plan" options={planOptions} />
                  <Field label="Ansvarig admin" placeholder="Ex. Nick" />
                  <SelectField label="Prioritet" options={["Låg", "Normal", "Hög"]} />
                  <div className="md:col-span-2">
                    <Textarea label="Intern anteckning" placeholder="Anteckningar för FloristSocial-teamet." />
                  </div>
                </div>

                <label className="mt-6 flex items-start gap-3 rounded-2xl bg-stone-50 p-4 text-sm text-stone-700">
                  <input type="checkbox" className="mt-1 h-4 w-4 accent-stone-900" />
                  <span>
                    Floristen godkänner att FloristSocial lagrar uppgifterna och kontaktar företaget
                    för verifiering innan profilen publiceras.
                  </span>
                </label>
              </Card>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline">Spara som utkast</Button>
                <Button type="submit">Skicka registrering →</Button>
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
                <StatusItem done={selectedStyles.length > 0} label="Stilprofil vald" />
              </div>

              <div className="mt-6 rounded-2xl bg-[#fbf7f2] p-4 text-sm leading-6 text-stone-600">
                Täckningsområden: {coverageAreas.length}. Varje område kan ha egen stad, stadsdel,
                postnummer och radie i km.
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function ImageDropzone({
  label,
  description,
  multiple = false,
}: {
  label: string;
  description: string;
  multiple?: boolean;
}) {
  const [images, setImages] = useState<UploadedImage[]>([]);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;

    const selectedImages = Array.from(fileList)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
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

  function clearImages() {
    images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setImages([]);
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
      <div>
        <h3 className="text-sm font-semibold">{label}</h3>
        <p className="mt-1 text-sm text-stone-500">{description}</p>
      </div>

      <label className="mt-4 flex cursor-pointer items-center justify-center rounded-2xl bg-stone-50 px-4 py-6 text-center text-sm text-stone-600 transition hover:bg-stone-100">
        Klicka eller dra in bild här
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(event) => addFiles(event.target.files)}
          className="hidden"
        />
      </label>

      {images.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-stone-500">
              {images.length} bild{images.length > 1 ? "er" : ""} vald{images.length > 1 ? "a" : ""}
            </span>
            <button
              type="button"
              onClick={clearImages}
              className="rounded-xl px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Ta bort alla
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {images.map((image) => (
              <div key={image.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
                <img src={image.previewUrl} alt={image.file.name} className="h-32 w-full object-cover" />
                <div className="p-3">
                  <p className="truncate text-xs font-medium text-stone-700">{image.file.name}</p>
                  <div className="mt-3 flex gap-2">
                    <label className="cursor-pointer rounded-xl bg-white px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100">
                      Byt bild
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          removeImage(image.id);
                          addFiles(event.target.files);
                        }}
                        className="hidden"
                      />
                    </label>
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
      ? "inline-flex h-12 items-center justify-center rounded-2xl border border-stone-300 bg-white px-6 text-sm font-medium text-stone-900 transition hover:bg-stone-50"
      : "inline-flex h-12 items-center justify-center rounded-2xl bg-stone-900 px-6 text-sm font-medium text-white transition hover:bg-stone-800";

  return <button type={type} onClick={onClick} className={className}>{children}</button>;
}

function SectionHeader({ icon, title, description }: { icon: string; title: string; description: string }) {
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
  label,
  placeholder,
  icon,
  type = "text",
  inputMode,
}: {
  label: string;
  placeholder: string;
  icon?: string;
  type?: "text" | "email" | "tel" | "url";
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "email" | "url";
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <div className="relative">
        {icon ? <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">{icon}</div> : null}
        <input
          type={type}
          inputMode={inputMode}
          placeholder={placeholder}
          className={`h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition placeholder:text-stone-400 focus:border-stone-500 ${icon ? "pl-12" : ""}`}
        />
      </div>
    </label>
  );
}

function Textarea({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="mt-8">
      <label className="mb-3 block text-sm font-semibold">{label}</label>
      <textarea
        rows={5}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-stone-500"
      />
    </div>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <select className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition focus:border-stone-500">
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
      className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${active ? activeClass : inactiveClass}`}
    >
      {children}
    </button>
  );
}

function StatusItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={done ? "text-emerald-600" : "text-stone-300"}>✓</span>
      <span className={done ? "text-stone-800" : "text-stone-400"}>{label}</span>
    </div>
  );
}
