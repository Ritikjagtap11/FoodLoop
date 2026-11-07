import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { getNGODashboard } from "../controllers/organizationController.js";

const router = express.Router();

router.get(
    "/dashboard", 
    verifyToken, 
    allowRoles("NGO"), 
    getNGODashboard
);

export default router;
