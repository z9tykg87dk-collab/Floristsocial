import { getCountryConfig } from "../country";
import type { CompanyPassport } from "./types";

export function createEmptyCompanyPassport(
  id: string,
): CompanyPassport {
  const country = getCountryConfig("SE");
  const now = new Date().toISOString();

  return {
    id,
    version: 1,
    status: "DRAFT",

    identity: {
      legalName: "",
      publicName: "",
      countryCode: country.code,
    },

    localization: {
      defaultLocale: country.defaultLocale,
      supportedLocales: [...country.locales],
      currency: country.currency,
      timezone: country.timezone,
    },

    verification: {
      level: "NONE",
      emailVerified: false,
      phoneVerified: false,
      businessVerified: false,
      identityVerified: false,
      paymentVerified: false,
    },

    addresses: [],
    contacts: [],

    profile: {},

    delivery: {
      enabled: false,
      pickupEnabled: false,
      deliveryEnabled: false,
    },

    economy: {},

    createdAt: now,
    updatedAt: now,
  };
}
