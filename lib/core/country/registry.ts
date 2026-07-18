import { swedenCountryConfig } from "./countries/se";
import type {
  CountryCode,
  CountryConfig,
} from "./types";

const countryRegistry: Record<CountryCode, CountryConfig> = {
  SE: swedenCountryConfig,
};

export function getCountryConfig(
  countryCode: CountryCode,
): CountryConfig {
  const country = countryRegistry[countryCode];

  if (!country) {
    throw new Error(
      `Country configuration not found for: ${countryCode}`,
    );
  }

  return country;
}

export function getSupportedCountries(): CountryConfig[] {
  return Object.values(countryRegistry);
}

export function isSupportedCountryCode(
  value: string,
): value is CountryCode {
  return value in countryRegistry;
}
