"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Building2,
  CalendarDays,
  Check,
  Clock,
  FileText,
  ImagePlus,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ShoppingBag,
  Truck,
  UploadCloud,
  User,
} from "lucide-react";

const paymentMethods = ["Kortbetalning via Stripe"];

const orderTypes = [
  "Bukett",
  "Begravning - Krans",
  "Begravning - Stående Bukett",
  "Begravning - Liggande Bukett",
  "Begravning - Blomsterdekoration",
  "Eventblommor",
  "Företagsblommor",
  "Prenumerationer",
  "Hotell & restaurang",
  "Skyltfönster & installationer",
  "Annat önskemål",
];

const priceOptions = [
  "500 kr",
  "625 kr",
  "750 kr",
  "800 kr",
  "1.000 kr",
  "1.250 kr",
  "1.500 kr",
  "2.000 kr",
  "2.500 kr",
  "3.000 kr",
  "3.500 kr",
  "4.000 kr",
  "5.000 kr",
  "Annat pris",
];

const cardOptions = ["Inget kort", "Gratis kort", "35 kr", "60 kr", "75 kr"];
const deliveryMethods = ["Leverans", "Avhämtning från butiken XXX"];
const swedishCities = [
  "Stockholm",
  "Göteborg",
  "Malmö",
  "Uppsala",
  "Örebro",
  "Linköping",
  "Annan ort",
];

function generateOrderNumber() {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(100000 + Math.random() * 900000);
  return `FSG-${year}-${random}`;
}

