export const LOCKED_PROFILE_FIELDS = [
  "company_name",
  "shop_name",
  "organization_number",
  "registration_number",
  "email",
  "membership_status",
  "cancel_membership",
] as const;

export type LockedProfileField = (typeof LOCKED_PROFILE_FIELDS)[number];

export function isLockedProfileField(field: string) {
  return LOCKED_PROFILE_FIELDS.includes(field as LockedProfileField);
}
