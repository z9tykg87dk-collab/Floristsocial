export const USER_ROLES = [
  "florist",
  "private_customer",
  "business_customer",
  "courier",
  "event_company",
  "supplier",
  "admin",
  "superadmin",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ADMIN_ROLES: UserRole[] = ["admin", "superadmin"];

export function isAdminRole(role?: string | null) {
  return role === "admin" || role === "superadmin";
}

export function canEditLockedProfileFields(role?: string | null) {
  return isAdminRole(role);
}

export function canCommunicateWith(fromRole: UserRole, toRole: UserRole) {
  if (fromRole === "florist") return true;
  if (toRole === "florist") return true;
  return false;
}

export function canLivestream(role: UserRole, audienceRole?: UserRole) {
  if (role === "florist") return true;
  if (role === "supplier") return audienceRole === "florist";
  return false;
}
