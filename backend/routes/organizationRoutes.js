import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getVerificationStatus, submitDocuments } from "../controllers/organizationController.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/documents",
  verifyToken,
  allowRoles("RESTAURANT", "NGO"),
  submitDocuments
);

router.get(
  "/verification-status",
  verifyToken,
  allowRoles("RESTAURANT", "NGO"),
  getVerificationStatus,
);

export default router;
