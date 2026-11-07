# FoodLoop – Backend API Documentation

## Person 1: Authentication & Organization Verification APIs

**Project:** FoodLoop – Surplus Food Donation Platform  
**Backend:** Node.js, Express.js  
**Database:** MySQL  
**Authentication:** JWT (JSON Web Token)  
**API Testing:** Postman

---

## 1. Base URL

```text
http://localhost:5000
```

All API requests use the following base path:

```text
/api
```

## 2. Authentication & Authorization

FoodLoop uses JWT-based authentication.

For protected APIs, pass the JWT token in the request header:

```http
Authorization: Bearer <JWT_TOKEN>
```

### User Roles

| Role | Description |
|---|---|
| RESTAURANT | Registers and submits surplus food organization details |
| NGO | Registers and submits NGO verification documents |
| ADMIN | Reviews and approves or rejects organizations |

### Account Status

| Status | Description |
|---|---|
| PENDING | Waiting for admin verification |
| ACTIVE | Approved and allowed to log in |
| REJECTED | Registration rejected |
| SUSPENDED | Account suspended |

---

## 3. Authentication APIs

### API 1: Register User

**Method:** POST  
**Endpoint:** `/api/auth/register`  
**Authentication:** Not required

Registers a new Restaurant or NGO.

**Request Body:**

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "Rahul@123",
  "role": "RESTAURANT",
  "organization_name": "Fresh Bites Restaurant",
  "phone": "9876543210",
  "address": "MG Road",
  "city": "Pune",
  "document_type": "FSSAI",
  "document_number": "FSSAI123456",
  "document_url": "https://example.com/document.pdf"
}
```

**Successful Response:** HTTP 201

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

**Notes:**
- Public registration supports RESTAURANT and NGO roles.
- ADMIN accounts are created separately.
- Passwords are hashed using bcrypt.
- Organization and initial verification document records are created.
- New accounts start with PENDING status.

### API 2: User Login

**Method:** POST  
**Endpoint:** `/api/auth/login`  
**Authentication:** Not required

Authenticates an approved user and generates a JWT.

**Request Body:**

```json
{
  "email": "rahul@example.com",
  "password": "Rahul@123"
}
```

**Successful Response:** HTTP 200

```json
{
  "success": true,
  "message": "Login successful",
  "token": "<JWT_TOKEN>"
}
```

**Notes:**
- Password is verified using bcrypt.
- Only ACTIVE accounts can log in.
- JWT contains userId and role.

### API 3: Get User Profile

**Method:** GET  
**Endpoint:** `/api/auth/profile`  
**Authentication:** Required

Fetches the logged-in user's profile.

**Headers:**

```http
Authorization: Bearer <JWT_TOKEN>
```

**Successful Response:** HTTP 200

```json
{
  "success": true,
  "user": {
    "user_id": 1,
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "role": "RESTAURANT",
    "account_status": "ACTIVE"
  }
}
```

---

## 4. Organization APIs

### API 4: Submit Verification Documents

**Method:** POST  
**Endpoint:** `/api/organizations/documents`  
**Authentication:** RESTAURANT or NGO

Allows an organization to submit additional verification documents.

**Request Body:**

```json
{
  "document_type": "OTHER",
  "document_number": "DOC12345",
  "document_url": "https://example.com/other-document.pdf"
}
```

**Successful Response:** HTTP 201

```json
{
  "success": true,
  "message": "Document submitted successfully",
  "document_id": 3
}
```

**Notes:**
- RESTAURANT supports FSSAI and OTHER.
- NGO supports NGO_DARPAN and OTHER.
- Newly submitted documents receive PENDING review status.
- Document URL is accepted through JSON; file uploading is not implemented in this version.

### API 5: Get Organization Verification Status

**Method:** GET  
**Endpoint:** `/api/organizations/verification-status`  
**Authentication:** RESTAURANT or NGO

Fetches the logged-in organization's verification status and submitted documents.

**Successful Response:** HTTP 200

```json
{
  "success": true,
  "message": "Verification status fetched successfully",
  "organization": {
    "organization_id": 2,
    "organization_name": "Helping Hands Foundation",
    "verification_status": "APPROVED"
  },
  "documents": [
    {
      "document_type": "NGO_DARPAN",
      "review_status": "APPROVED"
    },
    {
      "document_type": "OTHER",
      "review_status": "APPROVED"
    }
  ]
}
```

---

## 5. Admin Verification APIs

All admin APIs require:
- Valid JWT token.
- ADMIN role.

### API 6: Get Pending Organizations

**Method:** GET  
**Endpoint:** `/api/admin/verifications`  
**Authentication:** ADMIN

Fetches organizations whose verification status is PENDING.

**Successful Response:** HTTP 200

```json
{
  "success": true,
  "data": [
    {
      "organization_id": 1,
      "organization_name": "Fresh Bites Restaurant",
      "organization_type": "RESTAURANT",
      "city": "Pune",
      "verification_status": "PENDING",
      "document_id": 1,
      "document_type": "FSSAI",
      "document_number": "FSSAI123456",
      "document_url": "https://example.com/document.pdf",
      "review_status": "PENDING"
    }
  ]
}
```

### API 7: Get Organization Verification Details

**Method:** GET  
**Endpoint:** `/api/admin/verifications/:id`  
**Authentication:** ADMIN

Fetches the verification details and all documents belonging to a specific organization.

**Example URL:**

```text
GET /api/admin/verifications/2
```

**Successful Response:** HTTP 200

```json
{
  "success": true,
  "data": [
    {
      "organization_id": 2,
      "organization_name": "Helping Hands Foundation",
      "organization_type": "NGO",
      "document_type": "NGO_DARPAN",
      "document_number": "NGO12345",
      "document_url": "https://example.com/ngo.pdf",
      "review_status": "PENDING"
    }
  ]
}
```

### API 8: Approve or Reject Organization

**Method:** PUT  
**Endpoint:** `/api/admin/verifications/:id`  
**Authentication:** ADMIN

Allows the admin to approve or reject an organization.

**Example URL:**

```text
PUT /api/admin/verifications/2
```

**Approve Request Body:**

```json
{
  "status": "APPROVED",
  "remarks": "All documents verified successfully"
}
```

**Reject Request Body:**

```json
{
  "status": "REJECTED",
  "remarks": "Submitted registration document is invalid"
}
```

**Successful Response:** HTTP 200

```json
{
  "success": true,
  "message": "Organization approved successfully"
}
```

**Database Updates:**

| Table | Column | Approved | Rejected |
|---|---|---|---|
| organizations | verification_status | APPROVED | REJECTED |
| verification_documents | review_status | APPROVED | REJECTED |
| users | account_status | ACTIVE | REJECTED |

**Notes:**
- Remarks are compulsory when rejecting an organization.
- All three table updates are performed inside a database transaction.
- If an update fails, the transaction is rolled back.
- The admin ID and review timestamp are stored with the document review.

---

## 6. API Summary

| # | Method | Endpoint | Access |
|---|---|---|---|
| 1 | POST | `/api/auth/register` | Public |
| 2 | POST | `/api/auth/login` | Public |
| 3 | GET | `/api/auth/profile` | Authenticated |
| 4 | POST | `/api/organizations/documents` | RESTAURANT, NGO |
| 5 | GET | `/api/organizations/verification-status` | RESTAURANT, NGO |
| 6 | GET | `/api/admin/verifications` | ADMIN |
| 7 | GET | `/api/admin/verifications/:id` | ADMIN |
| 8 | PUT | `/api/admin/verifications/:id` | ADMIN |

**Total APIs implemented: 8**

---

## 7. HTTP Status Codes

| Status Code | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created successfully |
| 400 | Invalid request data |
| 401 | Missing or invalid authentication token |
| 403 | Access forbidden or account not active |
| 404 | Organization or resource not found |
| 500 | Internal server error |

---

## 8. Security Implemented

1. Password hashing using bcrypt.
2. JWT-based authentication.
3. Role-based authorization middleware.
4. SQL parameterized queries.
5. Input validation.
6. Protected admin routes.
7. Database transactions for verification updates.
8. Password hashes are not returned in profile responses.

---

## 9. Testing

All 8 planned APIs have been tested using Postman.

The following workflows were verified:

- Restaurant and NGO registration.
- User login and JWT generation.
- Authenticated profile retrieval.
- Additional document submission.
- Admin pending-verification listing.
- Individual organization verification details.
- Organization approval and rejection.
- Organization verification-status retrieval.

**Project Module Status: COMPLETED**

