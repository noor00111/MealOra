import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

const createOrderSchema = z.object({
  deliveryAddress: z.string().min(5, "Delivery address is required"),
  items: z.array(z.object({
        mealId: z.string().min(1),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "Order must contain at least one item"),
});

export async function createOrder(req: AuthRequest, res: Response) {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }

  const { deliveryAddress, items } = parsed.data;
  const customerId = req.user!.userId;
  const mealIds = items.map((i) => i.mealId);
  const meals = await prisma.meal.findMany({ where: { id: { in: mealIds } } });

  if (meals.length !== new Set(mealIds).size) {
    return res.status(400).json({ success: false, message: "One or more meals do not exist" });
  }

  const unavailable = meals.find((m) => !m.isAvailable);
  if (unavailable) {
    return res.status(400).json({ success: false, message: `${unavailable.name} is not available` });
  }

  const mealById = new Map(meals.map((m) => [m.id, m]));
  const orderItems = items.map((item) => {
    const meal = mealById.get(item.mealId)!;
    return {
      mealId: item.mealId,
      quantity: item.quantity,
      price: meal.price,
    };
  });

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      customerId,
      deliveryAddress,
      totalAmount,
      items: { create: orderItems },
    },
    include: {
      items: { include: { meal: true } },
    },
  });

  res.status(201).json({ success: true, data: order });
}

export async function getMyOrders(req: AuthRequest, res: Response) {
  const orders = await prisma.order.findMany({
    where: { customerId: req.user!.userId },
    include: {
      items: {
        include: { meal: { select: { id: true, name: true, imageUrl: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ success: true, data: orders });
}

export async function getOrderById(req: AuthRequest, res: Response) {
  const { id } = req.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { meal: { select: { id: true, name: true, imageUrl: true, providerId: true } } },
      },
    },
  });

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (order.customerId !== req.user!.userId && req.user!.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  res.json({ success: true, data: order });
}
