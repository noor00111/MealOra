export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type ProviderSummary = {
  id: string;
  businessName: string;
  cuisine: string | null;
  logoUrl: string | null;
};

export type Meal = {
  id: string;
  providerId: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  isAvailable: boolean;
  discountPercent: number;
  createdAt: string;
  updatedAt: string;
  category: Category | null;
  provider: ProviderSummary;
};

export type MealFilters = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  deal?: boolean;
};
