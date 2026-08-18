# Google Sheets Setup Guide

This guide walks you through setting up the **Google Sheets database** for the College QR Complaint Box.

---

## Automated 1-Click Setup (Recommended)

You do **not** have to create columns and sheets manually. The Apps Script backend comes with an automated migration script:

1. Open [Google Sheets](https://sheets.new) in your browser.
2. Name the spreadsheet: `College_QR_Complaint_Box`
3. Click **Extensions > Apps Script** in the menu bar.
4. Copy the scripts from the `/apps-script` folder into the editor (see [APPS_SCRIPT_SETUP.md](./APPS_SCRIPT_SETUP.md)).
5. In the Apps Script toolbar dropdown, select the function **`setupDatabase`** and click **Run**.
6. Grant the required permissions when prompted.
7. Return to Google Sheets: all 5 sheets, headers, colors, and initial seed categories/locations/admins are automatically initialized!

---

## Manual Sheet Structure (Reference)

If you prefer to inspect or create the sheets manually, ensure the following sheets and columns are present:

### 1. Sheet: `Complaints`
| Column Index | Column Header | Data Type | Description |
|---|---|---|---|
| A | `complaint_id` | String | Unique ticket ID (format: `CQB-YYYYMMDD-XXXX`) |
| B | `submitted_at` | ISO 8601 String | Submission timestamp |
| C | `updated_at` | ISO 8601 String | Last modification timestamp |
| D | `is_anonymous` | Boolean | `TRUE` if anonymous, `FALSE` if identified |
| E | `student_name` | String | Student Full Name (empty if anonymous) |
| F | `student_id` | String | Student ID / Roll Number (empty if anonymous) |
| G | `department` | String | Academic Department (empty if anonymous) |
| H | `semester` | String | Semester (empty if anonymous) |
| I | `contact` | String | Phone number (empty if anonymous) |
| J | `category` | String | Selected category (e.g. Electricity, Academic, Security) |
| K | `title` | String | Brief title of the issue |
| L | `description` | String | Detailed grievance statement |
| M | `location` | String | Incident location (e.g. Academic Block A) |
| N | `priority` | String | `Low`, `Medium`, `High`, or `Critical` |
| O | `status` | String | `New`, `Under Review`, `Assigned`, `In Progress`, `Resolved`, `Rejected`, `Closed` |
| P | `admin_remarks` | String | Internal proctor remarks (confidential) |
| Q | `resolution` | String | Official resolution note (visible to student) |
| R | `resolved_at` | ISO 8601 String | Timestamp when resolved |
| S | `assigned_to` | String | Assigned staff / proctor name |

---

### 2. Sheet: `Admins`
| Column Index | Column Header | Description |
|---|---|---|
| A | `admin_id` | Unique Admin ID (e.g. `ADM-001`) |
| B | `name` | Administrator Name |
| C | `email` | Authorized Google / login email |
| D | `role` | `Chief Proctor`, `Admin`, or `Staff` |
| E | `status` | `Active` or `Inactive` |
| F | `created_at` | Account creation timestamp |
| G | `last_login` | Last login timestamp |

---

### 3. Sheet: `Categories`
| Column Index | Column Header | Description |
|---|---|---|
| A | `category_id` | e.g. `CAT-01` |
| B | `category_name` | e.g. `Academic`, `Hostel`, `Electricity` |
| C | `description` | Category helper description |
| D | `status` | `Active` or `Inactive` |

---

### 4. Sheet: `Locations`
| Column Index | Column Header | Description |
|---|---|---|
| A | `location_id` | e.g. `LOC-01` |
| B | `location_name` | e.g. `Main Gate`, `Central Library` |
| C | `status` | `Active` or `Inactive` |

---

### 5. Sheet: `Activity_Log`
| Column Index | Column Header | Description |
|---|---|---|
| A | `log_id` | Unique log ID (e.g. `LOG-123456`) |
| B | `timestamp` | Timestamp of administrative action |
| C | `admin_id` | Proctor ID who executed action |
| D | `complaint_id` | Associated grievance ticket |
| E | `action` | `STATUS_CHANGE`, `PRIORITY_CHANGE`, `ADMIN_UPDATE` |
| F | `old_value` | Previous state |
| G | `new_value` | New state |
| H | `remarks` | Action notes or justification |
