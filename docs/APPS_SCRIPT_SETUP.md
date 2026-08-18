# Google Apps Script Setup & Deployment Guide

This guide explains how to install the backend code in Google Apps Script and publish it as a Web App API for your React frontend.

---

## Step 1: Open Apps Script Editor

1. Open your Google Spreadsheet created in the previous step (`College_QR_Complaint_Box`).
2. Click **Extensions > Apps Script** in the top navigation.
3. Name your Apps Script project: `College_QR_Complaint_Box_Backend`.

---

## Step 2: Copy Backend Code Files

Create the following files in the Apps Script left sidebar (click `+` > `Script` for each):

1. **`Code.gs`** (paste contents from `apps-script/Code.js`)
2. **`Database.gs`** (paste contents from `apps-script/Database.js`)
3. **`Security.gs`** (paste contents from `apps-script/Security.js`)
4. **`ComplaintService.gs`** (paste contents from `apps-script/ComplaintService.js`)
5. **`AdminService.gs`** (paste contents from `apps-script/AdminService.js`)
6. **`ActivityLogService.gs`** (paste contents from `apps-script/ActivityLogService.js`)
7. **`ConfigService.gs`** (paste contents from `apps-script/ConfigService.js`)
8. **`Setup.gs`** (paste contents from `apps-script/Setup.js`)

Save all files (`Ctrl + S` / `Cmd + S`).

---

## Step 3: Run Database Initialization

1. In the Apps Script toolbar, locate the function dropdown menu (defaults to `doGet` or `myFunction`).
2. Select **`setupDatabase`**.
3. Click the **Run** button (▶).
4. Google will ask for authorization:
   - Click **Review permissions**.
   - Choose your Google Account.
   - Click **Advanced** > **Go to College_QR_Complaint_Box_Backend (unsafe)**.
   - Click **Allow**.
5. The Execution log will output:
   `Database initialization completed successfully!`

---

## Step 4: Deploy as Web App

1. Click the blue **Deploy** button in the top right > **New deployment**.
2. Click the gear icon (⚙) next to "Select type" and choose **Web app**.
3. Fill in the deployment settings:
   - **Description**: `College QR Complaint Box API v1`
   - **Execute as**: **Me (`your-email@...`)**
   - **Who has access**: **Anyone** *(Crucial for student mobile access without requiring them to sign into Google)*
4. Click **Deploy**.
5. Copy the generated **Web App URL** (format: `https://script.google.com/macros/s/AKfycbx.../exec`).

---

## Step 5: Configure Frontend Environment

1. Open `frontend/.env` (or copy from `.env.example`).
2. Paste the Web App URL:
   ```env
   VITE_API_URL=https://script.google.com/macros/s/AKfycbx.../exec
   ```
3. Restart or build the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

---

## Step 6: Diagnostic Verification

To test that your Web App API is responding correctly:
1. Open your browser and navigate to:
   `https://script.google.com/macros/s/AKfycbx.../exec?action=ping`
2. You should receive a JSON response:
   ```json
   {
     "success": true,
     "message": "College QR Complaint Box Apps Script API is operational.",
     "version": "1.0.0"
   }
   ```
