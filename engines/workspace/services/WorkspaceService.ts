import type { MorningBriefing, WorkspaceCard, WorkspaceTask } from "../types";

export async function getMorningBriefing(): Promise<MorningBriefing> {
  return {
    greeting: "God morgon 🌸",
    generatedAt: new Date().toISOString(),
    messages: [
      "Du har fyra leveranser idag.",
      "Två buketter producerades igår för leverans idag före kl. 13.",
      "En företagskund väntar på offert.",
      "En Trust Rating skickas idag.",
    ],
  };
}

export async function getWorkspaceCards(): Promise<WorkspaceCard[]> {
  return [
    { id: "orders", title: "Aktiva order", subtitle: "Beställningar som kräver hantering", value: 6, color: "pink", href: "/orders" },
    { id: "calendar", title: "Dagens kalender", subtitle: "Order, leveranser och uppföljningar", value: 4, color: "green", href: "/workspace/calendar" },
    { id: "production", title: "Produktion idag", subtitle: "Buketter som ska bindas idag", value: 5, color: "pink", href: "/workspace/calendar" },
    { id: "yesterday-production", title: "Producerat igår", subtitle: "För leverans idag före kl. 13", value: 2, color: "amber", href: "/workspace/calendar" },
    { id: "deliveries", title: "Leveranser", subtitle: "Kundleveranser och budhämtningar", value: 4, color: "green", href: "/workspace/calendar" },
    { id: "courier", title: "Budhämtning", subtitle: "Hämtningar tidig morgon", value: 2, color: "blue", href: "/workspace/calendar" },
    { id: "trust", title: "Trust Score", subtitle: "Verifierade köpupplevelser", value: "98", color: "blue", href: "/trust/rating" },
    { id: "crm", title: "Relationer", subtitle: "Kunder som behöver uppföljning", value: 12, color: "amber", href: "/workspace" },
    { id: "economy", title: "Ekonomi", subtitle: "Omsättning och betalningar", value: "17 420 kr", color: "purple", href: "/workspace" },
    { id: "intelligence", title: "FOS Förslag", subtitle: "Smarta rekommendationer för dagen", value: 3, color: "blue", href: "/workspace" },
  ];
}

export async function getWorkspaceTasks(): Promise<WorkspaceTask[]> {
  return [
    { id: "t1", group: "Produktion", time: "08:30", title: "Bind brudbukett", description: "Leverans imorgon före kl. 10", status: "urgent", estimatedMinutes: 25 },
    { id: "t2", group: "Produktion", time: "09:15", title: "Bind 2 företagsbuketter", description: "Levereras idag före kl. 13", status: "urgent", estimatedMinutes: 35 },
    { id: "t3", group: "Budhämtning", time: "11:30", title: "Pickup bukett", description: "Budfirma hämtar FS-4587", status: "today", estimatedMinutes: 5 },
    { id: "t4", group: "Leveranser", time: "12:00", title: "Leverans till Solrosvägen 18", description: "Privatkund", status: "today", estimatedMinutes: 10 },
    { id: "t5", group: "Kunder", time: "13:30", title: "Ring företagskund", description: "Offert väntar", status: "today", estimatedMinutes: 15 },
    { id: "t6", group: "Ekonomi", time: "14:00", title: "Kontrollera betalning", description: "Stripe-status", status: "planned", estimatedMinutes: 10 },
    { id: "t7", group: "Trust", time: "16:30", title: "Trust Rating skickas", description: "48 timmar efter leverans", status: "planned", estimatedMinutes: 3 },
    { id: "t8", group: "FOS Förslag", title: "Kontakta återkommande kund", description: "Har inte beställt på 42 dagar", status: "planned", estimatedMinutes: 10 },
    { id: "t9", group: "Produktion", title: "Förbered begravningsdekoration", status: "planned", estimatedMinutes: 45 },
    { id: "t10", group: "Leveranser", time: "14:30", title: "Leverans till Hotell Grand", status: "planned", estimatedMinutes: 20 },
  ];
}
