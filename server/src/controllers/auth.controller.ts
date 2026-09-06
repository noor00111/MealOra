import bcrypt from "bcryptjs";
import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { signToken } from "../lib/jwt";
import { AuthRequest } from "../middleware/auth";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["CUSTOMER", "PROVIDER"]).default("CUSTOMER"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  address: string | null;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
  };
}

export async function register(req: AuthRequest, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }

  const { name, email, password, role, phone, address } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ success: false, message: "Email is already registered" });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role, phone, address },
  });
  const token = signToken({ userId: user.id, role: user.role });
  res.status(201).json({ success: true, data: { user: toPublicUser(user), token } });
}


export async function login(req: AuthRequest, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }
  const token = signToken({ userId: user.id, role: user.role });
  res.json({ success: true, data: { user: toPublicUser(user), token } });
}


export async function me(req: AuthRequest, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({ success: true, data: { user: toPublicUser(user) } });
}
