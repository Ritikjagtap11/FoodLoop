import { db } from "../config/db.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
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
      message: "Invalid document type for selected role",
    });
  }

  const queryEmailExist = "SELECT user_id FROM users WHERE email = ?";

  const [rows] = await db.query(queryEmailExist, [email]);

  if (rows.length > 0) {
    return res.status(409).json({
      success: false,
      message: "The email already exists.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let transactionStarted = false;
  let connection;

  try {
    connection = await db.getConnection();

    await connection.beginTransaction();
    transactionStarted = true;
    const queryInsertUsers =
      "INSERT INTO users(name, email, password, role) VALUES(?,?,?,?)";
    const [resultUser] = await connection.query(queryInsertUsers, [
      name,
      email,
      hashedPassword,
      role,
    ]);

    const userId = resultUser.insertId;

    const queryInsertOrganization =
      "INSERT INTO organizations(user_id, organization_name, organization_type, phone, address, city) VALUES(?,?,?,?,?,?)";

    const [resultOrganization] = await connection.query(
      queryInsertOrganization,
      [userId, organization_name, role, phone, address, city],
    );

    const organizationId = resultOrganization.insertId;

    const queryInsertVerificationDocument =
      "INSERT INTO verification_documents(organization_id, document_type, document_number, document_url) VALUES(?,?,?,?)";

    const [resultVerificationDocument] = await connection.query(
      queryInsertVerificationDocument,
      [organizationId, document_type, document_number, document_url],
    );

    await connection.commit();
    transactionStarted = false;

    return res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    if (transactionStarted && connection) {
      await connection.rollback();
      transactionStarted = false;
    }

    console.error(error);

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

export const loginUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  try {
    const selectQuery =
      "SELECT user_id, name, email, password, role, account_status FROM users WHERE email = ?";
    const [rows] = await db.query(selectQuery, [email]);

    if (rows.length === 0) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const user = rows[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    if (!(user.account_status === "ACTIVE")) {
      return res.status(403).send({ message: "Forbidden" });
    }

    const response = jwt.sign(
      {
        userId: user.user_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: response,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Login failed" });
  }
};


export const getProfile = async (req, res) => {
  try {
  
    const userId = req.user.userId;


    const selectQuery = "SELECT user_id, name, email, role, account_status FROM users WHERE user_id = ?";

    const [rows] = await db.query(selectQuery,[userId]);

    if(rows.length === 0){
      return res.status(404).json({
        message:"user not exist"
      });
    }

    const user = rows[0];

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: user,
    });

  } catch (error) {

    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    }); 

  }
};