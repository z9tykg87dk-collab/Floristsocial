import type {
  FOSStateEntityType,
  FOSStateRecord,
  FOSStateStatus,
  FOSStateTimelineItem,
} from "../types";

export function createFOSStateRecord(input: {
  entityId: string;
  entityType: FOSStateEntityType;
  status: FOSStateStatus;
  currentStep?: string;
  nextStep?: string;
  previousStep?: string;
  ownerId?: string;
  ownerRole?: string;
}): FOSStateRecord {
  return {
    id: crypto.randomUUID(),
    updatedAt: new Date().toISOString(),
    ...input,
  };
}

export function createFOSTimelineItem(input: {
  entityId: string;
  entityType: FOSStateEntityType;
  action: string;
  description?: string;
  actorId?: string;
  actorRole?: string;
}): FOSStateTimelineItem {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
}

export function advanceFOSState(input: {
  state: FOSStateRecord;
  nextStatus: FOSStateStatus;
  nextStep?: string;
}): FOSStateRecord {
  return {
    ...input.state,
    previousStep: input.state.currentStep,
    currentStep: input.state.nextStep || input.state.currentStep,
    nextStep: input.nextStep,
    status: input.nextStatus,
    updatedAt: new Date().toISOString(),
  };
}
