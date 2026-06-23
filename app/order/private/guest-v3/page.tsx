"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Sparkles, ShoppingBag, ImagePlus } from "lucide-react";

type Category =
  | "Bukett"
  | "Rosor"
  | "Begravning"
  | "Bröllop"
  | "Event"
  | "Företagsblommor"
  | "Växter"
  | "Presentbox"
  | "Egna önskemål";

type OrderItem = {
  id: string;
  category: Category;
  product: string;
  priceLabel: string;
  unitPrice: number;
  quantity: number;
  colors: string[];
  style: string;
  total: number;
  note?: string;
};

const categories: Category[] = [
  "Bukett",
  "Rosor",
  "Begravning",
  "Bröllop",
  "Event",
  "Företagsblommor",
  "Växter",
  "Presentbox",
  "Egna önskemål",
];

const colorOptions = [
  "Rosa",
  "Rött",
  "Orange",
  "Gult",
  "Blått",
  "Lila",
  "Vitt",
];

const styleOptions = [
  "Romantiskt",
  "Modernt",
  "Klassiskt",
  "Sorg",
  "Lyxigt",
  "Färgstarkt",
  "Säsongsbaserat",
  "Floristens val",
];

const bouquetPrices = [
  "500 kr",
  "625 kr",
  "750 kr",
  "1.000 kr",
  "1.250 kr",
  "1.500 kr",
  "2.000 kr",
  "Bukett-Prenumeration",
  "Annat pris",
];

const standardPrices = [
  "500 kr",
  "625 kr",
  "750 kr",
  "1.000 kr",
  "1.250 kr",
  "1.500 kr",
  "2.000 kr",
  "Annat pris",
];

const productsByCategory: Record<Category, string[]> = {
  Bukett: ["Bukett"],
  Rosor: ["Rosor"],
  Begravning: [
    "Krans",
    "Hjärta",
    "Stående dekoration",
    "Liggande dekoration",
    "Begravningsdekoration / Kistdekoration",
    "Bordsdekoration",
    "Lokaldekoration/Kyrkdekoration",
    "Helhetsdekoration",
  ],
  Bröllop: [
    "Brudbukett",
    "Tärnbukett / Näbb-bukett",
    "Corsage",
    "Bordsbukett",
    "Bordsdekoration",
    "Entrédekoration",
    "Kyrkdekoration",
    "Vigselbåge",
  ],
  Event: [
    "Bordsdekoration",
    "Scendekoration",
    "Bordsbukett",
    "Bordsdekoration i Oasis",
    "Mingelblommor i små vaser",
    "Entrédekoration",
    "Prisbukett",
    "Talarbukett",
  ],
  Företagsblommor: [
    "Veckobukett (Reception)",
    "Födelsedag / Årsdag",
    "Gratulationsbukett",
    "Mingelbuketter i små vaser",
    "Familjetillskott",
    "Bordsbukett",
    "VD-Bukett",
    "Bordsdekoration i Oasis",
  ],
  Växter: ["Växter"],
  Presentbox: ["Presentbox"],
  "Egna önskemål": ["Egna önskemål"],
};

const priceByProduct: Record<string, string[]> = {
  Bukett: bouquetPrices,
  Rosor: [
    "450 kr",
    "625 kr",
    "875 kr",
    "1.290 kr",
    "1.750 kr",
    "2.500 kr",
    "Annat pris",
  ],
  Brudbukett: ["2.000 kr", "2.500 kr", "3.000 kr", "4.000 kr", "Annat pris"],
  "Tärnbukett / Näbb-bukett": ["750 kr", "1.000 kr", "1.250 kr", "Annat pris"],
  Corsage: ["250 kr", "350 kr", "500 kr", "Annat pris"],
  Bordsbukett: ["650 kr", "750 kr", "1.000 kr", "1.250 kr", "Annat pris"],
  Bordsdekoration: ["650 kr", "1.000 kr", "1.500 kr", "2.000 kr", "Annat pris"],
  Entrédekoration: [
    "1.250 kr",
    "2.000 kr",
    "3.000 kr",
    "4.000 kr",
    "Annat pris",
  ],
  Kyrkdekoration: [
    "1.500 kr",
    "2.500 kr",
    "4.000 kr",
    "6.000 kr",
    "Annat pris",
  ],
  Vigselbåge: ["4.000 kr", "6.000 kr", "8.000 kr", "12.000 kr", "Annat pris"],
  "Lokaldekoration/Kyrkdekoration": [
    "1.250 kr",
    "2.000 kr",
    "3.000 kr",
    "Annat pris",
  ],
  "Mingelblommor i små vaser": ["125 kr", "150 kr", "200 kr", "Annat pris"],
  "Bordsdekoration i Oasis": ["650 kr", "1.000 kr", "1.500 kr", "Annat pris"],
  Scendekoration: [
    "2.000 kr",
    "3.000 kr",
    "4.000 kr",
    "5.000 kr",
    "Annat pris",
  ],
  Prisbukett: ["1.250 kr", "2.000 kr", "3.000 kr", "4.000 kr", "Annat pris"],
  Talarbukett: ["500 kr", "750 kr", "1.000 kr", "Annat pris"],
  "Veckobukett (Reception)": [
    "625 kr",
    "750 kr",
    "1.000 kr",
    "1.500 kr",
    "2.000 kr",
    "Bukett-Prenumeration",
    "Annat pris",
  ],
  "Födelsedag / Årsdag": standardPrices,
  Gratulationsbukett: standardPrices,
  Familjetillskott: standardPrices,
  "VD-Bukett": ["1.000 kr", "1.500 kr", "2.000 kr", "3.000 kr", "Annat pris"],
  Växter: standardPrices,
  Presentbox: standardPrices,
  "Egna önskemål": standardPrices,
};

