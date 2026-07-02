import type { WorkspaceCard } from "../types";

export async function getWorkspaceCards(role: string): Promise<WorkspaceCard[]> {
  if (role === "supplier") {
    return [
      { id: "calendar", type: "calendar", title: "Dagens aktiviteter", subtitle: "Möten, kataloger och floristkontakter", value: "4", actionLabel: "Öppna kalender", href: "/supplier/profile" },
      { id: "supplier", type: "supplier", title: "Leverantörsförmåner", subtitle: "Rabatter, kampanjer och avtal", value: "3", actionLabel: "Visa förmåner", href: "/supplier/profile" },
      { id: "social", type: "social", title: "Synlighet", subtitle: "Annonser och produktkommunikation", value: "2", actionLabel: "Öppna Socialt", href: "/media-center" },
      { id: "notifications", type: "notifications", title: "Notiser", subtitle: "Viktiga händelser", value: "5", actionLabel: "Visa", href: "/workspace" },
    ];
  }

  return [
    { id: "calendar", type: "calendar", title: "Dagens kalender", subtitle: "Order, leveranser och uppföljningar", value: "7", actionLabel: "Öppna kalender", href: "/florist/19eb5377-43e0-4285-8f9d-a1b1f5f0daf6" },
    { id: "crm", type: "crm", title: "Relationer", subtitle: "Kunder att följa upp", value: "3", actionLabel: "Öppna CRM", href: "/workspace" },
    { id: "orders", type: "orders", title: "Produktion", subtitle: "Order att förbereda", value: "4", actionLabel: "Visa order", href: "/orders" },
    { id: "economy", type: "economy", title: "Ekonomi idag", subtitle: "Omsättning, provision och betalningar", value: "12 450 kr", actionLabel: "Visa ekonomi", href: "/workspace" },
    { id: "intelligence", type: "intelligence", title: "Intelligence", subtitle: "Förslag som sparar tid", value: "5", actionLabel: "Visa förslag", href: "/workspace" },
    { id: "social", type: "social", title: "Sociala Flödet", subtitle: "Kommentarer och nya reaktioner", value: "9", actionLabel: "Öppna flödet", href: "/feed" },
  ];
}
