
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import {db} from './config/db.js';

import { verifyToken } from "./middleware/authMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import ngoRoutes from "./routes/ngoRoutes.js";
// import donationRoutes from "./routes/donationRoutes.js";
// import requestRoutes from "./routes/requestRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/ngo", ngoRoutes);
// app.use("/api/donations", donationRoutes);
// app.use("/api/requests", requestRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("FoodLoop Backend is Running!");
});

// Database health check
app.get("/api/health", async (req, res) => {
    try {
        await db.query("SELECT 1");

        res.json({
            success: true,
            message: "Backend and MySQL connected successfully"
        });
    } catch (error) {
        console.error("Database health check failed:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

app.get("/api/test-protected", verifyToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Token verified successfully",
        user: req.user
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`FoodLoop server running on port ${PORT}`);
});
