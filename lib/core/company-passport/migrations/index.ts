import type { CompanyPassport } from "../types";

export const CURRENT_COMPANY_PASSPORT_VERSION = 1;

export function upgradeCompanyPassport(
  passport: CompanyPassport,
): CompanyPassport {
  if (passport.version > CURRENT_COMPANY_PASSPORT_VERSION) {
    throw new Error(
      `Company Passport version ${passport.version} is newer than supported version ${CURRENT_COMPANY_PASSPORT_VERSION}.`,
    );
  }

  let upgradedPassport = passport;

  /*
   * Kommande migreringar läggs här.
   *
   * Exempel:
   *
   * if (upgradedPassport.version === 1) {
   *   upgradedPassport = migrateVersion1ToVersion2(
   *     upgradedPassport,
   *   );
   * }
   */

  return upgradedPassport;
}
