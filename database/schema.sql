CREATE DATABASE IF NOT EXISTS foodloop_db;
USE foodloop_db;

-- 1. USERS TABLE
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('RESTAURANT', 'NGO', 'ADMIN') NOT NULL,
    account_status ENUM(
        'PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED'
    ) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ORGANIZATIONS TABLE
CREATE TABLE organizations (
    organization_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    organization_name VARCHAR(150) NOT NULL,
    organization_type ENUM('RESTAURANT', 'NGO') NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    verification_status ENUM(
        'PENDING', 'APPROVED', 'REJECTED'
    ) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
);

-- 3. VERIFICATION DOCUMENTS TABLE
CREATE TABLE verification_documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    document_type ENUM(
        'FSSAI', 'NGO_DARPAN', 'OTHER'
    ) NOT NULL,
    document_number VARCHAR(100) NOT NULL,
    document_url VARCHAR(255) NOT NULL,
    review_status ENUM(
        'PENDING', 'APPROVED', 'REJECTED'
    ) DEFAULT 'PENDING',
    reviewed_by INT NULL,
    reviewed_at DATETIME NULL,
    remarks TEXT NULL,

    FOREIGN KEY (organization_id)
        REFERENCES organizations(organization_id),

    FOREIGN KEY (reviewed_by)
        REFERENCES users(user_id)
);

-- 4. DONATIONS TABLE
CREATE TABLE donations (
    donation_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    food_name VARCHAR(150) NOT NULL,
    category ENUM('VEG', 'NON_VEG') NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    description TEXT,
    prepared_at DATETIME NOT NULL,
    available_until DATETIME NOT NULL,
    status ENUM(
        'AVAILABLE',
        'REQUESTED',
        'ACCEPTED',
        'COMPLETED',
        'EXPIRED',
        'REMOVED'
    ) DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (restaurant_id)
        REFERENCES organizations(organization_id)
);

-- 5. REQUESTS TABLE
CREATE TABLE requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    donation_id INT NOT NULL,
    ngo_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    status ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED',
        'COMPLETED'
    ) DEFAULT 'PENDING',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (donation_id)
        REFERENCES donations(donation_id),

    FOREIGN KEY (ngo_id)
        REFERENCES organizations(organization_id)
);

-- Useful indexes
CREATE INDEX idx_org_verification
ON organizations(verification_status);

CREATE INDEX idx_donation_status
ON donations(status);

CREATE INDEX idx_request_status
ON requests(status);