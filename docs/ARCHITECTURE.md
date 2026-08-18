# System Architecture - College QR Complaint Box

This document outlines the end-to-end architecture, data flows, and security model of the **College QR Complaint Box System** (Phase 1 MVP).

---

## 1. High-Level Architecture

The system operates as a lightweight, scalable, and zero-server-maintenance 3-tier architecture:

```
[ Mobile / Desktop Browser ] (React + Vite + Tailwind + PWA)
           ↓ (HTTPS JSON / REST)
[ Google Apps Script Web App API ] (doGet / doPost Dispatcher)
           ↓ (Google Apps Script SpreadsheetApp Service)
[ Google Sheets Database ] (College_QR_Complaint_Box)
```

---

## 2. Component Layers

### 2.1 Frontend Client (`/frontend`)
- **Technology Stack**: React 18, TypeScript, Vite 5, Tailwind CSS 3, React Router v6, Lucide React icons.
- **PWA Capabilities**: Installable as a progressive web application on Android/iOS/Desktop.
- **Portals**:
  - **Student Portal**:
    - Mobile-optimized grievance submission (`/complaint`).
    - Anonymity toggle that strips personal data before transmission.
    - Public-safe tracking interface (`/track`).
    - Instant confirmation card with unique reference ID (`CQB-YYYYMMDD-XXXX`).
  - **Admin & Chief Proctor ERP**:
    - Authenticated management dashboard (`/admin/dashboard`).
    - Searchable & filterable grievance repository (`/admin/complaints`).
    - Complaint Inspector, Status changer, and Public resolution poster (`/admin/complaints/:id`).
    - Category directory (`/admin/categories`).
    - Campus location directory (`/admin/locations`).
    - Immutable activity audit log (`/admin/activity-log`).
    - Campus QR Code placard generator (`/admin/settings`).
- **Dual-Engine Client**: Seamlessly connects to live Google Apps Script (`VITE_API_URL`) or runs in local simulation mode with realistic mock data and localStorage persistence.

### 2.2 API Layer (`/apps-script`)
- **Technology Stack**: Google Apps Script (V8 Runtime) Web App.
- **Routing**: `doGet(e)` for public tracking, categories, locations, and dashboard queries; `doPost(e)` for complaint submission, admin login, and updates.
- **Response Protocol**: Standard JSON responses:
  ```json
  {
    "success": true,
    "message": "Operation completed successfully.",
    "data": { ... }
  }
  ```

### 2.3 Database Layer (Google Sheets)
Spreadsheet Name: `College_QR_Complaint_Box`

Comprises 5 relational sheets:
1. `Complaints`: 19 columns storing core ticket data, timestamps, proctor remarks, resolution notes.
2. `Admins`: 7 columns storing authorized proctor profiles and roles.
3. `Categories`: 4 columns defining campus complaint types (Academic, Hostel, Infrastructure, etc.).
4. `Locations`: 3 columns defining campus physical zones for geotargeting and placards.
5. `Activity_Log`: 8 columns storing compliance audit logs for every admin action.

---

## 3. Data Flow Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student (Mobile / QR)
    participant Client as React PWA Frontend
    participant API as Google Apps Script (Web App)
    participant Sheets as Google Sheets Database
    actor Admin as Chief Proctor / Admin

    Note over Student, Sheets: Student Complaint Submission Flow
    Student->>Client: Scans QR -> Opens /complaint
    Student->>Client: Fills form (Anonymous or Identified) -> Clicks Submit
    Client->>API: POST /exec?action=submitComplaint
    API->>API: Validates fields & generates ID (CQB-YYYYMMDD-XXXX)
    API->>Sheets: Appends row to "Complaints" sheet
    API-->>Client: Returns { success: true, complaint_id }
    Client-->>Student: Renders confirmation card with Reference ID

    Note over Admin, Sheets: Proctor Review & Resolution Flow
    Admin->>Client: Signs in at /admin/login
    Client->>API: POST /exec?action=adminLogin
    API->>Sheets: Queries "Admins" sheet
    API-->>Client: Returns session token & profile
    Admin->>Client: Views Dashboard & updates complaint status/resolution
    Client->>API: POST /exec?action=updateComplaint (with token)
    API->>Sheets: Updates "Complaints" sheet & appends row to "Activity_Log"
    API-->>Client: Returns updated complaint

    Note over Student, Sheets: Public Tracking Flow
    Student->>Client: Enters Reference ID at /track
    Client->>API: GET /exec?action=trackComplaint&id=CQB-...
    API->>Sheets: Searches "Complaints" sheet
    API->>API: Strips internal remarks and student identity
    API-->>Client: Returns public-safe status & resolution note
    Client-->>Student: Displays status timeline & official resolution
```
