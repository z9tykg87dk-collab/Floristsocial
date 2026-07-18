import type { CountryConfig } from "../types";

export const swedenCountryConfig: CountryConfig = {
  code: "SE",
  name: "Sweden",
  nativeName: "Sverige",

  locales: ["sv-SE", "en-SE"],
  defaultLocale: "sv-SE",

  currency: "SEK",
  timezone: "Europe/Stockholm",

  dateFormat: "YYYY-MM-DD",
  timeFormat: "24h",

  phone: {
    countryCallingCode: "+46",
    nationalPrefix: "0",
    exampleNational: "070-123 45 67",
    exampleInternational: "+46 70 123 45 67",
  },

  address: {
    requiredFields: [
      "street",
      "postalCode",
      "city",
      "countryCode",
    ],
    optionalFields: [
      "companyName",
      "careOf",
      "streetNumber",
      "region",
    ],
    postalCodePattern: /^\d{3}\s?\d{2}$/,
    postalCodeExample: "111 22",
  },

  businessIdentifiers: [
    {
      type: "ORGANISATION_NUMBER",
      label: "Organisationsnummer",
      required: true,
      example: "556123-4567",
      pattern: /^\d{6}-?\d{4}$/,
    },
    {
      type: "VAT_NUMBER",
      label: "Momsregistreringsnummer",
      required: false,
      example: "SE556123456701",
      pattern: /^SE\d{12}$/,
    },
  ],

  vat: {
    standardRate: 25,
    reducedRates: [12, 6],
    vatNumberPrefix: "SE",
  },
};
