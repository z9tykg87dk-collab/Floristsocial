"use client";

import Link from "next/link";
import { ArrowLeft, QrCode } from "lucide-react";import Link from "next/link";import { ArrowLeft, QrCode } from "lucide-react";

const order = {type: "Inrikes",receivedAt: "2026-05-26 14:35:23",orderId: "FS-FL-2026-00482",deliveryDate: "2026-05-28",deliveryWeekday: "Torsdag",recipient: {name: "Erik Andersson",address: "Storgatan 18",postalCity: "114 55 Stockholm",country: "SVERIGE",phone: "073-222 33 44",portCode: "1234",canHangOnDoor: "Nej",floor: "3",apartment: "1202",},cardText: "Grattis på födelsedagen!\nVarma kramar från oss.",products: [{ name: "Blommor", description: "Bukett romantiskt · floristens val", qty: "1 st.", sum: "625 kr" },{ name: "Kort", description: "Hälsningskort", qty: "1 st.", sum: "50 kr" },{ name: "Band", description: "Bandtext", qty: "1 st.", sum: "350 kr" },{ name: "Choklad", description: "Tillval", qty: "1 st.", sum: "100 kr" },{ name: "Vas", description: "Tillval", qty: "1 st.", sum: "350 kr" },],deliveryFee: "200 kr",total: "1 675 kr",orderingFlorist: {name: "Makalösa Blommor",address1: "Sveavägen 102",address2: "113 50 Stockholm",email: "info@makalosablommor.se",phone: "08-673 73 48",},performingFlorist: {name: "Blomsterateljén Stockholm",address1: "Floragatan 12",address2: "114 31 Stockholm",email: "order@blomsterateljen.se",phone: "08-111 22 33",},buyer: {name: "Anna Svensson",phone: "070-123 45 67",},};

export default function SimpleDeliveryNotePrintPage() {return (<main style={{ minWidth: 980, minHeight: "100vh", background: "#f3f0ea", color: "#111827", padding: "24px 0 60px", fontFamily: "Arial, sans-serif" }}><div className="no-print" style={{ width: 900, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}><Link href="/florist-order/delivery-note" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", color: "#111827", fontWeight: 700 }}> Till modern leveranssedel<button onClick={() => window.print()} style={{ height: 42, borderRadius: 10, border: "1px solid #111827", background: "#111827", color: "white", padding: "0 16px", fontWeight: 700, cursor: "pointer" }}>Skriv ut / PDF

  <section style={{ width: 900, margin: "0 auto", background: "white", padding: 18, boxShadow: "0 10px 35px rgba(0,0,0,0.08)" }}>
    <header style={{ textAlign: "center", borderBottom: "1px solid #d1d5db", paddingBottom: 10 }}>
      <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.04em" }}>FloristSocial</div>
      <div style={{ marginTop: 4, fontSize: 12, fontWeight: 800, color: "#e60073", letterSpacing: "0.14em", textTransform: "uppercase" }}>En smidig förmedlingstjänst</div>
    </header>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, borderBottom: "1px solid #d1d5db", padding: "10px 0" }}>
      <StrongLine label="Typ:" value={order.type} />
      <StrongLine label="Inkom:" value={order.receivedAt} />
      <StrongLine label="Order ID:" value={order.orderId} alignRight />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr 1fr", gap: 14, borderBottom: "1px solid #d1d5db", padding: "10px 0" }}>
      <div>
        <Title>Leveransdatum: {order.deliveryDate} {order.deliveryWeekday}</Title>
        <Title top>Leverans till:</Title>
        <AddressBlock />
      </div>

      <div>
        <Title>Ev. portkod:</Title>
        <p style={smallText}>{order.recipient.portCode || "Ej angiven"}</p>
        <Title top>Får hängas på dörren:</Title>
        <p style={smallText}>{order.recipient.canHangOnDoor}</p>
        <Title top>Våning / lägenhet:</Title>
        <p style={smallText}>Våning {order.recipient.floor}, lgh {order.recipient.apartment}</p>
      </div>

      <div>
        <Title>Extra meddelande:</Title>
        <p style={smallText}>Ring mottagaren om porten är låst.</p>
      </div>
    </div>

    <div style={{ borderBottom: "1px solid #d1d5db", padding: "9px 0" }}>
      <Title>Korttext:</Title>
      <p style={{ ...smallText, whiteSpace: "pre-line" }}>{order.cardText}</p>
    </div>

    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 6, fontSize: 12 }}>
      <thead>
        <tr style={{ borderBottom: "1px solid #d1d5db" }}>
          <th style={thLeft}>Vara</th>
          <th style={thCenter}>Antal</th>
          <th style={thRight}>Summa</th>
        </tr>
      </thead>
      <tbody>
        {order.products.map((item) => (
          <tr key={`${item.name}-${item.sum}`} style={{ borderBottom: "1px solid #f3f4f6" }}>
            <td style={tdLeft}><strong>{item.name}</strong> ({item.description})</td>
            <td style={tdCenter}>{item.qty}</td>
            <td style={tdRight}>{item.sum}</td>
          </tr>
        ))}
        <tr>
          <td style={tdLeft}></td>
          <td style={{ ...tdCenter, fontWeight: 900 }}>Fraktkostnad</td>
          <td style={tdRight}>{order.deliveryFee}</td>
        </tr>
        <tr>
          <td style={tdLeft}></td>
          <td style={{ ...tdCenter, fontWeight: 900 }}>Totalt</td>
          <td style={{ ...tdRight, fontWeight: 900 }}>{order.total}</td>
        </tr>
      </tbody>
    </table>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, borderTop: "1px solid #d1d5db", borderBottom: "1px solid #d1d5db", padding: "10px 0", marginTop: 10 }}>
      <ShopBlock title="Beställande butik:" shop={order.orderingFlorist} />
      <ShopBlock title="Utförande butik:" shop={order.performingFlorist} />
    </div>

    <div style={{ padding: "9px 0", borderBottom: "1px solid #d1d5db" }}>
      <Title>Beställarens uppgifter (frivilligt):</Title>
      <p style={smallText}>{order.buyer.name}</p>
      <p style={smallText}>{order.buyer.phone}</p>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 12, alignItems: "start" }}>
      <MiniSlip compact />
      <QrSlip compact title="Hämta / På väg" />
      <QrSlip compact title="Leveransbekräfta" />
    </div>
  </section>

  <style>{`
    @media print {
      body { background: white !important; }
      .no-print { display: none !important; }
      main { background: white !important; padding: 0 !important; }
      section { box-shadow: none !important; width: 100% !important; margin: 0 !important; }
    }
  `}</style>
