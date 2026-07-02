import type {
  CRMActivity,
  Customer,
  Relationship,
  TimelineItem,
} from "../types";

export type CRMServiceResult<T> = {
  data: T | null;
  error: string | null;
};

export async function getRelationshipTimeline(
  relationshipId: string,
): Promise<CRMServiceResult<TimelineItem[]>> {
  // TODO: Koppla till Supabase.
  return {
    data: [],
    error: null,
  };
}

export async function getCustomerRelationships(
  customerId: string,
): Promise<CRMServiceResult<Relationship[]>> {
  // TODO: Koppla till Supabase.
  return {
    data: [],
    error: null,
  };
}

export async function createCRMActivity(
  activity: CRMActivity,
): Promise<CRMServiceResult<CRMActivity>> {
  // TODO: Koppla till Supabase och Calendar Engine.
  return {
    data: activity,
    error: null,
  };
}

export async function searchCustomers(
  query: string,
): Promise<CRMServiceResult<Customer[]>> {
  // TODO: Koppla till Supabase och Search Engine.
  return {
    data: [],
    error: null,
  };
}
