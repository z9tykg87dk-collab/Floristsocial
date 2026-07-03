import type { AuditLogEntry } from "../types";

export type CreateAuditLogInput = Omit<AuditLogEntry, "id" | "createdAt">;

export async function createAuditLog(
  input: CreateAuditLogInput,
): Promise<AuditLogEntry> {
  const entry: AuditLogEntry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };

  // TODO: Koppla till Supabase.
  // Viktigt: Audit logs ska vara append-only.
  return entry;
}

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  // TODO: Endast admin/superadmin ska kunna läsa.
  return [];
}
