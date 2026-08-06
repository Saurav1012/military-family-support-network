import express from "express";

import {
  createResource,
  getResources,
  deleteResource,
  updateResource,
} from "../controllers/resourceController.js";

import { uploadResourceFiles } from "../controllers/resourceUploadController.js";
import { protect } from "../middleware/authMiddleware.js";
// Agar named export (authorize) hai toh standard layout follow karo:
import { authorize } from "../middleware/roleMiddleware.js";
import multer from "multer";
import upload from "../middleware/uploadMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

import { createResourceValidator } from "../validators/resourceValidator.js";

const router = express.Router();
const resourceUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

/* =========================================================
   Resource Routes
========================================================= */

// Get all resources (Anyone can view resources)
router.get("/", getResources);

// Create resource (Admin only + Validation)
router.post(
  "/",
  protect,
  authorize("admin"),
  createResourceValidator,
  validateRequest,
  createResource
);

// Upload resource image & pdf (Admin only)
router.post(
  "/:id/upload",
  protect,
  authorize("admin"),
  resourceUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  uploadResourceFiles
);

// Update resource (Admin only + Validation)
router.put(
  "/:id",
  protect,
  authorize("admin"),
  createResourceValidator,
  validateRequest,
  updateResource
);

// Delete resource (Admin only)
router.delete("/:id", protect, authorize("admin"), deleteResource);

export default router;