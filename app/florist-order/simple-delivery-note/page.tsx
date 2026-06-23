"use client";

import Link from "next/link";
import { ArrowLeft, QrCode } from "lucide-react";

const order = {
  type: "Inrikes",
  receivedAt: "2026-05-26 14:35:23",
  orderId: "FS-FL-2026-00482",
  deliveryDate: "2026-05-28",
  deliveryWeekday: "Torsdag",

  recipient: {
    name: "Erik Andersson",
    address: "Storgatan 18",
    postalCity: "114 55 Stockholm",
    country: "SVERIGE",
    phone: "073-222 33 44",
    portCode: "1234",
    canHangOnDoor: "Nej",
    floor: "3",
    apartment: "1202",
  },

  cardText: "Grattis på födelsedagen!\nVarma kramar från oss.",

  products: [
    {
      name: "Blommor",
      description: "Bukett romantiskt · floristens val",
      qty: "1 st.",
      sum: "625 kr",
    },
    {
      name: "Kort",
      description: "Hälsningskort",
      qty: "1 st.",
      sum: "50 kr",
    },
    {
      name: "Band",
      description: "Bandtext",
      qty: "1 st.",
      sum: "350 kr",
    },
    {
      name: "Choklad",
      description: "Tillval",
      qty: "1 st.",
      sum: "100 kr",
    },
    {
      name: "Vas",
      description: "Tillval",
      qty: "1 st.",
      sum: "350 kr",
    },
  ],

  deliveryFee: "200 kr",
  total: "1 675 kr",

  orderingFlorist: {
    name: "Makalösa Blommor",
    address1: "Sveavägen 102",
    address2: "113 50 Stockholm",
    email: "info@makalosablommor.se",
    phone: "08-673 73 48",
  },

  performingFlorist: {
    name: "Blomsterateljén Stockholm",
    address1: "Floragatan 12",
    address2: "114 31 Stockholm",
    email: "order@blomsterateljen.se",
    phone: "08-111 22 33",
  },

  buyer: {
    name: "Anna Svensson",
    phone: "070-123 45 67",
  },
};

