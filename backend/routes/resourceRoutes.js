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
import upload from "../middleware/uploadMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

import { createResourceValidator } from "../validators/resourceValidator.js";

const router = express.Router();

/* =========================================================
   Resource Routes
========================================================= */

// Get all resources (Any authenticated user)
router.get("/", protect, getResources);

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
  upload.fields([
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