import { Role } from "./auth";
import { Order } from "./order";

export type UserStatus = "ACTIVE" | "SUSPENDED";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  phone: string | null;
  createdAt: string;
};

export type AdminOrder = Order & {
  customer: { id: string; name: string; email: string };
};
