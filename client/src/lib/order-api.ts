import { api } from "./api";
import { CreateOrderPayload, Order } from "@/types/order";

export async function createOrder(payload: CreateOrderPayload) {
  const res = await api.post<{ success: true; data: Order }>("/orders", payload);
  return res.data.data;
}

export async function fetchMyOrders() {
  const res = await api.get<{ success: true; data: Order[] }>("/orders");
  return res.data.data;
}

export async function fetchOrderById(id: string) {
  const res = await api.get<{ success: true; data: Order }>(`/orders/${id}`);
  return res.data.data;
}
