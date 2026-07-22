import {
  AutomationJob,
  AutomationPriority,
} from "./types";

import {
  getAutomationJob,
  saveAutomationJob,
} from "./store";
import { claimNextFosAction } from "@/lib/fos/action-queue";
import { handleNotification } from "@/engines/workflow/handlers/NotificationHandler";

function createId(): string {
  return (
    "auto_" +
    Date.now() +
    "_" +
    Math.random().toString(36).slice(2, 8)
  );
}

export function createAutomationJob(input: {
  title: string;
  description: string;
  sourceEngine: string;
  targetModule: string;
  priority?: AutomationPriority;
  payload?: Record<string, unknown>;
}): AutomationJob {

  const job: AutomationJob = {
    id: createId(),
    title: input.title,
    description: input.description,
    sourceEngine: input.sourceEngine,
    targetModule: input.targetModule,
    priority: input.priority ?? "medium",
    status: "queued",
    payload: input.payload ?? {},
    createdAt: new Date().toISOString(),
  };

  saveAutomationJob(job);

  return job;
}

export function startAutomation(job: AutomationJob): AutomationJob {
  if (job.status !== "queued") {
    return job;
  }

  job.status = "running";
  job.startedAt = new Date().toISOString();

  saveAutomationJob(job);

  return job;
}

export function completeAutomation(job: AutomationJob): AutomationJob {
  if (job.status !== "running") {
    return job;
  }

  job.status = "completed";
  job.finishedAt = new Date().toISOString();

  saveAutomationJob(job);

  return job;
}

export function failAutomation(
  job: AutomationJob,
  error: string
): AutomationJob {
  if (job.status !== "running") {
    return job;
  }

  job.status = "failed";
  job.finishedAt = new Date().toISOString();
  job.error = error;

  saveAutomationJob(job);

  return job;
}

export function seedAutomationJobs() {

  createAutomationJob({
    title: "Skapa kalenderbokning",
    description: "Ny order ska bokas i kalendern.",
    sourceEngine: "Decision Engine",
    targetModule: "Calendar",
    priority: "high",
  });

  createAutomationJob({
    title: "Skicka orderbekräftelse",
    description: "Skicka notifiering till kund.",
    sourceEngine: "Decision Engine",
    targetModule: "Notification",
  });

  createAutomationJob({
    title: "Skapa CRM-aktivitet",
    description: "Lägg till uppföljning för återkommande kund.",
    sourceEngine: "Memory Engine",
    targetModule: "CRM",
  });

}

export function consumeNextQueuedAction(): AutomationJob | null {
  const claimedAction = claimNextFosAction();

  if (!claimedAction) {
    return null;
  }

  const priority: AutomationPriority =
    claimedAction.priority === "urgent"
      ? "critical"
      : claimedAction.priority;

  return createAutomationJob({
    title: claimedAction.title,
    description: claimedAction.description,
    sourceEngine: claimedAction.source,
    targetModule: claimedAction.targetModule,
    priority,
    payload: {
      ...claimedAction.payload,
    },
  });
}

export function executeAutomationJob(jobId: string): AutomationJob | null {
  const job = getAutomationJob(jobId);

  if (!job) {
    return null;
  }

  if (job.status !== "queued") {
    return {
      ...job,
      payload: { ...job.payload },
    };
  }

  const startedJob = startAutomation(job);

  if (startedJob.targetModule === "notification") {
    handleNotification({
      title: startedJob.title,
      message: startedJob.payload
        ? JSON.stringify(startedJob.payload)
        : "Automation notification",
      metadata: {
        jobId: startedJob.id,
      },
    });
  }

  return completeAutomation(startedJob);
}
