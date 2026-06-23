import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Flower2,
  Gift,
  Mail,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  Send,
  ShieldCheck,
  Store,
  Truck,
  UserRound,
} from "lucide-react";

const order = {
  orderNumber: "FS-FL-2026-00482",
  acceptedAt: "2026-05-26 14:32",
  status: "Order godkänd · Under behandling",
  sendingFlorist: "Makalösa Blommor",
  receivingFlorist: "Blomsterateljén Stockholm",
  customerName: "Anna Svensson",
  customerPhone: "+46 70 123 45 67",
  customerEmail: "anna@example.com",
  recipientName: "Erik Andersson",
  recipientPhone: "+46 73 222 33 44",
  recipientEmail: "",
  address: "Storgatan 18, 114 55 Stockholm",
  postalCode: "114 55",
  city: "Stockholm",
  portCode: "1234",
  floor: "3",
  apartment: "1202",
  co: "",
  deliveryDate: "2026-05-28",
  deliveryTime: "14:00–16:00",
  deliveryMethod: "Leverans",
  arrangement: "Bukett",
  style: "Romantiskt · Floristens val",
  productPrice: 625,
  quantity: 1,
  greetingCardPrice: 50,
  greetingText: "Grattis på födelsedagen! Varma kramar från oss.",
  ribbonPrice: 350,
  ribbonText: "Med kärlek och omtanke",
  chocolatePrice: 100,
  vasePrice: 350,
  extras: ["Lyxigare inslagning 90 kr"],
  deliveryFee: 200,
  paymentMethod: "Kortbetalning med Stripe",
  note: "Ring mottagaren om porten är låst. Kan lämnas till granne vid behov.",
};

const total =
  order.productPrice * order.quantity +
  order.greetingCardPrice +
  order.ribbonPrice +
  order.chocolatePrice +
  order.vasePrice +
  order.deliveryFee +
  90;

export default function Florist2OrderConfirmationPreview() {
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
          }}
        >
          <Link
            href="/florist-dashboard/orders"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              color: "#1c1917",
              textDecoration: "none",
              fontWeight: 850,
            }}
          >
            <ArrowLeft size={20} /> Till mottagna order
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
                Orderbekräftelse
              </div>
              <div style={{ fontSize: 13, fontWeight: 850, color: "#e60073" }}>
                Florist-2 har godkänt ordern
              </div>
            </div>
          </div>

          <div style={{ width: 160 }} />
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
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  borderRadius: 999,
                  background: "#ecfdf5",
                  border: "1px solid #bbf7d0",
                  color: "#047857",
                  padding: "9px 14px",
                  fontSize: 13,
                  fontWeight: 950,
                }}
              >
                <CheckCircle2 size={18} /> {order.status}
              </div>
              <h1
                style={{
                  margin: "18px 0 0",
                  fontSize: 42,
                  lineHeight: 1,
                  fontWeight: 950,
                  letterSpacing: "-0.04em",
                }}
              >
                {order.orderNumber}
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
                Ordern är godkänd av {order.receivingFlorist}. Den visas nu som
                mottagen order hos Florist-2, skickad order hos{" "}
                {order.sendingFlorist}, och ligger i båda floristernas kalender.
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
                <Clock size={20} /> Godkänd
              </div>
              <p style={{ margin: "8px 0 0", fontSize: 14, color: "#57534e" }}>
                {order.acceptedAt}
              </p>
              <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
                <StatusPill label="1. Godkänd" active />
                <StatusPill label="2. Under behandling" active />
                <StatusPill label="3. Under leverans" />
                <StatusPill label="4. Leverans bekräftad" />
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 24,
          }}
        >
          <div style={{ display: "grid", gap: 22 }}>
            <Card icon={<Store size={23} />} title="Floristkoppling">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <InfoBox
                  label="Skickad av Florist-1"
                  value={order.sendingFlorist}
                />
                <InfoBox
                  label="Godkänd av Florist-2"
                  value={order.receivingFlorist}
                />
              </div>
            </Card>

            <Card icon={<UserRound size={23} />} title="Beställare">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 14,
                }}
              >
                <InfoBox label="Namn" value={order.customerName} />
                <InfoBox label="Telefon" value={order.customerPhone} />
                <InfoBox label="E-post" value={order.customerEmail} />
              </div>
            </Card>

            <Card
              icon={<MapPin size={23} />}
              title="Mottagare och leveransadress"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 14,
                }}
              >
                <InfoBox label="Mottagare" value={order.recipientName} />
                <InfoBox label="Mobil" value={order.recipientPhone} />
                <InfoBox
                  label="E-post"
                  value={order.recipientEmail || "Ej angiven"}
                />
              </div>
              <div
                style={{
                  marginTop: 14,
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr",
                  gap: 14,
                }}
              >
                <InfoBox label="Adress" value={order.address} />
                <InfoBox label="Postnummer" value={order.postalCode} />
                <InfoBox label="Ort" value={order.city} />
              </div>
              <div
                style={{
                  marginTop: 14,
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 14,
                }}
              >
                <InfoBox label="Portkod" value={order.portCode} />
                <InfoBox label="Våning" value={order.floor} />
                <InfoBox label="Lägenhet" value={order.apartment} />
                <InfoBox label="C/O" value={order.co || "—"} />
              </div>
              <NoteBox text={order.note} />
            </Card>

            <Card icon={<Flower2 size={23} />} title="Beställning">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 14,
                }}
              >
                <InfoBox label="Arrangemang" value={order.arrangement} />
                <InfoBox label="Stil" value={order.style} />
                <InfoBox label="Pris" value={`${order.productPrice} kr`} />
                <InfoBox label="Antal" value={String(order.quantity)} />
              </div>

              <div
                style={{
                  marginTop: 14,
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 14,
                }}
              >
                <InfoBox
                  label="Hälsningskort"
                  value={`${order.greetingCardPrice} kr`}
                />
                <InfoBox label="Band" value={`${order.ribbonPrice} kr`} />
                <InfoBox label="Choklad" value={`${order.chocolatePrice} kr`} />
                <InfoBox label="Vas" value={`${order.vasePrice} kr`} />
              </div>

              <div
                style={{
                  marginTop: 14,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <TextBox
                  label="Hälsningskort/Band text"
                  value={`${order.greetingText}\n${order.ribbonText}`}
                />
                <TextBox
                  label="Extra produkter"
                  value={order.extras.join("\n")}
                />
              </div>
            </Card>

            <Card icon={<Truck size={23} />} title="Leverans och kalender">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 14,
                }}
              >
                <InfoBox label="Metod" value={order.deliveryMethod} />
                <InfoBox label="Datum" value={order.deliveryDate} />
                <InfoBox label="Tid" value={order.deliveryTime} />
                <InfoBox
                  label="Leveransavgift"
                  value={`${order.deliveryFee} kr`}
                />
              </div>

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
                  <CalendarDays size={20} /> Kalenderstatus
                </div>
                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "#57534e",
                  }}
                >
                  Ordern är nu synlig i Florist-2:s kalender som “Under
                  behandling” och i Florist-1:s kalender som “Skickad order ·
                  Godkänd”.
                </p>
              </div>
            </Card>
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
                Betalning
              </h2>
              <SummaryRow
                label="Produktvärde"
                value={`${order.productPrice * order.quantity} kr`}
              />
              <SummaryRow
                label="Hälsningskort"
                value={`${order.greetingCardPrice} kr`}
              />
              <SummaryRow label="Band" value={`${order.ribbonPrice} kr`} />
              <SummaryRow
                label="Choklad"
                value={`${order.chocolatePrice} kr`}
              />
              <SummaryRow label="Vas" value={`${order.vasePrice} kr`} />
              <SummaryRow label="Extra produkter" value="90 kr" />
              <SummaryRow label="Leverans" value={`${order.deliveryFee} kr`} />

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
                <strong>Totalt betalt</strong>
                <strong style={{ fontSize: 24 }}>{total} kr</strong>
              </div>

              <div
                style={{
                  marginTop: 16,
                  borderRadius: 18,
                  background: "#ecfdf5",
                  border: "1px solid #bbf7d0",
                  padding: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    color: "#047857",
                    fontWeight: 950,
                  }}
                >
                  <CreditCard size={19} /> Stripe betalning mottagen
                </div>
                <p
                  style={{
                    margin: "7px 0 0",
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: "#166534",
                  }}
                >
                  Stripe splittrar betalningen enligt FloristSocials modell.
                  Kortavgift visas inte separat för kunden.
                </p>
              </div>
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
                Nästa steg för Florist-2
              </h3>
              <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                <ActionButton
                  icon={<PackageCheck size={18} />}
                  label="Markera under behandling"
                />
                <ActionButton
                  icon={<Truck size={18} />}
                  label="Markera under leverans"
                />
                <ActionButton
                  icon={<CheckCircle2 size={18} />}
                  label="Bekräfta leverans"
                />
                <ActionButton
                  icon={<MessageCircle size={18} />}
                  label="Meddela Florist-1"
                  secondary
                />
                <ActionButton
                  icon={<FileText size={18} />}
                  label="Visa PDF-kvitto"
                  secondary
                />
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}

