export type OrderStatus = "PLACED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";

export type OrderItemMeal = {
  id: string;
  name: string;
  imageUrl: string | null;
  providerId?: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  mealId: string;
  quantity: number;
  price: string;
  meal: OrderItemMeal;
};

export type Order = {
  id: string;
  customerId: string;
  status: OrderStatus;
  deliveryAddress: string;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

export type CreateOrderPayload = {
  deliveryAddress: string;
  items: { mealId: string; quantity: number }[];
};

export type ProviderOrder = Order & {
  customer: { id: string; name: string; phone: string | null };
};

export type StatusFilter = OrderStatus | "ALL";
