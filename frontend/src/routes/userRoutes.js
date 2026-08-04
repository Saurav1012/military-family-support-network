import express from "express";
import { protect } from "../middleware/authMiddleware.js"; // JWT Protect Middleware
import { updateProfile, changePassword } from "../controllers/userController.js";
import multer from "multer";

// Multer Config (agar profile image upload handle kar rahe ho)
const upload = multer({ dest: "uploads/" }); 

const router = express.Router();

// 1. Profile update route (matches API.put("/user/profile"))
router.put("/profile", protect, upload.single("profileImage"), updateProfile);

// 2. Password change route (matches API.put("/user/change-password"))
router.put("/change-password", protect, changePassword);

export default router;