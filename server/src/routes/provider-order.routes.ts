import { Router } from "express";
import { getProviderOrders, updateOrderStatus } from "../controllers/provider-order.controller";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.use(requireAuth, requireRole("PROVIDER"));

router.get("/", getProviderOrders);
router.patch("/:id", updateOrderStatus);

export default router;
