import {
  validateBusinessIdentifier,
  validatePostalCode,
} from "../country";
import type {
  CompanyAddress,
  CompanyContact,
  CompanyPassport,
} from "./types";

export type CompanyPassportValidationError = {
  path: string;
  message: string;
};

function validateAddress(
  address: CompanyAddress,
  index: number,
): CompanyPassportValidationError[] {
  const errors: CompanyPassportValidationError[] = [];
  const basePath = `addresses.${index}`;

  if (!address.street.trim()) {
    errors.push({
      path: `${basePath}.street`,
      message: "Gatuadress saknas.",
    });
  }

  if (!address.city.trim()) {
    errors.push({
      path: `${basePath}.city`,
      message: "Stad saknas.",
    });
  }

  if (
    !validatePostalCode(
      address.countryCode,
      address.postalCode,
    )
  ) {
    errors.push({
      path: `${basePath}.postalCode`,
      message: "Postnumret har ogiltigt format.",
    });
  }

  return errors;
}

function validateContact(
  contact: CompanyContact,
  index: number,
): CompanyPassportValidationError[] {
  const errors: CompanyPassportValidationError[] = [];
  const basePath = `contacts.${index}`;

  if (!contact.firstName.trim()) {
    errors.push({
      path: `${basePath}.firstName`,
      message: "Förnamn saknas.",
    });
  }

  if (!contact.lastName.trim()) {
    errors.push({
      path: `${basePath}.lastName`,
      message: "Efternamn saknas.",
    });
  }

  if (!contact.email && !contact.phone) {
    errors.push({
      path: basePath,
      message:
        "Kontaktpersonen måste ha e-post eller telefonnummer.",
    });
  }

  return errors;
}

export function validateCompanyPassport(
  passport: CompanyPassport,
): CompanyPassportValidationError[] {
  const errors: CompanyPassportValidationError[] = [];

  if (!passport.id.trim()) {
    errors.push({
      path: "id",
      message: "Company Passport saknar id.",
    });
  }

  if (!passport.identity.legalName.trim()) {
    errors.push({
      path: "identity.legalName",
      message: "Juridiskt företagsnamn saknas.",
    });
  }

  if (!passport.identity.publicName.trim()) {
    errors.push({
      path: "identity.publicName",
      message: "Publikt företagsnamn saknas.",
    });
  }

  if (
    passport.identity.organisationNumber &&
    !validateBusinessIdentifier(
      passport.identity.countryCode,
      "ORGANISATION_NUMBER",
      passport.identity.organisationNumber,
    )
  ) {
    errors.push({
      path: "identity.organisationNumber",
      message: "Organisationsnumret har ogiltigt format.",
    });
  }

  if (
    passport.identity.vatNumber &&
    !validateBusinessIdentifier(
      passport.identity.countryCode,
      "VAT_NUMBER",
      passport.identity.vatNumber,
    )
  ) {
    errors.push({
      path: "identity.vatNumber",
      message: "Momsregistreringsnumret har ogiltigt format.",
    });
  }

  passport.addresses.forEach((address, index) => {
    errors.push(...validateAddress(address, index));
  });

  passport.contacts.forEach((contact, index) => {
    errors.push(...validateContact(contact, index));
  });

  const primaryAddresses = passport.addresses.filter(
    (address) => address.isPrimary,
  );

  if (primaryAddresses.length > 1) {
    errors.push({
      path: "addresses",
      message: "Endast en adress får vara primär.",
    });
  }

  const primaryContacts = passport.contacts.filter(
    (contact) => contact.isPrimary,
  );

  if (primaryContacts.length > 1) {
    errors.push({
      path: "contacts",
      message: "Endast en kontaktperson får vara primär.",
    });
  }

  return errors;
}

export function isValidCompanyPassport(
  passport: CompanyPassport,
): boolean {
  return validateCompanyPassport(passport).length === 0;
}
