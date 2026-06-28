"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Gift, Mail, QrCode, ShieldCheck, Sparkles, UploadCloud } from "lucide-react";

const amounts = [500, 700, 1000, 1500, 2000, 3000];

const giftImages = [
  "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1468327768560-75b778cbb551?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1487070183336-b863922373d4?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1461344577544-4e5dc9487184?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470509037663-253afd7f0f51?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?q=80&w=900&auto=format&fit=crop",
];

function makeCode(amount: number, months: number) {
  return `FS-GIFT-${amount}-${months}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export default function GiftCardClient() {
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [validMonths, setValidMonths] = useState<12 | 18>(12);
  const [selectedImage, setSelectedImage] = useState(giftImages[0]);
  const [code, setCode] = useState("");
  const [buyerContact, setBuyerContact] = useState("");
  const [receiptTime, setReceiptTime] = useState("");

  const selectedAmount = useMemo(() => {
    const custom = Number(customAmount);
    if (custom >= 500 && custom <= 10000) return custom;
    return amount;
  }, [amount, customAmount]);

  const vatIncluded = Math.round(selectedAmount * 0.2);
  const netAmount = selectedAmount - vatIncluded;
  const qrValue = code || `FS-GIFT-PREVIEW-${selectedAmount}-${validMonths}`;

  function handleFile(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setSelectedImage(url);
    setCode("");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ef", color: "#1c1917" }}>
      <div style={{ width: 1180, margin: "0 auto", padding: "42px 0 80px" }}>
        <section style={{ borderRadius: 34, background: "#fff1f7", border: "1px solid #ffe0ed", padding: 42 }}>
          <div style={{ maxWidth: 820 }}>
            <div style={{ display: "inline-flex", gap: 8, alignItems: "center", color: "#e60073", fontWeight: 900 }}>
              <Gift size={22} /> FloristSocial Presentkort
            </div>
            <h1 style={{ margin: "18px 0 0", fontSize: 56, lineHeight: 1, fontWeight: 950, letterSpacing: "-0.05em" }}>
              PRESENTKORT
            </h1>
            <p style={{ margin: "18px 0 0", fontSize: 18, lineHeight: 1.7, color: "#57534e" }}>
              Välj belopp, bild och mottagare. Presentkortet får ett unikt nummer och QR-kod.
            </p>
          </div>
        </section>

        <section style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 420px", gap: 24 }}>
          <div style={{ borderRadius: 28, background: "white", border: "1px solid #e7e2dc", padding: 28 }}>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 950 }}>Välj belopp</h2>

            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {amounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setAmount(value);
                    setCustomAmount("");
                    setCode("");
                  }}
                  style={{
                    height: 70,
                    borderRadius: 18,
                    border: amount === value && !customAmount ? "2px solid #e60073" : "1px solid #ffd5e7",
                    background: amount === value && !customAmount ? "#e60073" : "#fff7fb",
                    color: amount === value && !customAmount ? "white" : "#e60073",
                    fontSize: 17,
                    fontWeight: 950,
                    cursor: "pointer",
                  }}
                >
                  {value} kr
                </button>
              ))}
            </div>

            <input
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setCode("");
              }}
              placeholder="Valfritt belopp, minst 500 kr"
              type="number"
              min="500"
              max="10000"
              step="100"
              style={{ ...inputStyle, marginTop: 14 }}
            />

            <h3 style={{ margin: "24px 0 10px", fontSize: 18, fontWeight: 950 }}>Välj bild från bildbank</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, maxHeight: 250, overflowY: "auto" }}>
              {giftImages.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => {
                    setSelectedImage(image);
                    setCode("");
                  }}
                  style={{
                    height: 92,
                    borderRadius: 16,
                    overflow: "hidden",
                    border: selectedImage === image ? "3px solid #e60073" : "2px solid #ffd5e7",
                    padding: 0,
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  <img src={image} alt="Presentkortsbild" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </button>
              ))}
            </div>

            <h3 style={{ margin: "22px 0 10px", fontSize: 18, fontWeight: 950 }}>Eller ladda upp egen bild</h3>
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files?.[0]);
              }}
              style={{
                minHeight: 150,
                borderRadius: 22,
                border: "2px dashed #ff8abd",
                background: "#fff7fb",
                display: "grid",
                placeItems: "center",
                textAlign: "center",
                padding: 18,
                cursor: "pointer",
              }}
            >
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <div>
                <UploadCloud size={34} style={{ color: "#e60073", margin: "0 auto 8px" }} />
                <strong style={{ color: "#e60073" }}>Dra bild hit eller klicka för att välja från filer</strong>
                <p style={{ margin: "6px 0 0", fontSize: 13, color: "#78716c" }}>
                  Bilden visas som förhandsgranskning. Senare lägger vi till granskning innan publicering.
                </p>
              </div>
            </label>

            <h3 style={{ margin: "24px 0 10px", fontSize: 18, fontWeight: 950 }}>Giltighetstid</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[12, 18].map((months) => (
                <button
                  key={months}
                  type="button"
                  onClick={() => {
                    setValidMonths(months as 12 | 18);
                    setCode("");
                  }}
                  style={{
                    height: 56,
                    borderRadius: 16,
                    border: validMonths === months ? "2px solid #e60073" : "1px solid #e7e2dc",
                    background: validMonths === months ? "#fff1f7" : "white",
                    color: "#1c1917",
                    fontWeight: 950,
                    cursor: "pointer",
                  }}
                >
                  {months} månader
                </button>
              ))}
            </div>

            <form style={{ marginTop: 24, display: "grid", gap: 14 }}>
              <input placeholder="Mottagarens namn" style={inputStyle} />
              <input placeholder="Mottagarens e-post eller telefon" style={inputStyle} />
              <input placeholder="Ditt namn" style={inputStyle} />
              <input
                value={buyerContact}
                onChange={(e) => setBuyerContact(e.target.value)}
                placeholder="Beställarens e-post eller mobil för kvitto"
                style={inputStyle}
                required
              />
              <textarea placeholder="Personlig hälsning" rows={5} style={{ ...inputStyle, paddingTop: 14, height: 120 }} />

              <button
                type="button"
                onClick={() => {
                  setCode(makeCode(selectedAmount, validMonths));
                  setReceiptTime(new Date().toLocaleString("sv-SE"));
                }}
                style={primaryButtonStyle}
              >
                Generera presentkort
              </button>

              <button
                type="button"
                onClick={async () => {
                  const finalCode = code || makeCode(selectedAmount, validMonths);
                  setCode(finalCode);
                  setReceiptTime(new Date().toLocaleString("sv-SE"));

                  const res = await fetch("/api/gift-cards/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      amount: selectedAmount,
                      validityMonths: validMonths,
                      buyerContact,
                      code: finalCode,
                    }),
                  });

                  const data = await res.json();

                  if (!res.ok || !data.url) {
                    alert(data.error || "Kunde inte öppna Stripe betalning.");
                    return;
                  }

                  window.location.href = data.url;
                }}
                style={{ ...primaryButtonStyle, background: "#1c1917" }}
              >
                Fortsätt till betalning
              </button>
            </form>
          </div>

          <aside style={{ display: "grid", gap: 14 }}>
            <div style={{ borderRadius: 28, background: "white", border: "1px solid #e7e2dc", padding: 24, textAlign: "center" }}>
              <div style={{ height: 190, borderRadius: 22, overflow: "hidden", background: "#f5f5f4", marginBottom: 16 }}>
                <img src={selectedImage} alt="Vald presentkortsbild" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <QrCode size={92} style={{ color: "#e60073", margin: "0 auto" }} />
              <h3 style={{ margin: "14px 0 0", fontSize: 22, fontWeight: 950 }}>{selectedAmount} kr</h3>
              <p style={{ margin: "8px 0 0", color: "#57534e" }}>Giltigt i {validMonths} månader</p>
              <div style={{ marginTop: 14, borderRadius: 16, background: "#fff7fb", border: "1px solid #ffe0ed", padding: 12, fontWeight: 950, color: "#e60073", wordBreak: "break-word" }}>
                {qrValue}
              </div>
              <p style={{ margin: "12px 0 0", fontSize: 13, lineHeight: 1.5, color: "#78716c" }}>
                Presentkortet löses in av ansluten florist via FloristSocial.
              </p>
            </div>

            <div style={{ borderRadius: 28, background: "white", border: "1px solid #e7e2dc", padding: 24 }}>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 950 }}>Kvitto</h3>
              <div style={{ marginTop: 14, display: "grid", gap: 8, fontSize: 14, color: "#44403c" }}>
                <ReceiptRow label="Inköpssumma" value={`${selectedAmount} kr`} />
                <ReceiptRow label="Moms ingår" value={`${vatIncluded} kr`} />
                <ReceiptRow label="Belopp exkl. moms" value={`${netAmount} kr`} />
                <ReceiptRow label="Datum och tid" value={receiptTime || "Skapas vid köp"} />
                <ReceiptRow label="Plats" value="FloristSocial.com" />
                <ReceiptRow label="Kvitto skickas till" value={buyerContact || "Beställarens e-post eller mobil"} />
              </div>

              <div style={{ marginTop: 16, borderTop: "1px solid #f5f5f4", paddingTop: 14, fontSize: 13, lineHeight: 1.6, color: "#57534e" }}>
                <strong>Exklusiva Blommor AB</strong><br />
                Organisationsnummer: 559507-3544<br />
                VAT: SE559507354401
              </div>
            </div>

            <Info icon={<Mail size={22} />} title="Påminnelse" text="Mottagaren får en påminnelse 10 dagar innan presentkortet går ut, om det inte redan har lösts in." />
            <Info icon={<ShieldCheck size={22} />} title="Trygg betalning" text="Betalning kopplas senare till Stripe." />
            <Info icon={<Sparkles size={22} />} title="Bildgranskning" text="Egen uppladdad bild bör granskas innan presentkortet publiceras." />

            <Link href="/feed" style={{ color: "#e60073", fontWeight: 950, textDecoration: "none" }}>
              Se floristinspiration →
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  height: 52,
  borderRadius: 16,
  border: "1px solid #e7e2dc",
  padding: "0 16px",
  fontSize: 15,
  outline: "none",
};

const primaryButtonStyle: React.CSSProperties = {
  height: 56,
  borderRadius: 18,
  border: 0,
  background: "#e60073",
  color: "white",
  fontSize: 16,
  fontWeight: 950,
  cursor: "pointer",
};

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 14 }}>
      <span style={{ color: "#78716c" }}>{label}</span>
      <strong style={{ textAlign: "right" }}>{value}</strong>
    </div>
  );
}

function Info({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div style={{ borderRadius: 22, background: "white", border: "1px solid #e7e2dc", padding: 20 }}>
      <div style={{ color: "#e60073" }}>{icon}</div>
      <h3 style={{ margin: "10px 0 0", fontSize: 17, fontWeight: 950 }}>{title}</h3>
      <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.6, color: "#57534e" }}>{text}</p>
    </div>
  );
}
