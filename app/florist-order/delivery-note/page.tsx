import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  MapPin,
  PackageCheck,
  Phone,
  QrCode,
  ShieldCheck,
  Store,
  Truck,
  UserRound,
} from "lucide-react";

const delivery = {
  orderNumber: "FS-FL-2026-00482",
  deliveryNoteNumber: "LS-2026-00482",
  status: "Klar för bud",
  senderFlorist: "Blomsterateljén Stockholm",
  senderAddress: "Floragatan 12, 114 31 Stockholm",
  senderPhone: "+46 8 123 456",
  receivingCustomer: "Erik Andersson",
  customerPhone: "+46 73 222 33 44",
  deliveryAddress: "Storgatan 18, 114 55 Stockholm",
  portCode: "1234",
  floor: "3",
  apartment: "1202",
  deliveryDate: "2026-05-28",
  deliveryTime: "14:00–16:00",
  content: "Bukett · Romantiskt · Hälsningskort · Band · Choklad · Vas",
  instructions: "Ring mottagaren om porten är låst. Kan lämnas till granne vid behov.",
};

const qrCodes = [
  {
    title: "1. Hämta hos florist",
    subtitle: "Budet scannar vid upphämtning",
    value: `pickup:${delivery.orderNumber}`,
  },
  {
    title: "2. På väg",
    subtitle: "Scanna när leverans påbörjas",
    value: `in-transit:${delivery.orderNumber}`,
  },
  {
    title: "3. Levererat",
    subtitle: "Scanna vid överlämning/dörr",
    value: `delivered:${delivery.orderNumber}`,
  },
  {
    title: "4. Problem / avvikelse",
    subtitle: "Scanna vid portproblem, ej hemma eller skada",
    value: `issue:${delivery.orderNumber}`,
  },
];

