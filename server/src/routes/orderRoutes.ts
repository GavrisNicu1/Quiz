import { Router } from "express";

import { listOrders, checkout, updateOrderStatus } from "../controllers/orderController";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { checkoutSchema, updateOrderStatusSchema } from "../validators/orderSchemas";

const router = Router();

router.use(authenticate);

router.get("/", listOrders);
router.post("/checkout", validateRequest(checkoutSchema), checkout);
router.patch(
	"/:id/status",
	authorize(["ADMIN"]),
	validateRequest(updateOrderStatusSchema),
	updateOrderStatus
);

export default router;
