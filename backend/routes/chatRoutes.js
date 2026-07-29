import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { messageValidator } from "../validators/chatValidator.js";

import {
  createConversation,
  sendMessage,
  getConversations,
  getMessages,
  markSeen,
} from "../controllers/chatController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/conversation", createConversation);

router.get("/conversation", getConversations);

router.get("/:conversationId", getMessages);

// Mark messages as seen route
router.put("/:conversationId/seen", markSeen);

// Send message route with validation
router.post(
  "/:conversationId",
  messageValidator,
  validateRequest,
  sendMessage
);

export default router;