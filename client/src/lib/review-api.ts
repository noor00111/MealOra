import { api } from "./api";
import { CreateReviewPayload, Review } from "@/types/review";

export async function fetchMealReviews(mealId: string) {
  const res = await api.get<{ success: true; data: Review[] }>(`/reviews/meal/${mealId}`);
  return res.data.data;
}

export async function createReview(payload: CreateReviewPayload) {
  const res = await api.post<{ success: true; data: Review }>("/reviews", payload);
  return res.data.data;
}
