"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CreditCard,
  Flower2,
  ImagePlus,
  Info,
  Mail,
  MapPin,
  Package,
  Send,
  Store,
  Truck,
  UserRound,
} from "lucide-react";

const arrangementTypes = [
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

const styleOptions = [
  "Romantiskt",
  "Modernt",
  "Klassiskt",
  "Sorg",
  "Lyxigt",
  "Färgstarkt",
  "Säsongsbaserat",
  "Pollenfri",
  "Floristens val",
];

const productPriceOptions = [
  400, 500, 625, 750, 875, 1000, 1250, 1500, 1750, 2000, 2500, 3000, 4000, 5000,
  6000, 7000, 8000,
];
const greetingCardPriceOptions = [35, 50, 65, 75];
const ribbonPriceOptions = [350, 500];
const chocolatePriceOptions = [50, 100, 150, 200, 250];
const vasePriceOptions = [350, 650, 850];

const extraProducts = [
  { id: "teddy", label: "Nalle", price: 120 },
  { id: "balloon", label: "Ballong", price: 75 },
  { id: "extra-card", label: "Extra kort", price: 35 },
  { id: "luxury-wrap", label: "Lyxigare inslagning", price: 90 },
];

const inputStyle = {
  height: 50,
  borderRadius: 16,
  border: "1px solid #e7e2dc",
  background: "white",
  padding: "0 15px",
  fontSize: 14,
  outline: "none",
};

const textareaStyle = {
  minHeight: 110,
  borderRadius: 18,
  border: "1px solid #e7e2dc",
  background: "white",
  padding: 15,
  fontSize: 14,
  resize: "vertical" as const,
  outline: "none",
};

export default function FloristSocialFloristOrderPage() {
  const [productPrice, setProductPrice] = useState(625);
  const [quantity, setQuantity] = useState(1);
  const [deliveryFee, setDeliveryFee] = useState(0);

  // Alla tillval börjar som 0 / Ej valt.
  // De ska bara räknas om floristen aktivt väljer dem.
  const [greetingCardPrice, setGreetingCardPrice] = useState(0);
  const [ribbonPrice, setRibbonPrice] = useState(0);
  const [chocolatePrice, setChocolatePrice] = useState(0);
  const [vasePrice, setVasePrice] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const selectedExtraButtonsTotal = useMemo(
    () =>
      extraProducts
        .filter((item) => selectedExtras.includes(item.id))
        .reduce((sum, item) => sum + item.price, 0),
    [selectedExtras],
  );

  const extrasTotal =
    greetingCardPrice +
    ribbonPrice +
    chocolatePrice +
    vasePrice +
    selectedExtraButtonsTotal;
  const productTotal = Math.max(0, productPrice) * Math.max(1, quantity);
  const subtotal = productTotal + extrasTotal + Math.max(0, deliveryFee);
  const isMinimumOk = productTotal >= 400;

  const selectedExtrasLabels = [
    greetingCardPrice > 0 ? `Hälsningskort ${greetingCardPrice} kr` : null,
    ribbonPrice > 0 ? `Band ${ribbonPrice} kr` : null,
    chocolatePrice > 0 ? `Choklad ${chocolatePrice} kr` : null,
    vasePrice > 0 ? `Vas ${vasePrice} kr` : null,
    ...extraProducts
      .filter((item) => selectedExtras.includes(item.id))
      .map((item) => `${item.label} ${item.price} kr`),
  ].filter(Boolean) as string[];

  function toggleExtra(id: string) {
    setSelectedExtras((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <main
      style={{
        minWidth: 1280,
        minHeight: "100vh",
        background: "#f7f4ef",
        color: "#1c1917",
      }}
    >
      <header
        style={{ background: "white", borderBottom: "1px solid #e7e2dc" }}
      >
        <div
          style={{
            width: 1180,
            margin: "0 auto",
            height: 88,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <Link
            href="/florist-dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              color: "#1c1917",
              textDecoration: "none",
              fontWeight: 850,
            }}
          >
            <ArrowLeft size={20} /> Till dashboard
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                display: "grid",
                height: 54,
                width: 54,
                placeItems: "center",
                borderRadius: 18,
                background: "#fff7fb",
                color: "#e60073",
                border: "1px solid #ffe0ed",
              }}
            >
              <Store size={30} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 950,
                  letterSpacing: "-0.04em",
                }}
              >
                FloristSocial Florist Xxxxxx
              </div>
              <div style={{ fontSize: 13, fontWeight: 850, color: "#e60073" }}>
                Florist skickar order till annan florist
              </div>
            </div>
          </div>

          <div style={{ width: 140 }} />
        </div>
      </header>

      <div style={{ width: 1180, margin: "0 auto", padding: "30px 0 70px" }}>
        <section
          style={{
            borderRadius: 30,
            background: "white",
            border: "1px solid #e7e2dc",
            padding: 28,
            boxShadow: "0 14px 45px rgba(15,23,42,0.06)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 330px",
              gap: 30,
              alignItems: "start",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 42,
                  lineHeight: 1,
                  fontWeight: 950,
                  letterSpacing: "-0.04em",
                }}
              >
                FloristSocial Florist Xxxxxx
              </h1>
              <p
                style={{
                  margin: "12px 0 0",
                  maxWidth: 760,
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "#57534e",
                }}
              >
                Xxxxxx ersätts senare automatiskt med floristens företagsnamn.
                Florist-1 kan skapa en order åt en kund och skicka den till
                Florist-2. Ordern sparas som skickad order hos Florist-1 och
                mottagen order hos Florist-2, samt visas i båda floristernas
                kalender.
              </p>
            </div>

            <div
              style={{
                borderRadius: 24,
                background: "#fff7fb",
                border: "1px solid #ffe0ed",
                padding: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontWeight: 950,
                  color: "#e60073",
                }}
              >
                <Info size={20} /> Viktigt
              </div>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "#57534e",
                }}
              >
                Minsta produktvärde är 400 kr. Endast buketten är förvald. Alla
                extra produkter och tillval räknas först när floristen aktivt
                väljer dem.
              </p>
            </div>
          </div>
        </section>

        <form
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 24,
          }}
        >
          <div style={{ display: "grid", gap: 22 }}>
            <FormSection
              number="1"
              icon={<UserRound size={23} />}
              title="Beställarens uppgifter"
              description="Dessa uppgifter behövs för orderbekräftelse, betalning och kontakt vid frågor."
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <Field label="Ordernummer">
                  <input
                    style={inputStyle}
                    placeholder="Skapas automatiskt"
                    readOnly
                  />
                </Field>
                <Field label="Datum och tid">
                  <input
                    style={inputStyle}
                    placeholder="Skapas automatiskt"
                    readOnly
                  />
                </Field>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 14,
                  marginTop: 14,
                }}
              >
                <Field label="Beställarens namn *">
                  <input
                    style={inputStyle}
                    placeholder="Förnamn och efternamn"
                    required
                  />
                </Field>
                <Field label="Beställarens telefonnummer">
                  <input style={inputStyle} placeholder="Telefonnummer" />
                </Field>
                <Field label="Beställarens e-post">
                  <input style={inputStyle} type="email" placeholder="E-post" />
                </Field>
              </div>

              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: "#78716c",
                }}
              >
                Telefonnummer eller e-post räcker. Båda behövs inte.
              </p>
            </FormSection>

            <FormSection
              number="2"
              icon={<MapPin size={23} />}
              title="Mottagarens uppgifter"
              description="Floristen eller budet måste kunna hitta mottagaren och kontakta vid portproblem eller leveransfrågor."
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 14,
                }}
              >
                <Field label="Mottagarens namn *">
                  <input style={inputStyle} required />
                </Field>
                <Field label="Mottagarens mobiltelefonnummer *">
                  <input style={inputStyle} required />
                </Field>
                <Field label="Mottagarens e-post">
                  <input style={inputStyle} type="email" />
                </Field>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr",
                  gap: 14,
                  marginTop: 14,
                }}
              >
                <Field label="Mottagarens fullständiga adress *">
                  <input style={inputStyle} required />
                </Field>
                <Field label="Postnummer *">
                  <input style={inputStyle} required />
                </Field>
                <Field label="Ort *">
                  <input style={inputStyle} required />
                </Field>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 14,
                  marginTop: 14,
                }}
              >
                <Field label="Portkod">
                  <input style={inputStyle} />
                </Field>
                <Field label="Våning">
                  <input style={inputStyle} />
                </Field>
                <Field label="Lägenhetsnummer">
                  <input style={inputStyle} />
                </Field>
                <Field label="C/O">
                  <input style={inputStyle} />
                </Field>
              </div>

              <div
                style={{
                  marginTop: 16,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <CheckOption label="Kan hängas på dörren" />
                <CheckOption label="Anonym avsändare" />
              </div>

              <div style={{ marginTop: 14 }}>
                <Field label="Leveransinstruktioner">
                  <textarea style={textareaStyle} />
                </Field>
              </div>
            </FormSection>

            <FormSection
              number="3"
              icon={<Flower2 size={23} />}
              title="Beställning"
              description="Välj typ av arrangemang, pris, antal, stil och eventuella tillval."
            >
              <Field label="Jag önskar beställa *">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                  {arrangementTypes.map((item) => (
                    <Choice key={item} label={item} />
                  ))}
                </div>
              </Field>

              <div style={{ marginTop: 16 }}>
                <Field label="Stil / önskemål">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                    {styleOptions.map((item) => (
                      <Choice key={item} label={item} subtle />
                    ))}
                  </div>
                </Field>
              </div>

              <div
                style={{
                  marginTop: 16,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 14,
                }}
              >
                <Field label="Pris kr. *">
                  <select
                    style={inputStyle}
                    value={productPrice}
                    onChange={(event) =>
                      setProductPrice(Number(event.target.value))
                    }
                    required
                  >
                    {productPriceOptions.map((price) => (
                      <option key={price} value={price}>
                        {price} kr
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Antal *">
                  <input
                    style={inputStyle}
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(Number(event.target.value))
                    }
                    required
                  />
                </Field>
                <Field label="Hälsningskort">
                  <select
                    style={inputStyle}
                    value={greetingCardPrice > 0 ? "Ja" : "Nej"}
                    onChange={(event) =>
                      setGreetingCardPrice(event.target.value === "Ja" ? 50 : 0)
                    }
                  >
                    <option>Nej</option>
                    <option>Ja</option>
                  </select>
                </Field>
              </div>

              {!isMinimumOk && (
                <div
                  style={{
                    marginTop: 12,
                    borderRadius: 16,
                    background: "#fff1f2",
                    border: "1px solid #fecdd3",
                    color: "#be123c",
                    padding: 12,
                    fontSize: 13,
                    fontWeight: 850,
                  }}
                >
                  Minsta produktvärde är 400 kr.
                </div>
              )}

              <div
                style={{
                  marginTop: 14,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 14,
                }}
              >
                <Field label="Hälsningskort pris kr.">
                  <select
                    style={inputStyle}
                    value={greetingCardPrice}
                    onChange={(event) =>
                      setGreetingCardPrice(Number(event.target.value))
                    }
                  >
                    <option value={0}>Ej valt</option>
                    {greetingCardPriceOptions.map((price) => (
                      <option key={price} value={price}>
                        {price} kr
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Band">
                  <select
                    style={inputStyle}
                    value={ribbonPrice}
                    onChange={(event) =>
                      setRibbonPrice(Number(event.target.value))
                    }
                  >
                    <option value={0}>Ej valt</option>
                    {ribbonPriceOptions.map((price) => (
                      <option key={price} value={price}>
                        {price} kr
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Choklad">
                  <select
                    style={inputStyle}
                    value={chocolatePrice}
                    onChange={(event) =>
                      setChocolatePrice(Number(event.target.value))
                    }
                  >
                    <option value={0}>Ej valt</option>
                    {chocolatePriceOptions.map((price) => (
                      <option key={price} value={price}>
                        {price} kr
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div style={{ marginTop: 14 }}>
                <Field label="Hälsningskort/Band text">
                  <textarea style={textareaStyle} />
                </Field>
              </div>
              <div style={{ marginTop: 14 }}>
                <Field label="Specialönskemål">
                  <textarea style={textareaStyle} />
                </Field>
              </div>

              <div
                style={{
                  marginTop: 14,
                  borderRadius: 20,
                  background: "#fafaf9",
                  border: "1px dashed #d6d3d1",
                  padding: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontWeight: 900,
                  }}
                >
                  <ImagePlus size={22} /> Bifoga bild på liknande arrangemang du
                  önskar
                </div>
                <input type="file" accept="image/*" style={{ marginTop: 12 }} />
              </div>

              <div style={{ marginTop: 18 }}>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 950 }}>
                  Extra produkter
                </h3>
                <p
                  style={{
                    margin: "5px 0 12px",
                    fontSize: 13,
                    color: "#78716c",
                  }}
                >
                  Kunden kan klicka och lägga till extra produkter. Inga extra
                  produkter är valda från start.
                </p>

                <div
                  style={{
                    marginBottom: 14,
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: 14,
                  }}
                >
                  <Field label="Vas">
                    <select
                      style={inputStyle}
                      value={vasePrice}
                      onChange={(event) =>
                        setVasePrice(Number(event.target.value))
                      }
                    >
                      <option value={0}>Ej valt</option>
                      {vasePriceOptions.map((price) => (
                        <option key={price} value={price}>
                          Vas {price} kr.
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 10,
                  }}
                >
                  {extraProducts.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleExtra(item.id)}
                      style={{
                        minHeight: 58,
                        borderRadius: 16,
                        border: selectedExtras.includes(item.id)
                          ? "1px solid #e60073"
                          : "1px solid #e7e2dc",
                        background: selectedExtras.includes(item.id)
                          ? "#fff1f7"
                          : "white",
                        color: "#1c1917",
                        fontWeight: 850,
                        cursor: "pointer",
                      }}
                    >
                      {item.label} {item.price} kr
                    </button>
                  ))}
                </div>
              </div>
            </FormSection>

            <FormSection
              number="4"
              icon={<Truck size={23} />}
              title="Leverans eller avhämtning"
              description="Kunden kan välja leverans eller avhämtning från butiken."
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 14,
                }}
              >
                <Field label="Leveransmetod *">
                  <select style={inputStyle} required defaultValue="Leverans">
                    <option>Leverans</option>
                    <option>Avhämtning</option>
                  </select>
                </Field>
                <Field label="Datum till leverans / avhämtning *">
                  <input style={inputStyle} type="date" required />
                </Field>
                <Field label="Tid till leverans / avhämtning *">
                  <input style={inputStyle} type="time" required />
                </Field>
              </div>

              <div
                style={{
                  marginTop: 14,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 14,
                  alignItems: "end",
                }}
              >
                <Field label="Utförande butik/florists avhämtningsadress">
                  <input
                    style={inputStyle}
                    placeholder="Butikens adress visas här senare från floristprofilen"
                    readOnly
                  />
                </Field>

                <Field label="Leveransavgift">
                  <select
                    style={inputStyle}
                    value={deliveryFee}
                    onChange={(event) =>
                      setDeliveryFee(Number(event.target.value))
                    }
                  >
                    <option value={0}>Beräknas automatiskt</option>
                    <option value={100}>0–4 km · 100 kr</option>
                    <option value={200}>5–10 km · 200 kr</option>
                    <option value={300}>11–15 km · 300 kr</option>
                    <option value={400}>16–20 km · 400 kr</option>
                    <option value={500}>21–25 km · 500 kr</option>
                    <option value={600}>26–30 km · 600 kr</option>
                  </select>
                </Field>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "#78716c",
                  }}
                >
                  Fraktkostnad beräknas automatiskt utifrån avståndet mellan
                  Florist-2 och mottagarens adress. Om ingen bukett väljs hos
                  Florist-2 kan appen välja florist i staden och beräkna från
                  stadens centrum.
                </p>
              </div>
            </FormSection>

            <FormSection
              number="5"
              icon={<CreditCard size={23} />}
              title="Betalning och kvitto"
              description="Privatkunder och gäster betalar direkt. Faktura används inte för privatpersoner i första versionen."
            >
              <Field label="Betalningssätt *">
                <select
                  style={inputStyle}
                  required
                  defaultValue="Kortbetalning med Stripe"
                >
                  <option>Kortbetalning med Stripe</option>
                  <option disabled>Swish kommer senare</option>
                  <option disabled>Apple Pay / Google Pay kommer senare</option>
                  <option disabled>Klarna kommer senare</option>
                </select>
              </Field>

              <div
                style={{
                  marginTop: 16,
                  borderRadius: 20,
                  background: "#fff7fb",
                  border: "1px solid #ffe0ed",
                  padding: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontWeight: 950,
                    color: "#e60073",
                  }}
                >
                  <Check size={20} /> PDF-kvitto med moms skickas efter
                  betalning
                </div>
                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "#57534e",
                  }}
                >
                  Kunden betalar endast produkt, valda tillval, hälsningskort
                  och eventuell leverans. Stripe-/kortavgift visas inte separat
                  för kunden. Varje florist betalar sin egen del av
                  betalningsavgiften proportionellt enligt befintlig
                  Stripe-modell.
                </p>
              </div>
            </FormSection>
          </div>

          <aside
            style={{
              position: "sticky",
              top: 24,
              alignSelf: "start",
              display: "grid",
              gap: 18,
            }}
          >
            <section
              style={{
                borderRadius: 28,
                background: "white",
                border: "1px solid #e7e2dc",
                padding: 22,
                boxShadow: "0 14px 45px rgba(15,23,42,0.06)",
              }}
            >
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 950 }}>
                Ordersammanfattning
              </h2>

              <SummaryRow label="Produktvärde" value={`${productTotal} kr`} />
              <SummaryRow label="Valda tillval" value={`${extrasTotal} kr`} />
              <SummaryRow
                label="Leverans"
                value={deliveryFee > 0 ? `${deliveryFee} kr` : "Beräknas"}
              />

              {selectedExtrasLabels.length > 0 && (
                <div
                  style={{
                    marginTop: 12,
                    borderRadius: 16,
                    background: "#fafaf9",
                    border: "1px solid #f1f1f0",
                    padding: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 900,
                      color: "#78716c",
                      marginBottom: 8,
                    }}
                  >
                    Valda tillval
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gap: 5,
                      fontSize: 13,
                      color: "#44403c",
                    }}
                  >
                    {selectedExtrasLabels.map((item) => (
                      <div key={item}>{item}</div>
                    ))}
                  </div>
                </div>
              )}

              <div
                style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: "1px solid #f5f5f4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <strong>Totalt</strong>
                <strong style={{ fontSize: 24 }}>{subtotal} kr</strong>
              </div>

              <button
                type="submit"
                disabled={!isMinimumOk}
                style={{
                  marginTop: 18,
                  width: "100%",
                  height: 56,
                  borderRadius: 18,
                  border: "1px solid #e60073",
                  background: isMinimumOk ? "#e60073" : "#d6d3d1",
                  color: "white",
                  fontWeight: 950,
                  fontSize: 15,
                  cursor: isMinimumOk ? "pointer" : "not-allowed",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <Send size={19} /> Skapa och skicka order
              </button>
            </section>

            <section
              style={{
                borderRadius: 28,
                background: "#fff7fb",
                border: "1px solid #ffe0ed",
                padding: 20,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 17,
                  fontWeight: 950,
                  color: "#e60073",
                }}
              >
                Synkas automatiskt
              </h3>
              <div
                style={{
                  marginTop: 14,
                  display: "grid",
                  gap: 10,
                  fontSize: 14,
                  color: "#44403c",
                }}
              >
                <SyncLine
                  icon={<Store size={18} />}
                  text="Florist-1: Mina skickade order"
                />
                <SyncLine
                  icon={<Package size={18} />}
                  text="Florist-2: Mina mottagna order"
                />
                <SyncLine
                  icon={<CalendarDays size={18} />}
                  text="Båda floristernas kalender"
                />
                <SyncLine
                  icon={<Mail size={18} />}
                  text="Kund får orderbekräftelse"
                />
              </div>
            </section>
          </aside>
        </form>
      </div>
    </main>
  );
}

