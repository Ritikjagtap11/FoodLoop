import { db } from "../config/db.js";

export const getAdminDashboard = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to Admin Dashboard",
    user: req.user,
  });
};

export const getPendingVerifications = async (req, res) => {
  // Your implementation
  try {
    const fetchQuery = `
    SELECT
        o.organization_id,
        o.organization_name,
        o.organization_type,
        o.city,
        o.verification_status,
        v.document_id,
        v.document_type,
        v.document_number,
        v.document_url,
        v.review_status,
        v.remarks,
        v.reviewed_at
    FROM organizations o
    LEFT JOIN verification_documents v
        ON o.organization_id = v.organization_id
       AND v.document_id = (
           SELECT MAX(v2.document_id)
           FROM verification_documents v2
           WHERE v2.organization_id = o.organization_id
       )
    WHERE o.verification_status = 'PENDING';
`;
    const [rows] = await db.query(fetchQuery);

    return res.status(200).json({
      success: true,
      message: "successful fetching data to pending document verification",
      data: rows,
    });
  } catch (error) {
    console.log("verification satatus error by admin: ", error);
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getVerificationById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID",
      });
    }

    const fetchQueryById = `
      SELECT 
        o.organization_id,
        o.organization_name,
        o.organization_type,
        o.city,
        o.verification_status,
        v.document_id,
        v.document_type,
        v.document_number,
        v.document_url,
        v.review_status
    FROM organizations o
    INNER JOIN verification_documents v
        ON o.organization_id = v.organization_id
    WHERE o.organization_id = ?;
    `;
    const [rows] = await db.query(fetchQueryById, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Organization verification details fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Get verification by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const updateVerificationStatus = async (req, res) => {
  let connection;

  try {
    // 1. Get data from request
    const id = Number(req.params.id);
    const { status, remarks } = req.body;
    const adminId = req.user.userId;

    // 2. Validate organization ID
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID",
      });
    }

    // 3. Validate status
    if (
      typeof status !== "string" ||
      !["APPROVED", "REJECTED"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Status must be APPROVED or REJECTED",
      });
    }

    // 4. Remarks are compulsory when rejecting
    if (
      status === "REJECTED" &&
      (typeof remarks !== "string" || !remarks.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Remarks are required when rejecting",
      });
    }

    // 5. Start database transaction
    connection = await db.getConnection();
    await connection.beginTransaction();

    // 6. Check whether organization exists
    const selectQuery = `
      SELECT user_id
      FROM organizations
      WHERE organization_id = ?
    `;

    const [rows] = await connection.execute(selectQuery, [id]);

    if (rows.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    const userId = rows[0].user_id;

    // 7. Update organization verification status
    const updateQueryOrganization = `
      UPDATE organizations
      SET verification_status = ?
      WHERE organization_id = ?
    `;

    await connection.execute(updateQueryOrganization, [status, id]);

    // 8. Update all verification documents of this organization
    const updateQueryDocuments = `
      UPDATE verification_documents
      SET
        review_status = ?,
        reviewed_by = ?,
        reviewed_at = NOW(),
        remarks = ?
      WHERE organization_id = ?
    `;

    await connection.execute(updateQueryDocuments, [
      status,
      adminId,
      remarks?.trim() || null,
      id,
    ]);

    // 9. Update user's account status
    const statusUsers =
      status === "APPROVED" ? "ACTIVE" : "REJECTED";

    const updateQueryUsers = `
      UPDATE users
      SET account_status = ?
      WHERE user_id = ?
    `;

    await connection.execute(updateQueryUsers, [statusUsers, userId]);

    // 10. Save all three updates
    await connection.commit();

    return res.status(200).json({
      success: true,
      message: `Organization ${status.toLowerCase()} successfully`,
    });

  } catch (error) {
    // 11. Undo changes if any query fails
    if (connection) {
      await connection.rollback();
    }

    console.error("Update verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  } finally {
    // 12. Always release database connection
    connection?.release();
  }
};


export const getAllVerifications = async (req, res) => {
  try {
    const fetchQuery = `
      SELECT
        o.organization_id,
        o.organization_name,
        o.organization_type,
        o.city,
        o.verification_status,
        v.document_id,
        v.document_type,
        v.document_number,
        v.document_url,
        v.review_status,
        v.remarks,
        v.reviewed_at
      FROM organizations o
      LEFT JOIN verification_documents v
        ON o.organization_id = v.organization_id
        AND v.document_id = (
          SELECT MAX(v2.document_id)
          FROM verification_documents v2
          WHERE v2.organization_id = o.organization_id
        )
      ORDER BY
        CASE o.verification_status
          WHEN 'PENDING' THEN 1
          WHEN 'APPROVED' THEN 2
          WHEN 'REJECTED' THEN 3
          ELSE 4
        END,
        o.organization_id DESC;
    `;

    const [rows] = await db.query(fetchQuery);

    const pending = rows.filter(
      (item) => item.verification_status === "PENDING"
    );

    const approved = rows.filter(
      (item) => item.verification_status === "APPROVED"
    );

    const rejected = rows.filter(
      (item) => item.verification_status === "REJECTED"
    );

    return res.status(200).json({
      success: true,
      message: "All verification records fetched successfully",
      data: {
        pending,
        approved,
        rejected,
      },
    });

  } catch (error) {
    console.error("Get all verifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
