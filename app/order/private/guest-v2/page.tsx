"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CalendarDays,
  Check,
  Clock,
  CreditCard,
  Heart,
  Home,
  ImagePlus,
  Mail,
  MapPin,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  ShoppingBag,
  Trash2,
  UploadCloud,
  User,
} from "lucide-react";

const MINIMUM_ORDER_VALUE = 450;

const paymentMethods = ["Kortbetalning via Stripe"];
const deliveryMethods = ["Leverans", "Avhämtning"];
const cardOptions = ["Gratis kort", "35 kr", "75 kr"];

const orderTypes = [
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

const roseStyleOptions = ["Romantiskt", "Modernt", "Klassiskt"];
const roseLengthOptions = ["60 cm", "70 cm", "80 cm"];
const roseCountOptions = [
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

const bouquetPriceOptions = [
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

const standardPriceOptions = [
  "500 kr",
  "625 kr",
  "750 kr",
  "1.000 kr",
  "1.250 kr",
  "1.500 kr",
  "2.000 kr",
  "Annat pris",
];

const funeralCategoryOptions = [
  "Välj",
  "Krans",
  "Hjärta",
  "Stående dekoration",
  "Liggande dekoration",
  "Begravningsdekoration / Kistdekoration",
  "Bordsdekoration",
  "Entrédekoration",
  "Helhetsdekoration",
  "Stil / Önskemål",
];

const funeralPriceOptions: Record<string, string[]> = {
  Välj: ["Välj"],
  Krans: [
    "Krans cirka 35 cm - 3.000 kr",
    "Krans cirka 40 cm - 4.000 kr",
    "Krans cirka 50 cm - 4.500 kr",
    "Krans cirka 60 cm - 5.000 kr",
  ],
  Hjärta: [
    "Hjärta 35 cm - 3.500 kr",
    "Hjärta 40 cm - 4.700 kr",
    "Hjärta 45 cm - 5.500 kr",
  ],
  "Stående dekoration": [
    "Dekoration - 1.250 kr",
    "Dekoration - 1.500 kr",
    "Dekoration - 2.000 kr",
    "Dekoration - 2.500 kr",
  ],
  "Liggande dekoration": [
    "Dekoration - 1.250 kr",
    "Dekoration - 1.500 kr",
    "Dekoration - 2.000 kr",
    "Dekoration - 2.500 kr",
  ],
  "Begravningsdekoration / Kistdekoration": [
    "Dekoration - 3.000 kr",
    "Dekoration - 4.000 kr",
    "Dekoration - 5.000 kr",
    "Dekoration - 6.000 kr",
  ],
  Bordsdekoration: ["750 kr", "1.000 kr", "1.250 kr", "1.500 kr", "Annat pris"],
  Entrédekoration: ["1.250 kr", "2.000 kr", "3.000 kr", "Annat pris"],
  Helhetsdekoration: ["Annat pris"],
  "Stil / Önskemål": ["Annat pris"],
};

const funeralBandOptions = [
  "Välj",
  "Band 350 kr",
  "Band 500 kr - upp till 12 ord",
  "Band 700 kr - upp till 20 ord",
  "Band 900 kr - upp till 30 ord",
];

const bandColorOptions = [
  "Välj",
  "Vit",
  "Kräm",
  "Grönt",
  "Rosa",
  "Blått",
  "Gul",
  "Guld",
  "Rött",
];

const weddingCategoryOptions = [
  "Välj",
  "Brudbukett",
  "Tärnbukett",
  "Corsage",
  "Bordsbukett",
  "Bordsdekoration",
  "Entrédekoration",
  "Kyrkdekoration",
  "Vigselbåge",
];

const weddingPriceOptions: Record<string, string[]> = {
  Välj: ["Välj"],
  Brudbukett: ["2.000 kr", "2.500 kr", "3.000 kr", "4.000 kr", "Annat pris"],
  Tärnbukett: ["750 kr", "1.000 kr", "1.250 kr", "Annat pris"],
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
};

const eventCategoryOptions = [
  "Välj",
  "Bordsdekoration",
  "Scendekoration",
  "Bordsbukett",
  "Bordsdekoration i Oasis",
  "Mingelblommor i små vaser",
  "Entrédekoration",
  "Prisbukett",
  "Talarbukett",
];

const eventPriceOptions: Record<string, string[]> = {
  Välj: ["Välj"],
  Bordsdekoration: ["750 kr", "1.000 kr", "1.250 kr", "1.500 kr", "Annat pris"],
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
};

const companyFlowerCategoryOptions = [
  "Välj",
  "Veckobukett (Reception)",
  "Födelsedag / Årsdag",
  "Gratulationsbukett",
  "Mingelbuketter i små vaser",
  "Familjetillskott",
  "Bordsbukett",
  "VD-Bukett",
  "Bordsdekoration i Oasis",
];

const companyFlowerPriceOptions: Record<string, string[]> = {
  Välj: ["Välj"],
  "Veckobukett (Reception)": [
    "625 kr",
    "750 kr",
    "1.000 kr",
    "1.500 kr",
    "2.000 kr",
    "Bukett-Prenumeration",
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
  Familjetillskott: ["625 kr", "750 kr", "1.000 kr", "1.500 kr", "Annat pris"],
  Bordsbukett: ["650 kr", "750 kr", "1.000 kr", "1.250 kr", "Annat pris"],
  "VD-Bukett": ["1.000 kr", "1.500 kr", "2.000 kr", "3.000 kr", "Annat pris"],
  "Bordsdekoration i Oasis": ["650 kr", "1.000 kr", "1.500 kr", "Annat pris"],
};

const chocolateOptions = ["Välj", "125 kr", "200 kr", "300 kr"];
const balloonOptions = ["Välj", "125 kr", "250 kr"];
const teddyOptions = ["Välj", "250 kr", "500 kr"];
const vaseOptions = ["Välj", "149 kr", "299 kr", "499 kr", "699 kr"];
const potOptions = ["Välj", "200 kr", "400 kr", "600 kr", "950 kr"];

const subscriptionFrequencyOptions = [
  "Varje vecka",
  "Varannan vecka",
  "Varje månad",
];
const subscriptionBudgetOptions = [
  "500 kr",
  "625 kr",
  "750 kr",
  "1.000 kr",
  "1.250 kr",
  "1.500 kr",
  "2.000 kr",
  "Annat pris",
];

type OrderItem = {
  id: string;
  category: string;
  name: string;
  option: string;
  quantity: number;
  unitPrice: number;
  total: number;
  details?: string;
  isSubscription?: boolean;
};

function generateOrderNumber() {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(100000 + Math.random() * 900000);
  return "FSG-" + year + "-" + random;
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
  if (
    !value ||
    value === "Välj" ||
    value === "Gratis kort" ||
    value === "Bukett-Prenumeration"
  )
    return 0;
  const cleaned = value.replace(/[^0-9]/g, "");
  return Number(cleaned || 0);
}

function money(value: number) {
  return new Intl.NumberFormat("sv-SE").format(value) + " kr";
}

export default function PrivateGuestOrderPage() {
  const [orderNumber, setOrderNumber] = useState("Skapas när sidan laddas");
  const [createdAt, setCreatedAt] = useState("Skapas när sidan laddas");

  const [selectedOrderType, setSelectedOrderType] = useState("Bukett");
  const [selectedStyle, setSelectedStyle] = useState("Floristens val");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const [standardPrice, setStandardPrice] = useState("500 kr");
  const [standardCustomPrice, setStandardCustomPrice] = useState("");
  const [standardQuantity, setStandardQuantity] = useState(1);

  const [subscriptionFrequency, setSubscriptionFrequency] =
    useState("Varje vecka");
  const [subscriptionBudget, setSubscriptionBudget] = useState("750 kr");
  const [subscriptionCustomBudget, setSubscriptionCustomBudget] = useState("");

  const [roseLength, setRoseLength] = useState("70 cm");
  const [roseCount, setRoseCount] = useState("5");
  const [roseQuantity, setRoseQuantity] = useState(1);

  const [funeralCategory, setFuneralCategory] = useState("Välj");
  const [funeralPrice, setFuneralPrice] = useState("Välj");
  const [funeralCustomBudget, setFuneralCustomBudget] = useState("");
  const [funeralCount, setFuneralCount] = useState("1");
  const [selectedBand, setSelectedBand] = useState("Välj");
  const [bandColor, setBandColor] = useState("Välj");

  const [weddingCategory, setWeddingCategory] = useState("Välj");
  const [weddingPrice, setWeddingPrice] = useState("Välj");
  const [weddingCustomBudget, setWeddingCustomBudget] = useState("");
  const [weddingCount, setWeddingCount] = useState("1");
  const [weddingOtherText, setWeddingOtherText] = useState("");

  const [eventCategory, setEventCategory] = useState("Välj");
  const [eventPrice, setEventPrice] = useState("Välj");
  const [eventCustomBudget, setEventCustomBudget] = useState("");
  const [eventCount, setEventCount] = useState("1");
  const [eventDescription, setEventDescription] = useState("");

  const [companyFlowerCategory, setCompanyFlowerCategory] = useState("Välj");
  const [companyFlowerPrice, setCompanyFlowerPrice] = useState("Välj");
  const [companyFlowerCustomBudget, setCompanyFlowerCustomBudget] =
    useState("");
  const [companyFlowerCount, setCompanyFlowerCount] = useState("1");

  const [cardPrice, setCardPrice] = useState("35 kr");
  const [chocolatePrice, setChocolatePrice] = useState("Välj");
  const [balloonPrice, setBalloonPrice] = useState("Välj");
  const [teddyPrice, setTeddyPrice] = useState("Välj");
  const [vasePrice, setVasePrice] = useState("Välj");
  const [potPrice, setPotPrice] = useState("Välj");
  const [luxuryWrap, setLuxuryWrap] = useState(false);
  const [pollenFree, setPollenFree] = useState(false);

  const [deliveryMethod, setDeliveryMethod] = useState("Leverans");
  const [paymentMethod, setPaymentMethod] = useState(
    "Kortbetalning via Stripe",
  );

  const [deliveryFee] = useState(0);
  const [doorAllowed, setDoorAllowed] = useState(false);
  const [anonymousSender, setAnonymousSender] = useState(false);
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    setOrderNumber(generateOrderNumber());
    setCreatedAt(nowStamp());
  }, []);

  const isDelivery = deliveryMethod === "Leverans";
  const isPickup = deliveryMethod === "Avhämtning";
  const isRoseOrder = selectedOrderType === "Rosor";
  const isFuneralOrder = selectedOrderType === "Begravning";
  const isWeddingOrder = selectedOrderType === "Bröllop";
  const isEventOrder = selectedOrderType === "Event";
  const isCompanyFlowerOrder = selectedOrderType === "Företagsblommor";
  const isBouquetOrder = selectedOrderType === "Bukett";
  const isStandardBudgetOrder =
    selectedOrderType === "Växter" ||
    selectedOrderType === "Presentbox" ||
    selectedOrderType === "Egna önskemål";
  const isSubscriptionChoice =
    isBouquetOrder && standardPrice === "Bukett-Prenumeration";

  const activeStyleOptions = isRoseOrder ? roseStyleOptions : styleOptions;
  const orderCreatedText = useMemo(() => createdAt, [createdAt]);

  const roseProductPrice = rosePrices[roseLength]?.[roseCount] || 0;

  const standardProductPrice =
    standardPrice === "Annat pris"
      ? priceToNumber(standardCustomPrice)
      : standardPrice === "Bukett-Prenumeration"
        ? subscriptionBudget === "Annat pris"
          ? priceToNumber(subscriptionCustomBudget)
          : priceToNumber(subscriptionBudget)
        : priceToNumber(standardPrice);

  const funeralProductPrice =
    funeralPrice === "Annat pris"
      ? priceToNumber(funeralCustomBudget)
      : priceToNumber(funeralPrice);
  const weddingProductPrice =
    weddingPrice === "Annat pris"
      ? priceToNumber(weddingCustomBudget)
      : priceToNumber(weddingPrice);
  const eventProductPrice =
    eventPrice === "Annat pris"
      ? priceToNumber(eventCustomBudget)
      : priceToNumber(eventPrice);
  const companyFlowerProductPrice =
    companyFlowerPrice === "Annat pris"
      ? priceToNumber(companyFlowerCustomBudget)
      : priceToNumber(companyFlowerPrice);

  const draftProductSubtotal = isRoseOrder
    ? roseProductPrice * Math.max(1, roseQuantity)
    : isFuneralOrder
      ? funeralProductPrice * Math.max(1, Number(funeralCount || 1))
      : isWeddingOrder
        ? weddingProductPrice * Math.max(1, Number(weddingCount || 1))
        : isEventOrder
          ? eventProductPrice * Math.max(1, Number(eventCount || 1))
          : isCompanyFlowerOrder
            ? companyFlowerProductPrice *
              Math.max(1, Number(companyFlowerCount || 1))
            : standardProductPrice * Math.max(1, standardQuantity);

  const productSubtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  const bandTotal = isFuneralOrder ? priceToNumber(selectedBand) : 0;
  const cardTotal = priceToNumber(cardPrice);
  const deliveryTotal = isDelivery ? deliveryFee : 0;

  const extrasTotal =
    priceToNumber(chocolatePrice) +
    priceToNumber(balloonPrice) +
    priceToNumber(teddyPrice) +
    priceToNumber(vasePrice) +
    priceToNumber(potPrice) +
    (luxuryWrap ? 90 : 0);

  const orderTotal =
    productSubtotal + extrasTotal + bandTotal + cardTotal + deliveryTotal;
  const isBelowMinimum = productSubtotal < MINIMUM_ORDER_VALUE;
  const hasSubscription = orderItems.some((item) => item.isSubscription);

  function handleOrderTypeChange(type: string) {
    setSelectedOrderType(type);
    setSelectedStyle(
      type === "Rosor"
        ? "Romantiskt"
        : type === "Begravning"
          ? "Sorg"
          : "Floristens val",
    );
  }

  function handleFuneralCategoryChange(value: string) {
    setFuneralCategory(value);
    setFuneralPrice(funeralPriceOptions[value]?.[0] || "Välj");
  }

  function handleWeddingCategoryChange(value: string) {
    setWeddingCategory(value);
    setWeddingPrice(weddingPriceOptions[value]?.[0] || "Välj");
  }

  function handleEventCategoryChange(value: string) {
    setEventCategory(value);
    setEventPrice(eventPriceOptions[value]?.[0] || "Välj");
  }

  function handleCompanyFlowerCategoryChange(value: string) {
    setCompanyFlowerCategory(value);
    setCompanyFlowerPrice(companyFlowerPriceOptions[value]?.[0] || "Välj");
  }

  function addOrderItem() {
    if (
      draftProductSubtotal < MINIMUM_ORDER_VALUE &&
      !isRoseOrder &&
      !isWeddingOrder &&
      !isEventOrder &&
      !isFuneralOrder &&
      !isCompanyFlowerOrder
    ) {
      setSubmitMessage(
        "Minsta produktvärde är " +
          MINIMUM_ORDER_VALUE +
          " kr. Välj ett högre pris innan du lägger till produkten.",
      );
      return;
    }

    if (isRoseOrder) {
      addItem({
        category: "Rosor",
        name: "Rosor",
        option: roseCount + " st, " + roseLength,
        quantity: Math.max(1, roseQuantity),
        unitPrice: roseProductPrice,
        details: selectedStyle,
      });
      return;
    }

    if (isFuneralOrder) {
      if (funeralCategory === "Välj" || funeralPrice === "Välj")
        return setSubmitMessage("Välj typ och pris för begravningsblommor.");
      addItem({
        category: "Begravning",
        name: funeralCategory,
        option: funeralPrice,
        quantity: Math.max(1, Number(funeralCount || 1)),
        unitPrice: funeralProductPrice,
        details: selectedStyle,
      });
      return;
    }

    if (isWeddingOrder) {
      if (weddingCategory === "Välj" || weddingPrice === "Välj")
        return setSubmitMessage("Välj typ och pris för bröllopsblommor.");
      addItem({
        category: "Bröllop",
        name: weddingCategory,
        option: weddingPrice,
        quantity: Math.max(1, Number(weddingCount || 1)),
        unitPrice: weddingProductPrice,
        details: weddingOtherText || selectedStyle,
      });
      return;
    }

    if (isEventOrder) {
      if (eventCategory === "Välj" || eventPrice === "Välj")
        return setSubmitMessage("Välj typ och pris för eventblommor.");
      addItem({
        category: "Event",
        name: eventCategory,
        option: eventPrice,
        quantity: Math.max(1, Number(eventCount || 1)),
        unitPrice: eventProductPrice,
        details: eventDescription || selectedStyle,
      });
      return;
    }

    if (isCompanyFlowerOrder) {
      if (companyFlowerCategory === "Välj" || companyFlowerPrice === "Välj")
        return setSubmitMessage("Välj typ och pris för företagsblommor.");
      addItem({
        category: "Företagsblommor",
        name: companyFlowerCategory,
        option: companyFlowerPrice,
        quantity: Math.max(1, Number(companyFlowerCount || 1)),
        unitPrice: companyFlowerProductPrice,
        details: selectedStyle,
      });
      return;
    }

    if (isSubscriptionChoice) {
      addItem({
        category: "Bukett",
        name: "Bukett-Prenumeration",
        option:
          subscriptionBudget === "Annat pris"
            ? subscriptionCustomBudget + " kr"
            : subscriptionBudget,
        quantity: 1,
        unitPrice: standardProductPrice,
        details:
          subscriptionFrequency +
          ". Återkommande betalning via Stripe. Kan pausas av admin. Ingen debitering eller leverans under paus.",
        isSubscription: true,
      });
      return;
    }

    addItem({
      category: selectedOrderType,
      name: selectedOrderType,
      option:
        standardPrice === "Annat pris"
          ? standardCustomPrice + " kr"
          : standardPrice,
      quantity: Math.max(1, standardQuantity),
      unitPrice: standardProductPrice,
      details: selectedStyle,
    });
  }

  function addItem(item: Omit<OrderItem, "id" | "total">) {
    const newItem: OrderItem = {
      ...item,
      id: String(Date.now()) + "-" + Math.random().toString(16).slice(2),
      total: item.unitPrice * item.quantity,
    };
    setOrderItems((current) => [...current, newItem]);
    setSubmitMessage("Produkten har lagts till i beställningen.");
  }

  function removeOrderItem(id: string) {
    setOrderItems((current) => current.filter((item) => item.id !== id));
  }

  function updateItemQuantity(id: string, nextQuantity: number) {
    setOrderItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const quantity = Math.max(1, nextQuantity);
        return { ...item, quantity, total: item.unitPrice * quantity };
      }),
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (orderItems.length === 0) {
      setSubmitMessage(
        "Lägg till minst en produkt i beställningen innan du skickar ordern.",
      );
      return;
    }

    if (isBelowMinimum) {
      setSubmitMessage(
        "Minsta ordervärde är " +
          MINIMUM_ORDER_VALUE +
          " kr exklusive leverans och tillval. Lägg till minst 450 kr i produktvärde.",
      );
      return;
    }

    setSubmitMessage(
      "Gästbeställning " +
        orderNumber +
        " skapad. Kunden betalar " +
        orderTotal +
        " kr via Stripe. PDF-kvitto med moms skickas efter genomförd betalning.",
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
              <Heart size={16} /> FloristSocial privat gästbeställning
            </div>

            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Beställ blommor som privat gästkund.
            </h1>

            <p className="mt-5 text-lg leading-8 text-stone-600">
              Kunden kan beställa snabbt utan konto. Ordern sparas i
              FloristSocials orderhistorik.
            </p>

            <p className="mt-3 text-base leading-7 text-stone-600">
              Minsta produktvärde är <strong>450 kr</strong>. Betalning sker med
              kort via Stripe.
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
                  title="1. Beställare"
                  description="Dessa uppgifter behövs för orderbekräftelse, betalning och kontakt vid frågor."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <ReadOnlyField label="Ordernummer" value={orderNumber} />
                  <ReadOnlyField
                    label="Skapad"
                    value={orderCreatedText}
                    icon={<Clock size={18} />}
                  />

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
                    name="buyerEmail"
                    label="Beställarens e-post"
                    placeholder="namn@email.se"
                    type="email"
                    icon={<Mail size={18} />}
                  />
                </div>
              </Card>

              <Card>
                <SectionHeader
                  icon={<MapPin size={20} />}
                  title="2. Mottagare, Leveransform, Leveransdatum"
                  description="Vid avhämtning behövs mottagarens namn, telefonnummer, datum och tid. Vid leverans behövs även adress."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    required
                    name="recipientFirstName"
                    label="Mottagarens förnamn"
                    placeholder="Förnamn"
                    icon={<User size={18} />}
                  />
                  <Field
                    required
                    name="recipientLastName"
                    label="Mottagarens efternamn"
                    placeholder="Efternamn"
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
                </div>

                <div className="mt-6">
                  <span className="mb-3 block text-sm font-semibold">
                    Leveransmetod <Required />
                  </span>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {deliveryMethods.map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setDeliveryMethod(method)}
                        className={
                          "rounded-2xl border px-5 py-4 text-left text-sm font-semibold transition " +
                          (deliveryMethod === method
                            ? "border-stone-900 bg-stone-900 text-white"
                            : "border-stone-200 bg-white text-stone-700 hover:border-stone-400")
                        }
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Field
                    required
                    name="deliveryDate"
                    label={isPickup ? "Avhämtningsdatum" : "Leveransdatum"}
                    placeholder="YYYY-MM-DD"
                    type="date"
                    icon={<CalendarDays size={18} />}
                  />
                  <Field
                    required={isPickup}
                    name="deliveryTime"
                    label={isPickup ? "Avhämtningstid" : "Leveranstid"}
                    placeholder={isPickup ? "HH:MM" : "Valfritt"}
                    type="time"
                    icon={<Clock size={18} />}
                  />
                </div>

                {isDelivery && (
                  <>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
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
                        label="Mottagarens gatuadress och husnummer"
                        placeholder="Gatuadress och husnummer"
                        icon={<Home size={18} />}
                      />
                      <Field
                        required
                        name="recipientPostalCode"
                        label="Mottagarens postnummer"
                        placeholder="Ex. 113 50"
                      />
                      <Field
                        required
                        name="recipientCity"
                        label="Mottagarens ort"
                        placeholder="Ex. Stockholm"
                      />
                      <Field
                        name="doorCode"
                        label="Portkod"
                        placeholder="Ex. 1234"
                      />
                      <Field
                        name="floor"
                        label="Våning"
                        placeholder="Ex. 3 tr"
                      />
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
                          onChange={(event) =>
                            setDoorAllowed(event.target.checked)
                          }
                          className="mt-1 h-4 w-4 accent-stone-900"
                        />
                        <span>Kan hängas på dörren</span>
                      </label>

                      <label className="flex items-start gap-3 rounded-2xl bg-stone-50 p-4 text-sm text-stone-700">
                        <input
                          type="checkbox"
                          checked={anonymousSender}
                          onChange={(event) =>
                            setAnonymousSender(event.target.checked)
                          }
                          className="mt-1 h-4 w-4 accent-stone-900"
                        />
                        <span>Anonym avsändare</span>
                      </label>
                    </div>

                    <Textarea
                      name="deliveryInstructions"
                      label="Leveransinstruktioner"
                      placeholder="Portinformation, mottagning, ring före leverans, lämnas hos granne, osv."
                    />

                    <div className="mt-6 rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-stone-600">
                      <strong>Leveransavgift:</strong> Om ingen butik/florist är
                      vald beräknas avståndet från Stockholm centrum till
                      mottagarens adress. Om butik/florist väljs senare beräknas
                      avståndet från vald butik till mottagaren.
                    </div>
                  </>
                )}
              </Card>

              <Card>
                <SectionHeader
                  icon={<ShoppingBag size={20} />}
                  title="3. Beställningen"
                  description="Välj kategori, lägg till produkter och bygg en inköpslista i samma order."
                />

                <div>
                  <h3 className="mb-3 font-semibold">
                    Jag önskar beställa <Required />
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {orderTypes.map((type) => (
                      <PillButton
                        key={type}
                        active={selectedOrderType === type}
                        onClick={() => handleOrderTypeChange(type)}
                      >
                        {type}
                      </PillButton>
                    ))}
                  </div>
                </div>

                <ProductBuilderPanel
                  selectedOrderType={selectedOrderType}
                  selectedStyle={selectedStyle}
                  activeStyleOptions={activeStyleOptions}
                  setSelectedStyle={setSelectedStyle}
                  isRoseOrder={isRoseOrder}
                  isFuneralOrder={isFuneralOrder}
                  isWeddingOrder={isWeddingOrder}
                  isEventOrder={isEventOrder}
                  isCompanyFlowerOrder={isCompanyFlowerOrder}
                  isBouquetOrder={isBouquetOrder}
                  isStandardBudgetOrder={isStandardBudgetOrder}
                  standardPrice={standardPrice}
                  setStandardPrice={setStandardPrice}
                  standardCustomPrice={standardCustomPrice}
                  setStandardCustomPrice={setStandardCustomPrice}
                  standardQuantity={standardQuantity}
                  setStandardQuantity={setStandardQuantity}
                  subscriptionFrequency={subscriptionFrequency}
                  setSubscriptionFrequency={setSubscriptionFrequency}
                  subscriptionBudget={subscriptionBudget}
                  setSubscriptionBudget={setSubscriptionBudget}
                  subscriptionCustomBudget={subscriptionCustomBudget}
                  setSubscriptionCustomBudget={setSubscriptionCustomBudget}
                  roseLength={roseLength}
                  setRoseLength={setRoseLength}
                  roseCount={roseCount}
                  setRoseCount={setRoseCount}
                  roseQuantity={roseQuantity}
                  setRoseQuantity={setRoseQuantity}
                  roseProductPrice={roseProductPrice}
                  funeralCategory={funeralCategory}
                  funeralPrice={funeralPrice}
                  funeralCustomBudget={funeralCustomBudget}
                  setFuneralCustomBudget={setFuneralCustomBudget}
                  funeralCount={funeralCount}
                  setFuneralCount={setFuneralCount}
                  selectedBand={selectedBand}
                  setSelectedBand={setSelectedBand}
                  bandColor={bandColor}
                  setBandColor={setBandColor}
                  handleFuneralCategoryChange={handleFuneralCategoryChange}
                  setFuneralPrice={setFuneralPrice}
                  weddingCategory={weddingCategory}
                  weddingPrice={weddingPrice}
                  weddingCustomBudget={weddingCustomBudget}
                  setWeddingCustomBudget={setWeddingCustomBudget}
                  weddingCount={weddingCount}
                  setWeddingCount={setWeddingCount}
                  weddingOtherText={weddingOtherText}
                  setWeddingOtherText={setWeddingOtherText}
                  handleWeddingCategoryChange={handleWeddingCategoryChange}
                  setWeddingPrice={setWeddingPrice}
                  eventCategory={eventCategory}
                  eventPrice={eventPrice}
                  eventCustomBudget={eventCustomBudget}
                  setEventCustomBudget={setEventCustomBudget}
                  eventCount={eventCount}
                  setEventCount={setEventCount}
                  eventDescription={eventDescription}
                  setEventDescription={setEventDescription}
                  handleEventCategoryChange={handleEventCategoryChange}
                  setEventPrice={setEventPrice}
                  companyFlowerCategory={companyFlowerCategory}
                  companyFlowerPrice={companyFlowerPrice}
                  companyFlowerCustomBudget={companyFlowerCustomBudget}
                  setCompanyFlowerCustomBudget={setCompanyFlowerCustomBudget}
                  companyFlowerCount={companyFlowerCount}
                  setCompanyFlowerCount={setCompanyFlowerCount}
                  handleCompanyFlowerCategoryChange={
                    handleCompanyFlowerCategoryChange
                  }
                  setCompanyFlowerPrice={setCompanyFlowerPrice}
                  draftProductSubtotal={draftProductSubtotal}
                  addOrderItem={addOrderItem}
                />

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <SelectField
                    required
                    name="cardPrice"
                    label="Hälsningskort"
                    options={cardOptions}
                    value={cardPrice}
                    onChange={setCardPrice}
                  />
                </div>

                {isBelowMinimum && orderItems.length > 0 && (
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
                    placeholder="Till ex.: färgglad, vita rosor, säsongens blommor ..."
                  />
                </div>

                <div className="mt-6">
                  <ImageUploadBox
                    uploadedImageName={uploadedImageName}
                    onChange={setUploadedImageName}
                  />
                </div>

                <div className="mt-8 rounded-2xl bg-stone-50 p-5">
                  <h3 className="font-semibold">Extra produkter</h3>
                  <p className="mt-1 text-sm text-stone-600">
                    Kunden kan välja ett pris per kategori.
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <SelectField
                      label="Choklad"
                      options={chocolateOptions}
                      value={chocolatePrice}
                      onChange={setChocolatePrice}
                    />
                    <SelectField
                      label="Ballong"
                      options={balloonOptions}
                      value={balloonPrice}
                      onChange={setBalloonPrice}
                    />
                    <SelectField
                      label="Nalle"
                      options={teddyOptions}
                      value={teddyPrice}
                      onChange={setTeddyPrice}
                    />
                    <SelectField
                      label="Vas"
                      options={vaseOptions}
                      value={vasePrice}
                      onChange={setVasePrice}
                    />
                    <SelectField
                      label="Kruka"
                      options={potOptions}
                      value={potPrice}
                      onChange={setPotPrice}
                    />

                    <label className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm text-stone-700">
                      <input
                        type="checkbox"
                        checked={luxuryWrap}
                        onChange={(event) =>
                          setLuxuryWrap(event.target.checked)
                        }
                        className="mt-1 h-4 w-4 accent-stone-900"
                      />
                      <span>Lyxigare inslagning 90 kr</span>
                    </label>

                    <label className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm text-stone-700">
                      <input
                        type="checkbox"
                        checked={pollenFree}
                        onChange={(event) =>
                          setPollenFree(event.target.checked)
                        }
                        className="mt-1 h-4 w-4 accent-stone-900"
                      />
                      <span>Pollenfri önskas</span>
                    </label>
                  </div>
                </div>
              </Card>

              <Card>
                <SectionHeader
                  icon={<CreditCard size={20} />}
                  title="4. Betalning & Kvitto"
                  description="Gästbeställningar betalas direkt med kort via Stripe."
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
                    PDF-kvitto med moms skickas direkt efter genomförd
                    betalning.
                  </div>
                </div>

                {hasSubscription && (
                  <div className="mt-6 rounded-2xl bg-pink-50 p-4 text-sm leading-6 text-pink-900">
                    <strong>Bukett-Prenumeration:</strong> Kunden godkänner
                    återkommande betalning via Stripe. Prenumerationen löper
                    tills den avslutas. Makalösa Blommor kan pausa
                    prenumerationen via admin. Under paus sker ingen leverans
                    och ingen debitering.
                  </div>
                )}

                <div className="mt-6 rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-stone-600">
                  Kunden betalar produkt, tillval, hälsningskort, eventuell
                  begravningsband och eventuell leverans. Stripe-/kortavgift
                  visas inte separat för kunden.
                </div>
              </Card>
            </div>

            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <div className="rounded-3xl bg-white p-6 shadow-xl">
                <h2 className="text-xl font-semibold">Sammanfattning</h2>

                <div className="mt-5 space-y-4 text-sm text-stone-700">
                  <SummaryRow label="Ordernummer" value={orderNumber} />
                  <SummaryRow label="Kundtyp" value="Gästbeställning" />
                  <SummaryRow label="Leveransmetod" value={deliveryMethod} />
                  <SummaryRow label="Betalningssätt" value={paymentMethod} />
                </div>

                <div className="mt-6 border-t border-stone-100 pt-5">
                  <h3 className="font-semibold">Produkter i beställningen</h3>
                  {orderItems.length === 0 ? (
                    <p className="mt-3 rounded-2xl bg-stone-50 p-4 text-sm text-stone-600">
                      Inga produkter tillagda ännu.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {orderItems.map((item) => (
                        <OrderItemRow
                          key={item.id}
                          item={item}
                          onRemove={removeOrderItem}
                          onQuantityChange={updateItemQuantity}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-4 text-sm text-stone-700">
                  <SummaryRow
                    label="Produktvärde"
                    value={money(productSubtotal)}
                  />
                  <SummaryRow
                    label="Extra produkter"
                    value={money(extrasTotal)}
                  />
                  <SummaryRow label="Band" value={money(bandTotal)} />
                  <SummaryRow label="Hälsningskort" value={money(cardTotal)} />
                  <SummaryRow
                    label="Leverans"
                    value={isDelivery ? "Beräknas automatiskt" : "0 kr"}
                  />
                  <SummaryRow
                    label="Totalt just nu"
                    value={money(orderTotal)}
                    strong
                  />
                </div>

                <div className="mt-6 rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-stone-600">
                  Leveransavgiften kopplas senare till vald florist/butik och
                  mottagarens adress. Om ingen butik är vald används Stockholm
                  centrum som utgångspunkt.
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

function ProductBuilderPanel(props: any) {
  return (
    <div className="mt-8 rounded-3xl bg-stone-50 p-5">
      {props.isBouquetOrder && (
        <div>
          <h3 className="font-semibold">Bukett</h3>
          <p className="mt-1 text-sm text-stone-600">
            Inga bukettnamn. Kunden väljer pris och antal.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <SelectField
              label="Budget / Välj pris"
              options={bouquetPriceOptions}
              value={props.standardPrice}
              onChange={props.setStandardPrice}
            />
            {props.standardPrice === "Annat pris" && (
              <ControlledInput
                label="Annat pris"
                value={props.standardCustomPrice}
                onChange={props.setStandardCustomPrice}
                placeholder="Minst 450 kr"
              />
            )}
            {props.standardPrice !== "Bukett-Prenumeration" && (
              <NumberInput
                label="Antal"
                value={props.standardQuantity}
                onChange={props.setStandardQuantity}
              />
            )}
          </div>

          {props.standardPrice === "Bukett-Prenumeration" && (
            <div className="mt-5 rounded-2xl bg-white p-5">
              <h4 className="font-semibold">Bukett-Prenumeration</h4>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Privatkund får en ny bukett enligt valt intervall. Betalningen
                registreras som återkommande via Stripe tills prenumerationen
                avslutas. Prenumerationen kan pausas av admin. Ingen leverans
                eller debitering sker under paus.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <SelectField
                  label="Leveransintervall"
                  options={subscriptionFrequencyOptions}
                  value={props.subscriptionFrequency}
                  onChange={props.setSubscriptionFrequency}
                />
                <SelectField
                  label="Budget per leverans"
                  options={subscriptionBudgetOptions}
                  value={props.subscriptionBudget}
                  onChange={props.setSubscriptionBudget}
                />
                {props.subscriptionBudget === "Annat pris" && (
                  <ControlledInput
                    label="Annat pris"
                    value={props.subscriptionCustomBudget}
                    onChange={props.setSubscriptionCustomBudget}
                    placeholder="Minst 450 kr"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {props.isRoseOrder && (
        <div>
          <h3 className="font-semibold">Rosor</h3>
          <p className="mt-1 text-sm text-stone-600">
            Välj längd och antal. Priset räknas automatiskt enligt
            FloristSocials prislista.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <SelectField
              label="Längd på rosor"
              options={roseLengthOptions}
              value={props.roseLength}
              onChange={props.setRoseLength}
            />
            <SelectField
              label="Antal rosor"
              options={roseCountOptions}
              value={props.roseCount}
              onChange={props.setRoseCount}
            />
            <NumberInput
              label="Antal paket"
              value={props.roseQuantity}
              onChange={props.setRoseQuantity}
            />
          </div>
          <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-semibold text-stone-800">
            Pris för valda rosor: {money(props.roseProductPrice)}
          </div>
        </div>
      )}

      {props.isFuneralOrder && (
        <div>
          <h3 className="font-semibold">Begravningsblommor</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <SelectField
              label="Välj typ"
              options={funeralCategoryOptions}
              value={props.funeralCategory}
              onChange={props.handleFuneralCategoryChange}
            />
            <SelectField
              label="Välj pris"
              options={funeralPriceOptions[props.funeralCategory] || ["Välj"]}
              value={props.funeralPrice}
              onChange={props.setFuneralPrice}
            />
            {props.funeralPrice === "Annat pris" && (
              <ControlledInput
                label="Budget"
                value={props.funeralCustomBudget}
                onChange={props.setFuneralCustomBudget}
                placeholder="Minst 450 kr"
              />
            )}
            <ControlledInput
              label="Antal"
              value={props.funeralCount}
              onChange={props.setFuneralCount}
              placeholder="Ex. 1"
            />
            <SelectField
              label="Band"
              options={funeralBandOptions}
              value={props.selectedBand}
              onChange={props.setSelectedBand}
            />
            <SelectField
              label="Bandfärg"
              options={bandColorOptions}
              value={props.bandColor}
              onChange={props.setBandColor}
            />
          </div>
          {props.selectedBand !== "Välj" && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Textarea
                name="ribbonTextLeft"
                label="Bandtext vänster sida"
                placeholder="Tack för alla fina minnen"
              />
              <Textarea
                name="ribbonTextRight"
                label="Bandtext höger sida"
                placeholder="Familjen Andersson"
              />
            </div>
          )}
        </div>
      )}

      {props.isWeddingOrder && (
        <div>
          <h3 className="font-semibold">Bröllopsblommor</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <SelectField
              label="Välj typ"
              options={weddingCategoryOptions}
              value={props.weddingCategory}
              onChange={props.handleWeddingCategoryChange}
            />
            <SelectField
              label="Välj pris"
              options={weddingPriceOptions[props.weddingCategory] || ["Välj"]}
              value={props.weddingPrice}
              onChange={props.setWeddingPrice}
            />
            {props.weddingPrice === "Annat pris" && (
              <ControlledInput
                label="Budget"
                value={props.weddingCustomBudget}
                onChange={props.setWeddingCustomBudget}
                placeholder="Minst 450 kr"
              />
            )}
            <ControlledInput
              label="Antal"
              value={props.weddingCount}
              onChange={props.setWeddingCount}
              placeholder="Ex. 4"
            />
          </div>
          <div className="mt-4">
            <Textarea
              name="weddingOtherText"
              label="Önskemål"
              placeholder="Beskriv färg, stil, plats och andra önskemål."
            />
          </div>
        </div>
      )}

      {props.isEventOrder && (
        <div>
          <h3 className="font-semibold">Eventblommor</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <SelectField
              label="Välj typ"
              options={eventCategoryOptions}
              value={props.eventCategory}
              onChange={props.handleEventCategoryChange}
            />
            <SelectField
              label="Välj pris"
              options={eventPriceOptions[props.eventCategory] || ["Välj"]}
              value={props.eventPrice}
              onChange={props.setEventPrice}
            />
            {props.eventPrice === "Annat pris" && (
              <ControlledInput
                label="Budget"
                value={props.eventCustomBudget}
                onChange={props.setEventCustomBudget}
                placeholder="Minst 450 kr"
              />
            )}
            <ControlledInput
              label="Antal"
              value={props.eventCount}
              onChange={props.setEventCount}
              placeholder="Ex. 10"
            />
          </div>
          <div className="mt-4">
            <Textarea
              name="eventDescription"
              label="Beskrivning och önskemål"
              placeholder="Beskriv eventet, färger, plats och andra önskemål."
            />
          </div>
        </div>
      )}

      {props.isCompanyFlowerOrder && (
        <div>
          <h3 className="font-semibold">Företagsblommor</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <SelectField
              label="Välj typ"
              options={companyFlowerCategoryOptions}
              value={props.companyFlowerCategory}
              onChange={props.handleCompanyFlowerCategoryChange}
            />
            <SelectField
              label="Välj pris"
              options={
                companyFlowerPriceOptions[props.companyFlowerCategory] || [
                  "Välj",
                ]
              }
              value={props.companyFlowerPrice}
              onChange={props.setCompanyFlowerPrice}
            />
            {props.companyFlowerPrice === "Annat pris" && (
              <ControlledInput
                label="Budget"
                value={props.companyFlowerCustomBudget}
                onChange={props.setCompanyFlowerCustomBudget}
                placeholder="Minst 450 kr"
              />
            )}
            <ControlledInput
              label="Antal"
              value={props.companyFlowerCount}
              onChange={props.setCompanyFlowerCount}
              placeholder="Ex. 5"
            />
          </div>
        </div>
      )}

      {props.isStandardBudgetOrder && (
        <div>
          <h3 className="font-semibold">{props.selectedOrderType}</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <SelectField
              label="Budget / Välj pris"
              options={standardPriceOptions}
              value={props.standardPrice}
              onChange={props.setStandardPrice}
            />
            {props.standardPrice === "Annat pris" && (
              <ControlledInput
                label="Annat pris"
                value={props.standardCustomPrice}
                onChange={props.setStandardCustomPrice}
                placeholder="Minst 450 kr"
              />
            )}
            <NumberInput
              label="Antal"
              value={props.standardQuantity}
              onChange={props.setStandardQuantity}
            />
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="mb-3 font-semibold">Stil / önskemål</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {props.activeStyleOptions.map((style: string) => (
            <PillButton
              key={style}
              active={props.selectedStyle === style}
              onClick={() => props.setSelectedStyle(style)}
              variant="pink"
            >
              {style}
            </PillButton>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-stone-500">Vald produkt just nu</p>
          <p className="font-semibold">{money(props.draftProductSubtotal)}</p>
        </div>
        <Button onClick={props.addOrderItem}>
          <Plus size={16} /> Lägg till i beställning
        </Button>
      </div>
    </div>
  );
}

function OrderItemRow({
  item,
  onRemove,
  onQuantityChange,
}: {
  item: OrderItem;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-stone-100 bg-stone-50 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-stone-900">{item.name}</p>
          <p className="text-xs text-stone-500">
            {item.category} · {item.option}
          </p>
          {item.details && (
            <p className="mt-1 text-xs text-stone-500">{item.details}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="rounded-full p-2 text-stone-400 hover:bg-white hover:text-red-600"
        >
          <Trash2 size={15} />
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            className="rounded-full bg-white p-1 text-stone-600"
          >
            <Minus size={14} />
          </button>
          <span className="min-w-8 text-center text-sm font-semibold">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            className="rounded-full bg-white p-1 text-stone-600"
          >
            <Plus size={14} />
          </button>
        </div>
        <strong>{money(item.total)}</strong>
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
  type?: "text" | "email" | "tel" | "date" | "time";
  required?: boolean;
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
          className={
            "h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition placeholder:text-stone-400 focus:border-stone-500 " +
            (icon ? "pl-12" : "")
          }
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
          className={
            "h-12 w-full rounded-2xl border border-stone-200 bg-stone-100 px-4 text-stone-700 outline-none " +
            (icon ? "pl-12" : "")
          }
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

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input
        type="number"
        min={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 outline-none transition focus:border-stone-500"
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
      className={
        "w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium transition " +
        (active ? activeClass : inactiveClass)
      }
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
        className={
          "text-right " + (strong ? "text-lg text-stone-950" : "text-stone-900")
        }
      >
        {value}
      </strong>
    </div>
  );
}