function FormSection({
  number,
  icon,
  title,
  description,
  children,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        borderRadius: 28,
        background: "white",
        border: "1px solid #e7e2dc",
        padding: 24,
        boxShadow: "0 10px 35px rgba(15,23,42,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "grid",
            height: 42,
            width: 42,
            placeItems: "center",
            borderRadius: 16,
            background: "#fff7fb",
            color: "#e60073",
            border: "1px solid #ffe0ed",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                display: "grid",
                height: 26,
                width: 26,
                placeItems: "center",
                borderRadius: 999,
                background: "#e60073",
                color: "white",
                fontSize: 12,
                fontWeight: 950,
              }}
            >
              {number}
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: 23,
                fontWeight: 950,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h2>
          </div>
          <p
            style={{
              margin: "7px 0 0",
              fontSize: 14,
              lineHeight: 1.6,
              color: "#78716c",
            }}
          >
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label
      style={{
        display: "grid",
        gap: 7,
        fontSize: 13,
        fontWeight: 850,
        color: "#44403c",
      }}
    >
      {label}
      {children}
    </label>
  );
}

function Choice({
  label,
  subtle = false,
}: {
  label: string;
  subtle?: boolean;
}) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        minHeight: 40,
        borderRadius: 999,
        border: subtle ? "1px solid #e7e2dc" : "1px solid #ffd5e7",
        background: subtle ? "white" : "#fff7fb",
        padding: "0 14px",
        fontSize: 13,
        fontWeight: 850,
        cursor: "pointer",
      }}
    >
      <input type="checkbox" /> {label}
    </label>
  );
}

function CheckOption({ label }: { label: string }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        minHeight: 48,
        borderRadius: 16,
        border: "1px solid #e7e2dc",
        background: "white",
        padding: "0 14px",
        fontSize: 14,
        fontWeight: 850,
        cursor: "pointer",
      }}
    >
      <input type="checkbox" /> {label}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        marginTop: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 14,
        color: "#57534e",
      }}
    >
      <span>{label}</span>
      <strong style={{ color: "#1c1917" }}>{value}</strong>
    </div>
  );
}

function SyncLine({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ color: "#e60073" }}>{icon}</span>
      {text}
    </div>
  );
}
