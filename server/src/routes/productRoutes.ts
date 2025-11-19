import { Router } from "express";

import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
} from "../validators/productSchemas";

const router = Router();

router.get("/", listProducts);
router.get("/:id", validateRequest(productIdSchema), getProduct);

router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  validateRequest(createProductSchema),
  createProduct
);

router.patch(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  validateRequest(updateProductSchema),
  updateProduct
);

router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  validateRequest(productIdSchema),
  deleteProduct
);

export default router;
