"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

type StepKey = "buyer" | "recipient" | "order" | "payment";
type AddOn = { label: string; price: number; icon: string };
type OrderItem = {
  id: string;
  group: string;
  product: string;
  style: string;
  colors: string[];
  priceLabel: string;
  quantity: number;
  unitPrice: number;
  addons: AddOn[];
  total: number;
  subscription?: string;
  note?: string;
};

const MINIMUM_ORDER_VALUE = 450;

const groups = [
  { key: "Bukett", icon: "🌸" },
  { key: "Rosor", icon: "🌹" },
  { key: "Begravning", icon: "🕊️" },
  { key: "Bröllop", icon: "💍" },
  { key: "Event", icon: "🎉" },
  { key: "Företagsblommor", icon: "🏢" },
  { key: "Växter", icon: "🪴" },
  { key: "Presentbox", icon: "🎁" },
  { key: "Egna önskemål", icon: "✨" },
];

const baseStyles = [
  { label: "Floristens val", icon: "🌿" },
  { label: "Romantisk", icon: "🌹" },
  { label: "Modern", icon: "✨" },
  { label: "Klassisk", icon: "🏛️" },
  { label: "Sorg", icon: "🕊️" },
  { label: "Lyxig", icon: "💎" },
  { label: "Färgstark", icon: "🌈" },
];

const colors = [
  { label: "Rosa", dot: "🩷" },
  { label: "Rött", dot: "🔴" },
  { label: "Orange", dot: "🟠" },
  { label: "Gult", dot: "🟡" },
  { label: "Blått", dot: "🔵" },
  { label: "Lila", dot: "🟣" },
  { label: "Vitt", dot: "⚪" },
];

const cardOptions = ["Kort 35 kr", "Kort 50 kr", "Kort 75 kr", "Gratis kort"];
const cardQuantityOptions = Array.from({ length: 51 }, (_, index) =>
  String(index),
);
const deliveryMethods = ["Leverans", "Avhämtning"];
const paymentMethods = ["Kortbetalning via Stripe"];
const weekdays = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"];
const subscriptionIntervals = [
  "Varje vecka",
  "Varannan vecka",
  "En gång per månad",
];
const roseLengthOptions = ["60 cm", "70 cm", "80 cm"];
const roseCountOptions = [
  "0",
  "5",
  "7",
  "10",
  "15",
  "20",
  "30",
  "40",
  "50",
  "100",
  "200",
];

const rosePrices: Record<string, Record<string, number>> = {
  "60 cm": {
    "0": 0,
    "5": 450,
    "7": 625,
    "10": 875,
    "15": 1290,
    "20": 1750,
    "30": 2500,
    "40": 3500,
    "50": 4000,
    "100": 7800,
    "200": 15000,
  },
  "70 cm": {
    "0": 0,
    "5": 525,
    "7": 695,
    "10": 950,
    "15": 1450,
    "20": 1895,
    "30": 2850,
    "40": 3750,
    "50": 4500,
    "100": 9000,
    "200": 18750,
  },
  "80 cm": {
    "0": 0,
    "5": 625,
    "7": 780,
    "10": 1100,
    "15": 1500,
    "20": 1950,
    "30": 2950,
    "40": 3900,
    "50": 4800,
    "100": 9500,
    "200": 19000,
  },
};