</main>

);}

function AddressBlock() {return ({order.recipient.name}{order.recipient.address}{order.recipient.postalCity}{order.recipient.country}<a href={tel:${order.recipient.phone}} style={{ color: "#1d4ed8" }}>{order.recipient.phone});}

function MiniSlip({ noBorder = false, compact = false }: { noBorder?: boolean; compact?: boolean }) {return (<div style={{ border: compact ? "1px solid #d1d5db" : noBorder ? "0" : "1px solid #d1d5db", padding: compact ? 10 : "0 22px 22px" }}>Leveransdatum: {order.deliveryDate}{order.deliveryWeekday}Leverans till:Ev. portkod:{order.recipient.portCode || "Ej angiven"}Utförande butik:{order.performingFlorist.name}{order.performingFlorist.address1}{order.performingFlorist.address2}{order.performingFlorist.email}{order.performingFlorist.phone});}

function QrSlip({ compact = false, title = "Order ID" }: { compact?: boolean; title?: string }) {return (<div style={{ padding: compact ? "26px 0 0" : "0 26px 26px", textAlign: "center" }}><div style={{ textAlign: "left", display: "inline-block" }}>{title}<div style={{ fontWeight: 800, fontSize: 16 }}>{order.orderId}<div style={{ height: compact ? 90 : 132, width: compact ? 90 : 132, margin: "18px auto 10px", display: "grid", placeItems: "center", border: "1px solid #111827" }}><QrCode size={compact ? 70 : 104} /><p style={{ margin: 0, fontSize: 12, lineHeight: 1.45 }}>Använd mobilkameran på QR-kodför att leveransbekräfta.);}

function ShopBlock({ title, shop }: { title: string; shop: { name: string; address1: string; address2: string; email: string; phone: string } }) {return ({title}{shop.name}{shop.address1}{shop.address2}{shop.email}{shop.phone});}

function StrongLine({ label, value, alignRight = false }: { label: string; value: string; alignRight?: boolean }) {return (<div style={{ textAlign: alignRight ? "right" : "left", fontSize: 12 }}>{label} {value});}

function Title({ children, top = false }: { children: React.ReactNode; top?: boolean }) {return <div style={{ marginTop: top ? 10 : 0, fontWeight: 900, fontSize: 15 }}>{children};}

const smallText = { margin: "2px 0 0", fontSize: 12, lineHeight: 1.25 };const thLeft = { textAlign: "left" as const, padding: "8px 0", fontSize: 12 };const thCenter = { textAlign: "center" as const, padding: "8px 0", fontSize: 12 };const thRight = { textAlign: "right" as const, padding: "8px 0", fontSize: 12 };const tdLeft = { textAlign: "left" as const, padding: "9px 0", fontSize: 12 };const tdCenter = { textAlign: "center" as const, padding: "9px 0", fontSize: 12 };const tdRight = { textAlign: "right" as const, padding: "9px 0", fontSize: 12 };
