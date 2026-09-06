import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

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
