import type { CompanyPassport } from "../company-passport";

export type RegistrationPayload = Record<string, unknown>;

export type RegistrationContext = {
  authUserId: string;
};

export type RegistrationResult = {
  passport: CompanyPassport;
};
