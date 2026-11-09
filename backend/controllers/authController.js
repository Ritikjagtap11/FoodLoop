
import { db } from "../config/db.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER USER
export const registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const {
    name,
    email,
    password,
    role,
    organization_name,
    phone,
    address,
    city,
    document_type,
    document_number,
    document_url,
  } = req.body;

  if (
    (role === "RESTAURANT" && !["FSSAI", "OTHER"].includes(document_type)) ||
    (role === "NGO" && !["NGO_DARPAN", "OTHER"].includes(document_type))
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid document type for selected role",
    });
  }

  let connection;
  let transactionStarted = false;

  try {
    const [existingUsers] = await db.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "The email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    connection = await db.getConnection();

    await connection.beginTransaction();
    transactionStarted = true;

    const [resultUser] = await connection.query(
      "INSERT INTO users(name, email, password, role) VALUES(?,?,?,?)",
      [name, email, hashedPassword, role]
    );

    const userId = resultUser.insertId;

    const [resultOrganization] = await connection.query(
      `INSERT INTO organizations
       (user_id, organization_name, organization_type, phone, address, city)
       VALUES(?,?,?,?,?,?)`,
      [userId, organization_name, role, phone, address, city]
    );

    const organizationId = resultOrganization.insertId;

    await connection.query(
      `INSERT INTO verification_documents
       (organization_id, document_type, document_number, document_url)
       VALUES(?,?,?,?)`,
      [organizationId, document_type, document_number, document_url]
    );

    await connection.commit();
    transactionStarted = false;

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Your account is pending admin verification.",
      status: "PENDING",
    });
  } catch (error) {
    if (transactionStarted && connection) {
      await connection.rollback();
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};


// LOGIN USER
export const loginUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  try {
    const selectQuery = `
      SELECT
        u.user_id,
        u.name,
        u.email,
        u.password,
        u.role,
        u.account_status,
        o.verification_status,
        vd.remarks
      FROM users u
      LEFT JOIN organizations o
        ON o.user_id = u.user_id
      LEFT JOIN verification_documents vd
        ON vd.document_id = (
          SELECT MAX(v2.document_id)
          FROM verification_documents v2
          WHERE v2.organization_id = o.organization_id
        )
      WHERE u.email = ?
    `;

    const [rows] = await db.query(selectQuery, [email]);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password.",
      });
    }

    const user = rows[0];

    // Verify password first
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password.",
      });
    }

    // PENDING ACCOUNT
    if (user.account_status === "PENDING") {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_PENDING",
        status: "PENDING",
        message:
          "Your registration is currently under review. Please wait while our admin team verifies your documents.",
      });
    }

    // REJECTED ACCOUNT
    if (user.account_status === "REJECTED") {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_REJECTED",
        status: "REJECTED",
        message: "Your organization verification request has been rejected.",
        remarks:
          user.remarks || "No additional remarks were provided by the admin.",
      });
    }

    // OTHER INACTIVE ACCOUNT
    if (user.account_status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_INACTIVE",
        status: user.account_status,
        message:
          "Your account is currently inactive. Please contact the FoodLoop administration team.",
      });
    }

    // ACTIVE ACCOUNT: GENERATE JWT
    const token = jwt.sign(
      {
        userId: user.user_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return res.status(200).json({
      success: true,
      code: "LOGIN_SUCCESS",
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        account_status: user.account_status,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again later.",
    });
  }
};


// GET USER PROFILE
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const selectQuery = `
      SELECT user_id, name, email, role, account_status
      FROM users
      WHERE user_id = ?
    `;

    const [rows] = await db.query(selectQuery, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User does not exist.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: rows[0],
    });
  } catch (error) {
    console.error("Profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
