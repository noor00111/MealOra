import { Router } from "express";
import {createMeal, deleteMeal, getMyMeals, updateMeal} from "../controllers/provider-meal.controller";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.use(requireAuth, requireRole("PROVIDER"));

router.get("/", getMyMeals);
router.post("/", createMeal);
router.put("/:id", updateMeal);
router.delete("/:id", deleteMeal);

export default router;
