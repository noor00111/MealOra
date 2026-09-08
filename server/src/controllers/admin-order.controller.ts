import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

export async function getAllOrders(_req: AuthRequest, res: Response) {
  const orders = await prisma.order.findMany({
    include: {
      customer: { select: { id: true, name: true, email: true } },
      items: {
        include: { meal: { select: { id: true, name: true, providerId: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ success: true, data: orders });
}
