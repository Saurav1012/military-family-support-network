import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();
const eventUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

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
  eventUpload.single("banner"),
  createEvent
);

// Update event (Admin only)
router.put(
  "/:id",
  protect,
  authorize("admin"),
  eventUpload.single("banner"),
  updateEvent
);

// Delete event (Admin only)
router.delete("/:id", protect, authorize("admin"), deleteEvent);

export default router;