import { Router } from "express";
import { getProviderById, getProviders } from "../controllers/provider.controller";

const router = Router();

router.get("/", getProviders);
router.get("/:id", getProviderById);

export default router;
