export type TrustRatingCategory =
  | "quality"
  | "design"
  | "color"
  | "delivery";

export type TrustRating = {
  id: string;
  orderId: string;
  floristId: string;
  customerId: string;
  quality: number;
  design: number;
  color: number;
  delivery: number;
  wouldOrderAgain: boolean | null;
  comment?: string;
  verifiedPurchase: true;
  createdAt: string;
};
