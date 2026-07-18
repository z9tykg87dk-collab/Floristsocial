import type {
  CountryCode,
  SupportedCurrency,
  SupportedLocale,
} from "../country";

export type CompanyPassportStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "ACTIVE"
  | "SUSPENDED"
  | "REJECTED"
  | "ARCHIVED";

export type CompanyType =
  | "SOLE_TRADER"
  | "LIMITED_COMPANY"
  | "TRADING_PARTNERSHIP"
  | "LIMITED_PARTNERSHIP"
  | "ECONOMIC_ASSOCIATION"
  | "NON_PROFIT_ASSOCIATION"
  | "OTHER";

export type VerificationLevel =
  | "NONE"
  | "BASIC"
  | "BUSINESS"
  | "FULL";

export type CompanyAddressType =
  | "VISITING"
  | "POSTAL"
  | "BILLING"
  | "DELIVERY_ORIGIN";

export type CompanyContactType =
  | "PRIMARY"
  | "OWNER"
  | "MANAGER"
  | "ECONOMY"
  | "SUPPORT"
  | "OTHER";

export type CompanyAddress = {
  id: string;
  type: CompanyAddressType;
  companyName?: string;
  careOf?: string;
  street: string;
  streetNumber?: string;
  postalCode: string;
  city: string;
  region?: string;
  countryCode: CountryCode;
  latitude?: number;
  longitude?: number;
  externalPlaceId?: string;
  isPrimary: boolean;
};

export type CompanyContact = {
  id: string;
  type: CompanyContactType;
  firstName: string;
  lastName: string;
  roleTitle?: string;
  email?: string;
  phone?: string;
  isPrimary: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
};

export type CompanyIdentity = {
  legalName: string;
  publicName: string;
  companyType?: CompanyType;
  organisationNumber?: string;
  vatNumber?: string;
  countryCode: CountryCode;
};

export type CompanyLocalization = {
  defaultLocale: SupportedLocale;
  supportedLocales: SupportedLocale[];
  currency: SupportedCurrency;
  timezone: string;
};

export type CompanyVerification = {
  level: VerificationLevel;
  emailVerified: boolean;
  phoneVerified: boolean;
  businessVerified: boolean;
  identityVerified: boolean;
  paymentVerified: boolean;
  verifiedAt?: string;
};

export type CompanyDeliverySettings = {
  enabled: boolean;
  pickupEnabled: boolean;
  deliveryEnabled: boolean;
  longestDeliveryRadiusKm?: number;
  deliveryModel?: string;
};

export type CompanyEconomySettings = {
  pricingModel?: string;
  platformCommissionPercent?: number;
  sellerCommissionPercent?: number;
  executorCommissionPercent?: number;
  stripeFeeHandledBy?: string;
};

export type CompanyProfile = {
  description?: string;
  shortDescription?: string;
  websiteUrl?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    tiktok?: string;
  };
};

export type CompanyPassport = {
  id: string;
  version: number;
  status: CompanyPassportStatus;

  identity: CompanyIdentity;
  localization: CompanyLocalization;
  verification: CompanyVerification;

  addresses: CompanyAddress[];
  contacts: CompanyContact[];

  profile: CompanyProfile;
  delivery: CompanyDeliverySettings;
  economy: CompanyEconomySettings;

  createdAt: string;
  updatedAt: string;
};
