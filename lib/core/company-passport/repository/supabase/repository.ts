import type { Database } from "@/lib/database.types";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import {
  companyPassportToFloristRow,
  floristRowToCompanyPassport,
} from "../../adapters";
import type {
  FloristRow,
  FloristRowPatch,
} from "../../adapters";
import type { CompanyPassport } from "../../types";
import type {
  CompanyPassportRepository,
  CompanyPassportSaveResult,
} from "../types";

type FloristInsert =
  Database["public"]["Tables"]["florists"]["Insert"];

type FloristUpdate =
  Database["public"]["Tables"]["florists"]["Update"];

function getRequiredInsertEmail(
  patch: FloristRowPatch,
  passport: CompanyPassport,
): string {
  const email =
    patch.email ??
    patch.public_email ??
    patch.owner_email ??
    passport.contacts.find(
      (contact) => contact.isPrimary && contact.email,
    )?.email ??
    passport.contacts.find(
      (contact) => contact.email,
    )?.email;

  if (!email) {
    throw new Error(
      `Cannot create florist ${passport.id}: an email address is required.`,
    );
  }

  return email;
}

function toFloristRow(value: unknown): FloristRow {
  return value as FloristRow;
}

/**
 * Supabase-implementation av CompanyPassportRepository.
 *
 * Detta är det enda lagret i Company Passport-modulen som känner
 * till Supabase och den konkreta tabellen "florists".
 */
export class SupabaseCompanyPassportRepository
  implements CompanyPassportRepository
{
  async findById(
    id: string,
  ): Promise<CompanyPassport | null> {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("florists")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Failed to load Company Passport ${id}: ${error.message}`,
      );
    }

    if (!data) {
      return null;
    }

    return floristRowToCompanyPassport(
      toFloristRow(data),
    );
  }

  async save(
    passport: CompanyPassport,
  ): Promise<CompanyPassportSaveResult> {
    const supabase = createSupabaseAdminClient();
    const patch = companyPassportToFloristRow(passport);

    const { data: existing, error: lookupError } =
      await supabase
        .from("florists")
        .select("id")
        .eq("id", passport.id)
        .maybeSingle();

    if (lookupError) {
      throw new Error(
        `Failed to check Company Passport ${passport.id}: ${lookupError.message}`,
      );
    }

    if (existing) {
      /*
       * Casten hålls lokalt i infrastrukturlagret.
       *
       * Adaptertypen är medvetet frikopplad från Supabases
       * genererade databastyper. Några nyare floristkolumner kan
       * därför finnas i databasen innan database.types.ts har
       * regenererats.
       */
      const updatePayload =
        patch as unknown as FloristUpdate;

      const { data, error } = await supabase
        .from("florists")
        .update(updatePayload)
        .eq("id", passport.id)
        .select("*")
        .single();

      if (error) {
        throw new Error(
          `Failed to update Company Passport ${passport.id}: ${error.message}`,
        );
      }

      return {
        passport: floristRowToCompanyPassport(
          toFloristRow(data),
        ),
        created: false,
      };
    }

    const insertPayload = {
      id: passport.id,
      ...patch,
      email: getRequiredInsertEmail(
        patch,
        passport,
      ),
      created_at:
        passport.createdAt ||
        new Date().toISOString(),
      updated_at:
        passport.updatedAt ||
        new Date().toISOString(),
    } as unknown as FloristInsert;

    const { data, error } = await supabase
      .from("florists")
      .insert(insertPayload)
      .select("*")
      .single();

    if (error) {
      throw new Error(
        `Failed to create Company Passport ${passport.id}: ${error.message}`,
      );
    }

    return {
      passport: floristRowToCompanyPassport(
        toFloristRow(data),
      ),
      created: true,
    };
  }
}

export function createSupabaseCompanyPassportRepository(): CompanyPassportRepository {
  return new SupabaseCompanyPassportRepository();
}