function priceToNumber(value: string) {
  if (!value || value === "Annat pris" || value === "Bukett-Prenumeration")
    return 0;
  return Number(value.replace(/[^0-9]/g, ""));
}

function money(value: number) {
  return new Intl.NumberFormat("sv-SE").format(value) + " kr";
}

export default function GuestV3PrototypePage() {
  const [category, setCategory] = useState<Category>("Bukett");
  const [product, setProduct] = useState("Bukett");
  const [priceLabel, setPriceLabel] = useState("750 kr");
  const [customPrice, setCustomPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [style, setStyle] = useState("Floristens val");
  const [note, setNote] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);

  const priceOptions = priceByProduct[product] || standardPrices;
  const unitPrice =
    priceLabel === "Annat pris"
      ? priceToNumber(customPrice)
      : priceToNumber(priceLabel);
  const draftTotal = unitPrice * quantity;
  const orderTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.total, 0),
    [items],
  );

  function changeCategory(nextCategory: Category) {
    const firstProduct = productsByCategory[nextCategory][0];
    const firstPrice = (priceByProduct[firstProduct] || standardPrices)[0];
    setCategory(nextCategory);
    setProduct(firstProduct);
    setPriceLabel(firstPrice);
    setCustomPrice("");
    setQuantity(1);
  }

  function changeProduct(nextProduct: string) {
    const firstPrice = (priceByProduct[nextProduct] || standardPrices)[0];
    setProduct(nextProduct);
    setPriceLabel(firstPrice);
    setCustomPrice("");
    setQuantity(1);
  }

  function toggleColor(color: string) {
    setSelectedColors((current) => {
      if (current.includes(color))
        return current.filter((item) => item !== color);
      if (current.length >= 2) return current;
      return [...current, color];
    });
  }

  function addItem() {
    if (priceLabel !== "Bukett-Prenumeration" && unitPrice <= 0) return;
    const newItem: OrderItem = {
      id: Date.now().toString(),
      category,
      product,
      priceLabel:
        priceLabel === "Annat pris" ? `${customPrice} kr` : priceLabel,
      unitPrice,
      quantity: priceLabel === "Bukett-Prenumeration" ? 1 : quantity,
      colors: selectedColors,
      style,
      note,
      total: priceLabel === "Bukett-Prenumeration" ? unitPrice : draftTotal,
    };
    setItems((current) => [...current, newItem]);
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-5 py-8 text-stone-900 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <p className="inline-flex rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-800">
            GUEST V3 PROTOTYP
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Ny produktmotor med färgval och inspirationsbild
          </h1>
          <p className="mt-4 max-w-3xl text-stone-600">
            Detta är en klickbar prototyp för /order/private/guest-v3. Den
            ersätter inte den riktiga ordersidan ännu.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <section className="space-y-8">
            <Card>
              <h2 className="text-2xl font-semibold">1. Jag önskar beställa</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => changeCategory(item)}
                    className={
                      "rounded-2xl border p-4 text-left font-semibold transition " +
                      (category === item
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 bg-white hover:border-stone-400")
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-semibold">2. Välj produkt</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {productsByCategory[category].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => changeProduct(item)}
                    className={
                      "rounded-2xl border bg-white p-5 text-left transition hover:border-pink-300 " +
                      (product === item
                        ? "border-pink-700 ring-2 ring-pink-100"
                        : "border-stone-200")
                    }
                  >
                    <div className="h-28 rounded-2xl bg-gradient-to-br from-pink-50 via-white to-emerald-50 p-4">
                      <Sparkles className="text-pink-700" size={24} />
                      <p className="mt-8 text-xs text-stone-500">
                        Bildplats / framtida inspirationsbild
                      </p>
                    </div>
                    <h3 className="mt-4 font-semibold">{item}</h3>
                    <p className="mt-1 text-sm text-stone-500">
                      Välj färg, stil, pris och antal.
                    </p>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-semibold">3. Färg och stil</h2>
              <div className="mt-5">
                <h3 className="font-semibold">Färg (välj upp till 2)</h3>
                <p className="mt-1 text-sm text-stone-600">
                  Grönt finns inte som val eftersom blad och eucalyptus ofta
                  ingår naturligt.
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => toggleColor(color)}
                      className={
                        "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition " +
                        (selectedColors.includes(color)
                          ? "border-pink-700 bg-pink-700 text-white"
                          : "border-stone-200 bg-white hover:border-pink-300")
                      }
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold">Stil / Önskemål</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {styleOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setStyle(item)}
                      className={
                        "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition " +
                        (style === item
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-stone-200 bg-white hover:border-stone-400")
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-semibold">
                4. Pris, antal och inspirationsbild
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <Select
                  label="Pris"
                  value={priceLabel}
                  onChange={setPriceLabel}
                  options={priceOptions}
                />
                {priceLabel === "Annat pris" && (
                  <Input
                    label="Annat pris"
                    value={customPrice}
                    onChange={setCustomPrice}
                    placeholder="Ex. 950"
                  />
                )}
                {priceLabel !== "Bukett-Prenumeration" && (
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">
                      Antal
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4"
                    />
                  </label>
                )}
              </div>

              {priceLabel === "Bukett-Prenumeration" && (
                <div className="mt-5 rounded-2xl bg-pink-50 p-4 text-sm leading-6 text-pink-900">
                  <strong>Bukett-Prenumeration:</strong> kunden får återkommande
                  bukett enligt överenskommelse. Betalningen registreras som
                  återkommande via Stripe tills prenumerationen avslutas.
                  Prenumerationen kan pausas av admin. Ingen leverans eller
                  debitering sker under paus.
                </div>
              )}

              <div className="mt-6 rounded-3xl border border-dashed border-stone-300 bg-white p-5">
                <div className="flex items-start gap-3">
                  <ImagePlus className="mt-1 text-pink-700" size={22} />
                  <div>
                    <h3 className="font-semibold">Inspirationsbild</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      Bilden är en inspirationsbild. Blommor, nyanser och
                      detaljer kan variera beroende på säsong och
                      tillgänglighet. Floristen eftersträvar samma färgskala,
                      stil och känsla som visas i exemplet.
                    </p>
                  </div>
                </div>
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Övriga önskemål"
                rows={4}
                className="mt-5 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3"
              />

              <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-stone-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-stone-500">Vald produkt just nu</p>
                  <p className="text-xl font-semibold">
                    {priceLabel === "Bukett-Prenumeration"
                      ? "Prenumeration"
                      : money(draftTotal)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 text-sm font-semibold text-white hover:bg-stone-800"
                >
                  <Plus size={16} /> Lägg till i beställning
                </button>
              </div>
            </Card>
          </section>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} />
                <h2 className="text-xl font-semibold">Din beställning</h2>
              </div>

              {items.length === 0 ? (
                <p className="mt-5 rounded-2xl bg-stone-50 p-4 text-sm text-stone-600">
                  Inga produkter tillagda ännu.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-stone-100 bg-stone-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{item.product}</p>
                          <p className="text-xs text-stone-500">
                            {item.category} · {item.priceLabel} · x
                            {item.quantity}
                          </p>
                          <p className="mt-1 text-xs text-stone-500">
                            Färg:{" "}
                            {item.colors.length
                              ? item.colors.join(" + ")
                              : "Floristens val"}
                          </p>
                          <p className="text-xs text-stone-500">
                            Stil: {item.style}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="rounded-full p-2 text-stone-400 hover:bg-white hover:text-red-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <p className="mt-3 text-right font-semibold">
                        {money(item.total)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 border-t border-stone-100 pt-5">
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Produkter</span>
                  <strong className="text-stone-900">
                    {money(orderTotal)}
                  </strong>
                </div>
                <div className="mt-3 flex justify-between text-sm text-stone-600">
                  <span>Leverans</span>
                  <strong className="text-stone-900">Beräknas senare</strong>
                </div>
                <div className="mt-5 flex justify-between text-lg font-semibold">
                  <span>Totalt just nu</span>
                  <span>{money(orderTotal)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
      {children}
    </section>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4"
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

function Input({
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
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4"
      />
    </label>
  );
}
