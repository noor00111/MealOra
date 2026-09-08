import { api } from "./api";
import { AdminOrder, AdminUser, UserStatus } from "@/types/admin";
import { Category } from "@/types/meal";

export async function fetchAdminUsers() {
  const res = await api.get<{ success: true; data: AdminUser[] }>("/admin/users");
  return res.data.data;
}

export async function updateAdminUserStatus(id: string, status: UserStatus) {
  const res = await api.patch<{ success: true; data: AdminUser }>(`/admin/users/${id}`, { status });
  return res.data.data;
}

export async function fetchAdminOrders() {
  const res = await api.get<{ success: true; data: AdminOrder[] }>("/admin/orders");
  return res.data.data;
}

export async function updateAdminCategory(id: string, name: string) {
  const res = await api.put<{ success: true; data: Category }>(`/admin/categories/${id}`, { name });
  return res.data.data;
}

export async function deleteAdminCategory(id: string) {
  await api.delete(`/admin/categories/${id}`);
}