function nowStamp() {
  return new Date().toLocaleString("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CompanyGuestOrderPage() {
  const [orderNumber, setOrderNumber] = useState("Skapas när sidan laddas");
  const [createdAt, setCreatedAt] = useState("Skapas när sidan laddas");
  const [city, setCity] = useState("Stockholm");
  const [selectedOrderType, setSelectedOrderType] = useState("Bukett");
  const [selectedPrice, setSelectedPrice] = useState("750 kr");
  const [customPrice, setCustomPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedCardPrice, setSelectedCardPrice] = useState("35 kr");
  const [deliveryMethod, setDeliveryMethod] = useState("Leverans");
  const [paymentMethod, setPaymentMethod] = useState("Betalkort med Stripe");
  const [doorAllowed, setDoorAllowed] = useState(false);
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [extraProducts, setExtraProducts] = useState<string[]>([]);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    setOrderNumber(generateOrderNumber());
    setCreatedAt(nowStamp());
  }, []);

  const orderCreatedText = useMemo(
    () => `${createdAt}, ${city}`,
    [createdAt, city],
  );
  const displayPrice =
    selectedPrice === "Annat pris"
      ? customPrice || "Annat pris"
      : selectedPrice;

  function toggleExtraProduct(product: string) {
    setExtraProducts((items) =>
      items.includes(product)
        ? items.filter((item) => item !== product)
        : [...items, product],
    );
  }

  function handleOrderSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitMessage(
      `✅ Företags-gästorder ${orderNumber} skapad. Betalsätt: ${paymentMethod}. Beställning: ${selectedOrderType}, ${displayPrice}, antal ${quantity}. Momskvitto i PDF ska skickas direkt efter genomförd betalning.`,
    );
  }

  return (
    <main className="min-h-screen bg-[#fbf7f2] text-stone-900">
      {" "}
      <section className="relative overflow-hidden px-5 py-10 md:px-10 lg:px-16">
        {" "}
        <div className="absolute right-[-160px] top-[-160px] h-96 w-96 rounded-full bg-pink-200/50 blur-3xl" />{" "}
        <div className="absolute bottom-[-180px] left-[-140px] h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="relative mx-auto max-w-7xl space-y-8">
          <header className="max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm">
              <ShoppingBag size={16} /> FloristSocial företags-gästorder
            </div>

            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Beställ blommor som företagsgäst.
            </h1>

            <p className="mt-5 text-lg leading-8 text-stone-600">
              Företag kan beställa direkt utan företagskonto. Betalning sker med
              kort, Klarna, Swish, Apple Pay, Google Pay eller banköverföring.
            </p>

            <p className="mt-3 text-base leading-7 text-stone-600">
              Faktura används inte för företags-gästorder. Om företaget vill ha
              faktura behöver företaget först registreras och godkännas.
            </p>
          </header>

          {submitMessage && (
            <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
              {submitMessage}
            </div>
          )}

          <form
            onSubmit={handleOrderSubmit}
            className="grid gap-8 lg:grid-cols-[1fr_380px]"
          >
            <div className="space-y-8">
              <Card>
                <SectionHeader
                  icon={<Building2 size={20} />}
                  title="1. Företagets uppgifter"
                  description="Dessa uppgifter behövs för orderbekräftelse, betalning och kontakt vid frågor."
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <ReadOnlyField
                    label="Ordernummer"
                    value={orderNumber}
                    icon={<FileText size={18} />}
                  />
                  <ReadOnlyField
                    label="Datum, tid och ort"
                    value={orderCreatedText}
                    icon={<Clock size={18} />}
                  />

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">
                      Ort <Required />
                    </span>
                    <select
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition focus:border-stone-500"
                    >
                      {swedishCities.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Field
                    required
                    name="companyName"
                    label="Företagsnamn"
                    placeholder="Företagets namn"
                    icon={<Building2 size={18} />}
                  />
                  <Field
                    name="organizationNumber"
                    label="Organisationsnummer"
                    placeholder="Valfritt"
                  />
                  <Field
                    required
                    name="contactPerson"
                    label="Kontaktperson"
                    placeholder="Namn Efternamn"
                    icon={<User size={18} />}
                  />
                  <Field
                    required
                    name="buyerPhone"
                    label="Telefonnummer"
                    placeholder="070 000 00 00"
                    type="tel"
                    icon={<Phone size={18} />}
                  />
                  <Field
                    required
                    name="buyerEmail"
                    label="E-post"
                    placeholder="namn@foretag.se"
                    type="email"
                    icon={<Mail size={18} />}
                  />
                  <Field
                    required
                    name="referencePerson"
                    label="Företagets referensperson"
                    placeholder="Namn på referensperson"
                  />
                </div>
              </Card>

              <Card>
                <SectionHeader
                  icon={<ShoppingBag size={20} />}
                  title="2. Företagsorder"
                  description="Välj typ av arrangemang, pris, antal, hälsningskort och eventuella tillval."
                />

                <div>
                  <h3 className="mb-3 font-semibold">
                    Jag önskar beställa <Required />
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {orderTypes.map((type) => (
                      <PillButton
                        key={type}
                        active={selectedOrderType === type}
                        onClick={() => setSelectedOrderType(type)}
                      >
                        {type}
                      </PillButton>
                    ))}
                  </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">
                      Pris <Required />
                    </span>
                    <select
                      value={selectedPrice}
                      onChange={(event) => setSelectedPrice(event.target.value)}
                      className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition focus:border-stone-500"
                    >
                      {priceOptions.map((price) => (
                        <option key={price} value={price}>
                          {price}
                        </option>
                      ))}
                    </select>
                  </label>

                  {selectedPrice === "Annat pris" && (
                    <ControlledInput
                      label="Annat pris"
                      value={customPrice}
                      onChange={setCustomPrice}
                      placeholder="XXXX kr"
                    />
                  )}

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">
                      Antal <Required />
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(event) =>
                        setQuantity(Number(event.target.value))
                      }
                      className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition focus:border-stone-500"
                    />
                  </label>

                  <SelectField
                    required
                    name="cardPrice"
                    label="Hälsningskort"
                    options={cardOptions}
                    value={selectedCardPrice}
                    onChange={setSelectedCardPrice}
                  />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Textarea
                    name="cardText"
                    label="Hälsningskort text"
                    placeholder="Till ex.: Tack för ett fint samarbete"
                  />
                  <Textarea
                    name="specialRequests"
                    label="Specialönskemål"
                    placeholder="Till ex.: företagets färger, pollenfri, modern stil ..."
                  />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="flex items-start gap-3 rounded-2xl bg-stone-50 p-4 text-sm text-stone-700">
                    <input
                      type="checkbox"
                      checked={doorAllowed}
                      onChange={(event) => setDoorAllowed(event.target.checked)}
                      className="mt-1 h-4 w-4 accent-stone-900"
                    />
                    <span>Kan hängas på dörren</span>
                  </label>

                  <ImageUploadBox
                    uploadedImageName={uploadedImageName}
                    onChange={setUploadedImageName}
                  />
                </div>

                <div className="mt-8">
                  <h3 className="mb-3 font-semibold">Extra produkter</h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      "Choklad",
                      "Vas",
                      "Nalle",
                      "Extra kort",
                      "Ballong",
                      "Lyxigare inslagning",
                      "Doftljus",
                      "Säsongstillägg",
                    ].map((product) => (
                      <PillButton
                        key={product}
                        active={extraProducts.includes(product)}
                        onClick={() => toggleExtraProduct(product)}
                        variant="pink"
                      >
                        {product}
                      </PillButton>
                    ))}
                  </div>
                </div>
              </Card>

              <Card>
                <SectionHeader
                  icon={<Truck size={20} />}
                  title="3. Leverans eller avhämtning"
                  description="Företaget kan välja leverans till mottagare eller avhämtning från butik."
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <SelectField
                    required
                    name="deliveryMethod"
                    label="Leveransmetod"
                    options={deliveryMethods}
                    value={deliveryMethod}
                    onChange={setDeliveryMethod}
                  />
                  <Field
                    required
                    name="deliveryDate"
                    label="Datum till leverans / avhämtning"
                    placeholder="YYYY-MM-DD"
                    icon={<CalendarDays size={18} />}
                  />
                  <Field
                    required
                    name="deliveryTime"
                    label="Tid till leverans / avhämtning"
                    placeholder="HH:MM"
                    icon={<Clock size={18} />}
                  />
                </div>

                {deliveryMethod === "Leverans" && (
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <Field
                      required
                      name="deliveryAddress"
                      label="Leveransadress"
                      placeholder="Gatuadress, postnummer, ort"
                      icon={<Truck size={18} />}
                    />
                    <Field
                      name="deliveryNote"
                      label="Leveransnotering"
                      placeholder="Portkod, våning, mottagare, telefonnummer"
                    />
                  </div>
                )}
              </Card>

              <Card>
                <SectionHeader
                  icon={<Check size={20} />}
                  title="4. Betalning och kvitto"
                  description="Företags-gästorder betalas direkt. Faktura finns inte här."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField
                    required
                    name="paymentMethod"
                    label="Betalningssätt"
                    options={paymentMethods}
                    value={paymentMethod}
                    onChange={setPaymentMethod}
                  />

                  <div className="rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
                    <Check size={16} className="mr-1 inline" />
                    Betalningen genomförs direkt. Momskvitto i PDF skickas
                    automatiskt efter genomförd betalning.
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-stone-600">
                  Företags-gästorder kräver inget företagskonto och ingen
                  fakturakontroll. För faktura behöver företaget registreras och
                  godkännas först.
                </div>

                <div className="mt-6 flex justify-end">
                  <Button type="submit">
                    <PackageCheck size={16} /> Skicka företagsorder
                  </Button>
                </div>
              </Card>
            </div>

            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <div className="rounded-3xl bg-white p-6 shadow-xl">
                <h2 className="text-xl font-semibold">Sammanfattning</h2>

                <div className="mt-5 space-y-4 text-sm text-stone-700">
                  <SummaryRow label="Ordernummer" value={orderNumber} />
                  <SummaryRow
                    label="Datum, tid och ort"
                    value={orderCreatedText}
                  />
                  <SummaryRow label="Betalningssätt" value={paymentMethod} />
                  <SummaryRow label="Beställning" value={selectedOrderType} />
                  <SummaryRow label="Pris" value={displayPrice} />
                  <SummaryRow label="Antal" value={String(quantity)} />
                  <SummaryRow label="Hälsningskort" value={selectedCardPrice} />
                  <SummaryRow label="Metod" value={deliveryMethod} />
                  <SummaryRow
                    label="Dörrhängning"
                    value={doorAllowed ? "Ja" : "Nej"}
                  />
                  <SummaryRow
                    label="Extra produkter"
                    value={
                      extraProducts.length
                        ? extraProducts.join(", ")
                        : "Inga valda"
                    }
                  />
                </div>

                <div className="mt-6 rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-stone-600">
                  <strong>Obs:</strong> Detta är en företags-gästorder.
                  Betalning sker direkt och inget företagskonto krävs.
                </div>
              </div>
            </aside>
          </form>
        </div>
      </section>
    </main>
  );
}

