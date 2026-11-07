import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { getRestaurantDashboard } from "../controllers/organizationController.js";

const router = express.Router();

router.get(
  "/dashboard",
  verifyToken,
  allowRoles("RESTAURANT"),
  getRestaurantDashboard
);

export default router;