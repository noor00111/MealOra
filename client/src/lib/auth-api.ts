import { api } from "./api";
import { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth";

export async function registerRequest(payload: RegisterPayload) {
  const res = await api.post<AuthResponse>("/auth/register", payload);
  return res.data.data;
}

export async function loginRequest(payload: LoginPayload) {
  const res = await api.post<AuthResponse>("/auth/login", payload);
  return res.data.data;
}
