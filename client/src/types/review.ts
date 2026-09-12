export type Review = {
  id: string;
  customerId: string;
  mealId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  customer: { id: string; name: string };
};

export type CreateReviewPayload = {
  mealId: string;
  rating: number;
  comment?: string;
};
