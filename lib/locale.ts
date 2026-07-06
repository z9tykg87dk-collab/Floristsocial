export const countryLocales = {
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