function ImageUploadBox({
  uploadedImageName,
  onChange,
}: {
  uploadedImageName: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-stone-300 bg-white p-4">
      {" "}
      <h3 className="text-sm font-semibold">
        Bifoga bild på liknande arrangemang du önskar
      </h3>{" "}
      <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl bg-stone-50 px-4 py-6 text-center text-sm text-stone-600 transition hover:bg-stone-100">
        {" "}
        <UploadCloud size={28} /> Bifoga bilden här
        <input
          type="file"
          accept="image/*"
          onChange={(event) => onChange(event.target.files?.[0]?.name || "")}
          className="hidden"
        />{" "}
      </label>
      {uploadedImageName && (
        <p className="mt-3 truncate text-xs font-medium text-stone-700">
          {" "}
          <ImagePlus size={14} className="inline" /> {uploadedImageName}{" "}
        </p>
      )}{" "}
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
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 text-sm font-medium text-white transition hover:bg-stone-800"
    >
      {children}{" "}
    </button>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 flex gap-3">
      {" "}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-white">
        {icon}{" "}
      </div>{" "}
      <div>
        {" "}
        <h2 className="text-xl font-semibold">{title}</h2>{" "}
        <p className="mt-1 text-sm leading-6 text-stone-600">
          {description}
        </p>{" "}
      </div>{" "}
    </div>
  );
}

