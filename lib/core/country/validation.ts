import { getCountryConfig } from "./registry";
import type { CountryCode } from "./types";

function removeWhitespace(value: string): string {
  return value.replace(/\s+/g, "");
}

export function normalizeSwedishPostalCode(
  value: string,
): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length !== 5) {
    return value.trim();
  }

  return `${digits.slice(0, 3)} ${digits.slice(3)}`;
}

export function validatePostalCode(
  countryCode: CountryCode,
  value: string,
): boolean {
  const country = getCountryConfig(countryCode);
  const normalized = normalizeSwedishPostalCode(value);

  return country.address.postalCodePattern.test(normalized);
}

export function normalizeSwedishOrganisationNumber(
  value: string,
): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length !== 10) {
    return value.trim();
  }

  return `${digits.slice(0, 6)}-${digits.slice(6)}`;
}

export function validateBusinessIdentifier(
  countryCode: CountryCode,
  type: "ORGANISATION_NUMBER" | "VAT_NUMBER",
  value: string,
): boolean {
  const country = getCountryConfig(countryCode);

  const identifier = country.businessIdentifiers.find(
    (item) => item.type === type,
  );

  if (!identifier) {
    return false;
  }

  const normalized =
    type === "VAT_NUMBER"
      ? removeWhitespace(value).toUpperCase()
      : normalizeSwedishOrganisationNumber(value);

  return identifier.pattern.test(normalized);
}
