import express from "express";

import {
  createCommunity,
  getCommunities,
  joinCommunity,
} from "../controllers/communityController.js";

import { protect } from "../middleware/authMiddleware.js";

import { createCommunityValidator } from "../validators/communityValidator.js";

import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

/* Create Community */
router.post(
  "/",
  protect,
  createCommunityValidator,
  validateRequest,
  createCommunity
);

/* Get All Communities */
router.get("/", protect, getCommunities);

/* Join Community */
router.post("/:id/join", protect, joinCommunity);

export default router;