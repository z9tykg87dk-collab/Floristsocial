export const FLORISTSOCIAL_ENGINES = [
  { id: "calendar", name: "Calendar Engine", description: "Planering, aktiviteter, kalender, arbetsflöden och CRM-händelser." },
  { id: "crm", name: "CRM Engine", description: "Kunder, relationer, historik, uppföljning och offertarbete." },
  { id: "order", name: "Order Engine", description: "Order, produktion, leverans, status och orderflöden." },
  { id: "economy", name: "Economy Engine", description: "Omsättning, provision, moms, fakturor, rapporter och bokföring." },
  { id: "payment", name: "Payment Engine", description: "Stripe, betalningar, utbetalningar, återbetalningar och avgifter." },
  { id: "supplier", name: "Supplier Engine", description: "Leverantörer, kataloger, prislistor, förmåner och annonser." },
  { id: "partnership", name: "Partnership Engine", description: "Avtal, medlemsförmåner, rabatter, partnerskap och förhandlingar." },
  { id: "social", name: "Social Engine", description: "Sociala Flödet, Blomsterinspiration, kommentarer, följare och live." },
  { id: "communication", name: "Communication Engine", description: "Chat, ljudsamtal, videosamtal och rollstyrd kommunikation." },
  { id: "notification", name: "Notification Engine", description: "Notiser via app, e-post, SMS och systempåminnelser." },
  { id: "match", name: "Match Engine", description: "Matchning mellan kundbehov och rätt florist." },
  { id: "market", name: "Market Engine", description: "Marknadsinformation, blomsterpriser, grossister, trender och säsong." },
  { id: "business", name: "Business Engine", description: "Beslutsstöd för lönsamhet, merförsäljning och smartare arbetsflöden." },
  { id: "knowledge", name: "Knowledge Engine", description: "Kunskapsbank för floristyrket, etikett, material och arbetsmetoder." },
  { id: "intelligence", name: "Intelligence Engine", description: "Smarta rekommendationer baserade på data från hela ekosystemet." },
  { id: "analytics", name: "Analytics Engine", description: "Statistik, insikter, mätetal och rapporter." },
  { id: "search", name: "Search Engine", description: "Sökning för florister, produkter, kunder, order och leverantörer." },
  { id: "media", name: "Media Engine", description: "Media Center, bilder, video, PDF, kataloger och filanvändning." },
  { id: "security", name: "Security Engine", description: "Roller, behörigheter, låsta fält, audit log och skydd." },
  { id: "admin", name: "Admin Engine", description: "Adminverktyg, godkännanden, support, moderation och systemkontroll." },
] as const;

export type FloristSocialEngineId = (typeof FLORISTSOCIAL_ENGINES)[number]["id"];
