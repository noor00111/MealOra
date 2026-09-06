import { Router } from "express";
import { getMealById, getMeals } from "../controllers/meal.controller";

const router = Router();

router.get("/", getMeals);
router.get("/:id", getMealById);

export default router;
