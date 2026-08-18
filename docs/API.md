# API Reference - College QR Complaint Box

All requests are made to the published Google Apps Script Web App URL (`VITE_API_URL`).

---

## Response Structure

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Detailed error explanation.",
  "errorCode": "ERROR_CODE_STRING"
}
```

---

## 1. Public Endpoints (No Token Required)

### 1.1 Ping / Health Check
- **Method**: `GET`
- **Params**: `action=ping`
- **Auth**: Public

---

### 1.2 Submit Complaint
- **Method**: `POST`
- **Action**: `submitComplaint`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "action": "submitComplaint",
    "data": {
      "is_anonymous": true,
      "category": "Electricity",
      "title": "Broken fan in Room 302",
      "description": "Fan is making loud grinding noise during lectures.",
      "location": "Academic Block A",
      "student_name": "",
      "student_id": "",
      "department": "",
      "semester": "",
      "contact": ""
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Complaint submitted successfully.",
    "data": {
      "complaint_id": "CQB-20260818-A7F2",
      "complaint": { ... }
    }
  }
  ```

---

### 1.3 Track Complaint (Public-Safe)
- **Method**: `GET`
- **Params**: `action=trackComplaint&complaint_id=CQB-20260818-A7F2`
- **Auth**: Public
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "complaint_id": "CQB-20260818-A7F2",
      "submitted_at": "2026-08-18T09:15:00.000Z",
      "updated_at": "2026-08-18T10:00:00.000Z",
      "category": "Electricity",
      "title": "Broken fan in Room 302",
      "description": "Fan is making loud grinding noise during lectures.",
      "location": "Academic Block A",
      "status": "In Progress",
      "resolution": "",
      "resolved_at": ""
    }
  }
  ```

---

### 1.4 Get Categories
- **Method**: `GET`
- **Params**: `action=getCategories`
- **Auth**: Public

---

### 1.5 Get Locations
- **Method**: `GET`
- **Params**: `action=getLocations`
- **Auth**: Public

---

## 2. Protected Admin Endpoints (Session Token Required)

### 2.1 Admin Authentication / Login
- **Method**: `POST`
- **Action**: `adminLogin`
- **Request Body**:
  ```json
  {
    "action": "adminLogin",
    "data": {
      "email": "chiefproctor@college.edu",
      "passkey": "proctor2026"
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "token": "CQB_AUTH_ADM-001_1787040000000_...",
      "admin": {
        "admin_id": "ADM-001",
        "name": "Dr. Arthur Vance",
        "email": "chiefproctor@college.edu",
        "role": "Chief Proctor",
        "status": "Active"
      }
    }
  }
  ```

---

### 2.2 Get Dashboard Statistics
- **Method**: `GET`
- **Params**: `action=getDashboardStats&token=CQB_AUTH_...`
- **Auth**: Admin Token Required

---

### 2.3 Get Complaints List
- **Method**: `GET`
- **Params**: `action=getComplaints&status=New&priority=Critical&category=Academic&location=Library&department=Computer%20Science%20%26%20Engineering&search=...&token=CQB_AUTH_...`
- **Auth**: Admin Token Required

---

### 2.4 Update Complaint
- **Method**: `POST`
- **Action**: `updateComplaint`
- **Auth**: Admin Token Required
- **Request Body**:
  ```json
  {
    "action": "updateComplaint",
    "token": "CQB_AUTH_...",
    "data": {
      "complaint_id": "CQB-20260818-A7F2",
      "status": "Resolved",
      "priority": "High",
      "assigned_to": "Prof. Margaret Hayes",
      "admin_remarks": "Technician replaced capacitor.",
      "resolution": "Ceiling fan repaired and functioning properly as of Aug 18.",
      "admin_id": "ADM-001",
      "admin_name": "Dr. Arthur Vance"
    }
  }
  ```

---

### 2.5 Get Activity Audit Logs
- **Method**: `GET`
- **Params**: `action=getActivityLogs&token=CQB_AUTH_...`
- **Auth**: Admin Token Required
