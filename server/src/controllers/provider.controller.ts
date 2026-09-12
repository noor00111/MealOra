import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

const updateProviderProfileSchema = z.object({
  businessName: z.string().min(2).optional(),
  description: z.string().optional(),
  cuisine: z.string().optional(),
  address: z.string().optional(),
  logoUrl: z.string().optional(),
});

export async function updateProviderProfile(req: AuthRequest, res: Response) {
  const parsed = updateProviderProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }
  const profile = await prisma.providerProfile.findUnique({ where: { userId: req.user!.userId } });
  if (!profile) {
    return res.status(404).json({ success: false, message: "Provider profile not found" });
  }
  const updated = await prisma.providerProfile.update({
    where: { id: profile.id },
    data: parsed.data,
  });
  res.json({ success: true, data: updated });
}

export async function getMyProviderProfile(req: AuthRequest, res: Response) {
  const profile = await prisma.providerProfile.findUnique({ where: { userId: req.user!.userId } });
  if (!profile) {
    return res.status(404).json({ success: false, message: "Provider profile not found" });
  }
  res.json({ success: true, data: profile });
}

export async function getProviders(_req: Request, res: Response) {
  const providers = await prisma.providerProfile.findMany({
    select: {
      id: true,
      businessName: true,
      description: true,
      logoUrl: true,
      address: true,
      cuisine: true,
    },
    orderBy: { businessName: "asc" },
  });

  res.json({ success: true, data: providers });
}

export async function getProviderById(req: Request, res: Response) {
  const { id } = req.params;
  const provider = await prisma.providerProfile.findUnique({
    where: { id },
    select: {
      id: true,
      businessName: true,
      description: true,
      logoUrl: true,
      address: true,
      cuisine: true,
      createdAt: true,
      updatedAt: true,
      meals: {
        where: { isAvailable: true },
        include: { category: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!provider) {
    return res.status(404).json({ success: false, message: "Provider not found" });
  }

  res.json({ success: true, data: provider });
}
