import express from "express";

import {
  createPost,
  getPosts,
  toggleLike,
  deletePost,
} from "../controllers/forumController.js";

import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

import {
  createForumValidator,
} from "../validators/forumValidator.js";

const router = express.Router();

/* Create Forum Post */
router.post(
  "/",
  protect,
  createForumValidator,
  validateRequest,
  createPost
);

/* Get All Posts */
router.get(
  "/",
  protect,
  getPosts
);

/* Like / Unlike Post */
router.put(
  "/:id/like",
  protect,
  toggleLike
);

/* Delete Post */
router.delete(
  "/:id",
  protect,
  deletePost
);

export default router;