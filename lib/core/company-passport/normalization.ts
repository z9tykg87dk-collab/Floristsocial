import {
  normalizeSwedishOrganisationNumber,
  normalizeSwedishPostalCode,
} from "../country";
import type { CompanyPassport } from "./types";

function cleanOptionalText(
  value: string | undefined,
): string | undefined {
  const cleaned = value?.trim();
  return cleaned ? cleaned : undefined;
}

export function normalizeCompanyPassport(
  passport: CompanyPassport,
): CompanyPassport {
  return {
    ...passport,

    identity: {
      ...passport.identity,
      legalName: passport.identity.legalName.trim(),
      publicName: passport.identity.publicName.trim(),
      organisationNumber:
        passport.identity.organisationNumber
          ? normalizeSwedishOrganisationNumber(
              passport.identity.organisationNumber,
            )
          : undefined,
      vatNumber: passport.identity.vatNumber
        ?.replace(/\s+/g, "")
        .toUpperCase(),
    },

    addresses: passport.addresses.map((address) => ({
      ...address,
      companyName: cleanOptionalText(address.companyName),
      careOf: cleanOptionalText(address.careOf),
      street: address.street.trim(),
      streetNumber: cleanOptionalText(address.streetNumber),
      postalCode: normalizeSwedishPostalCode(
        address.postalCode,
      ),
      city: address.city.trim(),
      region: cleanOptionalText(address.region),
      externalPlaceId: cleanOptionalText(
        address.externalPlaceId,
      ),
    })),

    contacts: passport.contacts.map((contact) => ({
      ...contact,
      firstName: contact.firstName.trim(),
      lastName: contact.lastName.trim(),
      roleTitle: cleanOptionalText(contact.roleTitle),
      email: contact.email?.trim().toLowerCase(),
      phone: cleanOptionalText(contact.phone),
    })),

    profile: {
      ...passport.profile,
      description: cleanOptionalText(
        passport.profile.description,
      ),
      shortDescription: cleanOptionalText(
        passport.profile.shortDescription,
      ),
      websiteUrl: cleanOptionalText(
        passport.profile.websiteUrl,
      ),
      logoUrl: cleanOptionalText(passport.profile.logoUrl),
      coverImageUrl: cleanOptionalText(
        passport.profile.coverImageUrl,
      ),
    },

    updatedAt: new Date().toISOString(),
  };
}
