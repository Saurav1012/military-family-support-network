import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  uploadProfileImage,
  uploadVerificationDocument,
} from "../controllers/uploadController.js";

const router = express.Router();

/* Upload Profile */

router.post(
  "/profile",
  authMiddleware,
  upload.single("file"),
  uploadProfileImage
);

/* Upload Verification */

router.post(
  "/verification",
  authMiddleware,
  upload.single("file"),
  uploadVerificationDocument
);

export default router;