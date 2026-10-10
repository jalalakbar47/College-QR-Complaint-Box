# 🏛️ College QR Complaint Box — v2.2.0

[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Apps Script](https://img.shields.io/badge/Backend-Google_Apps_Script-4285F4?logo=google&logoColor=white)](https://developers.google.com/apps-script)
[![Google Sheets](https://img.shields.io/badge/Database-Google_Sheets-34A853?logo=google-sheets&logoColor=white)](https://sheets.google.com)
[![TypeScript 80.3%](https://img.shields.io/badge/TypeScript-80.3%25-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![JavaScript 17.9%](https://img.shields.io/badge/JavaScript-17.9%25-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![CSS 1.5%](https://img.shields.io/badge/CSS-1.5%25-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![HTML 0.3%](https://img.shields.io/badge/HTML-0.3%25-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An institutional-grade, mobile-first, and serverless **Student Grievance Redressal & QR Complaint System** built for modern colleges, universities, and polytechnics.

Students scan QR code placards placed across campus (Lecture Halls, IT Labs, Hostels, Cafeteria, Restrooms) to file confidential or identified complaints directly to the **Chief Proctor Office**. Backed by **Google Sheets** as the zero-maintenance database and **Google Apps Script** as the secure serverless REST API layer.

---

## 🌟 What's New in Version 2.2.0

- 📱 **Universal Screen & Mobile Responsiveness**:
  - **Zero Ellipsis Truncation**: Completely eliminated broken text clippings (`100% Ano...`, `Examination &...`, `Chief Proc...`) on narrow mobile screens (320px–390px).
  - **Adaptive Trust Strip**: Redesigned floating feature cards with responsive flex-reflow (`flex-col sm:flex-row`) for natural 2-column mobile readability.
  - **2-Line Category Showcase**: Upgraded category grid with `line-clamp-2` and fluid typography, ensuring full issue descriptions and department liaisons remain visible.
  - **Flexible Ticket Headers**: Re-engineered `TicketStub` headers with responsive `flex-wrap` and non-destructive wrapping for long reference codes and placards.
  - **Mobile Touch Grids**: Refined developer attribution strip with a 3-column equal-proportion touch layout for GitHub, LinkedIn, and Email links.
  - **Notification Drawer Bounds**: Constrained flyout notification panels to viewport boundaries (`w-[calc(100vw-32px)]`) to eliminate mobile horizontal overflow.
- ⚡ **Engine & Console Modernization**:
  - **React 18 Priority Hint Standard**: Resolved DOM `fetchpriority` attribute warning on high-priority campus hero images.
  - **React Router v7 Readiness**: Early opt-in to `v7_startTransition` and `v7_relativeSplatPath` future flags, eliminating deprecation console notices.

---

## 🌟 Core Features

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
- **Vector QR Poster Studio (`/admin/settings` & `/admin/locations`)**:
  - Generate and print location-specific campus QR placards for A4, A5, and Letter paper sizes.
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

## 🚀 Getting Started

### 1. Download or Clone
You can download this repository as a ZIP archive from GitHub and extract it, or clone it via git:
```bash
git clone https://github.com/jalalakbar47/College-QR-Complaint-Box.git
cd College-QR-Complaint-Box/frontend
npm install
```

### 2. Configure Environment & Branding
Copy the provided `.env.example` to `.env`:
```bash
cp .env.example .env
```

Customize `.env` with your own institution's branding and Apps Script Web App URL:
```env
# Google Apps Script Web App Deployment URL
# Leave empty during local development to use interactive mock simulation.
# For production, deploy your own Apps Script project and paste the Web App URL here:
VITE_API_URL=

# College Branding Configuration - customize for your own institution
VITE_COLLEGE_NAME=Your Institution / University Name
VITE_COLLEGE_SHORT_NAME=COLLEGE
VITE_PORTAL_TITLE=College QR Complaint Box
VITE_CAMPUS_PORTAL_URL=http://localhost:3000
```

### 3. Run Locally (Zero-Config Simulation Mode)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!TIP]
> The application includes an **interactive local simulation mode** by default. You can test submitting complaints, tracking tickets, signing in to the Chief Proctor ERP, changing statuses, and generating vector QR posters immediately without setting up any cloud backend!

#### Default Admin Credentials (Local Mode):
- **Email**: `chiefproctor@college.edu`
- **Passkey**: `proctor2026`

---

## ☁️ Connecting Your Own Google Sheets & Apps Script Backend

To connect the application to your own live Google Sheets database:

1. Open [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. In the menu bar, navigate to **Extensions > Apps Script**.
3. Copy the entire contents of [`apps-script/Combined_Deploy.js`](./apps-script/Combined_Deploy.js) and paste it into the script editor (replacing any existing code).
4. In the Apps Script toolbar, select the function **`setupDatabase`** and click **Run**.
   *(This automatically creates all 5 database sheets: `Complaints`, `Admins`, `Categories`, `Locations`, and `Activity_Log` with proper column headers and formatting).*
5. Click **Deploy > New deployment**:
   - **Select type**: Web app
   - **Description**: Production API
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
6. Click **Deploy**, authorize permissions, and copy your newly generated **Web App URL**.
7. In your `frontend/.env`, set your Web App URL:
   ```env
   VITE_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```
8. Build for production:
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
*Software Developer • BS Computer Science *
- **UNiversity**:University Of Malakand

- **GitHub**: [@jalalakbar47](https://github.com/jalalakbar47)
- **LinkedIn**: [linkedin.com/in/jalalakbar47](https://linkedin.com/in/jalalakbar47)
- **Email**: [jalalakbarbjr@gmail.com](mailto:jalalakbarbjr@gmail.com)

---

## 📄 License
This project is open-source under the [MIT License](LICENSE). Developed with dedication for university campus student grievance redressal.
