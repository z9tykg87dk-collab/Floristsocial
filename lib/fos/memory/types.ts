export type FosMemoryType =
  | "customer"
  | "florist"
  | "business"
  | "season"
  | "system";

export type FosMemoryConfidence = "low" | "medium" | "high";

export type FosMemoryRecord = {
  id: string;
  type: FosMemoryType;
  subjectId: string;
  key: string;
  value: string;
  confidence: FosMemoryConfidence;
  source: string;
  createdAt: string;
  updatedAt: string;
};
