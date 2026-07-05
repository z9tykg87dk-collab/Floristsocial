import { runFosDecisionRules } from "./rules";
import type { FosDecisionInput } from "./types";

export function runFosDecisionEngine(input: FosDecisionInput) {
  const actions = runFosDecisionRules(input);

  return {
    input,
    actions,
    actionCount: actions.length,
    generatedAt: new Date().toISOString(),
  };
}
