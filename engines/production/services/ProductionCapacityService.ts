import type { ProductionCapacity, ProductionJob } from "../types";

function minutesBetween(start: string, end: string) {
  return Math.max(0, Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 60000));
}

export function calculateProductionCapacity(input: {
  floristId: string;
  date: string;
  workdayStartsAt: string;
  workdayEndsAt: string;
  jobs: ProductionJob[];
}): ProductionCapacity {
  const availableMinutes = minutesBetween(input.workdayStartsAt, input.workdayEndsAt);

  const plannedMinutes = input.jobs.reduce(
    (sum, job) => sum + job.estimatedMinutes + job.packingMinutes,
    0,
  );

  const remainingMinutes = availableMinutes - plannedMinutes;

  return {
    floristId: input.floristId,
    date: input.date,
    workdayStartsAt: input.workdayStartsAt,
    workdayEndsAt: input.workdayEndsAt,
    availableMinutes,
    plannedMinutes,
    remainingMinutes,
    overloaded: remainingMinutes < 0,
  };
}
