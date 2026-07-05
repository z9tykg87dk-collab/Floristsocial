export type FOSEngineStatus =
  | "active"
  | "development"
  | "planned"
  | "inactive";

export type FOSEngineDefinition = {
  id: string;
  name: string;
  category:
    | "core"
    | "business"
    | "communication"
    | "intelligence"
    | "administration"
    | "integration";
  status: FOSEngineStatus;
  version: string;
  description: string;
};

export const FOS_ENGINES: FOSEngineDefinition[] = [
  { id: "order", name: "Order Engine", category: "core", status: "active", version: "0.2", description: "Orderflöden och orderstatus." },
  { id: "workflow", name: "Workflow Engine", category: "core", status: "active", version: "0.2", description: "Orkestrering mellan Engines." },
  { id: "production", name: "Production Engine", category: "core", status: "active", version: "0.1", description: "Produktion, packning och kapacitet." },
  { id: "calendar", name: "Calendar Engine", category: "core", status: "active", version: "0.2", description: "Kalender, planering och aktiviteter." },
  { id: "workspace", name: "Workspace Engine", category: "core", status: "active", version: "0.1", description: "Arbetsyta, uppgifter och nästa steg." },
  { id: "trust", name: "Trust Engine", category: "core", status: "active", version: "0.1", description: "Verifierade omdömen och Trust Score." },
  { id: "crm", name: "CRM / Relationship Engine", category: "business", status: "development", version: "0.1", description: "Relationer, kunder och historik." },
  { id: "notification", name: "Notification Engine", category: "communication", status: "development", version: "0.1", description: "Notiser, e-post, SMS och push." },
  { id: "intelligence", name: "Intelligence Engine", category: "intelligence", status: "planned", version: "0.1", description: "Rekommendationer och smart planering." },
  { id: "economy", name: "Economy Engine", category: "business", status: "planned", version: "0.1", description: "Ekonomi, provisioner och rapporter." },
  { id: "security", name: "Security Engine", category: "administration", status: "active", version: "0.1", description: "Roller, behörighet och säkerhet." },
  { id: "audit", name: "Audit Engine", category: "administration", status: "active", version: "0.1", description: "Audit log och spårbarhet." },
  { id: "event-bus", name: "FOS Event Bus", category: "core", status: "active", version: "0.1", description: "Händelsestyrning mellan Engines." },
  { id: "fos-state", name: "FOS State", category: "core", status: "active", version: "0.1", description: "Gemensam status och tidslinje." },
];

export function getFOSEngines() {
  return FOS_ENGINES;
}

export function getFOSEngineById(id: string) {
  return FOS_ENGINES.find((engine) => engine.id === id);
}
