import { db } from "../config/db.js";

export const getVerificationStatus = async (req, res) => {
  try {
    const userId = req.user.userId;

    const leftJoinQuery = `
      SELECT
        o.organization_id,
        o.organization_name,
        o.verification_status,
        vd.document_type,
        vd.review_status
      FROM organizations o
      LEFT JOIN verification_documents vd
        ON o.organization_id = vd.organization_id
      WHERE o.user_id = ?
    `;

    const [rows] = await db.query(leftJoinQuery, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    const organization = rows[0];

    const documents = rows
      .filter((row) => row.document_type !== null)
      .map((row) => ({
        document_type: row.document_type,
        review_status: row.review_status,
      }));

    return res.status(200).json({
      success: true,
      message: "Verification status fetched successfully",
      organization: {
        organization_id: organization.organization_id,
        organization_name: organization.organization_name,
        verification_status: organization.verification_status,
      },
      documents: documents,
    });
  } catch (error) {
    console.error("Verification status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch verification status",
    });
  }
};

export const getRestaurantDashboard = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Restaurant Dashboard",
    user: req.user,
  });
};

export const getNGODashboard = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to NGO Dashboard",
    user: req.user,
  });
};

export const submitDocuments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    const { document_type, document_number, document_url } = req.body;

    if (
      typeof document_type !== "string" ||
      typeof document_number !== "string" ||
      typeof document_url !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid document details",
      });
    }

    if (
      !document_type.trim() ||
      !document_number.trim() ||
      !document_url.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Document details cannot be empty",
      });
    }

  
    if (
      (role === "RESTAURANT" && !["FSSAI", "OTHER"].includes(document_type)) ||
      (role === "NGO" && !["NGO_DARPAN", "OTHER"].includes(document_type))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid document type for your role",
      });
    }


    const selectQuery = `
      SELECT organization_id
      FROM organizations
      WHERE user_id = ?
    `;

    const [rows] = await db.query(selectQuery, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    const organization_id = rows[0].organization_id;


    const insertQuery = `
      INSERT INTO verification_documents
      (organization_id, document_type, document_number, document_url)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.query(insertQuery, [
      organization_id,
      document_type,
      document_number,
      document_url,
    ]);

    return res.status(201).json({
      success: true,
      message: "Document submitted successfully",
      document_id: result.insertId,
    });

  } catch (error) {
    console.error("Document submit error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit document",
    });
  }
};