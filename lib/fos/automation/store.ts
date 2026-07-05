import { AutomationEngineState, AutomationJob } from "./types";

const jobs: AutomationJob[] = [];

const engineState: AutomationEngineState = {
  version: "1.0.0",
  status: "active",
  statistics: {
    queued: 0,
    running: 0,
    completed: 0,
    failed: 0,
  },
};

export function listAutomationJobs(): AutomationJob[] {
  return jobs;
}

export function getAutomationJob(id: string): AutomationJob | undefined {
  return jobs.find((job) => job.id === id);
}

export function saveAutomationJob(job: AutomationJob): AutomationJob {
  const index = jobs.findIndex((j) => j.id === job.id);

  if (index >= 0) {
    jobs[index] = job;
  } else {
    jobs.unshift(job);
  }

  updateStatistics();

  return job;
}

export function removeAutomationJob(id: string): boolean {
  const index = jobs.findIndex((job) => job.id === id);

  if (index === -1) {
    return false;
  }

  jobs.splice(index, 1);

  updateStatistics();

  return true;
}

export function getAutomationState(): AutomationEngineState {
  updateStatistics();
  return engineState;
}

function updateStatistics() {
  engineState.statistics.queued =
    jobs.filter((j) => j.status === "queued").length;

  engineState.statistics.running =
    jobs.filter((j) => j.status === "running").length;

  engineState.statistics.completed =
    jobs.filter((j) => j.status === "completed").length;

  engineState.statistics.failed =
    jobs.filter((j) => j.status === "failed").length;
}
