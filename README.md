# 🏛️ College QR Complaint Box — v2.0.0

A digital, mobile-first, and institutional-grade **Complaint Redressal and QR Complaint Box System** designed for modern colleges and universities.

Students scan QR code placards placed across the campus to submit anonymous or identified complaints directly to the **Chief Proctor Office**. The system is backed by **Google Sheets** as the zero-maintenance database and **Google Apps Script** as the secure serverless API layer.

---

## 🚀 What's New in Version 2.0.0

- 🔊 **Real-Time Notification Engine**: Instant auditory alerts (Web Audio API synthesizer chimes), interactive toast notifications, live unread badges, and desktop push alerts on new complaint submissions.
- 📄 **Perfect A4 Printable QR Poster Studio**: Redesigned printable campus placards featuring exact A4 aspect ratio, high-visibility QR code matrix, 3-step student instructions, and full-bleed college headers.
- ⚡ **Zero-Latency Cross-Tab Background Sync**: Background mutation and notification channels (`BroadcastChannel`) keep multiple open admin tabs and windows synchronized without manual refreshing.
- 💀 **Modern Skeleton Loading Suite**: Replaced old spinner loading states with smooth shimmer skeleton placeholders across tables, cards, stat widgets, and details pages.
- 🎨 **Redesigned Proctor Complaint Details Hub**:
  - Interactive hero banner with one-click Ticket ID copy and lifecycle progress stepper (`Logged` ➔ `In Progress` ➔ `Resolved`).
  - Streamlined Proctor Action & Resolution Center with 1-click presets and resolution notes.
  - Dedicated **Danger Zone** for permanent complaint deletion with confirmation modals and compliance audit logs.
- 🗑️ **Permanent Complaint Deletion**: Full administrative ability to permanently delete complaints from both Google Sheets and local storage, complete with audit trail tracking (`ACTION: 'DELETE_COMPLAINT'`).
- 🏷️ **Terminology Alignment**: Unified campus terminology to "Complaint" across all public pages, administrative portals, and configuration endpoints.

---

## 🌟 Key Features

### 🎓 Student Portal
- **Scan & Go Mobile UI**: Mobile-optimized form accessible on smartphones, tablets, and desktops.
- **100% Anonymous Reporting**: Option to report issues with complete privacy protection (no identity tracking).
- **Categorized Filing**: Academic, Examination, Harassment, Bullying, Discipline, Infrastructure, Cleanliness, Electricity, Water, Security, Transport, Hostel, IT/Internet, etc.
- **Unique Reference ID**: Standardized `CQB-YYYYMMDD-XXXX` ticket ID generated for each submission (e.g. `CQB-20260818-A7F2`).
- **Public Complaint Tracker**: Students track live proctor progress and official resolution notes at `/track` with internal administrative remarks securely protected.

### 🛡️ Chief Proctor Panel
- **Unified Proctor Authentication**: Streamlined single-role administrative access (`Chief Proctor`).
- **Real-Time Notification Center**: Auditory chimes, toast alerts, browser notifications, and interactive notification bell dropdown.
- **Real-Time KPI Dashboard**: Live tracking of Total, New, In Progress, Resolved, and Critical urgent complaints.
- **Complaints Repository**: Instant search by Ticket ID, keywords, and multi-dimensional filters (Status, Priority, Category, Campus Location).
- **Permanent Complaint Deletion**: Professional confirmation dialogs for safe and permanent deletion of complaints with audit log tracking.
- **Campus QR Studio**: Live printable flyer generator with high-resolution QR codes, college branding, and 3-step student instructions.
- **In-App Password Management**: Proctors can update security passkeys with direct sync to Google Sheets.
- **Immutable Audit Trail**: Automatic `Activity_Log` recording of all administrative actions.

---

## 🏗️ Architecture & Technology Stack

```
[ Student / Admin Device ] (React 18 + TypeScript + Vite 5 + Tailwind CSS 3)
           ↓ (HTTPS JSON / REST)
[ Google Apps Script API ] (doGet / doPost Dispatcher in V8 Runtime)
           ↓ (SpreadsheetApp Service)
[ Google Sheets Database ] (College QR Complaint Box Database)
```

