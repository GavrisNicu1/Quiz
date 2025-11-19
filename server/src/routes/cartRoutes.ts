import { Router } from "express";

import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController";
import { authenticate } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import {
  addCartItemSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from "../validators/cartSchemas";

const router = Router();

router.use(authenticate);

router.get("/", getCart);
router.post("/items", validateRequest(addCartItemSchema), addCartItem);
router.patch("/items/:id", validateRequest(updateCartItemSchema), updateCartItem);
router.delete("/items/:id", validateRequest(removeCartItemSchema), removeCartItem);
router.delete("/items", clearCart);

export default router;
