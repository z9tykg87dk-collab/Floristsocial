"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bell, CalendarDays, CheckCircle2, Clock, Flower2, Gift, Package, Store, Truck } from "lucide-react";

type CalendarEventType = "order" | "delivery" | "pickup" | "urgent" | "confirmation" | "holiday" | "reminder" | "closed";

type CalendarActionType = "Order" | "Leverans" | "Upphämtning" | "Händelse" | "Påminna" | "Stängd dag";

type CalendarEvent = {
  offset: number;
  label: string;
  type: CalendarEventType;
  time: string;
  description: string;
};

type SavedCalendarNote = {
  offset: number;
  type: CalendarActionType;
  text: string;
};

const events: CalendarEvent[] = [
  {
    offset: -2,
    label: "Lev",
    type: "delivery",
    time: "15:30",
    description: "Företagsleverans slutförd.",
  },
  {
    offset: 0,
    label: "Order",
    type: "order",
    time: "14:35",
    description: "Ny order inkom från privatkund.",
  },
  {
    offset: 3,
    label: "Högtid",
    type: "holiday",
    time: "Heldag",
    description: "Planera extra bemanning och färdiga buketter.",
  },
  {
    offset: 9,
    label: "Uppdrag",
    type: "pickup",
    time: "16:30",
    description: "Kund hämtar bukett i butik.",
  },
  {
    offset: 22,
    label: "Stängt",
    type: "closed",
    time: "Heldag",
    description: "Butiken är markerad som stängd.",
  },
  {
    offset: 36,
    label: "Bekräftelse",
    type: "confirmation",
    time: "09:00",
    description: "Kontrollera leveransbekräftelser.",
  },
];

