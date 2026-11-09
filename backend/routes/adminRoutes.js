
import express from "express";

import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

import {
  getAdminDashboard,
  getPendingVerifications,
  getAllVerifications,
  getVerificationById,
  updateVerificationStatus
} from "../controllers/adminController.js";

const router = express.Router();

router.get(
  "/dashboard",
  verifyToken,
  allowRoles("ADMIN"),
  getAdminDashboard
);

router.get(
  "/verifications",
  verifyToken,
  allowRoles("ADMIN"),
  getPendingVerifications
);

router.get(
  "/verifications/all",
  verifyToken,
  allowRoles("ADMIN"),
  getAllVerifications
);

router.get(
  "/verifications/:id",
  verifyToken,
  allowRoles("ADMIN"),
  getVerificationById
);

router.put(
  "/verifications/:id",
  verifyToken,
  allowRoles("ADMIN"),
  updateVerificationStatus
);

export default router;
