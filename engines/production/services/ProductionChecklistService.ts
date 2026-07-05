import type { ProductionChecklist, ProductionJobType } from "../types";

export function createDefaultChecklist(
  productionJobId: string,
  type: ProductionJobType,
): ProductionChecklist {
  const base = [
    "Produkt kontrollerad",
    "Kort/text kontrollerad",
    "Vatten/emballage kontrollerat",
    "Ordermärkning kontrollerad",
  ];

  const extra: Record<string, string[]> = {
    bridal_bouquet: ["Band kontrollerat", "Fotografering klar", "Transportskydd klart"],
    funeral_decoration: ["Bandtext kontrollerad", "Ceremonitid kontrollerad"],
    wedding_decoration: ["Färgtema kontrollerat", "Plats och tid kontrollerad"],
    event_decoration: ["Eventtid kontrollerad", "Monteringsplan kontrollerad"],
  };

  const labels = [...base, ...(extra[type] || [])];

  return {
    productionJobId,
    items: labels.map((label) => ({
      id: crypto.randomUUID(),
      label,
      completed: false,
    })),
  };
}
