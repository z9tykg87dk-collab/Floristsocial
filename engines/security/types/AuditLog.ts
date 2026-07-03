import type { FloristSocialRole } from "@/core/types/roles";

export type AuditActorType = "user" | "admin" | "superadmin" | "system";

export type AuditLogAction =
  | "profile_updated"
  | "locked_profile_field_updated"
  | "user_approved"
  | "user_rejected"
  | "order_status_changed"
  | "payment_status_changed"
  | "commission_rule_changed"
  | "fos_setting_changed"
  | "security_rule_changed"
  | "content_moderated"
  | "support_action"
  | "system_event";

export type AuditLogEntry = {
  id: string;

  actorType: AuditActorType;
  actorUserId?: string;
  actorDisplayName?: string;
  actorEmail?: string;
  actorRole?: FloristSocialRole;

  action: AuditLogAction;
  targetType?: string;
  targetId?: string;

  oldData?: Record<string, unknown>;
  newData?: Record<string, unknown>;

  ipAddress?: string;
  userAgent?: string;

  createdAt: string;
};
