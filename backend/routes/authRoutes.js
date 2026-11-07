import express from "express";
import { body } from "express-validator";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  loginUser,
  registerUser,
  getProfile,
} from "../controllers/authController.js";

const router = express.Router();

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Invalid Email").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role").isIn(["RESTAURANT", "NGO"]).withMessage("Invalid role"),
  body("organization_name")
    .trim()
    .notEmpty()
    .withMessage("organization name is required"),
  body("phone").trim().notEmpty().withMessage("phone is required"),
  body("address").trim().notEmpty().withMessage("address is required"),
  body("city").trim().notEmpty().withMessage("city is required"),
  body("document_type")
    .isIn(["FSSAI", "NGO_DARPAN", "OTHER"])
    .withMessage("Invalid document type"),
  body("document_number")
    .trim()
    .notEmpty()
    .withMessage("document number is required"),
  body("document_url")
    .trim()
    .notEmpty()
    .withMessage("document url is required"),
];

const loginValidation = [
  body("email").trim().isEmail().withMessage("Invalid Email").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.get("/profile", verifyToken, getProfile);

export default router;