function StatusPill({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: 999,
        background: active ? "white" : "#f5f5f4",
        border: active ? "1px solid #bbf7d0" : "1px solid #e7e2dc",
        padding: "8px 11px",
        fontSize: 13,
        fontWeight: 850,
        color: active ? "#047857" : "#78716c",
      }}
    >
      {label}
    </div>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
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
          alignItems: "center",
          gap: 12,
          marginBottom: 18,
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
          }}
        >
          {icon}
        </div>
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
      {children}
    </section>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 16,
        background: "#fafaf9",
        border: "1px solid #f1f1f0",
        padding: 14,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 900, color: "#78716c" }}>
        {label}
      </div>
      <div
        style={{
          marginTop: 5,
          fontSize: 14,
          fontWeight: 850,
          color: "#1c1917",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function TextBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 16,
        background: "#fafaf9",
        border: "1px solid #f1f1f0",
        padding: 14,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 900, color: "#78716c" }}>
        {label}
      </div>
      <p
        style={{
          margin: "7px 0 0",
          whiteSpace: "pre-line",
          fontSize: 14,
          lineHeight: 1.6,
          color: "#1c1917",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function NoteBox({ text }: { text: string }) {
  return (
    <div
      style={{
        marginTop: 14,
        borderRadius: 18,
        background: "#fff7fb",
        border: "1px solid #ffe0ed",
        padding: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          fontWeight: 950,
          color: "#e60073",
        }}
      >
        <Gift size={18} /> Leveransinstruktion
      </div>
      <p
        style={{
          margin: "6px 0 0",
          fontSize: 13,
          lineHeight: 1.55,
          color: "#57534e",
        }}
      >
        {text}
      </p>
    </div>
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

function ActionButton({
  icon,
  label,
  secondary = false,
}: {
  icon: React.ReactNode;
  label: string;
  secondary?: boolean;
}) {
  return (
    <button
      type="button"
      style={{
        height: 46,
        borderRadius: 16,
        border: secondary ? "1px solid #ffd5e7" : "1px solid #e60073",
        background: secondary ? "white" : "#e60073",
        color: secondary ? "#e60073" : "white",
        fontSize: 14,
        fontWeight: 900,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
      }}
    >
      {icon}
      {label}
    </button>
  );
}
