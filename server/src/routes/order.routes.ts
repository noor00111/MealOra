import { Router } from "express";
import { createOrder, getMyOrders, getOrderById } from "../controllers/order.controller";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.post("/", requireRole("CUSTOMER"), createOrder);
router.get("/", requireRole("CUSTOMER"), getMyOrders);
router.get("/:id", getOrderById);

export default router;
