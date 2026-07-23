import express from "express";

import {
  getPendingUsers,
  approveUser,
  rejectUser,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/pending-users", getPendingUsers);

router.put("/approve/:id", approveUser);

router.put("/reject/:id", rejectUser);

export default router;