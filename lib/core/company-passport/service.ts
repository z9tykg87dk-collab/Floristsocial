import { createEmptyCompanyPassport } from "./defaults";
import {
  CURRENT_COMPANY_PASSPORT_VERSION,
  upgradeCompanyPassport,
} from "./migrations";
import { normalizeCompanyPassport } from "./normalization";
import type {
  CompanyPassportRepository,
  CompanyPassportSaveResult,
} from "./repository/types";
import type { CompanyPassport } from "./types";
import {
  validateCompanyPassport,
  type CompanyPassportValidationError,
} from "./validation";

export type CompanyPassportServiceResult = {
  passport: CompanyPassport;
  validationErrors: CompanyPassportValidationError[];
  valid: boolean;
};

export type SaveCompanyPassportOptions = {
  requireValidPassport?: boolean;
};

export class CompanyPassportService {
  constructor(
    private readonly repository: CompanyPassportRepository,
  ) {}

  create(id: string): CompanyPassport {
    return createEmptyCompanyPassport(id);
  }

  prepare(
    passport: CompanyPassport,
  ): CompanyPassportServiceResult {
    const upgraded = upgradeCompanyPassport(passport);
    const normalized = normalizeCompanyPassport(upgraded);
    const validationErrors =
      validateCompanyPassport(normalized);

    return {
      passport: normalized,
      validationErrors,
      valid: validationErrors.length === 0,
    };
  }

  validate(
    passport: CompanyPassport,
  ): CompanyPassportValidationError[] {
    return validateCompanyPassport(passport);
  }

  normalize(
    passport: CompanyPassport,
  ): CompanyPassport {
    return normalizeCompanyPassport(passport);
  }

  upgrade(
    passport: CompanyPassport,
  ): CompanyPassport {
    return upgradeCompanyPassport(passport);
  }

  async load(id: string): Promise<CompanyPassport | null> {
    const passport = await this.repository.findById(id);

    if (!passport) {
      return null;
    }

    return this.prepare(passport).passport;
  }

  async save(
    passport: CompanyPassport,
    options: SaveCompanyPassportOptions = {},
  ): Promise<CompanyPassportSaveResult> {
    const prepared = this.prepare(passport);

    if (
      options.requireValidPassport &&
      !prepared.valid
    ) {
      const details = prepared.validationErrors
        .map(
          (error) =>
            `${error.path}: ${error.message}`,
        )
        .join("; ");

      throw new Error(
        `Company Passport validation failed: ${details}`,
      );
    }

    return this.repository.save(prepared.passport);
  }

  export(passport: CompanyPassport): string {
    const prepared = this.prepare(passport);

    return JSON.stringify(prepared.passport, null, 2);
  }

  import(serializedPassport: string): CompanyPassportServiceResult {
    const parsed: unknown = JSON.parse(serializedPassport);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      throw new Error(
        "Imported Company Passport must be a JSON object.",
      );
    }

    const passport = parsed as CompanyPassport;

    if (
      typeof passport.version !== "number" ||
      passport.version < 1
    ) {
      throw new Error(
        "Imported Company Passport has an invalid version.",
      );
    }

    return this.prepare(passport);
  }

  getCurrentVersion(): number {
    return CURRENT_COMPANY_PASSPORT_VERSION;
  }
}
