import type { CompanyPassport } from "../types";

export type CompanyPassportSaveResult = {
  passport: CompanyPassport;
  created: boolean;
};

export interface CompanyPassportRepository {
  findById(id: string): Promise<CompanyPassport | null>;

  save(
    passport: CompanyPassport,
  ): Promise<CompanyPassportSaveResult>;

  delete?(id: string): Promise<void>;
}
