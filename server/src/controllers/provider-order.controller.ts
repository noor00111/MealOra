import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

const statusSchema = z.object({
  status: z.enum(["PLACED", "PREPARING", "READY", "DELIVERED", "CANCELLED"]),
});

async function getOwnProviderProfile(userId: string) {
  return prisma.providerProfile.findUnique({ where: { userId } });
}

export async function getProviderOrders(req: AuthRequest, res: Response) {
  const profile = await getOwnProviderProfile(req.user!.userId);
  if (!profile) {
    return res.status(404).json({ success: false, message: "Provider profile not found" });
  }
  const orders = await prisma.order.findMany({
    where: { items: { some: { meal: { providerId: profile.id } } } },
    include: {
      customer: { select: { id: true, name: true, phone: true } },
      items: { include: { meal: { select: { id: true, name: true, imageUrl: true, providerId: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: orders });
}

export async function updateOrderStatus(req: AuthRequest, res: Response) {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }
  const profile = await getOwnProviderProfile(req.user!.userId);
  if (!profile) {
    return res.status(404).json({ success: false, message: "Provider profile not found" });
  }
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: { include: { meal: true } } },
  });
  if (!order || !order.items.some((item) => item.meal.providerId === profile.id)) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { status: parsed.data.status },
    include: {
      customer: { select: { id: true, name: true, phone: true } },
      items: { include: { meal: { select: { id: true, name: true, imageUrl: true, providerId: true } } } },
    },
  });
  res.json({ success: true, data: updated });
}
