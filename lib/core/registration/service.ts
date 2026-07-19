import {
  CompanyPassportService,
} from "../company-passport";

import {
  registrationPayloadToCompanyPassport,
} from "./mapper";

import type {
  RegistrationContext,
  RegistrationPayload,
  RegistrationResult,
} from "./types";

export class FloristRegistrationService {
  constructor(
    private readonly passportService: CompanyPassportService,
  ) {}

  prepareRegistration(
    payload: RegistrationPayload,
    context: RegistrationContext,
  ): RegistrationResult {

    const passport =
      registrationPayloadToCompanyPassport(
        payload,
        context,
      );

    return {
      passport:
        this.passportService.prepare(passport).passport,
    };
  }
}
