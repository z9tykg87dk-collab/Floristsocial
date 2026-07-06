from pathlib import Path

# 1) Fixa svarta/rosa knappar med osynlig text
for file in ["app/page.tsx", "app/workspace/page.tsx"]:
    p = Path(file)
    if not p.exists():
        continue
    s = p.read_text()

    s = s.replace("bg-stone-950 px", "bg-stone-950 !text-white px")
    s = s.replace("bg-pink-600 px", "bg-pink-600 !text-white px")
    s = s.replace("bg-[#223a25] px", "bg-pink-600 !text-white px")
    s = s.replace("hover:bg-pink-700", "hover:bg-pink-700")

    p.write_text(s)

# 2) Lägg till enkel global theme-fil
theme = Path("lib/theme.ts")
theme.parent.mkdir(parents=True, exist_ok=True)
theme.write_text('''export const themeColors = {
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
''')

# 3) Lägg till språk-konfiguration
locale = Path("lib/locale.ts")
locale.write_text('''export const countryLocales = {
  SE: {
    country: "Sverige",
    defaultLanguage: "sv",
    helperLanguage: "en",
    languages: ["sv", "en"],
  },
  NO: {
    country: "Norge",
    defaultLanguage: "no",
    helperLanguage: "en",
    languages: ["no", "en"],
  },
  DK: {
    country: "Danmark",
    defaultLanguage: "da",
    helperLanguage: "en",
    languages: ["da", "en"],
  },
  FI: {
    country: "Finland",
    defaultLanguage: "fi",
    helperLanguage: "en",
    languages: ["fi", "sv", "en"],
  },
};

export type CountryCode = keyof typeof countryLocales;
''')

print("Theme, language foundation and button color fixes completed.")