export default function SimpleDeliveryNotePrintPage() {
  return (
    <main
      style={{
        minWidth: 980,
        minHeight: "100vh",
        background: "#f3f0ea",
        color: "#111827",
        padding: "24px 0 60px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        className="no-print"
        style={{
          width: 900,
          margin: "0 auto 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/florist-order/delivery-note"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            color: "#111827",
            fontWeight: 700,
          }}
        >
          <ArrowLeft size={18} />
          Till modern leveranssedel
        </Link>

        <button
          onClick={() => window.print()}
          style={{
            height: 42,
            borderRadius: 10,
            border: "1px solid #111827",
            background: "#111827",
            color: "white",
            padding: "0 16px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Skriv ut / PDF
        </button>
      </div>

      <section
        style={{
          width: 900,
          margin: "0 auto",
          background: "white",
          padding: 18,
          boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
        }}
      >
        <header
          style={{
            textAlign: "center",
            borderBottom: "1px solid #d1d5db",
            paddingBottom: 10,
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "-0.04em",
            }}
          >
            FloristSocial
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 12,
              fontWeight: 800,
              color: "#e60073",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            En smidig förmedlingstjänst
          </div>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
            borderBottom: "1px solid #d1d5db",
            padding: "10px 0",
          }}
        >
          <StrongLine label="Typ:" value={order.type} />
          <StrongLine label="Inkom:" value={order.receivedAt} />
          <StrongLine label="Order ID:" value={order.orderId} alignRight />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr 1fr",
            gap: 14,
            borderBottom: "1px solid #d1d5db",
            padding: "10px 0",
          }}
        >
          <div>
            <Title>
              Leveransdatum: {order.deliveryDate} {order.deliveryWeekday}
            </Title>

            <Title top>Leverans till:</Title>

            <AddressBlock />
          </div>

          <div>
            <Title>Ev. portkod:</Title>

            <p style={smallText}>{order.recipient.portCode || "Ej angiven"}</p>

            <Title top>Får hängas på dörren:</Title>

            <p style={smallText}>{order.recipient.canHangOnDoor}</p>

            <Title top>Våning / lägenhet:</Title>

            <p style={smallText}>
              Våning {order.recipient.floor}, lgh {order.recipient.apartment}
            </p>
          </div>

          <div>
            <Title>Extra meddelande:</Title>

            <p style={smallText}>Ring mottagaren om porten är låst.</p>
          </div>
        </div>

        <div
          style={{
            borderBottom: "1px solid #d1d5db",
            padding: "9px 0",
          }}
        >
          <Title>Korttext:</Title>

          <p
            style={{
              ...smallText,
              whiteSpace: "pre-line",
            }}
          >
            {order.cardText}
          </p>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 6,
            fontSize: 12,
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid #d1d5db",
              }}
            >
              <th style={thLeft}>Vara</th>
              <th style={thCenter}>Antal</th>
              <th style={thRight}>Summa</th>
            </tr>
          </thead>

          <tbody>
            {order.products.map((item) => (
              <tr
                key={`${item.name}-${item.sum}`}
                style={{
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <td style={tdLeft}>
                  <strong>{item.name}</strong> ({item.description})
                </td>

                <td style={tdCenter}>{item.qty}</td>

                <td style={tdRight}>{item.sum}</td>
              </tr>
            ))}

            <tr>
              <td style={tdLeft}></td>

              <td
                style={{
                  ...tdCenter,
                  fontWeight: 900,
                }}
              >
                Fraktkostnad
              </td>

              <td style={tdRight}>{order.deliveryFee}</td>
            </tr>

            <tr>
              <td style={tdLeft}></td>

              <td
                style={{
                  ...tdCenter,
                  fontWeight: 900,
                }}
              >
                Totalt
              </td>

              <td
                style={{
                  ...tdRight,
                  fontWeight: 900,
                }}
              >
                {order.total}
              </td>
            </tr>
          </tbody>
        </table>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            borderTop: "1px solid #d1d5db",
            borderBottom: "1px solid #d1d5db",
            padding: "10px 0",
            marginTop: 10,
          }}
        >
          <ShopBlock title="Beställande butik:" shop={order.orderingFlorist} />

          <ShopBlock title="Utförande butik:" shop={order.performingFlorist} />
        </div>

        <div
          style={{
            padding: "9px 0",
            borderBottom: "1px solid #d1d5db",
          }}
        >
          <Title>Beställarens uppgifter (frivilligt):</Title>

          <p style={smallText}>{order.buyer.name}</p>

          <p style={smallText}>{order.buyer.phone}</p>
        </div>

        {/* FYRA IDENTISKA QR-LAPPAR */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
            marginTop: 14,
          }}
        >
          <RecipientQrSlip />
          <RecipientQrSlip />
          <RecipientQrSlip />
          <RecipientQrSlip />
        </div>
      </section>

      <style>{`
        @media print {
          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          main {
            background: white !important;
            padding: 0 !important;
          }

          section {
            box-shadow: none !important;
            width: 100% !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </main>
  );
}

function RecipientQrSlip() {
  return (
    <div
      style={{
        border: "1px solid #111827",
        padding: 8,
        fontSize: 9,
        lineHeight: 1.3,
        minHeight: 250,
      }}
    >
      <div>
        <strong>Inkom:</strong> {order.receivedAt}
      </div>

      <div>
        <strong>Order ID:</strong> {order.orderId}
      </div>

      <div>
        <strong>Levereras:</strong> {order.deliveryDate} {order.deliveryWeekday}
      </div>

      <div style={{ marginTop: 6 }}>
        <strong>Till:</strong> {order.recipient.name}, {order.recipient.address}
      </div>

      <div>
        {order.recipient.postalCity}/{order.recipient.country}
      </div>

      <div>{order.recipient.phone}</div>

      <div style={{ marginTop: 6 }}>
        <strong>Ev. portkod:</strong> {order.recipient.portCode}
      </div>

      <div>
        <strong>Får hängas på dörren:</strong> {order.recipient.canHangOnDoor}
      </div>

      <div>
        <strong>Våning / lägenhet:</strong> Våning {order.recipient.floor}, lgh{" "}
        {order.recipient.apartment}
      </div>

      <div style={{ marginTop: 6 }}>Ring mottagaren om porten är låst.</div>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            border: "1px solid #111827",
            display: "grid",
            placeItems: "center",
          }}
        >
          <QrCode size={46} />
        </div>
      </div>
    </div>
  );
}

function AddressBlock() {
  return (
    <div style={smallText}>
      <div>{order.recipient.name}</div>

      <div>{order.recipient.address}</div>

      <div>{order.recipient.postalCity}</div>

      <div>{order.recipient.country}</div>

      <a href={`tel:${order.recipient.phone}`} style={{ color: "#1d4ed8" }}>
        {order.recipient.phone}
      </a>
    </div>
  );
}

function ShopBlock({
  title,
  shop,
}: {
  title: string;
  shop: {
    name: string;
    address1: string;
    address2: string;
    email: string;
    phone: string;
  };
}) {
  return (
    <div>
      <Title>{title}</Title>

      <p style={smallText}>
        {shop.name}
        <br />
        {shop.address1}
        <br />
        {shop.address2}
        <br />
        {shop.email}
        <br />
        {shop.phone}
      </p>
    </div>
  );
}

function StrongLine({
  label,
  value,
  alignRight = false,
}: {
  label: string;
  value: string;
  alignRight?: boolean;
}) {
  return (
    <div
      style={{
        textAlign: alignRight ? "right" : "left",
        fontSize: 12,
      }}
    >
      <strong>{label}</strong> {value}
    </div>
  );
}

function Title({
  children,
  top = false,
}: {
  children: React.ReactNode;
  top?: boolean;
}) {
  return (
    <div
      style={{
        marginTop: top ? 10 : 0,
        fontWeight: 900,
        fontSize: 15,
      }}
    >
      {children}
    </div>
  );
}

const smallText = {
  margin: "2px 0 0",
  fontSize: 12,
  lineHeight: 1.25,
};

const thLeft = {
  textAlign: "left" as const,
  padding: "8px 0",
  fontSize: 12,
};

const thCenter = {
  textAlign: "center" as const,
  padding: "8px 0",
  fontSize: 12,
};

const thRight = {
  textAlign: "right" as const,
  padding: "8px 0",
  fontSize: 12,
};

const tdLeft = {
  textAlign: "left" as const,
  padding: "9px 0",
  fontSize: 12,
};

const tdCenter = {
  textAlign: "center" as const,
  padding: "9px 0",
  fontSize: 12,
};

const tdRight = {
  textAlign: "right" as const,
  padding: "9px 0",
  fontSize: 12,
};
