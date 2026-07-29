import express from "express";

import {
  getPendingUsers,
  approveUser,
  rejectUser,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

/* =========================================================
   Middleware Guard
   Subhi routes ko automatically protect & admin-only banata hai
========================================================= */
router.use(protect);
router.use(authorize("admin"));

/* =========================================================
   Admin Management Routes
========================================================= */

// Get list of pending users
router.get("/pending-users", getPendingUsers);

// Approve a user account
router.put("/approve/:id", approveUser);

// Reject a user account
router.put("/reject/:id", rejectUser);

export default router;