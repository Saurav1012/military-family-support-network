import express from "express";
import multer from "multer";
import { updateProfile, changePassword } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const profileUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.put("/profile", protect, profileUpload.single("profileImage"), updateProfile);
router.put("/change-password", protect, changePassword);

export default router;