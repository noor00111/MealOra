import { Router } from "express";
import { createCategory, getCategories } from "../controllers/category.controller";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", getCategories);
router.post("/", requireAuth, requireRole("PROVIDER", "ADMIN"), createCategory);

export default router;
