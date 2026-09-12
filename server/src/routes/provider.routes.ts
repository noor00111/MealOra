import { Router } from "express";
import { getProviderById, getProviders, getMyProviderProfile, updateProviderProfile } from "../controllers/provider.controller";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", getProviders);
router.get("/me/profile", requireAuth, requireRole("PROVIDER"), getMyProviderProfile);
router.patch("/me/profile", requireAuth, requireRole("PROVIDER"), updateProviderProfile);
router.get("/:id", getProviderById);

export default router;
