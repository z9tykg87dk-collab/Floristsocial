import type { FosMemoryRecord, FosMemoryType, FosMemoryConfidence } from "./types";

const memoryRecords: FosMemoryRecord[] = [];

function now() {
  return new Date().toISOString();
}

function createId() {
  return `fos_mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createFosMemory(input: {
  type: FosMemoryType;
  subjectId: string;
  key: string;
  value: string;
  confidence?: FosMemoryConfidence;
  source?: string;
}) {
  const record: FosMemoryRecord = {
    id: createId(),
    type: input.type,
    subjectId: input.subjectId,
    key: input.key,
    value: input.value,
    confidence: input.confidence || "medium",
    source: input.source || "manual",
    createdAt: now(),
    updatedAt: now(),
  };

  memoryRecords.unshift(record);
  return record;
}

export function listFosMemory() {
  return memoryRecords;
}

export function seedDemoFosMemory() {
  if (memoryRecords.length > 0) return memoryRecords;

  createFosMemory({
    type: "customer",
    subjectId: "demo-customer",
    key: "Favoritblomma",
    value: "Rosor",
    confidence: "high",
    source: "order-history",
  });

  createFosMemory({
    type: "customer",
    subjectId: "demo-customer",
    key: "Vanlig ordernivå",
    value: "1000-1500 kr",
    confidence: "medium",
    source: "order-history",
  });

  createFosMemory({
    type: "florist",
    subjectId: "demo-florist",
    key: "Starkaste kategori",
    value: "Bröllop",
    confidence: "high",
    source: "sales-pattern",
  });

  createFosMemory({
    type: "season",
    subjectId: "sweden-spring",
    key: "Säsongsmönster",
    value: "Tulpaner och ljusa buketter ökar under våren",
    confidence: "medium",
    source: "season-analysis",
  });

  return memoryRecords;
}