function Required() {
  return <span className="text-red-600">*</span>;
}

function Field({
  name,
  label,
  placeholder,
  icon,
  type = "text",
  required = false,
}: {
  name?: string;
  label: string;
  placeholder: string;
  icon?: ReactNode;
  type?: "text" | "email" | "tel";
  required?: boolean;
}) {
  return (
    <label className="block">
      {" "}
      <span className="mb-2 block text-sm font-semibold">
        {label} {required && <Required />}{" "}
      </span>{" "}
      <div className="relative">
        {icon ? (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
            {icon}
          </div>
        ) : null}
        <input
          name={name}
          required={required}
          type={type}
          placeholder={placeholder}
          className={`h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition placeholder:text-stone-400 focus:border-stone-500 ${icon ? "pl-12" : ""}`}
        />{" "}
      </div>{" "}
    </label>
  );
}

function ReadOnlyField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <label className="block">
      {" "}
      <span className="mb-2 block text-sm font-semibold">{label}</span>{" "}
      <div className="relative">
        {icon ? (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
            {icon}
          </div>
        ) : null}
        <input
          readOnly
          value={value}
          className={`h-12 w-full rounded-2xl border border-stone-200 bg-stone-100 px-4 text-stone-700 outline-none ${icon ? "pl-12" : ""}`}
        />{" "}
      </div>{" "}
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
      {" "}
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition placeholder:text-stone-400 focus:border-stone-500"
      />{" "}
    </label>
  );
}

function Textarea({
  name,
  label,
  placeholder,
}: {
  name?: string;
  label: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      {" "}
      <span className="mb-2 block text-sm font-semibold">{label}</span>{" "}
      <textarea
        name={name}
        rows={4}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-stone-500"
      />{" "}
    </label>
  );
}

function SelectField({
  name,
  label,
  options,
  required = false,
  value,
  onChange,
}: {
  name?: string;
  label: string;
  options: string[];
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      {" "}
      <span className="mb-2 block text-sm font-semibold">
        {label} {required && <Required />}{" "}
      </span>
      <select
        name={name}
        required={required}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition focus:border-stone-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}{" "}
          </option>
        ))}{" "}
      </select>{" "}
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
  const activeClass =
    variant === "pink"
      ? "border-pink-700 bg-pink-700 text-white"
      : "border-stone-900 bg-stone-900 text-white";
  const inactiveClass =
    variant === "pink"
      ? "border-stone-200 bg-white text-stone-700 hover:border-pink-300"
      : "border-stone-200 bg-white text-stone-700 hover:border-stone-400";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${active ? activeClass : inactiveClass}`}
    >
      {children}{" "}
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
      {" "}
      <span className="text-stone-500">{label}</span>{" "}
      <strong className="text-right text-stone-900">{value}</strong>{" "}
    </div>
  );
}
