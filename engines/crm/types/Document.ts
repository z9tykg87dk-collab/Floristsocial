export type CRMDocumentType =
  | "quote"
  | "agreement"
  | "invoice"
  | "price_list"
  | "catalog"
  | "image"
  | "pdf"
  | "other";

export type CRMDocument = {
  id: string;
  relationshipId: string;
  type: CRMDocumentType;
  title: string;
  fileUrl?: string;
  mediaId?: string;
  createdBy: string;
  createdAt: string;
};
