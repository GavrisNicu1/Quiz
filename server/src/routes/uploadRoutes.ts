import { Router } from "express";

import { authenticate, authorize } from "../middleware/authMiddleware";
import { uploadImage } from "../middleware/uploadMiddleware";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  uploadImage.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Nu s-a trimis niciun fișier" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    return res.status(201).json({ imageUrl });
  }
);

export default router;
