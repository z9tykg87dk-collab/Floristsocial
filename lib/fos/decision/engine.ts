import { runFosDecisionRules } from "./rules";
import { createFosAction } from "@/lib/fos/action-queue";
import type { FosDecisionInput, FosDecisionResult } from "./types";

export function runFosDecisionEngine(input: FosDecisionInput): FosDecisionResult {
  const actions = runFosDecisionRules(input);
  const result: FosDecisionResult = {
    input,
    actions,
    actionCount: actions.length,
    generatedAt: new Date().toISOString(),
  };

  if (input.enqueueToActionQueue !== true) {
    return result;
  }

  const queuedActionIds: string[] = [];

  for (const action of actions) {
    try {
      const queued = createFosAction({
        title: action.title,
        description: action.description,
        targetModule: action.targetModule,
        priority: action.priority,
        source: "decision-engine",
        payload: {
          decisionActionId: action.id,
          decisionActionType: action.type,
          decisionActionHref: action.href,
          decisionCreatedAt: action.createdAt,
          decisionInput: {
            eventType: input.eventType,
            module: input.module,
          },
        },
      });

      queuedActionIds.push(queued.id);
    } catch {
      // Keep returning recommendations even if one enqueue operation fails.
    }
  }

  result.enqueuedCount = queuedActionIds.length;
  result.queuedActionIds = queuedActionIds;

  return result;
}