- **Frontend**: React 18, TypeScript, Vite 5, Tailwind CSS 3, React Router v6, Lucide React icons, Canvas Confetti.
- **Backend / API**: Google Apps Script Web App API (`apps-script/Combined_Deploy.js`).
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
│   │   │   ├── ui/               # Button, Input, Modal, Table, Skeleton, ConfirmDialog
│   │   │   ├── layout/           # Navbar, Footer, AdminSidebar, AdminHeader
│   │   │   ├── complaints/       # Badges, Filters, Table, Card, DetailView
│   │   │   ├── dashboard/        # StatCard, RecentComplaints, QuickActions
│   │   │   └── qr/               # QRDisplay, PrintableQRCard (A4 Format)
│   │   ├── contexts/             # AuthContext, ToastContext, NotificationContext, RefreshContext
│   │   ├── hooks/                # useComplaints, useDashboardStats, etc.
│   │   ├── pages/
│   │   │   ├── public/           # LandingPage, ComplaintForm, Success, Track
│   │   │   └── admin/            # Dashboard, Complaints, Detail, Categories, Locations, ActivityLog, Settings
│   │   ├── services/             # Centralized apiService & gasClient
│   │   ├── types/                # Strict TypeScript interfaces
│   │   ├── utils/                # ID generator, sound synthesizer, date formatters
│   │   ├── config/               # statusConfig, constants, env
│   │   ├── App.tsx               # Route declarations
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── apps-script/                  # Google Apps Script Backend
│   ├── Combined_Deploy.js        # Complete 1-file deployable backend
│   ├── Code.js                   # doGet / doPost Router
│   ├── Database.js               # Sheet access, schemas & auto-migration
│   ├── ComplaintService.js       # Submit, track, filter, update, delete logic
│   ├── AdminService.js           # Auth & password management logic
│   ├── ActivityLogService.js     # Compliance audit trail logger
│   ├── ConfigService.js          # Categories and locations provider
│   ├── Security.js               # Sanitization, tokens, public data filter
│   └── appsscript.json           # Manifest
├── docs/                         # Detailed Architectural Guides
│   ├── ARCHITECTURE.md           # System design & sequence diagrams
│   ├── GOOGLE_SHEETS_SETUP.md    # Spreadsheet schema & 1-click initializer
│   ├── APPS_SCRIPT_SETUP.md      # Web App publishing instructions
│   ├── API.md                    # REST/JSON API endpoint specifications
│   ├── SECURITY.md               # Privacy & anonymity guarantees
│   └── DEPLOYMENT.md             # Vercel & static hosting guide
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/jalalakbar47/College-QR-Complaint-Box.git
cd College-QR-Complaint-Box/frontend
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!NOTE]
> The application includes an **interactive local storage simulation mode** out of the box with realistic seed data. You can test submissions, tracking, admin authentication, status updates, notifications, and printable posters immediately without any cloud configuration!

### 3. Default Chief Proctor Credentials
- **Email**: `chiefproctor@college.edu`
- **Passkey**: `proctor2026`

---

## ☁️ Connecting to Live Google Sheets (1-Click)

1. Open [Google Apps Script](https://script.google.com).
2. Copy and paste the entire code from [`apps-script/Combined_Deploy.js`](./apps-script/Combined_Deploy.js) into `Code.gs`.
3. Select `setupDatabase` in the toolbar dropdown and click **Run** *(automatically creates and formats your Google Spreadsheet)*.
4. Click **Deploy > New deployment > Web app**:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
5. Copy the generated Web App URL and paste it into `frontend/.env` (and Vercel environment variables):
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

## 👨‍💻 Author & Developer

**Jalaluddin Khan** ([@jalalakbar47](https://github.com/jalalakbar47))  
*Software Developer • BS Computer Science*  
*Government Post Graduate College (GPGC) Khar, District Bajaur*

- **GitHub**: [@jalalakbar47](https://github.com/jalalakbar47)
- **LinkedIn**: [in/jalalakbar47](https://linkedin.com/in/jalalakbar47)
- **Email**: [jalalakbarbjr@gmail.com](mailto:jalalakbarbjr@gmail.com)

---

## 📄 License
MIT License. Developed for university campus complaint redressing.
