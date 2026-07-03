import type { FloristSocialRole } from "@/core/types/roles";

export type AdminCapability =
  | "read_all_users"
  | "read_all_roles"
  | "approve_users"
  | "moderate_content"
  | "handle_support"
  | "view_orders"
  | "view_payments"
  | "view_audit_logs"
  | "edit_user_profile_locked_fields"
  | "change_fos_settings"
  | "change_system_settings"
  | "change_payment_rules"
  | "change_commission_rules"
  | "change_security_rules"
  | "delete_audit_logs";

export function canAdminPerform(
  role: FloristSocialRole,
  capability: AdminCapability,
) {
  if (role === "superadmin") {
    return capability !== "delete_audit_logs";
  }

  if (role === "admin") {
    return [
      "read_all_users",
      "read_all_roles",
      "approve_users",
      "moderate_content",
      "handle_support",
      "view_orders",
      "view_payments",
      "view_audit_logs",
      "edit_user_profile_locked_fields",
    ].includes(capability);
  }

  return false;
}
