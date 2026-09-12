import { OrderStatus } from "@/types/order";

export const statusStyles: Record<OrderStatus, string> = {
  PLACED: "bg-accent text-accent-foreground",
  PREPARING: "bg-accent text-accent-foreground",
  READY: "bg-secondary text-secondary-foreground",
  DELIVERED: "bg-brand-green/15 text-brand-green",
  CANCELLED: "bg-destructive/10 text-destructive",
};

export const statusSteps: OrderStatus[] = ["PLACED", "PREPARING", "READY", "DELIVERED"];

export const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  PLACED: "PREPARING",
  PREPARING: "READY",
  READY: "DELIVERED",
};

export const statusColor: Record<OrderStatus, string> = {
  PLACED: "#f97316",
  PREPARING: "#3b82f6",
  READY: "#10b981",
  DELIVERED: "#9ca3af",
  CANCELLED: "#ef4444",
};