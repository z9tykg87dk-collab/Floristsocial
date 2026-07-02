export const FLORISTSOCIAL_ROLES = [
  "florist",
  "private_customer",
  "business_customer",
  "courier",
  "event_company",
  "supplier",
  "admin",
  "superadmin",
] as const;

export type FloristSocialRole = (typeof FLORISTSOCIAL_ROLES)[number];

export const ADMIN_ROLES: FloristSocialRole[] = ["admin", "superadmin"];
