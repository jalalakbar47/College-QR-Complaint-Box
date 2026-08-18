# Security & Privacy Architecture - College QR Complaint Box

This document details the security model, access control policies, and privacy guarantees implemented in the **College QR Complaint Box System** (Phase 1 MVP).

---

## 1. Strict API Endpoint Separation

The Google Apps Script backend enforces a strict boundary between public student operations and protected administrative operations:

```
PUBLIC API (No Token Required)
├── submitComplaint     (Student grievance submission)
├── trackComplaint      (Public-safe status lookup)
├── getCategories       (Public categories list)
└── getLocations        (Public campus locations list)

PROTECTED ADMIN API (Valid HMAC Session Token Required)
├── adminLogin          (Authentication against Admins sheet)
├── getComplaints       (Full grievance repository query)
├── getComplaint        (Individual grievance inspector)
├── updateComplaint     (Status, Priority, Remarks & Resolution editor)
├── getDashboardStats   (Real-time KPI calculations)
├── getAdmins           (Authorized personnel list)
└── getActivityLogs     (Compliance audit trail)
```

Every protected endpoint validates the cryptographic session token at the Apps Script dispatcher level before executing any read or write operation on Google Sheets.

---

## 2. Admin Authentication & Session Security

1. **Zero Plaintext Passwords in Google Sheets**:
   - Plaintext passwords and homemade password hashes are **not** stored in Google Sheets.
   - The `Admins` sheet lists authorized institutional proctor and administrator accounts (`admin_id`, `name`, `email`, `role`, `status`, `created_at`, `last_login`).
   - Authentication verifies authorized active admin status and issues a cryptographically signed HMAC token (`CQB_AUTH_...`) with a strict 12-hour expiration window.
2. **Session Invalidation**:
   - Deactivating an administrator in the `Admins` sheet (`status = 'Inactive'`) immediately prevents further administrative access.
3. **No Frontend-Only Route Protection**:
   - Even if client-side routes are accessed directly, all data-fetching and mutating operations fail at the backend without a valid session token.

---

## 3. Strict Non-Fallback in Production

- In **Local Development / Mock Mode** (`VITE_API_URL` is empty), the application operates against an in-browser mock database with realistic seed data to facilitate local UI testing and component development.
- In **Production** (`VITE_API_URL` is configured with the live Google Apps Script Web App URL), the application **strictly dispatches to the live API** and **never silently falls back to local storage** upon failure or network errors. If the API fails or is unreachable, the system displays an explicit error: `"Unable to connect to the complaint server. Please check your network connection and try again."`

---

## 4. Guarantees for Anonymous Complaints

1. **Client-Side Data Sanitization**: When a student checks "Submit 100% Anonymously", the form dynamically unbinds and clears `student_name`, `student_id`, `department`, `semester`, and `contact`.
2. **Server-Side Identity Stripping**: Even if extraneous payload parameters are provided, the backend enforces `is_anonymous === true` and sets all personal identifier columns in Google Sheets to empty strings (`""`).
3. **Public Tracking Privacy Filter**: The public tracking endpoint (`/track`) executes `Security.filterPublicSafeComplaint()`, which exclusively exposes `complaint_id`, `submitted_at`, `updated_at`, `category`, `title`, `description`, `location`, `status`, and `resolution`.
4. **No Device Fingerprints or IP Tracking in DB**: Google Sheets stores zero student device fingerprints or IP logs.

---

## 5. Compliance & Audit Trails

1. **Immutable Activity Log**: Every change to a complaint (status update, priority re-assignment, proctor remark, resolution post) automatically generates a record in the `Activity_Log` sheet containing:
   - Unique log ID
   - Exact UTC timestamp
   - Administrator ID
   - Complaint Reference ID
   - Action type (`STATUS_CHANGE`, `PRIORITY_CHANGE`, `ADMIN_UPDATE`)
   - Old value and New value
   - Accompanying remarks
2. **No Silent Modifications**: Administrators cannot overwrite complaint details without generating an audit log trail.
