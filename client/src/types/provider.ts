import { Category } from "./meal";

export type Provider = {
  id: string;
  businessName: string;
  description: string | null;
  logoUrl: string | null;
  address: string | null;
  cuisine: string | null;
};

export type ProviderMeal = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  isAvailable: boolean;
  category: Category | null;
};

export type ProviderDetail = Provider & {
  createdAt: string;
  updatedAt: string;
  meals: ProviderMeal[];
};
