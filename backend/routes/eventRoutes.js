import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // Banner upload ke liye agar use kar rahe ho

const router = express.Router();

/* =========================================================
   Event Routes
========================================================= */

// Get all events (Any authenticated user)
router.get("/", protect, getEvents);

// Create event (Admin only)
// Note: upload.single('banner') tabhi chalega agar multer set hai, otherwise use normal handler
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("banner"),
  createEvent
);

// Update event (Admin only)
router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.single("banner"),
  updateEvent
);

// Delete event (Admin only)
router.delete("/:id", protect, authorize("admin"), deleteEvent);

export default router;