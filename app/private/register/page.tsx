"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CalendarDays,
  Check,
  Clock,
  Gift,
  Heart,
  Home,
  ImagePlus,
  KeyRound,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Send,
  ShoppingBag,
  Sparkles,
  Truck,
  UploadCloud,
  User,
} from "lucide-react";

const MINIMUM_ORDER_VALUE = 400;

const paymentMethods = [
  "Betalkort med Stripe",
  "Klarna",
  "Swish",
  "Apple Pay",
  "Google Pay",
];
const deliveryMethods = ["Leverans", "Avhämtning från butiken XXX"];
const cardOptions = ["Inget kort", "Gratis kort", "35 kr", "60 kr", "75 kr"];
const swedishCities = [
  "Stockholm",
  "Göteborg",
  "Malmö",
  "Uppsala",
  "Örebro",
  "Linköping",
  "Annan ort",
];

const orderTypes = [
  "Bukett",
  "Rosor",
  "Begravning",
  "Bröllop",
  "Event",
  "Företagsblommor",
  "Växter",
  "Presentbox",
  "Choklad",
  "Ballonger",
  "Egna önskemål",
];

const priceOptions = [
  "400 kr",
  "500 kr",
  "650 kr",
  "750 kr",
  "1.000 kr",
  "1.250 kr",
  "1.500 kr",
  "2.000 kr",
  "Annat pris",
];
const extraProducts = [
  "Choklad 50 kr",
  "Vas 150 kr",
  "Nalle 120 kr",
  "Ballong 75 kr",
  "Extra kort 35 kr",
  "Lyxigare inslagning 90 kr",
];
const styleOptions = [
  "Romantiskt",
  "Modernt",
  "Klassiskt",
  "Lyxigt",
  "Färgstarkt",
  "Säsongsbaserat",
  "Pollenfri",
  "Floristens val",
];

function generateCustomerNumber() {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(100000 + Math.random() * 900000);
  return `FSP-${year}-${random}`;
}

function generateOrderNumber() {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(100000 + Math.random() * 900000);
  return `FSO-${year}-${random}`;
}

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!?#";
  const array = new Uint32Array(12);
  crypto.getRandomValues(array);
  return Array.from(array, (x) => chars[x % chars.length]).join("");
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

function priceToNumber(value: string) {
  const cleaned = value.replace(/[^0-9]/g, "");
  return Number(cleaned || 0);
}