export default function DeliveryNotePreviewPage() {
  return (
    <main style={{ minWidth: 1280, minHeight: "100vh", background: "#f7f4ef", color: "#1c1917" }}>
      <header style={{ background: "white", borderBottom: "1px solid #e7e2dc" }}>
        <div style={{ width: 1180, margin: "0 auto", height: 88, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/florist-dashboard/orders" style={{ display: "inline-flex", alignItems: "center", gap: 10, color: "#1c1917", textDecoration: "none", fontWeight: 850 }}>
            <ArrowLeft size={20} /> Till ordern
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "grid", height: 54, width: 54, placeItems: "center", borderRadius: 18, background: "#fff7fb", color: "#e60073", border: "1px solid #ffe0ed" }}>
              <Truck size={30} />
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 950, letterSpacing: "-0.04em" }}>Leveranssedel</div>
              <div style={{ fontSize: 13, fontWeight: 850, color: "#e60073" }}>För budfirma och leveransspårning</div>
            </div>
          </div>

          <button type="button" style={{ height: 46, borderRadius: 16, border: "1px solid #e60073", background: "#e60073", color: "white", padding: "0 18px", fontWeight: 900, cursor: "pointer" }}>
            Skriv ut / PDF
          </button>
        </div>
      </header>

      <div style={{ width: 1180, margin: "0 auto", padding: "30px 0 70px" }}>
        <section style={{ borderRadius: 30, background: "white", border: "1px solid #e7e2dc", padding: 28, boxShadow: "0 14px 45px rgba(15,23,42,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 30 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 9, borderRadius: 999, background: "#ecfdf5", border: "1px solid #bbf7d0", color: "#047857", padding: "9px 14px", fontSize: 13, fontWeight: 950 }}>
                <CheckCircle2 size={18} /> {delivery.status}
              </div>
              <h1 style={{ margin: "18px 0 0", fontSize: 42, lineHeight: 1, fontWeight: 950, letterSpacing: "-0.04em" }}>
                {delivery.deliveryNoteNumber}
              </h1>
              <p style={{ margin: "12px 0 0", maxWidth: 760, fontSize: 15, lineHeight: 1.7, color: "#57534e" }}>
                Leveranssedeln genereras när Florist-2 vill skicka ut buketten med budfirma. Fyra QR-koder används för upphämtning, på väg, levererat och avvikelse.
              </p>
            </div>

            <div style={{ borderRadius: 24, background: "#fff7fb", border: "1px solid #ffe0ed", padding: 18 }}>
              <InfoLine icon={<ClipboardList size={18} />} label="Order" value={delivery.orderNumber} />
              <InfoLine icon={<CalendarDays size={18} />} label="Datum" value={delivery.deliveryDate} />
              <InfoLine icon={<Truck size={18} />} label="Tid" value={delivery.deliveryTime} />
            </div>
          </div>
        </section>

        <section style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <Card title="Avsändare / Florist-2" icon={<Store size={23} />}>
            <DataRow label="Florist" value={delivery.senderFlorist} />
            <DataRow label="Adress" value={delivery.senderAddress} />
            <DataRow label="Telefon" value={delivery.senderPhone} />
          </Card>

          <Card title="Mottagare" icon={<UserRound size={23} />}>
            <DataRow label="Namn" value={delivery.receivingCustomer} />
            <DataRow label="Telefon" value={delivery.customerPhone} />
            <DataRow label="Adress" value={delivery.deliveryAddress} />
            <DataRow label="Port / våning / lgh" value={`Portkod ${delivery.portCode} · Våning ${delivery.floor} · Lgh ${delivery.apartment}`} />
          </Card>
        </section>

        <section style={{ marginTop: 24, borderRadius: 28, background: "white", border: "1px solid #e7e2dc", padding: 24, boxShadow: "0 10px 35px rgba(15,23,42,0.04)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 23, fontWeight: 950 }}>Innehåll</h2>
              <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.7, color: "#57534e" }}>{delivery.content}</p>
            </div>
            <div style={{ borderRadius: 20, background: "#fff7fb", border: "1px solid #ffe0ed", padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, color: "#e60073", fontWeight: 950 }}>
                <MapPin size={19} /> Leveransinstruktioner
              </div>
              <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.6, color: "#57534e" }}>{delivery.instructions}</p>
            </div>
          </div>
        </section>

        <section style={{ marginTop: 24, borderRadius: 28, background: "white", border: "1px solid #e7e2dc", padding: 24, boxShadow: "0 10px 35px rgba(15,23,42,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, marginBottom: 18 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 23, fontWeight: 950 }}>Fyra exakta QR-koder</h2>
              <p style={{ margin: "6px 0 0", fontSize: 14, color: "#78716c" }}>Varje QR-kod uppdaterar orderns status i FloristSocial och synkas till båda floristernas orderhistorik och kalender.</p>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, background: "#ecfdf5", border: "1px solid #bbf7d0", color: "#047857", padding: "9px 13px", fontSize: 13, fontWeight: 950 }}>
              <ShieldCheck size={17} /> Spårbar leverans
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {qrCodes.map((qr) => (
              <QrCard key={qr.value} title={qr.title} subtitle={qr.subtitle} value={qr.value} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section style={{ borderRadius: 28, background: "white", border: "1px solid #e7e2dc", padding: 24, boxShadow: "0 10px 35px rgba(15,23,42,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{ display: "grid", height: 42, width: 42, placeItems: "center", borderRadius: 16, background: "#fff7fb", color: "#e60073", border: "1px solid #ffe0ed" }}>
          {icon}
        </div>
        <h2 style={{ margin: 0, fontSize: 23, fontWeight: 950, letterSpacing: "-0.02em" }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 12, borderBottom: "1px solid #f5f5f4", padding: "10px 0", fontSize: 14 }}>
      <strong style={{ color: "#78716c" }}>{label}</strong>
      <span style={{ color: "#1c1917", fontWeight: 750 }}>{value}</span>
    </div>
  );
}

function InfoLine({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "9px 0", borderBottom: "1px solid #ffe0ed" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#e60073", fontWeight: 850 }}>{icon}{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function QrCard({ title, subtitle, value }: { title: string; subtitle: string; value: string }) {
  return (
    <div style={{ borderRadius: 24, background: "#fafaf9", border: "1px solid #e7e2dc", padding: 16, textAlign: "center" }}>
      <div style={{ height: 132, width: 132, margin: "0 auto", borderRadius: 18, background: "white", border: "1px solid #e7e2dc", display: "grid", placeItems: "center" }}>
        <QrCode size={84} color="#1c1917" />
      </div>
      <h3 style={{ margin: "14px 0 0", fontSize: 15, fontWeight: 950 }}>{title}</h3>
      <p style={{ margin: "5px 0 0", fontSize: 12, lineHeight: 1.45, color: "#78716c" }}>{subtitle}</p>
      <div style={{ marginTop: 10, borderRadius: 999, background: "white", border: "1px solid #e7e2dc", padding: "7px 8px", fontSize: 10, fontWeight: 850, color: "#57534e" }}>
        {value}
      </div>
    </div>
  );
}

