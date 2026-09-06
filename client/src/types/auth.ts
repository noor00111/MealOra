import { z } from "zod";

export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
  address: string | null;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  success: true;
  data: { user: AuthUser; token: string };
};

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginForm = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CUSTOMER", "PROVIDER"]),
});
export type SignupForm = z.infer<typeof signupSchema>;