function eventColors(type: CalendarEventType) {
  switch (type) {
    case "order":
      return { bg: "#f59e0b", soft: "#fffbeb", border: "#fde68a", text: "#92400e" };
    case "delivery":
      return { bg: "#e60073", soft: "#fff1f7", border: "#ffd5e7", text: "#e60073" };
    case "pickup":
      return { bg: "#3b82f6", soft: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" };
    case "urgent":
      return { bg: "#ef4444", soft: "#fef2f2", border: "#fecaca", text: "#b91c1c" };
    case "confirmation":
      return { bg: "#8b5cf6", soft: "#f5f3ff", border: "#ddd6fe", text: "#6d28d9" };
    case "holiday":
      return { bg: "#22c55e", soft: "#ecfdf5", border: "#bbf7d0", text: "#047857" };
    case "closed":
      return { bg: "#ef4444", soft: "#fef2f2", border: "#fecaca", text: "#b91c1c" };
    default:
      return { bg: "#78716c", soft: "#fafaf9", border: "#e7e2dc", text: "#57534e" };
  }
}

function eventIcon(type: CalendarEventType) {
  switch (type) {
    case "order":
      return <Package size={14} />;
    case "delivery":
      return <Truck size={14} />;
    case "pickup":
      return <Store size={14} />;
    case "confirmation":
      return <CheckCircle2 size={14} />;
    case "holiday":
      return <Flower2 size={14} />;
    case "closed":
      return <Bell size={14} />;
    default:
      return <Bell size={14} />;
  }
}

function getISOWeek(offset: number) {
  const date = new Date("2026-05-28T12:00:00");
  date.setDate(date.getDate() + offset);
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getDayLabel(offset: number) {
  if (offset === 0) return "Idag";
  return offset > 0 ? `+${offset}` : `${offset}`;
}

function CalendarEventPill({ event }: { event: CalendarEvent }) {
  const colors = eventColors(event.type);

  return (
    <div
      style={{
        marginTop: 4,
        borderRadius: 999,
        background: colors.bg,
        color: "white",
        padding: "2px 5px",
        fontSize: 8.5,
        fontWeight: 950,
        textAlign: "center",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
        lineHeight: 1.1,
        maxWidth: "100%",
      }}
      title={event.label}
    >
      {event.label.length > 9 ? `${event.label.slice(0, 8)}…` : event.label}
    </div>
  );
}

export default function FloristCompactCalendar({ floristId }: { floristId: string }) {
  const [selectedOffset, setSelectedOffset] = useState<number | null>(null);
  const [activeAction, setActiveAction] = useState<CalendarActionType | null>(null);
  const [noteText, setNoteText] = useState("");
  const [savedNotes, setSavedNotes] = useState<SavedCalendarNote[]>([]);

  const days = useMemo(() => Array.from({ length: 56 }, (_, index) => index - 14), []);
  const selectedEvents = events.filter((event) => event.offset === selectedOffset);
  const selectedNotes = savedNotes.filter((note) => note.offset === selectedOffset);

  function saveNote() {
    if (selectedOffset === null || !activeAction || !noteText.trim()) return;

    setSavedNotes((current) => [
      ...current,
      {
        offset: selectedOffset,
        type: activeAction,
        text: noteText.trim(),
      },
    ]);

    setActiveAction(null);
    setNoteText("");
  }

  function closePopup() {
    setSelectedOffset(null);
    setActiveAction(null);
    setNoteText("");
  }

  return (
    <>
      <div style={{ borderRadius: 24, background: "white", border: "1px solid #e7e2dc", padding: 16, boxShadow: "0 12px 32px rgba(15,23,42,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <strong style={{ fontSize: 16 }}>8 veckors kalender</strong>
          <span style={{ fontSize: 12, fontWeight: 900, color: "#e60073" }}>2 veckor bakåt · 6 framåt</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "34px repeat(7, 1fr)", gap: 6, marginBottom: 8 }}>
          <div style={{ textAlign: "center", fontSize: 10, fontWeight: 950, color: "#a8a29e" }}>V</div>
          {["M", "T", "O", "T", "F", "L", "S"].map((day, index) => (
            <div key={`${day}-${index}`} style={{ textAlign: "center", fontSize: 11, fontWeight: 900, color: "#78716c" }}>
              {day}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "34px repeat(7, 1fr)", gap: 6 }}>
          {Array.from({ length: 8 }).map((_, weekIndex) => {
            const weekDays = days.slice(weekIndex * 7, weekIndex * 7 + 7);
            const weekNumber = getISOWeek(weekDays[0]);

            return (
              <div key={`week-${weekIndex}`} style={{ display: "contents" }}>
                <div style={{ minHeight: 46, display: "grid", placeItems: "center", borderRadius: 12, background: "#fff7fb", border: "1px solid #ffe0ed", color: "#e60073", fontSize: 11, fontWeight: 950 }}>
                  {weekNumber}
                </div>

                {weekDays.map((offset) => {
                  const dayEvents = events.filter((event) => event.offset === offset);
                  const dayNotes = savedNotes.filter((note) => note.offset === offset);

                  return (
                    <button
                      key={offset}
                      type="button"
                      onClick={() => setSelectedOffset(offset)}
                      style={{
                        minHeight: 46,
                        borderRadius: 12,
                        background: offset === 0 ? "#fff1f7" : "#fafaf9",
                        border: offset === 0 ? "1px solid #e60073" : "1px solid #f1f1f0",
                        padding: 6,
                        color: "#1c1917",
                        cursor: "pointer",
                        textAlign: "left",
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ fontSize: 10.5, fontWeight: 950, color: offset < 0 ? "#a8a29e" : "#292524" }}>
                        {getDayLabel(offset)}
                      </div>

                      {dayEvents.slice(0, 1).map((event) => (
                        <CalendarEventPill key={`${offset}-${event.label}`} event={event} />
                      ))}

                      {dayNotes.slice(0, 1).map((note, index) => (
                        <div key={`${offset}-${note.type}-${index}`} style={{ marginTop: 4, borderRadius: 999, background: "#292524", color: "white", padding: "2px 5px", fontSize: 8.5, fontWeight: 950, textAlign: "center", lineHeight: 1.1 }}>
                          {note.type.length > 7 ? `${note.type.slice(0, 6)}…` : note.type}
                        </div>
                      ))}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {selectedOffset !== null && (
        <div style={{ position: "fixed", inset: 0, zIndex: 90, display: "grid", placeItems: "center", background: "rgba(12,10,9,0.42)", padding: 24 }}>
          <div style={{ width: 620, maxHeight: "88vh", overflowY: "auto", borderRadius: 28, background: "white", padding: 24, boxShadow: "0 30px 80px rgba(15,23,42,0.28)", border: "1px solid #e7e2dc" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 18 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 950, color: "#e60073", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  <CalendarDays size={16} /> Floristkalender
                </div>
                <h3 style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 950 }}>
                  {selectedOffset === 0 ? "Idag" : selectedOffset > 0 ? `Om ${selectedOffset} dagar` : `${Math.abs(selectedOffset)} dagar sedan`}
                </h3>
                <p style={{ margin: "6px 0 0", fontSize: 14, color: "#57534e" }}>
                  Välj åtgärd eller se händelser för denna dag.
                </p>
              </div>

              <button type="button" onClick={closePopup} style={{ border: 0, borderRadius: 999, background: "#f5f5f4", padding: "10px 16px", fontSize: 13, fontWeight: 900, cursor: "pointer" }}>
                Stäng
              </button>
            </div>

            {(selectedEvents.length > 0 || selectedNotes.length > 0) && (
              <div style={{ marginTop: 18, borderRadius: 22, background: "#fafaf9", padding: 16, border: "1px solid #e7e2dc" }}>
                <strong style={{ fontSize: 15 }}>Händelser denna dag</strong>
                <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                  {selectedEvents.map((event) => {
                    const colors = eventColors(event.type);
                    return (
                      <div key={`${event.offset}-${event.label}`} style={{ borderRadius: 16, border: `1px solid ${colors.border}`, background: colors.soft, color: colors.text, padding: 12, overflowWrap: "anywhere", wordBreak: "break-word" }}>
                        <strong style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ flexShrink: 0 }}>{eventIcon(event.type)}</span>
                          <span>{event.label}</span>
                        </strong>
                        <div style={{ marginTop: 5, fontSize: 12, fontWeight: 800 }}>{event.time}</div>
                        <p style={{ margin: "5px 0 0", fontSize: 12, lineHeight: 1.55 }}>{event.description}</p>
                      </div>
                    );
                  })}

                  {selectedNotes.map((note, index) => (
                    <div key={`${note.offset}-${note.type}-${index}`} style={{ borderRadius: 16, background: "white", border: "1px solid #e7e2dc", padding: 12 }}>
                      <strong>{note.type}: {note.text}</strong>
                      <p style={{ margin: "5px 0 0", fontSize: 12, color: "#57534e" }}>
                        Nästa steg: öppna order, skapa leverans eller planera butiksåtgärd.
                      </p>
                      <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Link href="/florist-order" style={pinkButtonStyle}>Öppna order</Link>
                        <Link href="/florist-order/delivery-note" style={greenButtonStyle}>Leverans</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              <Link href="/florist-order" style={pinkBlockStyle}>Order<span>Öppna floristorder</span></Link>
              <Link href="/florist-order/delivery-note" style={greenBlockStyle}>Leverans<span>Skapa leveranssedel</span></Link>
              {(["Upphämtning", "Händelse", "Påminna", "Stängd dag"] as CalendarActionType[]).map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => setActiveAction(action)}
                  style={{
                    borderRadius: 20,
                    border: activeAction === action ? "1px solid #e60073" : "1px solid #e7e2dc",
                    background: activeAction === action ? "#fff1f7" : "white",
                    color: activeAction === action ? "#e60073" : "#1c1917",
                    padding: 14,
                    textAlign: "left",
                    fontSize: 13,
                    fontWeight: 950,
                    cursor: "pointer",
                  }}
                >
                  {action}
                  <span style={{ marginTop: 4, display: "block", fontSize: 11, fontWeight: 750, color: "#78716c" }}>Skriv några ord</span>
                </button>
              ))}
            </div>

            {activeAction && (
              <div style={{ marginTop: 18, borderRadius: 22, border: "1px solid #ffe0ed", background: "#fff7fb", padding: 16 }}>
                <strong style={{ color: "#e60073" }}>{activeAction} - skriv några ord</strong>
                <textarea
                  value={noteText}
                  onChange={(event) => setNoteText(event.target.value)}
                  rows={3}
                  placeholder="Ex. Ring kunden, planera bröllopsmöte, stäng butiken tidigare, förbered expressbukett..."
                  style={{ marginTop: 10, width: "100%", resize: "none", borderRadius: 16, border: "1px solid #ffd5e7", background: "white", padding: 14, fontSize: 14, fontWeight: 750, outline: "none" }}
                />
                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button type="button" onClick={saveNote} style={{ border: 0, borderRadius: 999, background: "#1c1917", color: "white", padding: "10px 18px", fontSize: 13, fontWeight: 950, cursor: "pointer" }}>Spara i kalendern</button>
                  <button type="button" onClick={() => { setActiveAction(null); setNoteText(""); }} style={{ border: 0, borderRadius: 999, background: "white", color: "#57534e", padding: "10px 18px", fontSize: 13, fontWeight: 950, cursor: "pointer" }}>Avbryt</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const pinkButtonStyle = {
  borderRadius: 999,
  background: "#e60073",
  color: "white",
  padding: "9px 14px",
  fontSize: 12,
  fontWeight: 950,
  textDecoration: "none",
};

const greenButtonStyle = {
  borderRadius: 999,
  background: "#059669",
  color: "white",
  padding: "9px 14px",
  fontSize: 12,
  fontWeight: 950,
  textDecoration: "none",
};

const pinkBlockStyle = {
  borderRadius: 20,
  background: "#e60073",
  color: "white",
  padding: 14,
  fontSize: 13,
  fontWeight: 950,
  textDecoration: "none",
  boxShadow: "0 10px 22px rgba(230,0,115,0.12)",
} as const;

const greenBlockStyle = {
  borderRadius: 20,
  background: "#059669",
  color: "white",
  padding: 14,
  fontSize: 13,
  fontWeight: 950,
  textDecoration: "none",
  boxShadow: "0 10px 22px rgba(5,150,105,0.12)",
} as const;
