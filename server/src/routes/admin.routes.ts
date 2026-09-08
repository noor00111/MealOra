import { Router } from "express";
import { getUsers, updateUserStatus } from "../controllers/admin-user.controller";
import { getAllOrders } from "../controllers/admin-order.controller";
import { deleteCategory, updateCategory } from "../controllers/admin-category.controller";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.use(requireAuth, requireRole("ADMIN"));

router.get("/users", getUsers);
router.patch("/users/:id", updateUserStatus);
router.get("/orders", getAllOrders);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

export default router;
