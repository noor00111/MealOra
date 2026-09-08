import { api } from "./api";
import { MealInput, ProviderMeal } from "@/types/provider-meal";
import { OrderStatus, ProviderOrder } from "@/types/order";

export async function fetchMyMeals() {
  const res = await api.get<{ success: true; data: ProviderMeal[] }>("/provider/meals");
  return res.data.data;
}

export async function createMyMeal(payload: MealInput) {
  const res = await api.post<{ success: true; data: ProviderMeal }>("/provider/meals", payload);
  return res.data.data;
}

export async function updateMyMeal(id: string, payload: Partial<MealInput>) {
  const res = await api.put<{ success: true; data: ProviderMeal }>(`/provider/meals/${id}`, payload);
  return res.data.data;
}

export async function deleteMyMeal(id: string) {
  await api.delete(`/provider/meals/${id}`);
}

export async function fetchProviderOrders() {
  const res = await api.get<{ success: true; data: ProviderOrder[] }>("/provider/orders");
  return res.data.data;
}

export async function updateProviderOrderStatus(id: string, status: OrderStatus) {
  const res = await api.patch<{ success: true; data: ProviderOrder }>(`/provider/orders/${id}`, {
    status,
  });
  return res.data.data;
}
