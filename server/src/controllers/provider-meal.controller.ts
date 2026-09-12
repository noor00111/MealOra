import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

const mealSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  categoryId: z.string().optional(),
  imageUrl: z.string().optional(),
  isAvailable: z.boolean().optional(),
  discountPercent: z.number().int().min(0).max(90).optional(),
});

async function getOwnProviderProfile(userId: string) {
  return prisma.providerProfile.findUnique({ where: { userId } });
}

export async function getMyMeals(req: AuthRequest, res: Response) {
  const profile = await getOwnProviderProfile(req.user!.userId);
  if (!profile) {
    return res.status(404).json({ success: false, message: "Provider profile not found" });
  }
  const meals = await prisma.meal.findMany({
    where: { providerId: profile.id },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: meals });
}

export async function createMeal(req: AuthRequest, res: Response) {
  const parsed = mealSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }
  const profile = await getOwnProviderProfile(req.user!.userId);
  if (!profile) {
    return res.status(404).json({ success: false, message: "Provider profile not found" });
  }
  const meal = await prisma.meal.create({
    data: { ...parsed.data, providerId: profile.id },
    include: { category: true },
  });
  res.status(201).json({ success: true, data: meal });
}

export async function updateMeal(req: AuthRequest, res: Response) {
  const parsed = mealSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }
  const profile = await getOwnProviderProfile(req.user!.userId);
  if (!profile) {
    return res.status(404).json({ success: false, message: "Provider profile not found" });
  }
  const meal = await prisma.meal.findUnique({ where: { id: req.params.id } });
  if (!meal || meal.providerId !== profile.id) {
    return res.status(404).json({ success: false, message: "Meal not found" });
  }
  const updated = await prisma.meal.update({
    where: { id: meal.id },
    data: parsed.data,
    include: { category: true },
  });
  res.json({ success: true, data: updated });
}

export async function deleteMeal(req: AuthRequest, res: Response) {
  const profile = await getOwnProviderProfile(req.user!.userId);
  if (!profile) {
    return res.status(404).json({ success: false, message: "Provider profile not found" });
  }
  const meal = await prisma.meal.findUnique({ where: { id: req.params.id } });
  if (!meal || meal.providerId !== profile.id) {
    return res.status(404).json({ success: false, message: "Meal not found" });
  }
  await prisma.meal.delete({ where: { id: meal.id } });
  res.json({ success: true, data: null });
}
