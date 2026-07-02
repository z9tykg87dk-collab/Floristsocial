import type { FloristSocialRole } from "@/core/types/roles";

export type CustomerType =
  | "private_customer"
  | "business_customer"
  | "courier"
  | "event_company"
  | "supplier";

export type Customer = {
  id: string;
  role: FloristSocialRole;
  customerType: CustomerType;
  displayName: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  createdAt: string;
  updatedAt?: string;
};
