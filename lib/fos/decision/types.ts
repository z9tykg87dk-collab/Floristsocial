export type FosDecisionPriority = "low" | "medium" | "high" | "urgent";

export type FosDecisionActionType =
  | "create_notification"
  | "create_calendar_task"
  | "create_crm_reminder"
  | "flag_risk"
  | "recommend_growth_action"
  | "open_workspace";

export type FosDecisionInput = {
  eventType: string;
  module: "order" | "calendar" | "crm" | "economy" | "notification" | "trust" | "intelligence";
  payload?: Record<string, any>;
};

export type FosDecisionAction = {
  id: string;
  title: string;
  description: string;
  type: FosDecisionActionType;
  priority: FosDecisionPriority;
  targetModule: string;
  href?: string;
  createdAt: string;
};
