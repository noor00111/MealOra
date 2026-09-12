import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export async function getMeals(req: Request, res: Response) {
  const { category, minPrice, maxPrice, search, deal } = req.query;

  const where: Prisma.MealWhereInput = {
    isAvailable: true,
  };

  if (deal === "true") {
    where.discountPercent = { gt: 0 };
  }

  if (typeof category === "string") {
    where.category = { slug: category };
  }

  if (typeof search === "string" && search.trim()) {
    where.name = { contains: search, mode: "insensitive" };
  }

  const price: Prisma.DecimalFilter = {};
  if (typeof minPrice === "string" && !Number.isNaN(Number(minPrice))) {
    price.gte = Number(minPrice);
  }
  if (typeof maxPrice === "string" && !Number.isNaN(Number(maxPrice))) {
    price.lte = Number(maxPrice);
  }
  if (Object.keys(price).length > 0) {
    where.price = price;
  }

  const meals = await prisma.meal.findMany({
    where,
    include: {
      category: true,
      provider: { select: { id: true, businessName: true, cuisine: true, logoUrl: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: meals });
}

export async function getMealById(req: Request, res: Response) {
  const { id } = req.params;
  const meal = await prisma.meal.findUnique({
    where: { id },
    include: {
      category: true,
      provider: { select: { id: true, businessName: true, cuisine: true, logoUrl: true, address: true } },
    },
  });

  if (!meal) {
    return res.status(404).json({ success: false, message: "Meal not found" });
  }
  res.json({ success: true, data: meal });
}