const priceLists: Record<string, Record<string, string[]>> = {
  Bukett: {
    Bukett: [
      "500 kr",
      "625 kr",
      "750 kr",
      "1.000 kr",
      "1.250 kr",
      "1.500 kr",
      "2.000 kr",
      "Annat pris",
    ],
    "Bukett-Prenumeration": [
      "500 kr",
      "625 kr",
      "750 kr",
      "1.000 kr",
      "1.250 kr",
      "1.500 kr",
      "2.000 kr",
      "Annat pris",
    ],
  },
  Begravning: {
    Krans: [
      "Krans cirka 35 cm - 3.000 kr",
      "Krans cirka 40 cm - 4.000 kr",
      "Krans cirka 50 cm - 4.500 kr",
      "Krans cirka 60 cm - 5.000 kr",
      "Annat pris",
    ],
    Hjärta: [
      "Hjärta 35 cm - 3.500 kr",
      "Hjärta 40 cm - 4.700 kr",
      "Hjärta 45 cm - 5.500 kr",
      "Annat pris",
    ],
    "Stående dekoration": [
      "Dekoration - 1.250 kr",
      "Dekoration - 1.500 kr",
      "Dekoration - 2.000 kr",
      "Dekoration - 2.500 kr",
      "Annat pris",
    ],
    "Liggande dekoration": [
      "Dekoration - 1.250 kr",
      "Dekoration - 1.500 kr",
      "Dekoration - 2.000 kr",
      "Dekoration - 2.500 kr",
      "Annat pris",
    ],
    "Begravningsdekoration / Kistdekoration": [
      "Dekoration - 3.000 kr",
      "Dekoration - 4.000 kr",
      "Dekoration - 5.000 kr",
      "Dekoration - 6.000 kr",
      "Annat pris",
    ],
    Bordsdekoration: [
      "750 kr",
      "1.000 kr",
      "1.250 kr",
      "1.500 kr",
      "Annat pris",
    ],
    "Lokaldekoration / Kyrkdekoration": [
      "1.250 kr",
      "2.000 kr",
      "3.000 kr",
      "Annat pris",
    ],
    Helhetsdekoration: ["Annat pris"],
  },
  Bröllop: {
    Brudbukett: ["2.000 kr", "2.500 kr", "3.000 kr", "4.000 kr", "Annat pris"],
    "Tärnbukett / Näbb-bukett": [
      "750 kr",
      "1.000 kr",
      "1.250 kr",
      "Annat pris",
    ],
    Corsage: ["250 kr", "350 kr", "500 kr", "Annat pris"],
    Bordsbukett: ["650 kr", "750 kr", "1.000 kr", "1.250 kr", "Annat pris"],
    Bordsdekoration: [
      "650 kr",
      "1.000 kr",
      "1.500 kr",
      "2.000 kr",
      "Annat pris",
    ],
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
  },
  Event: {
    Bordsdekoration: [
      "750 kr",
      "1.000 kr",
      "1.250 kr",
      "1.500 kr",
      "Annat pris",
    ],
    Scendekoration: [
      "2.000 kr",
      "3.000 kr",
      "4.000 kr",
      "5.000 kr",
      "Annat pris",
    ],
    Bordsbukett: ["650 kr", "750 kr", "1.000 kr", "1.250 kr", "Annat pris"],
    "Bordsdekoration i Oasis": ["650 kr", "1.000 kr", "1.500 kr", "Annat pris"],
    "Mingelblommor i små vaser": ["125 kr", "150 kr", "200 kr", "Annat pris"],
    Entrédekoration: ["625 kr", "750 kr", "1.000 kr", "1.500 kr", "Annat pris"],
    Prisbukett: ["1.250 kr", "2.000 kr", "3.000 kr", "4.000 kr", "Annat pris"],
    Talarbukett: ["500 kr", "750 kr", "1.000 kr", "Annat pris"],
  },
  Företagsblommor: {
    "Veckobukett (Reception)": [
      "625 kr",
      "750 kr",
      "1.000 kr",
      "1.500 kr",
      "2.000 kr",
      "Annat pris",
    ],
    "Födelsedag / Årsdag": [
      "625 kr",
      "750 kr",
      "1.000 kr",
      "1.500 kr",
      "2.000 kr",
      "Annat pris",
    ],
    Gratulationsbukett: [
      "625 kr",
      "750 kr",
      "1.000 kr",
      "1.500 kr",
      "2.000 kr",
      "Annat pris",
    ],
    "Mingelbuketter i små vaser": ["125 kr", "150 kr", "200 kr", "Annat pris"],
    Familjetillskott: [
      "625 kr",
      "750 kr",
      "1.000 kr",
      "1.500 kr",
      "Annat pris",
    ],
    Bordsbukett: ["650 kr", "750 kr", "1.000 kr", "1.250 kr", "Annat pris"],
    "VD-Bukett": ["1.000 kr", "1.500 kr", "2.000 kr", "3.000 kr", "Annat pris"],
    "Bordsdekoration i Oasis": ["650 kr", "1.000 kr", "1.500 kr", "Annat pris"],
    Prisbukett: [
      "625 kr",
      "750 kr",
      "1.000 kr",
      "1.500 kr",
      "2.000 kr",
      "Annat pris",
    ],
  },
  Växter: {
    Växter: [
      "500 kr",
      "625 kr",
      "750 kr",
      "1.000 kr",
      "1.250 kr",
      "1.500 kr",
      "2.000 kr",
      "Annat pris",
    ],
  },
  Presentbox: {
    Presentbox: [
      "500 kr",
      "625 kr",
      "750 kr",
      "1.000 kr",
      "1.250 kr",
      "1.500 kr",
      "2.000 kr",
      "Annat pris",
    ],
  },
  "Egna önskemål": {
    "Egna önskemål": [
      "500 kr",
      "625 kr",
      "750 kr",
      "1.000 kr",
      "1.250 kr",
      "1.500 kr",
      "2.000 kr",
      "Annat pris",
    ],
  },
};

const funeralBandOptions = [
  { label: "Band 350 kr", price: 350 },
  { label: "Band 500 kr - upp till 12 ord", price: 500 },
  { label: "Band 700 kr - upp till 20 ord", price: 700 },
  { label: "Band 900 kr - upp till 30 ord", price: 900 },
];

const bandColorOptions = [
  "Vit",
  "Kräm",
  "Grönt",
  "Rosa",
  "Blått",
  "Gul",
  "Guld",
  "Rött",
];
const chocolateOptions = ["Välj", "125 kr", "200 kr", "300 kr"];
const balloonOptions = ["Välj", "125 kr", "250 kr"];
const teddyOptions = ["Välj", "250 kr", "500 kr"];
const vaseOptions = ["Välj", "149 kr", "299 kr", "499 kr", "699 kr"];
const potOptions = ["Välj", "200 kr", "400 kr", "600 kr", "950 kr"];

