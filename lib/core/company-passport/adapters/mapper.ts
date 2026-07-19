import { createEmptyCompanyPassport } from "../defaults";
import type {
  CompanyAddress,
  CompanyContact,
  CompanyPassport,
  CompanyPassportStatus,
  VerificationLevel,
} from "../types";
import type {
  FloristRow,
  FloristRowPatch,
} from "./types";

type UnknownRecord = Record<string, unknown>;

function optionalText(
  value: string | null | undefined,
): string | undefined {
  const cleaned = value?.trim();
  return cleaned ? cleaned : undefined;
}

function requiredText(
  ...values: Array<string | null | undefined>
): string {
  for (const value of values) {
    const cleaned = optionalText(value);

    if (cleaned) {
      return cleaned;
    }
  }

  return "";
}

function nullableText(
  value: string | undefined,
): string | null {
  return optionalText(value) ?? null;
}

function asRecord(value: unknown): UnknownRecord {
  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  ) {
    return value as UnknownRecord;
  }

  return {};
}

function recordString(
  record: UnknownRecord,
  ...keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string") {
      const cleaned = optionalText(value);

      if (cleaned) {
        return cleaned;
      }
    }
  }

  return undefined;
}

function recordNumber(
  record: UnknownRecord,
  ...keys: string[]
): number | undefined {
  for (const key of keys) {
    const value = record[key];

    if (
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      return value;
    }

    if (
      typeof value === "string" &&
      value.trim() !== ""
    ) {
      const parsed = Number(value);

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return undefined;
}

function mapVerificationLevel(
  value: string | null | undefined,
): VerificationLevel {
  switch (value?.trim().toUpperCase()) {
    case "BASIC":
      return "BASIC";
    case "BUSINESS":
      return "BUSINESS";
    case "FULL":
      return "FULL";
    default:
      return "NONE";
  }
}

function mapPassportStatus(
  row: FloristRow,
): CompanyPassportStatus {
  if (row.is_active === false) {
    return "SUSPENDED";
  }

  const claimStatus = row.claim_status
    ?.trim()
    .toUpperCase();

  switch (claimStatus) {
    case "REJECTED":
      return "REJECTED";
    case "SUSPENDED":
      return "SUSPENDED";
    case "ARCHIVED":
      return "ARCHIVED";
    case "CLAIM_PENDING":
    case "PENDING":
    case "PENDING_REVIEW":
      return "PENDING_REVIEW";
    case "APPROVED":
    case "ACTIVE":
    case "CLAIMED":
      return "ACTIVE";
  }

  const status = row.status?.trim().toUpperCase();

  if (
    status === "REJECTED" ||
    status === "AVVISAD"
  ) {
    return "REJECTED";
  }

  if (
    status === "ACTIVE" ||
    status === "AKTIV" ||
    status === "APPROVED" ||
    status === "GODKÄND"
  ) {
    return "ACTIVE";
  }

  return "DRAFT";
}

function mapClaimStatus(
  status: CompanyPassportStatus,
): string {
  switch (status) {
    case "ACTIVE":
      return "APPROVED";
    case "PENDING_REVIEW":
      return "CLAIM_PENDING";
    case "SUSPENDED":
      return "SUSPENDED";
    case "REJECTED":
      return "REJECTED";
    case "ARCHIVED":
      return "ARCHIVED";
    case "DRAFT":
    default:
      return "DRAFT";
  }
}

function createAddress(
  row: FloristRow,
): CompanyAddress | null {
  const street = requiredText(row.address_line_1);
  const postalCode = requiredText(row.postal_code);
  const city = requiredText(row.city);

  const hasAddress =
    Boolean(street) ||
    Boolean(postalCode) ||
    Boolean(city) ||
    typeof row.latitude === "number" ||
    typeof row.longitude === "number";

  if (!hasAddress) {
    return null;
  }

  return {
    id: `${row.id}:visiting`,
    type: "VISITING",
    companyName: optionalText(
      row.shop_name ?? row.florist_name,
    ),
    careOf: optionalText(row.address_line_2),
    street,
    postalCode,
    city,
    region: optionalText(
      row.county ?? row.municipality,
    ),
    countryCode: "SE",
    latitude:
      typeof row.latitude === "number"
        ? row.latitude
        : undefined,
    longitude:
      typeof row.longitude === "number"
        ? row.longitude
        : undefined,
    externalPlaceId: optionalText(
      row.external_place_id,
    ),
    isPrimary: true,
  };
}

function createContacts(
  row: FloristRow,
): CompanyContact[] {
  const ownerEmail = optionalText(row.owner_email);
  const publicEmail = optionalText(
    row.public_email ?? row.email,
  );
  const ownerPhone = optionalText(row.owner_phone);
  const publicPhone = optionalText(row.phone);

  const contacts: CompanyContact[] = [];

  const hasOwner =
    Boolean(row.first_name) ||
    Boolean(row.last_name) ||
    Boolean(ownerEmail) ||
    Boolean(ownerPhone);

  if (hasOwner) {
    contacts.push({
      id: `${row.id}:owner`,
      type: "OWNER",
      firstName: requiredText(row.first_name),
      lastName: requiredText(row.last_name),
      email: ownerEmail,
      phone: ownerPhone,
      isPrimary: true,
      emailVerified: false,
      phoneVerified: false,
    });
  }

  const publicContactIsDifferent =
    publicEmail !== ownerEmail ||
    publicPhone !== ownerPhone;

  if (
    (publicEmail || publicPhone) &&
    (!hasOwner || publicContactIsDifferent)
  ) {
    contacts.push({
      id: `${row.id}:primary`,
      type: "PRIMARY",
      firstName: "",
      lastName: "",
      email: publicEmail,
      phone: publicPhone,
      isPrimary: !hasOwner,
      emailVerified: false,
      phoneVerified: false,
    });
  }

  return contacts;
}

function deliveryModelIncludes(
  deliveryModel: string | null | undefined,
  terms: string[],
): boolean {
  const normalized =
    deliveryModel?.trim().toLowerCase() ?? "";

  return terms.some((term) =>
    normalized.includes(term),
  );
}

/**
 * Översätter en befintlig florist-rad till FloristOS
 * domänmodell CompanyPassport.
 */
export function floristRowToCompanyPassport(
  row: FloristRow,
): CompanyPassport {
  const passport = createEmptyCompanyPassport(row.id);
  const verificationLevel = mapVerificationLevel(
    row.verification_level,
  );
  const economy = asRecord(row.economy_settings);

  const address = createAddress(row);
  const contacts = createContacts(row);

  const emailVerified =
    verificationLevel === "BASIC" ||
    verificationLevel === "BUSINESS" ||
    verificationLevel === "FULL";

  const businessVerified =
    verificationLevel === "BUSINESS" ||
    verificationLevel === "FULL";

  const identityVerified =
    verificationLevel === "FULL";

  const paymentVerified = Boolean(
    optionalText(row.stripe_account_id),
  );

  const deliveryEnabled =
    typeof row.delivery_radius_km === "number" &&
      row.delivery_radius_km > 0
      ? true
      : deliveryModelIncludes(row.delivery_model, [
          "leverans",
          "delivery",
          "lokal",
        ]);

  const pickupEnabled = deliveryModelIncludes(
    row.delivery_model,
    ["avhämtning", "upphämtning", "pickup"],
  );

  return {
    ...passport,

    status: mapPassportStatus(row),

    identity: {
      ...passport.identity,
      legalName: requiredText(
        row.legal_business_name,
        row.shop_name,
        row.florist_name,
      ),
      publicName: requiredText(
        row.shop_name,
        row.florist_name,
        row.legal_business_name,
      ),
      organisationNumber: optionalText(
        row.organization_number,
      ),
      vatNumber: recordString(
        economy,
        "vatNumber",
        "vat_number",
      ),
    },

    verification: {
      level: verificationLevel,
      emailVerified,
      phoneVerified: false,
      businessVerified,
      identityVerified,
      paymentVerified,
    },

    addresses: address ? [address] : [],
    contacts,

    profile: {
      description: optionalText(
        row.description ?? row.bio,
      ),
      shortDescription: optionalText(row.bio),
      websiteUrl: optionalText(row.website),
      logoUrl: optionalText(row.logo_url),
      coverImageUrl: optionalText(
        row.cover_image_url,
      ),
      socialLinks: {
        instagram: optionalText(
          row.business_instagram ?? row.instagram,
        ),
      },
    },

    delivery: {
      enabled: deliveryEnabled || pickupEnabled,
      pickupEnabled,
      deliveryEnabled,
      longestDeliveryRadiusKm:
        typeof row.delivery_radius_km === "number"
          ? row.delivery_radius_km
          : undefined,
      deliveryModel: optionalText(
        row.delivery_model,
      ),
    },

    economy: {
      pricingModel: recordString(
        economy,
        "pricingModel",
        "pricing_model",
      ),
      platformCommissionPercent: recordNumber(
        economy,
        "platformCommissionPercent",
        "platform_commission_percent",
      ),
      sellerCommissionPercent: recordNumber(
        economy,
        "sellerCommissionPercent",
        "seller_commission_percent",
      ),
      executorCommissionPercent: recordNumber(
        economy,
        "executorCommissionPercent",
        "executor_commission_percent",
      ),
      stripeFeeHandledBy: recordString(
        economy,
        "stripeFeeHandledBy",
        "stripe_fee_handled_by",
      ),
    },

    createdAt:
      optionalText(row.created_at) ??
      passport.createdAt,
    updatedAt:
      optionalText(row.updated_at) ??
      passport.updatedAt,
  };
}

/**
 * Översätter CompanyPassport till en begränsad och säker
 * patch för florists-tabellen.
 *
 * Mappern skriver inte administrativa fält, lösenord,
 * Stripe-ID eller statistik.
 */
export function companyPassportToFloristRow(
  passport: CompanyPassport,
): FloristRowPatch {
  const primaryAddress =
    passport.addresses.find(
      (address) =>
        address.isPrimary &&
        address.type === "VISITING",
    ) ??
    passport.addresses.find(
      (address) => address.isPrimary,
    ) ??
    passport.addresses[0];

  const ownerContact =
    passport.contacts.find(
      (contact) => contact.type === "OWNER",
    ) ??
    passport.contacts.find(
      (contact) => contact.isPrimary,
    );

  const primaryContact =
    passport.contacts.find(
      (contact) =>
        contact.type === "PRIMARY" &&
        contact.isPrimary,
    ) ??
    passport.contacts.find(
      (contact) => contact.type === "PRIMARY",
    ) ??
    ownerContact;

  const instagram =
    passport.profile.socialLinks?.instagram;

  return {
    shop_name: nullableText(
      passport.identity.publicName,
    ),
    florist_name: nullableText(
      passport.identity.publicName,
    ),
    legal_business_name: nullableText(
      passport.identity.legalName,
    ),
    organization_number: nullableText(
      passport.identity.organisationNumber,
    ),

    email: nullableText(primaryContact?.email),
    public_email: nullableText(
      primaryContact?.email,
    ),
    owner_email: nullableText(ownerContact?.email),
    phone: nullableText(primaryContact?.phone),
    owner_phone: nullableText(ownerContact?.phone),
    first_name: nullableText(
      ownerContact?.firstName,
    ),
    last_name: nullableText(ownerContact?.lastName),

    address_line_1: nullableText(
      primaryAddress?.street,
    ),
    postal_code: nullableText(
      primaryAddress?.postalCode,
    ),
    city: nullableText(primaryAddress?.city),
    county: nullableText(primaryAddress?.region),
    country:
      passport.identity.countryCode === "SE"
        ? "Sverige"
        : passport.identity.countryCode,
    latitude: primaryAddress?.latitude ?? null,
    longitude: primaryAddress?.longitude ?? null,
    external_place_id: nullableText(
      primaryAddress?.externalPlaceId,
    ),

    description: nullableText(
      passport.profile.description,
    ),
    bio: nullableText(
      passport.profile.shortDescription ??
        passport.profile.description,
    ),
    website: nullableText(
      passport.profile.websiteUrl,
    ),
    instagram: nullableText(instagram),
    logo_url: nullableText(
      passport.profile.logoUrl,
    ),
    cover_image_url: nullableText(
      passport.profile.coverImageUrl,
    ),

    delivery_model: nullableText(
      passport.delivery.deliveryModel,
    ),
    delivery_radius_km:
      passport.delivery.longestDeliveryRadiusKm ??
      null,

    verification_level:
      passport.verification.level,
    claim_status: mapClaimStatus(passport.status),
    is_active: passport.status === "ACTIVE",

    economy_settings: {
      pricingModel:
        passport.economy.pricingModel ?? null,
      platformCommissionPercent:
        passport.economy
          .platformCommissionPercent ?? null,
      sellerCommissionPercent:
        passport.economy
          .sellerCommissionPercent ?? null,
      executorCommissionPercent:
        passport.economy
          .executorCommissionPercent ?? null,
      stripeFeeHandledBy:
        passport.economy.stripeFeeHandledBy ??
        null,
      vatNumber:
        passport.identity.vatNumber ?? null,
    },

    updated_at: new Date().toISOString(),
  };
}
