import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

import {
  createAlert,
  getAlerts,
  deactivateAlert,
} from "../controllers/emergencyController.js";

const router = express.Router();

/* =========================================================
   Emergency Alert Routes
========================================================= */

// Get all active alerts (Any authenticated user)
router.get("/", protect, getAlerts);

// Create a new emergency alert (Admin only)
router.post(
  "/",
  protect,
  authorize("admin"),
  createAlert
);

// Deactivate an existing alert (Admin only)
router.put(
  "/:id/deactivate",
  protect,
  authorize("admin"),
  deactivateAlert
);

export default router;