function money(value: number) {
  return new Intl.NumberFormat("sv-SE").format(value) + " kr";
}
function priceToNumber(value: string) {
  if (
    !value ||
    value === "Välj" ||
    value === "Gratis kort" ||
    value === "Automatiskt pris"
  )
    return 0;
  const part = value.includes("-")
    ? value.split("-").pop()?.trim() || value
    : value;
  return Number(part.replace(/[^0-9]/g, "") || 0);
}
function minPriceFromOptions(options: string[]) {
  const nums = options.map(priceToNumber).filter(Boolean);
  return nums.length ? Math.min(...nums) : MINIMUM_ORDER_VALUE;
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
function generateOrderNumber() {
  return (
    "FSG-" +
    new Date().getFullYear().toString().slice(-2) +
    "-" +
    Math.floor(100000 + Math.random() * 900000)
  );
}
function showCardFor(group: string, product: string) {
  if (
    ["Bukett", "Rosor", "Växter", "Presentbox", "Egna önskemål"].includes(group)
  )
    return true;
  if (group === "Event") return ["Talarbukett", "Prisbukett"].includes(product);
  if (group === "Företagsblommor")
    return ["Födelsedag / Årsdag", "Gratulationsbukett", "Prisbukett"].includes(
      product,
    );
  if (group === "Begravning") return true;
  return false;
}
function availableStyles(group: string) {
  if (group === "Rosor")
    return baseStyles.filter((item) => item.label === "Floristens val");
  if (group === "Bröllop" || group === "Växter")
    return baseStyles.filter((item) => item.label !== "Sorg");
  return baseStyles;
}
function shouldHideFuneralExtra(group: string, extra: string) {
  return (
    group === "Begravning" && ["Choklad", "Ballong", "Nalle"].includes(extra)
  );
}
function visualFor(product: string) {
  const p = product.toLowerCase();
  if (p.includes("krans"))
    return "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=80";
  if (p.includes("stående"))
    return "https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=900&q=80";
  if (p.includes("ros"))
    return "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=80";
  if (p.includes("presentbox"))
    return "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80";
  if (p.includes("växt"))
    return "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80";
  if (p.includes("dekoration"))
    return "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80";
  return "https://images.unsplash.com/photo-1494336934272-f0efcedfc8cf?auto=format&fit=crop&w=900&q=80";
}

export default function GuestV42Bestallningsstudio() {
  const [activeStep, setActiveStep] = useState<StepKey>("order");
  const [orderNumber, setOrderNumber] = useState("Skapas när sidan laddas");
  const [createdAt, setCreatedAt] = useState("Skapas när sidan laddas");
  const [group, setGroup] = useState("Bukett");
  const [product, setProduct] = useState("Bukett");
  const [style, setStyle] = useState("Floristens val");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceLabel, setPriceLabel] = useState("750 kr");
  const [customPrice, setCustomPrice] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [roseLength, setRoseLength] = useState("70 cm");
  const [roseCount, setRoseCount] = useState("0");
  const [subscriptionInterval, setSubscriptionInterval] =
    useState("Varje vecka");
  const [subscriptionDay, setSubscriptionDay] = useState("Måndag");
  const [cardPrice, setCardPrice] = useState("Kort 35 kr");
  const [cardQuantity, setCardQuantity] = useState("0");
  const [cardText, setCardText] = useState("");
  const [funeralMessageOption, setFuneralMessageOption] = useState<
    "Hälsningskort" | "Begravningsband" | "Inget meddelande"
  >("Hälsningskort");
  const [funeralCardPrice, setFuneralCardPrice] = useState("Kort 75 kr");
  const [funeralCardQuantity, setFuneralCardQuantity] = useState("0");
  const [selectedBand, setSelectedBand] = useState(funeralBandOptions[1].label);
  const [bandColor, setBandColor] = useState("Vit");
  const [bandTextLeft, setBandTextLeft] = useState("");
  const [bandTextRight, setBandTextRight] = useState("");
  const [personalNote, setPersonalNote] = useState("");
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [uploadedImagePreview, setUploadedImagePreview] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("Leverans");
  const [doorAllowed, setDoorAllowed] = useState(false);
  const [anonymousSender, setAnonymousSender] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(
    "Kortbetalning via Stripe",
  );
  const [chocolatePrice, setChocolatePrice] = useState("Välj");
  const [balloonPrice, setBalloonPrice] = useState("Välj");
  const [teddyPrice, setTeddyPrice] = useState("Välj");
  const [vasePrice, setVasePrice] = useState("Välj");
  const [potPrice, setPotPrice] = useState("Välj");
  const [luxuryWrap, setLuxuryWrap] = useState(false);
  const [pollenFree, setPollenFree] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setOrderNumber(generateOrderNumber());
    setCreatedAt(nowStamp());
  }, []);

  const isDelivery = deliveryMethod === "Leverans";
  const isSubscriptionProduct =
    product === "Bukett-Prenumeration" ||
    (group === "Företagsblommor" && product === "Veckobukett (Reception)");
  const productOptions = useMemo(
    () =>
      group === "Rosor"
        ? ["Rosor"]
        : Object.keys(
            priceLists[group] || { [group]: ["500 kr", "Annat pris"] },
          ),
    [group],
  );
  const currentPriceOptions = useMemo(
    () =>
      group === "Rosor"
        ? ["Automatiskt pris", "Annat pris"]
        : priceLists[group]?.[product] || ["500 kr", "Annat pris"],
    [group, product],
  );
  const selectedUnitPrice = useMemo(() => {
    if (group === "Rosor" && priceLabel !== "Annat pris")
      return rosePrices[roseLength]?.[roseCount] || 0;
    if (priceLabel === "Annat pris") return priceToNumber(customPrice);
    return priceToNumber(priceLabel);
  }, [group, priceLabel, customPrice, roseLength, roseCount]);
  const minimumCustomPrice = useMemo(
    () =>
      group === "Rosor"
        ? rosePrices[roseLength]?.[roseCount] || MINIMUM_ORDER_VALUE
        : minPriceFromOptions(currentPriceOptions),
    [group, roseLength, roseCount, currentPriceOptions],
  );
  const activeCardPrice = group === "Begravning" ? funeralCardPrice : cardPrice;
  const activeCardQuantity =
    group === "Begravning"
      ? Number(funeralCardQuantity || 0)
      : Number(cardQuantity || 0);

  const draftAddons: AddOn[] = useMemo(() => {
    const addons: AddOn[] = [];
    if (showCardFor(group, product) && activeCardQuantity > 0)
      addons.push({
        label: activeCardPrice + " x " + activeCardQuantity,
        price: priceToNumber(activeCardPrice) * activeCardQuantity,
        icon: "💌",
      });
    if (group === "Begravning" && funeralMessageOption === "Begravningsband") {
      const band = funeralBandOptions.find(
        (item) => item.label === selectedBand,
      );
      addons.push({
        label: selectedBand + " (" + bandColor + ")",
        price: band?.price || 0,
        icon: "🎗️",
      });
    }
    if (!shouldHideFuneralExtra(group, "Choklad") && chocolatePrice !== "Välj")
      addons.push({
        label: "Choklad " + chocolatePrice,
        price: priceToNumber(chocolatePrice),
        icon: "🍫",
      });
    if (!shouldHideFuneralExtra(group, "Ballong") && balloonPrice !== "Välj")
      addons.push({
        label: "Ballong " + balloonPrice,
        price: priceToNumber(balloonPrice),
        icon: "🎈",
      });
    if (!shouldHideFuneralExtra(group, "Nalle") && teddyPrice !== "Välj")
      addons.push({
        label: "Nalle " + teddyPrice,
        price: priceToNumber(teddyPrice),
        icon: "🧸",
      });
    if (vasePrice !== "Välj")
      addons.push({
        label: "Vas " + vasePrice,
        price: priceToNumber(vasePrice),
        icon: "🏺",
      });
    if (potPrice !== "Välj")
      addons.push({
        label: "Kruka " + potPrice,
        price: priceToNumber(potPrice),
        icon: "🪴",
      });
    if (luxuryWrap)
      addons.push({ label: "Lyxigare inslagning", price: 90, icon: "🎀" });
    if (pollenFree)
      addons.push({ label: "Pollenfri önskas", price: 0, icon: "🌿" });
    return addons;
  }, [
    activeCardPrice,
    activeCardQuantity,
    bandColor,
    balloonPrice,
    chocolatePrice,
    funeralMessageOption,
    group,
    luxuryWrap,
    pollenFree,
    potPrice,
    product,
    selectedBand,
    teddyPrice,
    vasePrice,
  ]);

  const itemSubtotal = selectedUnitPrice * Math.max(0, quantity);
  const addonsTotal = draftAddons.reduce((sum, item) => sum + item.price, 0);
  const currentTotalPreview = itemSubtotal + addonsTotal;
  const orderSubtotal = orderItems.reduce((sum, item) => sum + item.total, 0);

  function resetExtras() {
    setChocolatePrice("Välj");
    setBalloonPrice("Välj");
    setTeddyPrice("Välj");
    setVasePrice("Välj");
    setPotPrice("Välj");
    setLuxuryWrap(false);
    setPollenFree(false);
  }
  function resetDraft(options?: { keepGroup?: boolean }) {
    setSelectedColors([]);
    setStyle("Floristens val");
    setCustomPrice("");
    setQuantity(0);
    setRoseLength("70 cm");
    setRoseCount("0");
    setCardPrice("Kort 35 kr");
    setCardQuantity("0");
    setFuneralCardPrice("Kort 75 kr");
    setFuneralCardQuantity("0");
    setCardText("");
    setFuneralMessageOption("Hälsningskort");
    setSelectedBand(funeralBandOptions[1].label);
    setBandColor("Vit");
    setBandTextLeft("");
    setBandTextRight("");
    setPersonalNote("");
    setUploadedImageName("");
    setUploadedImagePreview("");
    setSubscriptionInterval("Varje vecka");
    setSubscriptionDay("Måndag");
    resetExtras();
    if (!options?.keepGroup) {
      setGroup("Bukett");
      setProduct("Bukett");
      setPriceLabel("750 kr");
    }
  }
  function handleGroup(nextGroup: string) {
    const firstProduct =
      nextGroup === "Rosor"
        ? "Rosor"
        : Object.keys(priceLists[nextGroup] || { [nextGroup]: [] })[0] ||
          nextGroup;
    setGroup(nextGroup);
    setProduct(firstProduct);
    setStyle("Floristens val");
    setPriceLabel(
      nextGroup === "Rosor"
        ? "Automatiskt pris"
        : priceLists[nextGroup]?.[firstProduct]?.[0] || "500 kr",
    );
    resetDraft({ keepGroup: true });
  }
  function handleProduct(nextProduct: string) {
    setProduct(nextProduct);
    setPriceLabel(
      priceLists[group]?.[nextProduct]?.[0] ||
        (group === "Rosor" ? "Automatiskt pris" : "500 kr"),
    );
    setCustomPrice("");
    setQuantity(0);
    if (
      nextProduct === "Veckobukett (Reception)" ||
      nextProduct === "Bukett-Prenumeration"
    ) {
      setSubscriptionInterval("Varje vecka");
      setSubscriptionDay("Måndag");
    }
  }
  function toggleColor(color: string) {
    setSelectedColors((current) =>
      current.includes(color)
        ? current.filter((item) => item !== color)
        : current.length >= 2
          ? current
          : [...current, color],
    );
  }
  function addOrderItem() {
    const hasMainProduct = itemSubtotal > 0;
    const hasAddonsOnly = itemSubtotal === 0 && addonsTotal >= 500;

    if (
      hasMainProduct &&
      priceLabel === "Annat pris" &&
      selectedUnitPrice < minimumCustomPrice
    ) {
      setMessage(
        "Annat pris får inte vara lägre än " +
          money(minimumCustomPrice) +
          " för denna produkt.",
      );
      return;
    }

    if (!hasMainProduct && !hasAddonsOnly) {
      setMessage(
        "Välj en produkt med giltigt pris och antal, eller extra produkter för minst 500 kr.",
      );
      return;
    }

    setOrderItems((current) => [
      ...current,
      {
        id: Date.now().toString(),
        group: hasMainProduct ? group : "Extra produkter",
        product: hasMainProduct ? product : "Extra produkter",
        style: hasMainProduct ? style : "Tillval utan blomsterarrangemang",
        colors: hasMainProduct ? selectedColors : [],
        priceLabel: hasMainProduct
          ? priceLabel === "Annat pris"
            ? "Annat pris: " + money(selectedUnitPrice)
            : group === "Rosor"
              ? roseCount + " rosor, " + roseLength
              : priceLabel
          : "Endast extra produkter",
        quantity: hasMainProduct ? quantity : 0,
        unitPrice: hasMainProduct ? selectedUnitPrice : 0,
        total: currentTotalPreview,
        addons: draftAddons,
        cardText: activeCardQuantity > 0 ? cardText : undefined,
        messageOption:
          group === "Begravning" ? funeralMessageOption : undefined,
        band:
          group === "Begravning" && funeralMessageOption === "Begravningsband"
            ? selectedBand + ", " + bandColor
            : undefined,
        bandTextLeft,
        bandTextRight,
        personalNote,
        subscription:
          hasMainProduct && isSubscriptionProduct
            ? subscriptionInterval + ", " + subscriptionDay
            : undefined,
      },
    ]);
    resetDraft();
    setMessage("Produkten har lagts till i beställningen.");
  }

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-6 text-stone-900 md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-[2rem] bg-white/80 p-5 shadow-sm">
          <p className="text-sm font-medium text-pink-700">
            FloristSocial Beställningsstudio V4.3
          </p>
          <h1 className="mt-1 text-2xl font-semibold md:text-4xl">
            Designa din egen bukett eller blomsterdekoration
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600 md:text-base">
            Välj grupp, stil, färg och pris. Floristen skapar sedan ett unikt
            arrangemang utifrån dina val, säsongens blommor och sin
            professionella kreativitet.
          </p>
        </div>
        {message && (
          <div className="mb-4 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            {message}
          </div>
        )}
        <div className="grid gap-5 lg:grid-cols-[230px_1fr_340px]">
          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <div className="rounded-[2rem] bg-white p-4 shadow-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                Steg
              </p>
              <StepButton
                active={activeStep === "buyer"}
                onClick={() => setActiveStep("buyer")}
                icon="👤"
                title="1. Beställare"
              />
              <StepButton
                active={activeStep === "recipient"}
                onClick={() => setActiveStep("recipient")}
                icon="📍"
                title="2. Mottagare"
              />
              <StepButton
                active={activeStep === "order"}
                onClick={() => setActiveStep("order")}
                icon="🌸"
                title="3. Beställningen"
              />
              <StepButton
                active={activeStep === "payment"}
                onClick={() => setActiveStep("payment")}
                icon="💳"
                title="4. Betalning"
              />
            </div>
          </aside>
          <section className="min-w-0">
            {activeStep === "buyer" && (
              <Panel
                title="1. Beställare"
                description="Dessa uppgifter behövs för orderbekräftelse, betalning och kontakt vid frågor."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <ReadOnly label="Ordernummer" value={orderNumber} />
                  <ReadOnly label="Skapad" value={createdAt} />
                  <Field
                    required
                    label="Beställarens namn"
                    placeholder="Namn Efternamn"
                  />
                  <Field
                    required
                    label="Beställarens telefonnummer"
                    placeholder="070 000 00 00"
                  />
                  <Field
                    label="Beställarens e-post"
                    placeholder="namn@email.se"
                    type="email"
                  />
                </div>
              </Panel>
            )}
            {activeStep === "recipient" && (
              <Panel
                title="2. Mottagare, Leveransform, Leveransdatum"
                description="Vid avhämtning behövs mottagarens namn, telefonnummer, datum och tid. Vid leverans behövs även adress."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    required
                    label="Mottagarens förnamn"
                    placeholder="Förnamn"
                  />
                  <Field
                    required
                    label="Mottagarens efternamn"
                    placeholder="Efternamn"
                  />
                  <Field
                    required
                    label="Mottagarens mobiltelefonnummer"
                    placeholder="070 000 00 00"
                  />
                </div>
                <div className="mt-6">
                  <Label>Leveransmetod *</Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {deliveryMethods.map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setDeliveryMethod(method)}
                        className={choiceClass(deliveryMethod === method)}
                      >
                        {deliveryMethod === method ? "⭕ " : "○ "}
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Field
                    required
                    label={
                      deliveryMethod === "Avhämtning"
                        ? "Avhämtningsdatum"
                        : "Leveransdatum"
                    }
                    type="date"
                    placeholder=""
                  />
                  <Field
                    label={
                      deliveryMethod === "Avhämtning"
                        ? "Avhämtningstid"
                        : "Leveranstid"
                    }
                    type="time"
                    placeholder=""
                  />
                </div>
                {deliveryMethod === "Avhämtning" && (
                  <Info>
                    <strong>Avhämtning:</strong> Namn och adress på utförande
                    butik/florist ska visas på ordern när florist/butik är vald.
                  </Info>
                )}
                {deliveryMethod === "Leverans" && (
                  <div className="mt-6 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field
                        label="Mottagarens e-post"
                        placeholder="valfritt@email.se"
                        type="email"
                      />
                      <Field
                        required
                        label="Mottagarens gatuadress och husnummer"
                        placeholder="Gatuadress och husnummer"
                      />
                      <Field
                        required
                        label="Mottagarens postnummer"
                        placeholder="Ex. 113 50"
                      />
                      <Field
                        required
                        label="Mottagarens ort"
                        placeholder="Ex. Stockholm"
                      />
                      <Field label="Portkod" placeholder="Ex. 1234" />
                      <Field label="Våning" placeholder="Ex. 3 tr" />
                      <Field label="Lägenhetsnummer" placeholder="Ex. 1202" />
                      <Field label="C/O" placeholder="Ex. c/o Andersson" />
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <CheckBox
                        checked={doorAllowed}
                        onChange={setDoorAllowed}
                        label="Kan hängas på dörren"
                      />
                      <CheckBox
                        checked={anonymousSender}
                        onChange={setAnonymousSender}
                        label="Anonym avsändare"
                      />
                    </div>
                    <Textarea
                      label="Leveransinstruktioner"
                      placeholder="Portinformation, mottagning, ring före leverans, lämnas hos granne, osv."
                    />
                    <Info>
                      <strong>Leveransavgift:</strong> Om ingen butik/florist är
                      vald beräknas avståndet från Stockholm centrum till
                      mottagarens adress.
                    </Info>
                  </div>
                )}
              </Panel>
            )}
            {activeStep === "order" && (
              <Panel
                title="3. Beställningen"
                description="Bygg kundens blomsterarrangemang med grupp, stil, färg, pris och personliga önskemål."
              >
                <div className="grid gap-5 xl:grid-cols-[210px_1fr]">
                  <div className="rounded-3xl bg-stone-50 p-3">
                    <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                      Grupp
                    </p>
                    <div className="flex gap-2 overflow-x-auto xl:block xl:space-y-2">
                      {groups.map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => handleGroup(item.key)}
                          className={
                            "shrink-0 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition xl:w-full " +
                            (group === item.key
                              ? "bg-stone-900 text-white"
                              : "bg-white text-stone-700 hover:bg-stone-100")
                          }
                        >
                          {group === item.key ? "⭕ " : ""}
                          {item.icon} {item.key}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="rounded-[2rem] bg-gradient-to-br from-pink-100 via-white to-emerald-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-700">
                        Inspirationsbild
                      </p>
                      <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/70 shadow-inner">
                        <img
                          src={uploadedImagePreview || visualFor(product)}
                          alt="Inspirationsbild"
                          className="h-72 w-full object-cover"
                        />
                      </div>
                      <p className="mt-4 text-xs leading-5 text-stone-600">
                        En liknande bukett eller dekoration kommer att levereras
                        till mottagaren. Blommor och material väljs
                        säsongsmässigt av floristen och kan variera beroende på
                        tillgänglighet.
                      </p>
                    </div>
                    <Section title="Välj produkt">
                      {group !== "Rosor" ? (
                        <div className="flex flex-wrap gap-2">
                          {productOptions.map((item) => (
                            <Chip
                              key={item}
                              active={product === item}
                              onClick={() => handleProduct(item)}
                            >
                              {product === item ? "⭕ " : "○ "}
                              {item}
                            </Chip>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <Select
                              label="Längd på rosor"
                              value={roseLength}
                              onChange={setRoseLength}
                              options={roseLengthOptions}
                            />
                            <Select
                              label="Antal rosor"
                              value={roseCount}
                              onChange={setRoseCount}
                              options={roseCountOptions}
                            />
                          </div>
                          <div className="rounded-2xl bg-white p-4">
                            <p className="text-sm text-stone-500">
                              Valda rosor just nu
                            </p>
                            <p className="text-2xl font-semibold">
                              {money(itemSubtotal)}
                            </p>
                          </div>
                        </div>
                      )}
                      {isSubscriptionProduct && (
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <Select
                            label="Prenumeration"
                            value={subscriptionInterval}
                            onChange={setSubscriptionInterval}
                            options={subscriptionIntervals}
                          />
                          <Select
                            label="Veckodag"
                            value={subscriptionDay}
                            onChange={setSubscriptionDay}
                            options={weekdays}
                          />
                        </div>
                      )}
                    </Section>
                    <Section title="Stil">
                      <div className="flex flex-wrap gap-2">
                        {availableStyles(group).map((item) => (
                          <Chip
                            key={item.label}
                            active={style === item.label}
                            onClick={() => setStyle(item.label)}
                          >
                            {style === item.label ? "⭕ " : "○ "}
                            {item.icon} {item.label}
                          </Chip>
                        ))}
                      </div>
                    </Section>
                    <Section title="Färg (välj max två)">
                      <div className="flex flex-wrap gap-3">
                        {colors.map((item) => {
                          const active = selectedColors.includes(item.label);
                          return (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() => toggleColor(item.label)}
                              title={item.label}
                              className={
                                "rounded-full border px-3 py-2 text-2xl transition " +
                                (active
                                  ? "border-emerald-600 bg-white shadow-md"
                                  : "border-stone-200 bg-white/70 hover:bg-white")
                              }
                            >
                              {active ? "🟢" : ""}
                              {item.dot}
                            </button>
                          );
                        })}
                      </div>
                      <p className="mt-2 text-xs text-stone-500">
                        Grönt behöver inte väljas eftersom blad och grönt
                        material ofta ingår naturligt.
                      </p>
                    </Section>
                    <Section title="Pris och antal">
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {currentPriceOptions.map((item) => (
                            <Chip
                              key={item}
                              active={priceLabel === item}
                              onClick={() => setPriceLabel(item)}
                            >
                              {priceLabel === item ? "⭕ " : "○ "}
                              {item}
                            </Chip>
                          ))}
                        </div>
                        {priceLabel === "Annat pris" && (
                          <label className="block max-w-sm">
                            <Label>
                              {"Annat pris (minst " +
                                money(minimumCustomPrice) +
                                ")"}
                            </Label>
                            <div className="relative">
                              <input
                                type="number"
                                min={minimumCustomPrice}
                                step={50}
                                value={customPrice}
                                onChange={(event) =>
                                  setCustomPrice(event.target.value)
                                }
                                placeholder={String(minimumCustomPrice)}
                                className="h-14 w-full rounded-2xl border border-stone-300 bg-white px-5 pr-14 text-lg font-semibold outline-none transition placeholder:text-stone-400 focus:border-stone-700"
                              />
                              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-stone-500">
                                kr
                              </span>
                            </div>
                          </label>
                        )}
                        <div>
                          <Label>Antal</Label>
                          <div className="inline-flex items-center gap-3 rounded-full bg-white p-2">
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(Math.max(0, quantity - 1))
                              }
                              className="h-9 w-9 rounded-full bg-stone-100 text-lg"
                            >
                              −
                            </button>
                            <span className="min-w-8 text-center font-semibold">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQuantity(quantity + 1)}
                              className="h-9 w-9 rounded-full bg-stone-900 text-lg text-white"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </Section>
                    {group === "Begravning" && (
                      <Section title="Meddelandealternativ">
                        <div className="flex flex-wrap gap-2">
                          {(
                            [
                              "Hälsningskort",
                              "Begravningsband",
                              "Inget meddelande",
                            ] as const
                          ).map((item) => (
                            <Chip
                              key={item}
                              active={funeralMessageOption === item}
                              onClick={() => setFuneralMessageOption(item)}
                            >
                              {funeralMessageOption === item ? "⭕ " : "○ "}
                              {item}
                            </Chip>
                          ))}
                        </div>
                        {funeralMessageOption === "Hälsningskort" && (
                          <div className="mt-4 space-y-4">
                            <CardChooser
                              value={funeralCardPrice}
                              onChange={setFuneralCardPrice}
                            />
                            <Select
                              label="Antal kort"
                              value={funeralCardQuantity}
                              onChange={setFuneralCardQuantity}
                              options={cardQuantityOptions}
                            />
                            <Textarea
                              label="Hälsningskort text"
                              value={cardText}
                              onChange={setCardText}
                              placeholder="Till ex.: Tack för alla fina minnen."
                            />
                          </div>
                        )}
                        {funeralMessageOption === "Begravningsband" && (
                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <Select
                              label="Band"
                              value={selectedBand}
                              onChange={setSelectedBand}
                              options={funeralBandOptions.map(
                                (item) => item.label,
                              )}
                            />
                            <Select
                              label="Bandfärg"
                              value={bandColor}
                              onChange={setBandColor}
                              options={bandColorOptions}
                            />
                            <Textarea
                              label="Bandtext vänster sida"
                              value={bandTextLeft}
                              onChange={setBandTextLeft}
                              placeholder="Tack för alla fina minnen"
                            />
                            <Textarea
                              label="Bandtext höger sida"
                              value={bandTextRight}
                              onChange={setBandTextRight}
                              placeholder="Familjen Andersson"
                            />
                          </div>
                        )}
                      </Section>
                    )}
                    {group !== "Begravning" && showCardFor(group, product) && (
                      <Section title="Hälsningskort">
                        <CardChooser
                          value={cardPrice}
                          onChange={setCardPrice}
                        />
                        <Select
                          label="Antal kort"
                          value={cardQuantity}
                          onChange={setCardQuantity}
                          options={cardQuantityOptions}
                        />
                        <div className="mt-4">
                          <Textarea
                            label="Hälsningskort text"
                            value={cardText}
                            onChange={setCardText}
                            placeholder="Till ex.: Hälsningar från Morbror Johan"
                          />
                        </div>
                      </Section>
                    )}
                    <Section title="Personliga önskemål">
                      <Textarea
                        label="Vad vill du att floristen ska tänka på?"
                        value={personalNote}
                        onChange={setPersonalNote}
                        placeholder={
                          "T.ex.\n• Gärna pioner om möjligt\n• Inga liljor på grund av allergi\n• Extra romantisk känsla"
                        }
                      />
                    </Section>
                    <Section title="Bifoga bild">
                      <ImageUploadBox
                        uploadedImageName={uploadedImageName}
                        previewUrl={uploadedImagePreview}
                        onChange={(file) => {
                          setUploadedImageName(file.name);
                          setUploadedImagePreview(URL.createObjectURL(file));
                        }}
                      />
                    </Section>
                    <Section title="Extra produkter">
                      <div className="grid gap-4 md:grid-cols-2">
                        {!shouldHideFuneralExtra(group, "Choklad") && (
                          <Select
                            label="Choklad"
                            value={chocolatePrice}
                            onChange={setChocolatePrice}
                            options={chocolateOptions}
                          />
                        )}
                        {!shouldHideFuneralExtra(group, "Ballong") && (
                          <Select
                            label="Ballong"
                            value={balloonPrice}
                            onChange={setBalloonPrice}
                            options={balloonOptions}
                          />
                        )}
                        {!shouldHideFuneralExtra(group, "Nalle") && (
                          <Select
                            label="Nalle"
                            value={teddyPrice}
                            onChange={setTeddyPrice}
                            options={teddyOptions}
                          />
                        )}
                        <Select
                          label="Vas"
                          value={vasePrice}
                          onChange={setVasePrice}
                          options={vaseOptions}
                        />
                        <Select
                          label="Kruka"
                          value={potPrice}
                          onChange={setPotPrice}
                          options={potOptions}
                        />
                        <CheckBox
                          checked={luxuryWrap}
                          onChange={setLuxuryWrap}
                          label="Lyxigare inslagning 90 kr"
                        />
                        <CheckBox
                          checked={pollenFree}
                          onChange={setPollenFree}
                          label="Pollenfri önskas"
                        />
                      </div>
                    </Section>
                    <div className="flex flex-col gap-3 rounded-[2rem] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm text-stone-500">
                          {group === "Rosor"
                            ? "Valda rosor just nu"
                            : "Vald produkt just nu"}
                        </p>
                        <p className="text-2xl font-semibold">
                          {money(currentTotalPreview)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addOrderItem}
                        className="rounded-2xl bg-stone-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-stone-800"
                      >
                        + Lägg till i beställning
                      </button>
                    </div>
                  </div>
                </div>
              </Panel>
            )}
            {activeStep === "payment" && (
              <Panel
                title="4. Betalning & Kvitto"
                description="Gästbeställningar betalas direkt med kort via Stripe."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Select
                    label="Betalningssätt *"
                    value={paymentMethod}
                    onChange={setPaymentMethod}
                    options={paymentMethods}
                  />
                  <Info>
                    PDF-kvitto med moms skickas direkt efter genomförd
                    betalning.
                  </Info>
                </div>
                <div className="mt-6">
                  <Info>
                    Kunden betalar produkt, tillval, hälsningskort, eventuell
                    begravningsband och eventuell leverans. Stripe-/kortavgift
                    visas inte separat för kunden.
                  </Info>
                </div>
                <button
                  type="button"
                  className="mt-6 rounded-2xl bg-stone-900 px-6 py-4 text-sm font-semibold text-white"
                >
                  Skicka beställning
                </button>
              </Panel>
            )}
          </section>
          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <div className="rounded-[2rem] bg-white p-5 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                Order
              </p>
              <h2 className="mt-2 text-xl font-semibold">Din beställning</h2>
              <div className="mt-5 space-y-3">
                {orderItems.length === 0 ? (
                  <p className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-500">
                    Inga produkter tillagda ännu.
                  </p>
                ) : (
                  orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-stone-100 bg-stone-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{item.product}</p>
                          <p className="text-xs text-stone-500">
                            {item.group} · {item.style}
                          </p>
                          <p className="text-xs text-stone-500">
                            {item.colors.join(" + ") || "Floristens val färg"}
                          </p>
                          <p className="text-xs text-stone-500">
                            {item.priceLabel} x {item.quantity}
                          </p>
                          {item.subscription && (
                            <p className="mt-1 text-xs text-stone-500">
                              Prenumeration: {item.subscription}
                            </p>
                          )}
                          {item.band && (
                            <p className="mt-1 text-xs text-stone-500">
                              Band: {item.band}
                            </p>
                          )}
                          {item.addons.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {item.addons.map((addon) => (
                                <p
                                  key={addon.label}
                                  className="text-xs text-stone-600"
                                >
                                  {addon.icon} {addon.label}:{" "}
                                  {money(addon.price)}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setOrderItems((items) =>
                              items.filter((x) => x.id !== item.id),
                            )
                          }
                          className="rounded-full p-2 text-red-600 hover:bg-white"
                          title="Ta bort"
                        >
                          🗑️
                        </button>
                      </div>
                      <p className="mt-3 text-right font-semibold">
                        {money(item.total)}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-6 space-y-3 border-t border-stone-100 pt-5 text-sm">
                <Summary label="Produkter" value={money(orderSubtotal)} />
                <Summary
                  label="Leverans"
                  value={isDelivery ? "Beräknas automatiskt" : "0 kr"}
                />
                <Summary
                  label="Totalt just nu"
                  value={money(orderSubtotal)}
                  strong
                />
              </div>
            </div>
            <div className="mt-4 rounded-[2rem] bg-stone-900 p-5 text-white shadow-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Din design hittills
              </p>
              <div className="mt-4 overflow-hidden rounded-2xl bg-white/10">
                <img
                  src={uploadedImagePreview || visualFor(product)}
                  alt="Din design"
                  className="h-36 w-full object-cover"
                />
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                {groups.find((x) => x.key === group)?.icon} {product}
              </h3>
              <p className="mt-2 text-sm text-white/70">{style}</p>
              <p className="mt-1 text-sm text-white/70">
                {selectedColors.length
                  ? selectedColors.join(" + ")
                  : "Ingen färg vald"}
              </p>
              {draftAddons.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {draftAddons.map((addon) => (
                    <span
                      key={addon.label}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs"
                    >
                      {addon.icon} {addon.label}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-4 text-2xl font-semibold">
                {money(currentTotalPreview)}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function StepButton({
  active,
  onClick,
  icon,
  title,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "mb-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition " +
        (active
          ? "bg-stone-900 text-white"
          : "bg-stone-50 text-stone-700 hover:bg-stone-100")
      }
    >
      <span>{icon}</span>
      <span>{title}</span>
    </button>
  );
}
function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-sm md:p-7">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[1.5rem] bg-stone-50 p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-stone-500">
        {title}
      </h3>
      {children}
    </div>
  );
}
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full border px-4 py-2 text-sm font-semibold transition " +
        (active
          ? "border-stone-900 bg-stone-900 text-white"
          : "border-stone-200 bg-white text-stone-700 hover:border-stone-400")
      }
    >
      {children}
    </button>
  );
}
function CardChooser({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {cardOptions.map((option) => (
        <Chip
          key={option}
          active={value === option}
          onClick={() => onChange(option)}
        >
          {value === option ? "⭕ " : "○ "}
          {option}
        </Chip>
      ))}
    </div>
  );
}
function ImageUploadBox({
  uploadedImageName,
  previewUrl,
  onChange,
}: {
  uploadedImageName: string;
  previewUrl: string;
  onChange: (file: File) => void;
}) {
  function handleFile(file?: File) {
    if (!file) return;
    onChange(file);
  }
  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        handleFile(event.dataTransfer.files?.[0]);
      }}
      className="rounded-2xl border-2 border-dashed border-stone-300 bg-white p-5 text-center"
    >
      <div className="text-3xl">☁️</div>
      <h3 className="mt-2 text-sm font-semibold">
        Dra & släpp bild här eller välj fil
      </h3>
      <p className="mt-1 text-xs text-stone-500">
        Bifoga bild på liknande arrangemang du önskar.
      </p>
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Förhandsvisning"
          className="mt-4 h-48 w-full rounded-2xl object-cover"
        />
      )}
      <label className="mt-4 inline-flex cursor-pointer rounded-full bg-stone-900 px-5 py-2 text-sm font-semibold text-white">
        Välj fil
        <input
          type="file"
          accept="image/*"
          onChange={(event) => handleFile(event.target.files?.[0])}
          className="hidden"
        />
      </label>
      {uploadedImageName && (
        <p className="mt-3 truncate text-xs font-medium text-stone-700">
          📎 {uploadedImageName}
        </p>
      )}
    </div>
  );
}
function Label({ children }: { children: ReactNode }) {
  return <span className="mb-2 block text-sm font-semibold">{children}</span>;
}
function Field({
  label,
  placeholder,
  type = "text",
  required = false,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <Label>
        {label}
        {required ? " *" : ""}
      </Label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition placeholder:text-stone-400 focus:border-stone-500"
      />
    </label>
  );
}
function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        readOnly
        value={value}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-100 px-4 text-stone-700 outline-none"
      />
    </label>
  );
}
function Textarea({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <textarea
        rows={4}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition placeholder:text-stone-400 focus:border-stone-500"
      />
    </label>
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
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
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
function CheckBox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm text-stone-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 accent-stone-900"
      />
      <span>{label}</span>
    </label>
  );
}
function Info({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
      {children}
    </div>
  );
}
function Summary({
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
        className={
          "text-right " + (strong ? "text-lg text-stone-950" : "text-stone-900")
        }
      >
        {value}
      </strong>
    </div>
  );
}
function choiceClass(active: boolean) {
  return (
    "rounded-2xl border px-5 py-4 text-left text-sm font-semibold transition " +
    (active
      ? "border-stone-900 bg-stone-900 text-white"
      : "border-stone-200 bg-white text-stone-700 hover:border-stone-400")
  );
}
