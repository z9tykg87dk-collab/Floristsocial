import { runFosRules } from "./rules";
import { calculateFosScores } from "./scores";
import type { FosBusinessSnapshot } from "./types";

export function runFosIntelligence(snapshot: FosBusinessSnapshot) {
  return {
    snapshot,
    scores: calculateFosScores(snapshot),
    recommendations: runFosRules(snapshot),
    generatedAt: new Date().toISOString(),
  };
}
