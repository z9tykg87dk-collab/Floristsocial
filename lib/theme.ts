export const themeColors = {
  pink: {
    name: "Rosa",
    primary: "bg-pink-600",
    primaryHover: "hover:bg-pink-700",
    text: "text-pink-600",
    ring: "ring-pink-100",
  },
  green: {
    name: "Grön",
    primary: "bg-emerald-600",
    primaryHover: "hover:bg-emerald-700",
    text: "text-emerald-600",
    ring: "ring-emerald-100",
  },
  gold: {
    name: "Guld",
    primary: "bg-amber-600",
    primaryHover: "hover:bg-amber-700",
    text: "text-amber-600",
    ring: "ring-amber-100",
  },
};

export type ThemeColorKey = keyof typeof themeColors;
