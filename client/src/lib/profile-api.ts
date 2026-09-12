import { api } from "./api";

export type UserProfileInput = {
  name?: string;
  phone?: string;
  address?: string;
};

export type ProviderProfileInput = {
  businessName?: string;
  description?: string;
  cuisine?: string;
  address?: string;
  logoUrl?: string;
};

export type ProviderProfileData = {
  id: string;
  businessName: string;
  description: string | null;
  cuisine: string | null;
  address: string | null;
  logoUrl: string | null;
};

export async function updateUserProfile(data: UserProfileInput) {
  const res = await api.patch<{ success: true; data: { user: { name: string; phone: string | null; address: string | null } } }>("/auth/profile", data);
  return res.data.data.user;
}

export async function fetchMyProviderProfile() {
  const res = await api.get<{ success: true; data: ProviderProfileData }>("/providers/me/profile");
  return res.data.data;
}

export async function updateProviderProfile(data: ProviderProfileInput) {
  const res = await api.patch<{ success: true; data: ProviderProfileData }>("/providers/me/profile", data);
  return res.data.data;
}
