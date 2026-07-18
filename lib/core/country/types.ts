export type CountryCode = "SE";

export type SupportedLocale = "sv-SE" | "en-SE";

export type SupportedCurrency = "SEK";

export type BusinessIdentifierType =
  | "ORGANISATION_NUMBER"
  | "VAT_NUMBER";

export type AddressField =
  | "companyName"
  | "careOf"
  | "street"
  | "streetNumber"
  | "postalCode"
  | "city"
  | "region"
  | "countryCode";

export type CountryPhoneConfig = {
  countryCallingCode: string;
  nationalPrefix: string;
  exampleNational: string;
  exampleInternational: string;
};

export type CountryAddressConfig = {
  requiredFields: AddressField[];
  optionalFields: AddressField[];
  postalCodePattern: RegExp;
  postalCodeExample: string;
};

export type CountryBusinessIdentifierConfig = {
  type: BusinessIdentifierType;
  label: string;
  required: boolean;
  example: string;
  pattern: RegExp;
};

export type CountryVatConfig = {
  standardRate: number;
  reducedRates: number[];
  vatNumberPrefix: string;
};

export type CountryConfig = {
  code: CountryCode;
  name: string;
  nativeName: string;
  locales: SupportedLocale[];
  defaultLocale: SupportedLocale;
  currency: SupportedCurrency;
  timezone: string;
  dateFormat: string;
  timeFormat: "24h" | "12h";
  phone: CountryPhoneConfig;
  address: CountryAddressConfig;
  businessIdentifiers: CountryBusinessIdentifierConfig[];
  vat: CountryVatConfig;
};
