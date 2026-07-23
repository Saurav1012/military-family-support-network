import express from "express";

import {
  registerUser,
  loginUser,
  getProfile, // Added getProfile import
} from "../controllers/authController.js";

import {
  registerValidator,
  loginValidator,
} from "../validators/authValidator.js";

import { protect } from "../middleware/authMiddleware.js"; // Added protect middleware import

const router = express.Router();

// Register
router.post(
  "/register",
  registerValidator,
  registerUser
);

// Login
router.post(
  "/login",
  loginValidator,
  loginUser
);

// Get User Profile (Protected Route)
router.get(
  "/profile",
  protect,
  getProfile
);

export default router;