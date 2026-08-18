# Deployment Guide - College QR Complaint Box

This document guides you through deploying both the **React Frontend** and the **Google Apps Script Backend** to production.

---

## 1. Frontend Production Build

The frontend is built using Vite and generates a purely static single-page application (SPA) suitable for hosting on **Vercel**, **Netlify**, **GitHub Pages**, **AWS S3 + CloudFront**, or **Apache/Nginx**.

### Step 1: Install & Build
```bash
cd frontend
npm install
npm run build
```
The compiled, minified production assets will be output to `frontend/dist/`.

---

## 2. Deploying Frontend to Vercel

1. Push your code to GitHub / GitLab.
2. Log in to [Vercel Dashboard](https://vercel.com).
3. Click **Add New > Project** and import your repository.
4. Set the **Root Directory** to `frontend`.
5. Under **Environment Variables**, add:
   - `VITE_API_URL`: Your published Google Apps Script Web App URL.
   - `VITE_COLLEGE_NAME`: Your institution's full name.
   - `VITE_COLLEGE_SHORT_NAME`: Your institution's abbreviation (e.g., `AIET`).
   - `VITE_PORTAL_TITLE`: `College QR Complaint Box`.
6. Click **Deploy**.

---

## 3. Deploying Frontend to Netlify

1. Log in to [Netlify](https://netlify.com) and click **Add new site > Import an existing project**.
2. Select your repository.
3. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. Add environment variable: `VITE_API_URL`.
5. Create a `_redirects` file in `frontend/public/_redirects` containing:
   ```
   /*    /index.html   200
   ```
6. Click **Deploy Site**.

---

## 4. Google Apps Script Web App Deployment

1. Follow the instructions in [APPS_SCRIPT_SETUP.md](./APPS_SCRIPT_SETUP.md).
2. Ensure **Execute as** is set to **Me** and **Who has access** is set to **Anyone**.
3. Whenever you update code in `apps-script/`, create a **New Version** via **Deploy > Manage deployments > Edit > New version > Deploy**.
