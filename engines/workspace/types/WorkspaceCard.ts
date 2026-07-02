export type WorkspaceCardType =
  | "calendar"
  | "crm"
  | "orders"
  | "economy"
  | "notifications"
  | "intelligence"
  | "social"
  | "supplier";

export type WorkspaceCard = {
  id: string;
  type: WorkspaceCardType;
  title: string;
  subtitle?: string;
  value?: string;
  actionLabel?: string;
  href?: string;
};
