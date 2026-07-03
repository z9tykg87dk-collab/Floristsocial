export type WorkspaceCardColor =
  | "pink"
  | "green"
  | "blue"
  | "amber"
  | "purple"
  | "slate";

export type WorkspaceCard = {
  id: string;

  title: string;

  subtitle?: string;

  value?: string | number;

  icon?: string;

  color: WorkspaceCardColor;

  href?: string;

  priority?: number;
};
