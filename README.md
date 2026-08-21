# 🏛️ College QR Complaint Box — v2.1.0

[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Apps Script](https://img.shields.io/badge/Backend-Google_Apps_Script-4285F4?logo=google&logoColor=white)](https://developers.google.com/apps-script)
[![Google Sheets](https://img.shields.io/badge/Database-Google_Sheets-34A853?logo=google-sheets&logoColor=white)](https://sheets.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An institutional-grade, mobile-first, and serverless **Student Grievance Redressal & QR Complaint System** built for modern colleges, universities, and polytechnics.

Students scan QR code placards placed across campus (Lecture Halls, IT Labs, Hostels, Cafeteria, Restrooms) to file confidential or identified complaints directly to the **Chief Proctor Office**. Backed by **Google Sheets** as the zero-maintenance database and **Google Apps Script** as the secure serverless REST API layer.

---

## 🌟 What's New in Version 2.1.0

- 🏛️ **3-Level Surface Elevation Design System**:
  - **Level 0 Canvas** (`#EAEDF3`): High-end paper canvas providing distinct visual depth.
  - **Level 1 Containers** (`#FFFFFF`): Elevated cards, tables, and modal dialogs with hairline borders (`#D7DEE8`) and subtle shadows.
  - **Level 2 Insets** (`#F3F5F9`): Recessed input fields, select dropdowns, table row stripes, and quick-response chip trays with crisp focus transitions.
  - **Ink-Navy Surfaces** (`#101B36` & `#16234A`): Deep institutional headers, sidebar navigation, and TicketStub receipt dividers.
- 🖨️ **Direct-Print Vector QR Poster Studio**:
  - Full-page vector QR poster engine supporting **A4, A5, and Letter** paper dimensions.
  - 1-Click native browser print trigger (`window.print()`) with dedicated `@media print` styling, college seal emblem, 3-step student instructions, and guarantee footer.
- 🔊 **Real-Time Web Audio Chime & Notification Center**:
  - Synthesized auditory alert upon new grievance arrivals (custom Web Audio API synthesizer — zero external audio assets required).
  - Unread badge counter, interactive notification center dropdown, and desktop notification sync.
- ⚡ **Zero-Latency Cross-Tab Sync (`BroadcastChannel`)**:
  - Real-time event bus synchronizes complaint status updates, passkey updates, and deletion events across all open administrative tabs without requiring manual refreshes.
- 📋 **Interactive Categories & Locations ERP**:
  - Reorderable category list with live status toggles, department liaisons, and icon grid pickers.
  - Campus locations directory with building/block mapping and instant location-specific poster generation.
- 📜 **Plain-Voice Compliance Audit Trail**:
  - Fact-based timeline tracking every administrative action (`Status Changed`, `Note Added`, `Ticket Resolved`, `Ticket Deleted`, `Settings Updated`) with status-coded indicator dots.
- 💀 **Modern Shimmer Skeleton Loading**:
  - Eliminated spinners in favor of layout-matched skeleton loaders for a smooth, flicker-free browsing experience.

---

## 🌟 Key Features

### 🎓 1. Public Student Portal
- **Scan & Go Mobile UI**: Mobile-optimized form accessible across iOS, Android, tablets, and desktop browsers.
- **100% Anonymous Reporting**: Built-in privacy toggle that strips personal identity, student roll numbers, and contact information before transmission.
- **Auto-Detect via QR Codes**: Scanned QR codes pre-populate the exact campus location and category directly from URL query parameters.
- **Unique Reference ID**: Standardized `CQB-YYYYMMDD-XXXX` ticket codes (e.g. `CQB-20260818-A7F2`) generated upon submission.
- **Public Complaint Tracker (`/track`)**: Students track real-time resolution progress and view official Proctor Redressal Notes while protecting internal administrative remarks.

### 🛡️ 2. Chief Proctor Management ERP
- **Institutional Authentication**: Secure passkey-based administrative login with automatic session persistence.
- **5-KPI Real-Time Dashboard**: Inflow metrics tracking Total Complaints, New, In Progress, Resolved, and Critical Urgency reports.
- **Complaints Repository**: Advanced search and multi-parameter filtering by Reference ID, Category, Location, Priority, and Status.
- **Complaint Inspector & Redressal Center**:
  - Signature `TicketStub` ticket header with 1-click Reference ID copy.
  - 1-Click quick response preset trays for standard administrative actions.
  - Multi-status stepper (`Logged` ➔ `Under Review` ➔ `In Progress` ➔ `Resolved`).
  - Isolated **Danger Zone** with confirmation dialogs for permanent complaint removal.
- **Immutable Audit Trail (`/admin/activity-log`)**: Permanent audit logging of all administrative actions.

---

## 🏗️ Architecture & Tech Stack

```
┌──────────────────────────────────────────────────────────────────┐
│                   React 18 + TypeScript Client                   │
│   (Vite 5 • Tailwind CSS 3 • Lucide React • React Router v6)     │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                     HTTPS JSON / REST API (CORS)
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│            Google Apps Script Serverless Web App API             │
│        (V8 JavaScript Runtime • doGet / doPost Dispatcher)        │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                    SpreadsheetApp Service (CRUD)
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Google Sheets Database                        │
│   • Complaints   • Admins   • Categories   • Locations   • Logs  │
└──────────────────────────────────────────────────────────────────┘
```

| Layer | Technology | Key Details |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18.3 + TypeScript 5.5 | Type-safe components, custom hooks, context state management |
| **Build Tooling** | Vite 5.4 | Sub-second HMR, optimized production tree-shaking & chunk splitting |
| **Styling & Theme** | Tailwind CSS 3.4 + Vanilla CSS | Custom 3-level elevation tokens (`--color-surface-0/1/2`), Fraunces serif & Inter sans |
| **Backend Engine** | Google Apps Script (V8) | Serverless `doGet` / `doPost` controller with action routing & sanitization |
| **Database** | Google Sheets | 5 structured relational sheets (`Complaints`, `Admins`, `Categories`, `Locations`, `Activity_Log`) |
| **Local Mode** | Web Storage + Mock Engine | Automatic fallback allowing full offline testing with seed fixtures |

---

## 📁 Repository Structure

```
College-QR-Compliant/
├── frontend/                       # React 18 + TypeScript + Tailwind Client
│   ├── public/                     # Favicons, campus background, PWA assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                 # Button, Input, Select, Textarea, Card, Modal, Pill, Skeleton
│   │   │   ├── layout/             # Navbar, Footer, AdminHeader, AdminSidebar, StudentLayout, AdminLayout
│   │   │   ├── complaints/         # ComplaintTable, ComplaintCard, ComplaintFilters, ComplaintDetailView
│   │   │   ├── dashboard/          # StatCard, RecentComplaints, QuickActionCard
│   │   │   └── qr/                 # PrintableQRCard (Direct Print Vector Poster)
│   │   ├── contexts/               # AuthContext, ToastContext, NotificationContext, RefreshContext
│   │   ├── hooks/                  # useComplaints, useCategories, useLocations, useDashboardStats
│   │   ├── pages/
│   │   │   ├── public/             # LandingPage, ComplaintFormPage, ComplaintSuccessPage, TrackComplaintPage
│   │   │   └── admin/              # Dashboard, Complaints, Categories, Locations, ActivityLog, Settings, Login
│   │   ├── services/               # Centralized apiService & gasClient with automatic fallback
│   │   ├── types/                  # Strict TypeScript interfaces & DTOs
│   │   ├── utils/                  # Web Audio synthesizer, Reference ID generator, date formatters
│   │   ├── config/                 # designTokens, statusConfig, constants, env
│   │   ├── index.css               # Design system root tokens, print layout rules, animations
│   │   ├── App.tsx                 # Route hierarchy & protected admin route guards
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── apps-script/                    # Google Apps Script Serverless Backend
│   ├── Combined_Deploy.js          # Complete 1-file deployable backend script
│   ├── Code.js                     # doGet / doPost Router & CORS headers
│   ├── Database.js                 # Sheet schema definitions & auto-initializer
│   ├── ComplaintService.js         # Submit, track, update, and permanent delete logic
│   ├── AdminService.js             # Proctor authentication & passkey update logic
│   ├── ActivityLogService.js       # Compliance audit trail recorder
│   ├── ConfigService.js            # Categories and Locations provider
│   ├── Security.js                 # Input sanitization, token validation, public data stripper
│   └── appsscript.json             # Google Apps Script manifest
├── docs/                           # Architectural & Deployment Guides
│   ├── ARCHITECTURE.md             # System design, elevation scale & sequence diagrams
│   ├── GOOGLE_SHEETS_SETUP.md      # Spreadsheet schema & 1-click initializer
│   ├── APPS_SCRIPT_SETUP.md        # Web App deployment walkthrough
│   ├── API.md                      # REST endpoint specifications & payload schemas
│   ├── SECURITY.md                 # Anonymity guarantee & Proctor privacy model
│   └── DEPLOYMENT.md               # Vercel, Netlify & GitHub Pages deployment guide
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install
```bash
git clone https://github.com/jalalakbar47/College-QR-Complaint-Box.git
cd College-QR-Complaint-Box/frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!TIP]
> The app runs in **interactive simulation mode** by default with realistic seed records. You can submit complaints, track tickets, sign in as Chief Proctor, update statuses, test auditory alerts, and generate printable placards immediately without configuring Google Cloud!

### 3. Default Administrative Credentials
- **Email**: `chiefproctor@college.edu`
- **Passkey**: `proctor2026`

---

## ☁️ Connecting to Live Google Sheets (Production)

1. Open [Google Apps Script](https://script.google.com) and create a **New project**.
2. Copy the entire contents of [`apps-script/Combined_Deploy.js`](./apps-script/Combined_Deploy.js) and paste into `Code.gs`.
3. Select `setupDatabase` in the function toolbar and click **Run** *(creates and formats your Google Spreadsheet automatically)*.
4. Click **Deploy > New deployment**:
   - **Type**: Web app
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
5. Copy the generated Web App URL and add it to `frontend/.env`:
   ```env
   VITE_API_URL=https://script.google.com/macros/s/AKfycbx.../exec
   ```
6. Build for production:
   ```bash
   cd frontend
   npm run build
   ```

---

## 🧪 Production Verification

To verify TypeScript correctness and bundle production assets:
```bash
# Type check
cd frontend
npx tsc --noEmit

# Production build
npm run build
```

---

## 👨‍💻 Author & Developer

**Jalaluddin Khan** ([@jalalakbar47](https://github.com/jalalakbar47))  
*Software Developer • BS Computer Science*  
*Government Post Graduate College (GPGC) Khar, District Bajaur*

- **GitHub**: [@jalalakbar47](https://github.com/jalalakbar47)
- **LinkedIn**: [linkedin.com/in/jalalakbar47](https://linkedin.com/in/jalalakbar47)
- **Email**: [jalalakbarbjr@gmail.com](mailto:jalalakbarbjr@gmail.com)

---

## 📄 License
This project is open-source under the [MIT License](LICENSE). Developed with dedication for university campus student grievance redressal.
