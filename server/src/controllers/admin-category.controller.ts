import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";
import { slugify } from "./category.controller";

const categorySchema = z.object({
  name: z.string().min(2),
});

export async function updateCategory(req: AuthRequest, res: Response) {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }
  const { id } = req.params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }
  const { name } = parsed.data;
  const slug = slugify(name);
  const conflict = await prisma.category.findFirst({
    where: { id: { not: id }, OR: [{ name }, { slug }] },
  });
  if (conflict) {
    return res.status(409).json({ success: false, message: "Category already exists" });
  }
  const updated = await prisma.category.update({ where: { id }, data: { name, slug } });
  res.json({ success: true, data: updated });
}

export async function deleteCategory(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }
  await prisma.category.delete({ where: { id } });
  res.json({ success: true, data: null });
}
