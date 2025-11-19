import { Router } from "express";

import { register, login, me, logout } from "../controllers/authController";
import { validateRequest } from "../middleware/validateRequest";
import { authenticate } from "../middleware/authMiddleware";
import { loginSchema, registerSchema } from "../validators/authSchemas";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.get("/me", authenticate, me);
router.post("/logout", authenticate, logout);

export default router;
