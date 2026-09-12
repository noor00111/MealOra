import { z } from "zod";
import { Category } from "./meal";

export type ProviderMeal = {
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
};

export type MealInput = {
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  discountPercent?: number;
};

export const mealFormSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  categoryId: z.string().optional(),
  imageUrl: z.string().optional(),
  isAvailable: z.boolean(),
  discountPercent: z.coerce.number().int().min(0).max(90),
});

export type MealForm = z.input<typeof mealFormSchema>;
export type MealFormOutput = z.output<typeof mealFormSchema>;
