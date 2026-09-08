import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const categorySchema = z.object({name: z.string().min(2)});

export async function getCategories(_req: Request, res: Response) {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  res.json({ success: true, data: categories });
}

export async function createCategory(req: Request, res: Response) {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }

  const { name } = parsed.data;
  const slug = slugify(name);

  const existing = await prisma.category.findFirst({ where: { OR: [{ name }, { slug }] } });
  if (existing) {
    return res.status(409).json({ success: false, message: "Category already exists" });
  }

  const category = await prisma.category.create({ data: { name, slug } });
  res.status(201).json({ success: true, data: category });
}
