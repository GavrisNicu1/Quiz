import { Router } from "express";

import { authenticate, authorize } from "../middleware/authMiddleware";
import { getAdminStats } from "../controllers/adminController";

const router = Router();

router.use(authenticate, authorize(["ADMIN"]));
router.get("/stats", getAdminStats);

export default router;
