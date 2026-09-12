import { Router } from "express";
import { createReview, getMealReviews } from "../controllers/review.controller";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/meal/:mealId", getMealReviews);
router.post("/", requireAuth, requireRole("CUSTOMER"), createReview);

export default router;
