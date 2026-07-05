export type ProductionChecklistItem = {
  id: string;
  label: string;
  completed: boolean;
};

export type ProductionChecklist = {
  productionJobId: string;
  items: ProductionChecklistItem[];
};
