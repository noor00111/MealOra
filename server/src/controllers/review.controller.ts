import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

const createReviewSchema = z.object({
  mealId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export async function createReview(req: AuthRequest, res: Response) {
  const parsed = createReviewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }

  const { mealId, rating, comment } = parsed.data;
  const customerId = req.user!.userId;

  const hasOrdered = await prisma.orderItem.findFirst({
    where: { mealId, order: { customerId } },
  });
  if (!hasOrdered) {
    return res
      .status(403)
      .json({ success: false, message: "You can only review meals you have ordered" });
  }

  const existing = await prisma.review.findUnique({
    where: { customerId_mealId: { customerId, mealId } },
  });
  if (existing) {
    return res.status(409).json({ success: false, message: "You have already reviewed this meal" });
  }

  const review = await prisma.review.create({
    data: { customerId, mealId, rating, comment },
    include: { customer: { select: { id: true, name: true } } },
  });

  res.status(201).json({ success: true, data: review });
}

export async function getMealReviews(req: AuthRequest, res: Response) {
  const { mealId } = req.params;

  const reviews = await prisma.review.findMany({
    where: { mealId },
    include: { customer: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  res.json({ success: true, data: reviews });
}
