export type WorkspaceTaskStatus = "urgent" | "today" | "planned" | "done";

export type WorkspaceTask = {
  id: string;
  title: string;
  group: string;
  time?: string;
  description?: string;
  status: WorkspaceTaskStatus;
  estimatedMinutes?: number;
};
