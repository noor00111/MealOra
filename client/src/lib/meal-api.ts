import { api } from "./api";
import { Category, Meal, MealFilters } from "@/types/meal";
import { ProviderDetail, Provider } from "@/types/provider";

export async function fetchMeals(filters: MealFilters = {}) {
  const params: Record<string, string> = {};
  if (filters.category) params.category = filters.category;
  if (filters.minPrice !== undefined) params.minPrice = String(filters.minPrice);
  if (filters.maxPrice !== undefined) params.maxPrice = String(filters.maxPrice);
  if (filters.search) params.search = filters.search;

  const res = await api.get<{ success: true; data: Meal[] }>("/meals", { params });
  return res.data.data;
}

export async function fetchMealById(id: string) {
  const res = await api.get<{ success: true; data: Meal }>(`/meals/${id}`);
  return res.data.data;
}

export async function fetchProviders() {
  const res = await api.get<{ success: true; data: Provider[] }>("/providers");
  return res.data.data;
}

export async function fetchProviderById(id: string) {
  const res = await api.get<{ success: true; data: ProviderDetail }>(`/providers/${id}`);
  return res.data.data;
}

export async function fetchCategories() {
  const res = await api.get<{ success: true; data: Category[] }>("/categories");
  return res.data.data;
}

export async function createCategory(name: string) {
  const res = await api.post<{ success: true; data: Category }>("/categories", { name });
  return res.data.data;
}
