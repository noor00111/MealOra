import { Request } from "express";

export type JwtPayload = {
  userId: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
};

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