export default function PrivateCustomerAndGuestOrderPage() {
  const [customerNumber, setCustomerNumber] = useState(
    "Skapas när sidan laddas",
  );
  const [orderNumber, setOrderNumber] = useState("Skapas när sidan laddas");
  const [createdAt, setCreatedAt] = useState("Skapas när sidan laddas");
  const [city, setCity] = useState("Stockholm");
  const [createAccount, setCreateAccount] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [selectedOrderType, setSelectedOrderType] = useState("Bukett");
  const [selectedStyle, setSelectedStyle] = useState("Floristens val");
  const [selectedPrice, setSelectedPrice] = useState("500 kr");
  const [customPrice, setCustomPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cardPrice, setCardPrice] = useState("35 kr");
  const [deliveryMethod, setDeliveryMethod] = useState("Leverans");
  const [paymentMethod, setPaymentMethod] = useState("Betalkort med Stripe");
  const [deliveryFee, setDeliveryFee] = useState("100");
  const [doorAllowed, setDoorAllowed] = useState(false);
  const [anonymousDelivery, setAnonymousDelivery] = useState(false);
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    setCustomerNumber(generateCustomerNumber());
    setOrderNumber(generateOrderNumber());
    setCreatedAt(nowStamp());
  }, []);

  const productPrice =
    selectedPrice === "Annat pris"
      ? priceToNumber(customPrice)
      : priceToNumber(selectedPrice);
  const extrasTotal = selectedExtras.reduce(
    (total, item) => total + priceToNumber(item),
    0,
  );
  const cardTotal = cardPrice === "Inget kort" ? 0 : priceToNumber(cardPrice);
  const deliveryTotal =
    deliveryMethod === "Leverans" ? Number(deliveryFee || 0) : 0;
  const subtotal = productPrice * quantity;
  const orderTotal = subtotal + extrasTotal + cardTotal + deliveryTotal;
  const isBelowMinimum = subtotal < MINIMUM_ORDER_VALUE;

  const orderCreatedText = useMemo(
    () => `${createdAt}, ${city}`,
    [createdAt, city],
  );

  function toggleExtra(product: string) {
    setSelectedExtras((items) =>
      items.includes(product)
        ? items.filter((item) => item !== product)
        : [...items, product],
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isBelowMinimum) {
      setSubmitMessage(
        `⚠️ Minsta ordervärde är ${MINIMUM_ORDER_VALUE} kr exklusive leverans och tillval. Välj minst 400 kr i produktvärde.`,
      );
      return;
    }

    setSubmitMessage(
      `✅ Beställning ${orderNumber} skapad. Kunden betalar ${orderTotal} kr. PDF-kvitto med moms ska skickas direkt efter genomförd betalning.`,
    );
  }

  return (
    <main className="min-h-screen bg-[#fbf7f2] text-stone-900">
      <section className="relative overflow-hidden px-5 py-10 md:px-10 lg:px-16">
        <div className="absolute right-[-160px] top-[-160px] h-96 w-96 rounded-full bg-pink-200/50 blur-3xl" />
        <div className="absolute bottom-[-180px] left-[-140px] h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl space-y-8">
          <header className="max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm">
              <Heart size={16} /> FloristSocial privatkund
            </div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Beställ blommor som privatkund eller gäst.
            </h1>
            <p className="mt-5 text-lg leading-8 text-stone-600">
              Kunden ska kunna beställa snabbt utan konto, men kan även skapa
              ett privatkonto för orderhistorik, sparade adresser,
              favoritflorister och snabbare checkout senare.
            </p>
            <p className="mt-3 text-base leading-7 text-stone-600">
              Minsta produktvärde är <strong>400 kr</strong>. Kunden betalar
              produkt, extra produkter, hälsningskort och eventuell leverans.
              Kortavgift eller Stripeavgift visas inte för kunden.
            </p>
          </header>

          {submitMessage && (
            <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
              {submitMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid gap-8 lg:grid-cols-[1fr_380px]"
          >
            <div className="space-y-8">
              <Card>
                <SectionHeader
                  icon={<User size={20} />}
                  title="1. Beställarens uppgifter"
                  description="Dessa uppgifter behövs för orderbekräftelse, betalning och kontakt vid frågor."
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <ReadOnlyField label="Ordernummer" value={orderNumber} />
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
                    name="buyerName"
                    label="Beställarens namn"
                    placeholder="Namn Efternamn"
                    icon={<User size={18} />}
                  />
                  <Field
                    required
                    name="buyerPhone"
                    label="Beställarens telefonnummer"
                    placeholder="070 000 00 00"
                    type="tel"
                    icon={<Phone size={18} />}
                  />
                  <Field
                    required
                    name="buyerEmail"
                    label="Beställarens e-post"
                    placeholder="namn@email.se"
                    type="email"
                    icon={<Mail size={18} />}
                  />
                  <label className="flex items-start gap-3 rounded-2xl bg-stone-50 p-4 text-sm text-stone-700">
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={(event) =>
                        setCreateAccount(event.target.checked)
                      }
                      className="mt-1 h-4 w-4 accent-stone-900"
                    />
                    <span>
                      Skapa privatkonto efter köpet för orderhistorik och
                      snabbare checkout
                    </span>
                  </label>
                </div>

                {createAccount && (
                  <PasswordFields
                    generatedPassword={generatedPassword}
                    onGenerated={setGeneratedPassword}
                  />
                )}
              </Card>

              <Card>
                <SectionHeader
                  icon={<MapPin size={20} />}
                  title="2. Mottagarens uppgifter"
                  description="Floristen eller budet måste kunna hitta mottagaren och kontakta vid portproblem eller leveransfrågor."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    required
                    name="recipientName"
                    label="Mottagarens namn"
                    placeholder="Namn Efternamn"
                    icon={<User size={18} />}
                  />
                  <Field
                    required
                    name="recipientPhone"
                    label="Mottagarens mobiltelefonnummer"
                    placeholder="070 000 00 00"
                    type="tel"
                    icon={<Phone size={18} />}
                  />
                  <Field
                    name="recipientEmail"
                    label="Mottagarens e-post"
                    placeholder="valfritt@email.se"
                    type="email"
                    icon={<Mail size={18} />}
                  />
                  <Field
                    required
                    name="recipientAddress"
                    label="Mottagarens fullständiga adress"
                    placeholder="Gatuadress och nummer"
                    icon={<Home size={18} />}
                  />
                  <Field
                    required
                    name="recipientPostalCode"
                    label="Postnummer"
                    placeholder="113 50"
                  />
                  <Field
                    required
                    name="recipientCity"
                    label="Ort"
                    placeholder="Stockholm"
                  />
                  <Field
                    name="doorCode"
                    label="Portkod"
                    placeholder="Ex. 1234"
                  />
                  <Field name="floor" label="Våning" placeholder="Ex. 3 tr" />
                  <Field
                    name="apartmentNumber"
                    label="Lägenhetsnummer"
                    placeholder="Ex. 1202"
                  />
                  <Field
                    name="careOf"
                    label="C/O"
                    placeholder="Ex. c/o Andersson"
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
                  <label className="flex items-start gap-3 rounded-2xl bg-stone-50 p-4 text-sm text-stone-700">
                    <input
                      type="checkbox"
                      checked={anonymousDelivery}
                      onChange={(event) =>
                        setAnonymousDelivery(event.target.checked)
                      }
                      className="mt-1 h-4 w-4 accent-stone-900"
                    />
                    <span>Anonym leverans</span>
                  </label>
                </div>

                <Textarea
                  name="deliveryInstructions"
                  label="Leveransinstruktioner"
                  placeholder="Portinformation, mottagning, ring före leverans, lämnas hos granne, osv."
                />
              </Card>

              <Card>
                <SectionHeader
                  icon={<ShoppingBag size={20} />}
                  title="3. Beställning"
                  description="Välj typ av arrangemang, pris, antal, stil och eventuella tillval."
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

                <div className="mt-8">
                  <h3 className="mb-3 font-semibold">Stil / önskemål</h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {styleOptions.map((style) => (
                      <PillButton
                        key={style}
                        active={selectedStyle === style}
                        onClick={() => setSelectedStyle(style)}
                        variant="pink"
                      >
                        {style}
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
                      placeholder="Minst 400 kr"
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
                    value={cardPrice}
                    onChange={setCardPrice}
                  />
                </div>

                {isBelowMinimum && (
                  <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
                    Minsta produktvärde är {MINIMUM_ORDER_VALUE} kr. Leverans
                    och extra tillval räknas ovanpå detta.
                  </div>
                )}

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Textarea
                    name="cardText"
                    label="Hälsningskort text"
                    placeholder="Till ex.: Hälsningar från Morbror Johan"
                  />
                  <Textarea
                    name="specialRequests"
                    label="Specialönskemål"
                    placeholder="Till ex.: färgglad, pollenfri, vita rosor, säsongens blommor ..."
                  />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <ImageUploadBox
                    uploadedImageName={uploadedImageName}
                    onChange={setUploadedImageName}
                  />
                  <div className="rounded-2xl bg-stone-50 p-5">
                    <h3 className="font-semibold">Extra produkter</h3>
                    <p className="mt-1 text-sm text-stone-600">
                      Kunden kan klicka och lägga till extra produkter.
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {extraProducts.map((product) => (
                        <PillButton
                          key={product}
                          active={selectedExtras.includes(product)}
                          onClick={() => toggleExtra(product)}
                          variant="pink"
                        >
                          {product}
                        </PillButton>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <SectionHeader
                  icon={<Truck size={20} />}
                  title="4. Leverans eller avhämtning"
                  description="Kunden kan välja leverans eller avhämtning från butiken."
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
                    <ControlledInput
                      label="Leveransavgift"
                      value={deliveryFee}
                      onChange={setDeliveryFee}
                      placeholder="Ex. 100"
                    />
                    <div className="rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-stone-600">
                      Fraktkostnad beräknas senare automatiskt utifrån avståndet
                      mellan levererande florist/blomsterbutik och
                      leveransadressen.
                    </div>
                  </div>
                )}
              </Card>

              <Card>
                <SectionHeader
                  icon={<Sparkles size={20} />}
                  title="5. Betalning och kvitto"
                  description="Privatkunder och gäster betalar direkt. Faktura används inte för privatpersoner i första versionen."
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
                    <Check size={16} className="mr-1 inline" /> PDF-kvitto med
                    moms ska skickas direkt efter genomförd betalning.
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-stone-600">
                  Kunden betalar endast produkt, tillval, hälsningskort och
                  eventuell leverans. Stripe-/kortavgift visas inte separat för
                  kunden. Varje florist betalar sin egen del av
                  betalningsavgiften proportionellt enligt befintlig
                  Stripe-modell.
                </div>
              </Card>
            </div>

            <aside className="lg:sticky lg:top-8 lg:h-fit">
              <div className="rounded-3xl bg-white p-6 shadow-xl">
                <h2 className="text-xl font-semibold">Sammanfattning</h2>
                <div className="mt-5 space-y-4 text-sm text-stone-700">
                  <SummaryRow label="Ordernummer" value={orderNumber} />
                  <SummaryRow
                    label="Kundnummer"
                    value={createAccount ? customerNumber : "Gästbeställning"}
                  />
                  <SummaryRow
                    label="Datum, tid och ort"
                    value={orderCreatedText}
                  />
                  <SummaryRow label="Beställning" value={selectedOrderType} />
                  <SummaryRow label="Stil" value={selectedStyle} />
                  <SummaryRow label="Produktvärde" value={`${subtotal} kr`} />
                  <SummaryRow
                    label="Extra produkter"
                    value={`${extrasTotal} kr`}
                  />
                  <SummaryRow label="Hälsningskort" value={`${cardTotal} kr`} />
                  <SummaryRow label="Leverans" value={`${deliveryTotal} kr`} />
                  <SummaryRow label="Betalningssätt" value={paymentMethod} />
                  <SummaryRow
                    label="Totalt att betala"
                    value={`${orderTotal} kr`}
                    strong
                  />
                </div>

                <div className="mt-6 rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-stone-600">
                  Exempel: Bukett 500 kr + choklad 50 kr + leverans 100 kr =
                  kunden betalar 650 kr.
                </div>

                <div className="mt-6 flex justify-end">
                  <Button type="submit">
                    <PackageCheck size={16} /> Skicka beställning
                  </Button>
                </div>
              </div>
            </aside>
          </form>
        </div>
      </section>
    </main>
  );
}

function PasswordFields({
  generatedPassword,
  onGenerated,
}: {
  generatedPassword: string;
  onGenerated: (value: string) => void;
}) {
  const [password, setPassword] = useState(generatedPassword);
  const [confirmPassword, setConfirmPassword] = useState(generatedPassword);

  function generate() {
    const next = generatePassword();
    onGenerated(next);
    setPassword(next);
    setConfirmPassword(next);
  }

  return (
    <div className="mt-6 rounded-3xl bg-stone-50 p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold">
            Eget lösenord eller säkert lösenord <Required />
          </h3>
          <p className="text-sm text-stone-600">
            Kunden kan skriva eget lösenord eller generera ett säkert lösenord.
          </p>
        </div>
        <Button type="button" onClick={generate}>
          <KeyRound size={16} /> Generera säkert lösen
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">
            Lösenord <Required />
          </span>
          <input
            name="password"
            required
            type="text"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minst 8 tecken"
            className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition placeholder:text-stone-400 focus:border-stone-500"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">
            Bekräfta lösenord <Required />
          </span>
          <input
            name="confirmPassword"
            required
            type="text"
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Upprepa lösenordet"
            className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition placeholder:text-stone-400 focus:border-stone-500"
          />
        </label>
      </div>
    </div>
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
      <h3 className="text-sm font-semibold">
        Bifoga bild på liknande arrangemang du önskar
      </h3>
      <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl bg-stone-50 px-4 py-6 text-center text-sm text-stone-600 transition hover:bg-stone-100">
        <UploadCloud size={28} /> Bifoga bilden här
        <input
          type="file"
          accept="image/*"
          onChange={(event) => onChange(event.target.files?.[0]?.name || "")}
          className="hidden"
        />
      </label>
      {uploadedImageName && (
        <p className="mt-3 truncate text-xs font-medium text-stone-700">
          <ImagePlus size={14} className="inline" /> {uploadedImageName}
        </p>
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
      {children}
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
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">
        {label} {required && <Required />}
      </span>
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
        />
      </div>
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
      <span className="mb-2 block text-sm font-semibold">{label}</span>
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
        />
      </div>
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
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <textarea
        name={name}
        rows={4}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-stone-500"
      />
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
      <span className="mb-2 block text-sm font-semibold">
        {label} {required && <Required />}
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
            {option}
          </option>
        ))}
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
      {children}
    </button>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
      <span className="text-stone-500">{label}</span>
      <strong
        className={`text-right ${strong ? "text-lg text-stone-950" : "text-stone-900"}`}
      >
        {value}
      </strong>
    </div>
  );
}
