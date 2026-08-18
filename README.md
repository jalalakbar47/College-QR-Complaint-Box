# 🏛️ College QR Complaint Box — Phase 1 MVP

A digital, mobile-first, and institutional-grade **Grievance Redressal and QR Complaint Box System** designed for colleges and universities.

Students scan QR code placards placed across the campus to submit anonymous or identified complaints directly to the **Chief Proctor Office**. The system is backed by **Google Sheets** as the database and **Google Apps Script** as the secure serverless API layer.

---

## 🌟 Key Features

### 🎓 Student Portal
- **Scan & Go Mobile UI**: Mobile-optimized form accessible on low-end smartphones and tablets.
- **100% Anonymous Reporting**: Option to report issues without recording name, roll number, or phone number.
- **Categorized Filing**: Academic, Examination, Harassment, Bullying, Infrastructure, Cleanliness, Electricity, Water, Security, Hostel, etc.
- **Unique Reference ID**: Standardized `CQB-YYYYMMDD-XXXX` ID generated for each submission (e.g. `CQB-20260818-A7F2`).
- **Public-Safe Grievance Tracker**: Students can track live proctor progress and official resolution notes at `/track` without exposing internal administrative remarks or staff identities.

### 🛡️ Chief Proctor / Admin ERP Panel
- **Secure Access Control**: Authenticated proctor dashboard with role verification (`Chief Proctor`, `Admin`, `Staff`).
- **Real-Time KPI Dashboard**: Track Total, New, In Progress, Resolved, and Critical alert counts.
- **Complaints Repository**: Search by ticket ID or keywords, filter by Status, Priority, Category, and Campus Location.
- **Complaint Detail & Resolution Manager**: Update status (`New` → `Under Review` → `Assigned` → `In Progress` → `Resolved` → `Closed`), assign priority (`Low`, `Medium`, `High`, `Critical`), assign responsible staff, add internal remarks, and publish public resolution notes.
- **Campus QR Studio & Poster Generator**: Live printable flyer generator (`window.print()`) with institutional headers, 3-step scan instructions, and high-res SVG QR codes for physical campus placards.
- **Immutable Audit Trail**: Automatic `Activity_Log` recording of all administrative changes.

---

## 🏗️ Architecture & Technology Stack

```
[ Student / Admin Device ] (React 18 + TypeScript + Vite + Tailwind CSS)
           ↓ (HTTPS JSON / REST)
[ Google Apps Script API ] (doGet / doPost Dispatcher in V8 Runtime)
           ↓ (SpreadsheetApp Service)
[ Google Sheets Database ] (College_QR_Complaint_Box)
```

- **Frontend**: React 18, TypeScript, Vite 5, Tailwind CSS 3, React Router v6, Lucide React icons, Canvas Confetti.
- **Backend / API**: Google Apps Script Web App API.
- **Database**: Google Sheets (`Complaints`, `Admins`, `Categories`, `Locations`, `Activity_Log`).
- **PWA**: Mobile manifest and installable progressive web app capabilities.

---

## 📁 Repository Structure

```
College-QR-Compliant/
├── frontend/                     # React + TypeScript + Tailwind Client
│   ├── public/                   # PWA manifest, icons, favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # Reusable Button, Input, Modal, Table, etc.
│   │   │   ├── layout/           # Navbar, Footer, AdminSidebar, AdminHeader
│   │   │   ├── complaints/       # Badges, Filters, Table, DetailView
│   │   │   ├── dashboard/        # StatCard, RecentComplaints, QuickActions
│   │   │   └── qr/               # QRDisplay, PrintableQRCard
│   │   ├── contexts/             # AuthContext, ToastContext
│   │   ├── hooks/                # useComplaints, useDashboardStats, etc.
│   │   ├── pages/
│   │   │   ├── public/           # LandingPage, ComplaintForm, Success, Track
│   │   │   └── admin/            # Dashboard, Complaints, Detail, Settings
│   │   ├── services/             # Centralized apiService & gasClient
│   │   ├── types/                # Strict TypeScript interfaces
│   │   ├── utils/                # ID generator, validation, date formatters
│   │   ├── config/               # statusConfig, constants, env
│   │   ├── App.tsx               # Route declarations
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── apps-script/                  # Google Apps Script Backend
│   ├── Code.js                   # doGet / doPost Router
│   ├── Database.js               # Sheet access, schemas & auto-migration
│   ├── ComplaintService.js       # Submit, track, filter, update logic
│   ├── AdminService.js           # Auth & dashboard stats calculation
│   ├── ActivityLogService.js     # Compliance audit trail logger
│   ├── ConfigService.js          # Categories and locations provider
│   ├── Security.js               # Sanitization, tokens, public data filter
│   ├── Setup.js                  # 1-Click database setup function
│   └── appsscript.json           # Manifest
├── docs/                         # Detailed Architectural Guides
│   ├── ARCHITECTURE.md           # System design & sequence diagrams
│   ├── GOOGLE_SHEETS_SETUP.md    # Spreadsheet schema & 1-click initializer
│   ├── APPS_SCRIPT_SETUP.md      # Web App publishing instructions
│   ├── API.md                    # REST/JSON API endpoint specifications
│   ├── SECURITY.md               # Privacy & anonymity guarantees
│   └── DEPLOYMENT.md             # Vercel, Netlify, & static hosting guide
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!NOTE]
> The application includes an **interactive local storage simulation mode** out of the box with realistic seed data. You can test submissions, tracking, admin authentication, status updates, and printable posters immediately without any cloud configuration!

### 3. Quick-Fill Demo Admin Credentials
- **Chief Proctor**: `chiefproctor@college.edu` / Passkey: `proctor2026`
- **Admin Staff**: `admin@college.edu` / Passkey: `proctor2026`

---

## ☁️ Connecting to Live Google Sheets

1. Create a Google Spreadsheet named `College_QR_Complaint_Box`.
2. Click **Extensions > Apps Script** and paste the code from `/apps-script/`.
3. Run the function `setupDatabase` in the Apps Script editor to initialize sheets & seed data.
4. Click **Deploy > New Deployment > Web app** (Execute as: **Me**, Access: **Anyone**).
5. Copy the generated Web App URL and paste it into `frontend/.env`:
   ```env
   VITE_API_URL=https://script.google.com/macros/s/AKfycbx.../exec
   ```
6. Detailed step-by-step instructions are available in [docs/APPS_SCRIPT_SETUP.md](./docs/APPS_SCRIPT_SETUP.md).

---

## 🧪 Production Verification

Build the static production bundle:
```bash
cd frontend
npm run build
```
Verify the build output in `frontend/dist/`.

---

## 🗺️ Roadmap (Future Phases)

- **Phase 2**: Location-specific QR codes with automatic room binding, file/photo attachments, email/SMS proctor notifications, CSV/Excel grievance exports.
- **Phase 3**: Advanced analytics, resolution time metrics, proctor performance dashboards, automated escalation rules.
- **Phase 4**: AI complaint categorization and sentiment analysis.
- **Phase 5**: Native mobile applications and offline sync.

---

## 📄 License
MIT License. Developed for university campus grievance redressing.
