export const floristSocialDesign = {
  brand: {
    name: "FloristSocial",
    slogan: "Där florister blomstrar tillsammans",
  },

  colors: {
    background: "#fffafa",
    surface: "#ffffff",
    surfaceSoft: "#fff5f8",
    primary: "#f2055c",
    primaryHover: "#d90452",
    primarySoft: "#ffe6ef",
    text: "#111827",
    textMuted: "#6b7280",
    border: "#f0e7eb",
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",
  },

  themes: {
    rose: {
      name: "Rose",
      labelSv: "Rosa",
      primary: "#f2055c",
      primaryHover: "#d90452",
      primarySoft: "#ffe6ef",
      gradientFrom: "#fff1f5",
      gradientTo: "#ecfdf5",
    },
    lavender: {
      name: "Lavender",
      labelSv: "Lila",
      primary: "#7c3aed",
      primaryHover: "#6d28d9",
      primarySoft: "#ede9fe",
      gradientFrom: "#f5f3ff",
      gradientTo: "#fff1f5",
    },
    sage: {
      name: "Sage",
      labelSv: "Grön",
      primary: "#16a34a",
      primaryHover: "#15803d",
      primarySoft: "#dcfce7",
      gradientFrom: "#ecfdf5",
      gradientTo: "#f7fee7",
    },
    ocean: {
      name: "Ocean",
      labelSv: "Blå",
      primary: "#2563eb",
      primaryHover: "#1d4ed8",
      primarySoft: "#dbeafe",
      gradientFrom: "#eff6ff",
      gradientTo: "#ecfeff",
    },
  },

  activeTheme: "rose",

  radius: {
    button: "9999px",
    card: "28px",
    section: "36px",
    image: "24px",
    input: "18px",
  },

  shadows: {
    soft: "0 10px 30px rgba(17, 24, 39, 0.06)",
    medium: "0 18px 45px rgba(17, 24, 39, 0.10)",
    pink: "0 18px 35px rgba(242, 5, 92, 0.20)",
  },

  layout: {
    pageMaxWidth: "1440px",
    sectionPaddingDesktop: "32px",
    sectionPaddingMobile: "20px",
    cardPadding: "24px",
    gap: "24px",
  },

  typography: {
    h1: "text-4xl font-bold tracking-tight text-stone-950 md:text-6xl",
    h2: "text-2xl font-bold text-stone-950 md:text-3xl",
    h3: "text-lg font-bold text-stone-950",
    body: "text-base leading-7 text-stone-700",
    muted: "text-sm leading-6 text-stone-500",
    small: "text-xs font-semibold text-stone-500",
  },

  buttons: {
    primary:
      "inline-flex items-center justify-center gap-2 rounded-full bg-pink-600 px-5 py-3 text-sm font-bold !text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700",
    secondary:
      "inline-flex items-center justify-center gap-2 rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-bold !text-pink-700 transition hover:bg-pink-50",
    dark:
      "inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-bold !text-white transition hover:bg-stone-800",
    ghost:
      "inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold !text-stone-900 shadow-sm ring-1 ring-stone-200 transition hover:bg-stone-50",
  },

  cards: {
    default:
      "rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-stone-200/70",
    soft:
      "rounded-[28px] bg-pink-50/60 p-6 ring-1 ring-pink-100",
    section:
      "rounded-[36px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-6",
  },

  inputs: {
    search:
      "h-12 w-full rounded-full border border-stone-200 bg-white px-4 pl-11 text-sm outline-none transition placeholder:text-stone-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100",
    default:
      "h-12 w-full rounded-[18px] border border-stone-200 bg-white px-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100",
  },

  profile: {
    publicLocationFormat: "{city} / Sweden",
    primaryCommunication: "FloristSocial",
    showEmailAsPrimary: false,
    showDashboardQuickMenuPublicly: false,
  },
};

export type FloristSocialDesign = typeof floristSocialDesign;

