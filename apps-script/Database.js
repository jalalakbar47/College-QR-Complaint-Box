/**
 * ==============================================================================
 * College QR Complaint Box - Database & Google Sheets Management
 * ==============================================================================
 */

const Database = {
  // Spreadsheet Name
  SPREADSHEET_NAME: 'College_QR_Complaint_Box',

  // Sheet Names
  SHEETS: {
    COMPLAINTS: 'Complaints',
    ADMINS: 'Admins',
    CATEGORIES: 'Categories',
    LOCATIONS: 'Locations',
    ACTIVITY_LOG: 'Activity_Log',
  },

  // Column Headers for Complaints (19 columns)
  COMPLAINT_HEADERS: [
    'complaint_id',
    'submitted_at',
    'updated_at',
    'is_anonymous',
    'student_name',
    'student_id',
    'department',
    'semester',
    'contact',
    'category',
    'title',
    'description',
    'location',
    'priority',
    'status',
    'admin_remarks',
    'resolution',
    'resolved_at',
    'assigned_to',
  ],

  // Column Headers for Admins (7 columns)
  ADMIN_HEADERS: [
    'admin_id',
    'name',
    'email',
    'role',
    'status',
    'created_at',
    'last_login',
  ],

  // Column Headers for Categories (4 columns)
  CATEGORY_HEADERS: [
    'category_id',
    'category_name',
    'description',
    'status',
  ],

  // Column Headers for Locations (3 columns)
  LOCATION_HEADERS: [
    'location_id',
    'location_name',
    'status',
  ],

  // Column Headers for Activity Log (8 columns)
  ACTIVITY_LOG_HEADERS: [
    'log_id',
    'timestamp',
    'admin_id',
    'complaint_id',
    'action',
    'old_value',
    'new_value',
    'remarks',
  ],

  /**
   * Retrieves the active spreadsheet, opens configured sheet ID, or auto-creates one
   */
  getSpreadsheet: function () {
    try {
      const active = SpreadsheetApp.getActiveSpreadsheet();
      if (active) return active;
    } catch (e) {}

    try {
      const spId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
      if (spId) {
        if (spId.indexOf('http') === 0) return SpreadsheetApp.openByUrl(spId);
        return SpreadsheetApp.openById(spId);
      }
    } catch (e) {}

    Logger.log('Standalone script detected. Auto-creating a new "College QR Complaint Box Database" Google Sheet...');
    const newSheet = SpreadsheetApp.create('College QR Complaint Box Database');
    const newId = newSheet.getId();
    try {
      PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', newId);
    } catch (e) {}
    Logger.log('Google Spreadsheet created successfully! URL: ' + newSheet.getUrl());
    return newSheet;
  },

  /**
   * Get sheet by name
   */
  getSheet: function (sheetName) {
    const ss = this.getSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    return sheet;
  },

  /**
   * Reads all data rows as objects based on header row
   */
  readAll: function (sheetName) {
    const sheet = this.getSheet(sheetName);
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();

    if (lastRow <= 1 || lastCol === 0) {
      return [];
    }

    const values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
    const headers = values[0].map(function (h) {
      return String(h).trim();
    });

    const rows = [];
    for (let r = 1; r < values.length; r++) {
      const row = values[r];
      const obj = {};
      let hasData = false;

      for (let c = 0; c < headers.length; c++) {
        const header = headers[c];
        const val = row[c];
        obj[header] = val !== undefined && val !== null ? val : '';
        if (val !== '' && val !== null && val !== undefined) {
          hasData = true;
        }
      }

      if (hasData) {
        rows.push(obj);
      }
    }

    return rows;
  },

  /**
   * Appends an object as a new row in the target sheet
   */
  appendRow: function (sheetName, headers, rowObj) {
    const sheet = this.getSheet(sheetName);
    const rowValues = headers.map(function (h) {
      const val = rowObj[h];
      return val !== undefined && val !== null ? val : '';
    });

    sheet.appendRow(rowValues);
    return true;
  },

  /**
   * Updates an existing row identified by keyColumn value
   */
  updateRow: function (sheetName, keyColumn, keyValue, updatedFields) {
    const sheet = this.getSheet(sheetName);
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();

    if (lastRow <= 1 || lastCol === 0) return false;

    const values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
    const headers = values[0].map(function (h) {
      return String(h).trim();
    });

    const keyIndex = headers.indexOf(keyColumn);
    if (keyIndex === -1) return false;

    let targetRowIndex = -1;
    for (let r = 1; r < values.length; r++) {
      if (String(values[r][keyIndex]).trim().toUpperCase() === String(keyValue).trim().toUpperCase()) {
        targetRowIndex = r + 1; // 1-indexed for Sheet Range
        break;
      }
    }

    if (targetRowIndex === -1) return false;

    // Apply updates
    for (let c = 0; c < headers.length; c++) {
      const header = headers[c];
      if (updatedFields.hasOwnProperty(header)) {
        sheet.getRange(targetRowIndex, c + 1).setValue(updatedFields[header]);
      }
    }

    return true;
  },

  /**
   * Deletes an existing row identified by keyColumn value
   */
  deleteRow: function (sheetName, keyColumn, keyValue) {
    const sheet = this.getSheet(sheetName);
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();

    if (lastRow <= 1 || lastCol === 0) return false;

    const values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
    const headers = values[0].map(function (h) {
      return String(h).trim();
    });

    const keyIndex = headers.indexOf(keyColumn);
    if (keyIndex === -1) return false;

    let targetRowIndex = -1;
    for (let r = 1; r < values.length; r++) {
      if (String(values[r][keyIndex]).trim().toUpperCase() === String(keyValue).trim().toUpperCase()) {
        targetRowIndex = r + 1; // 1-indexed for Sheet Range
        break;
      }
    }

    if (targetRowIndex === -1) return false;
    sheet.deleteRow(targetRowIndex);
    return true;
  },

  /**
   * Automated Database Initializer & Migration
   * Run this once to configure all 5 sheets, format headers, and inject seed data.
   */
  setupDatabase: function () {
    const ss = this.getSpreadsheet();

    // 1. Complaints Sheet
    let sComplaints = ss.getSheetByName(this.SHEETS.COMPLAINTS) || ss.insertSheet(this.SHEETS.COMPLAINTS);
    if (sComplaints.getLastRow() === 0) {
      sComplaints.appendRow(this.COMPLAINT_HEADERS);
      sComplaints.getRange(1, 1, 1, this.COMPLAINT_HEADERS.length).setBackground('#0359a1').setFontColor('#ffffff').setFontWeight('bold');
      sComplaints.setFrozenRows(1);
    }

    // 2. Admins Sheet (Single Chief Proctor Default Account)
    let sAdmins = ss.getSheetByName(this.SHEETS.ADMINS) || ss.insertSheet(this.SHEETS.ADMINS);
    if (sAdmins.getLastRow() === 0) {
      sAdmins.appendRow(this.ADMIN_HEADERS);
      sAdmins.getRange(1, 1, 1, this.ADMIN_HEADERS.length).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
      sAdmins.setFrozenRows(1);

      // Default Single Chief Proctor Admin Credentials
      sAdmins.appendRow(['ADM-001', 'Chief Proctor', 'chiefproctor@college.edu', 'Chief Proctor', 'Active', 'proctor2026', new Date().toISOString(), '']);
    }

    // 3. Categories Sheet
    let sCategories = ss.getSheetByName(this.SHEETS.CATEGORIES) || ss.insertSheet(this.SHEETS.CATEGORIES);
    if (sCategories.getLastRow() === 0) {
      sCategories.appendRow(this.CATEGORY_HEADERS);
      sCategories.getRange(1, 1, 1, this.CATEGORY_HEADERS.length).setBackground('#0c3f6e').setFontColor('#ffffff').setFontWeight('bold');
      sCategories.setFrozenRows(1);

      const defaultCats = [
        ['CAT-01', 'Academic', 'Curriculum, classes, syllabus coverage, lectures', 'Active'],
        ['CAT-02', 'Examination', 'Exam scheduling, seating, hall tickets, grading anomalies', 'Active'],
        ['CAT-03', 'Harassment', 'Verbal, physical, or discriminatory harassment', 'Active'],
        ['CAT-04', 'Bullying', 'Ragging, intimidation, or peer hostility', 'Active'],
        ['CAT-05', 'Discipline', 'Campus conduct, misconduct, disturbance', 'Active'],
        ['CAT-06', 'Infrastructure', 'Classrooms, furniture, boards, civil repairs', 'Active'],
        ['CAT-07', 'Cleanliness', 'Waste disposal, sanitation, campus grounds hygiene', 'Active'],
        ['CAT-08', 'Electricity', 'Power cuts, fans, lighting, backup generators', 'Active'],
        ['CAT-09', 'Water', 'Drinking water stations, washroom water supply', 'Active'],
        ['CAT-10', 'Security', 'Gate pass, guards, surveillance, theft issues', 'Active'],
        ['CAT-11', 'Transport', 'College buses, timings, route issues, drivers', 'Active'],
        ['CAT-12', 'Hostel', 'Mess food, hostel wardens, rooms, maintenance', 'Active'],
        ['CAT-13', 'Teacher/Staff', 'Faculty behavior, staff coordination, grievance', 'Active'],
        ['CAT-14', 'IT/Internet', 'Wi-Fi connectivity, lab computers, portal access', 'Active'],
        ['CAT-15', 'Other', 'General or miscellaneous campus issues', 'Active'],
      ];
      defaultCats.forEach(function (row) {
        sCategories.appendRow(row);
      });
    }

    // 4. Locations Sheet
    let sLocations = ss.getSheetByName(this.SHEETS.LOCATIONS) || ss.insertSheet(this.SHEETS.LOCATIONS);
    if (sLocations.getLastRow() === 0) {
      sLocations.appendRow(this.LOCATION_HEADERS);
      sLocations.getRange(1, 1, 1, this.LOCATION_HEADERS.length).setBackground('#0c3f6e').setFontColor('#ffffff').setFontWeight('bold');
      sLocations.setFrozenRows(1);

      const defaultLocs = [
        ['LOC-01', 'Main Gate', 'Active'],
        ['LOC-02', 'Administration Block', 'Active'],
        ['LOC-03', 'Academic Block A', 'Active'],
        ['LOC-04', 'Academic Block B', 'Active'],
        ['LOC-05', 'Computer Lab 1 & 2', 'Active'],
        ['LOC-06', 'Science & Core Labs', 'Active'],
        ['LOC-07', 'Central Library', 'Active'],
        ['LOC-08', 'Classrooms Floor 1-3', 'Active'],
        ['LOC-09', 'Examination Hall', 'Active'],
        ['LOC-10', 'Cafeteria & Canteen', 'Active'],
        ['LOC-11', 'Hostel Boys / Girls', 'Active'],
        ['LOC-12', 'Playground & Sports Arena', 'Active'],
        ['LOC-13', 'Student Parking Area', 'Active'],
        ['LOC-14', 'Washrooms & Restrooms', 'Active'],
        ['LOC-15', 'Other', 'Active'],
      ];
      defaultLocs.forEach(function (row) {
        sLocations.appendRow(row);
      });
    }

    // 5. Activity_Log Sheet
    let sActivity = ss.getSheetByName(this.SHEETS.ACTIVITY_LOG) || ss.insertSheet(this.SHEETS.ACTIVITY_LOG);
    if (sActivity.getLastRow() === 0) {
      sActivity.appendRow(this.ACTIVITY_LOG_HEADERS);
      sActivity.getRange(1, 1, 1, this.ACTIVITY_LOG_HEADERS.length).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
      sActivity.setFrozenRows(1);
    }

    return {
      success: true,
      message: 'College QR Complaint Box Database initialization completed successfully!',
    };
  },
};
