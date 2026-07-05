export type ProductionCapacity = {
  floristId: string;
  date: string;
  workdayStartsAt: string;
  workdayEndsAt: string;
  availableMinutes: number;
  plannedMinutes: number;
  remainingMinutes: number;
  overloaded: boolean;
};
