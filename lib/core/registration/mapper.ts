import {
  createEmptyCompanyPassport,
  type CompanyPassport,
} from "../company-passport";

import type {
  RegistrationContext,
  RegistrationPayload,
} from "./types";

export function registrationPayloadToCompanyPassport(
  payload: RegistrationPayload,
  context: RegistrationContext,
): CompanyPassport {
  const passport = createEmptyCompanyPassport(
    context.authUserId,
  );

  passport.identity.publicName = String(
    payload.shopName ?? "",
  );

  passport.identity.legalName = String(
    payload.legalBusinessName ?? "",
  );

  passport.identity.organisationNumber = String(
    payload.organizationNumber ?? "",
  );

  return passport;
}
