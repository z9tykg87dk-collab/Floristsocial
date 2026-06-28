import Link from "next/link";
import { CalendarDays, Gift, Heart, Sparkles } from "lucide-react";

const holidays = [
  { date: "14 februari", name: "Alla hjärtans dag", text: "Romantiska buketter, rosor och personliga hälsningar." },
  { date: "Mars / april", name: "Påsk", text: "Tulpaner, vårblommor och färgstarka arrangemang." },
  { date: "30 april", name: "Valborg", text: "Vårfirande med säsongens blommor." },
  { date: "Maj", name: "Mors dag", text: "En av årets viktigaste blomsterdagar i Sverige." },
  { date: "Juni", name: "Student", text: "Studentbuketter, halsband och gratulationsblommor." },
  { date: "Midsommar", name: "Midsommarafton", text: "Sommarblommor, kransar och bordsdekorationer." },
  { date: "November", name: "Fars dag", text: "Buketter, växter och presentboxar." },
  { date: "December", name: "Advent", text: "Amaryllis, hyacinter, kransar och vintergrönt." },
  { date: "24 december", name: "Julafton", text: "Julgrupper, blommor och gåvor." },
  { date: "31 december", name: "Nyår", text: "Festliga buketter och eleganta bordsdekorationer." },
];

export default function SwedishHolidaysPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ef", color: "#1c1917" }}>
      <div style={{ width: 1180, margin: "0 auto", padding: "42px 0 80px" }}>
        <section style={{ borderRadius: 34, background: "white", border: "1px solid #e7e2dc", padding: 42 }}>
          <div style={{ display: "inline-flex", gap: 8, alignItems: "center", color: "#e60073", fontWeight: 900 }}>
            <CalendarDays size={22} /> Svenska högtider
          </div>
          <h1 style={{ margin: "18px 0 0", fontSize: 52, lineHeight: 1, fontWeight: 950, letterSpacing: "-0.05em" }}>
            Planera blommor till årets viktigaste dagar
          </h1>
          <p style={{ margin: "16px 0 0", maxWidth: 760, fontSize: 17, lineHeight: 1.7, color: "#57534e" }}>
            En enkel kalender över svenska högtider där kunder kan hitta inspiration och beställa blommor i god tid.
          </p>
        </section>

        <section style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {holidays.map((holiday) => (
            <article key={holiday.name} style={{ borderRadius: 24, background: "white", border: "1px solid #e7e2dc", padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 950, color: "#e60073" }}>{holiday.date}</div>
                  <h2 style={{ margin: "6px 0 0", fontSize: 24, fontWeight: 950 }}>{holiday.name}</h2>
                </div>
                <div style={{ height: 48, width: 48, display: "grid", placeItems: "center", borderRadius: 999, background: "#fff1f7", color: "#e60073" }}>
                  {holiday.name.includes("hjärt") ? <Heart size={24} /> : holiday.name.includes("Jul") ? <Gift size={24} /> : <Sparkles size={24} />}
                </div>
              </div>
              <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.6, color: "#57534e" }}>{holiday.text}</p>
              <Link href="/feed" style={{ display: "inline-flex", marginTop: 16, color: "#e60073", fontWeight: 950, textDecoration: "none" }}>
                Visa inspiration →
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
