/**
 * ==============================================================================
 * College QR Complaint Box - Complete Backend (Single Combined File)
 * ==============================================================================
 * Paste this ENTIRE file into your Google Apps Script editor (Code.gs).
 * Then select "setupDatabase" in the toolbar and click "Run".
 * ==============================================================================
 */

// ==========================================
// 1. SECURITY & TOKEN VERIFICATION
// ==========================================
const Security = {
  VALID_STATUSES: ['New', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Rejected', 'Closed'],
  VALID_PRIORITIES: ['Low', 'Medium', 'High', 'Critical'],

  sanitizeString: function (str) {
    if (!str) return '';
    return String(str).replace(/<[^>]*>/g, '').trim();
  },

  generateToken: function (adminId) {
    const timestamp = Date.now();
    const raw = adminId + '_' + timestamp;
    const signature = Utilities.base64Encode(
      Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw + '_CQB_PROCTOR_SECRET_SALT_2026')
    ).substring(0, 20);
    return 'CQB_AUTH_' + adminId + '_' + timestamp + '_' + signature;
  },

  validateToken: function (token) {
    if (!token || typeof token !== 'string') return false;
    if (!token.startsWith('CQB_AUTH_')) return false;

    const parts = token.split('_');
    if (parts.length < 5) return false;

    const adminId = parts[2];
    const timestamp = parseInt(parts[3], 10);
    const providedSig = parts[4];

    if (isNaN(timestamp) || Date.now() - timestamp > 43200000 || timestamp > Date.now() + 60000) {
      return false;
    }

    const expectedSig = Utilities.base64Encode(
      Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, adminId + '_' + timestamp + '_CQB_PROCTOR_SECRET_SALT_2026')
    ).substring(0, 20);

    if (providedSig !== expectedSig) return false;

    try {
      const admins = Database.readAll(Database.SHEETS.ADMINS);
      const activeAdmin = admins.find(function (a) {
        return String(a.admin_id).trim() === adminId && a.status === 'Active';
      });
      return Boolean(activeAdmin);
    } catch (e) {
      Logger.log('Error verifying admin authorization: ' + e.toString());
      return false;
    }
  },

  filterPublicSafeComplaint: function (c) {
    if (!c) return null;
    return {
      complaint_id: c.complaint_id,
      submitted_at: c.submitted_at,
      updated_at: c.updated_at,
      category: c.category,
      title: c.title,
      description: c.description,
      location: c.location,
      status: c.status,
      resolution: c.resolution || '',
      resolved_at: c.resolved_at || '',
    };
  },
};

// ==========================================
// 2. DATABASE & SHEETS MANAGEMENT
// ==========================================
const Database = {
  SHEETS: {
    COMPLAINTS: 'Complaints',
    ADMINS: 'Admins',
    CATEGORIES: 'Categories',
    LOCATIONS: 'Locations',
    ACTIVITY_LOG: 'Activity_Log',
  },

  COMPLAINT_HEADERS: [
    'complaint_id', 'submitted_at', 'updated_at', 'is_anonymous',
    'student_name', 'student_id', 'department', 'semester', 'contact',
    'category', 'title', 'description', 'location', 'priority', 'status',
    'admin_remarks', 'resolution', 'resolved_at', 'assigned_to'
  ],

  ADMIN_HEADERS: ['admin_id', 'name', 'email', 'role', 'status', 'passkey', 'created_at', 'last_login'],
  CATEGORY_HEADERS: ['category_id', 'category_name', 'description', 'status'],
  LOCATION_HEADERS: ['location_id', 'location_name', 'status'],
  ACTIVITY_LOG_HEADERS: ['log_id', 'timestamp', 'admin_id', 'complaint_id', 'action', 'old_value', 'new_value', 'remarks'],

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

  getSheet: function (sheetName) {
    const ss = this.getSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    return sheet;
  },

  readAll: function (sheetName) {
    const sheet = this.getSheet(sheetName);
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();

    if (lastRow <= 1 || lastCol === 0) return [];

    const values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
    const headers = values[0].map(function (h) { return String(h).trim(); });

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

      if (hasData) rows.push(obj);
    }
    return rows;
  },

  appendRow: function (sheetName, headers, rowObj) {
    const sheet = this.getSheet(sheetName);
    const rowValues = headers.map(function (h) {
      const val = rowObj[h];
      return val !== undefined && val !== null ? val : '';
    });
    sheet.appendRow(rowValues);
    return true;
  },

  updateRow: function (sheetName, keyColumn, keyValue, updatedFields) {
    const sheet = this.getSheet(sheetName);
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();

    if (lastRow <= 1 || lastCol === 0) return false;

    const values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
    const headers = values[0].map(function (h) { return String(h).trim(); });

    const keyIndex = headers.indexOf(keyColumn);
    if (keyIndex === -1) return false;

    let targetRowIndex = -1;
    for (let r = 1; r < values.length; r++) {
      if (String(values[r][keyIndex]).trim().toUpperCase() === String(keyValue).trim().toUpperCase()) {
        targetRowIndex = r + 1;
        break;
      }
    }

    if (targetRowIndex === -1) return false;

    for (let c = 0; c < headers.length; c++) {
      const header = headers[c];
      if (updatedFields.hasOwnProperty(header)) {
        sheet.getRange(targetRowIndex, c + 1).setValue(updatedFields[header]);
      }
    }
    return true;
  },

  deleteRow: function (sheetName, keyColumn, keyValue) {
    const sheet = this.getSheet(sheetName);
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();

    if (lastRow <= 1 || lastCol === 0) return false;

    const values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
    const headers = values[0].map(function (h) { return String(h).trim(); });

    const keyIndex = headers.indexOf(keyColumn);
    if (keyIndex === -1) return false;

    let targetRowIndex = -1;
    for (let r = 1; r < values.length; r++) {
      if (String(values[r][keyIndex]).trim().toUpperCase() === String(keyValue).trim().toUpperCase()) {
        targetRowIndex = r + 1;
        break;
      }
    }

    if (targetRowIndex === -1) return false;
    sheet.deleteRow(targetRowIndex);
    return true;
  },

  setupDatabase: function () {
    const ss = this.getSpreadsheet();

    // 1. Complaints Sheet
    let sComplaints = ss.getSheetByName(this.SHEETS.COMPLAINTS) || ss.insertSheet(this.SHEETS.COMPLAINTS);
    if (sComplaints.getLastRow() === 0) {
      sComplaints.appendRow(this.COMPLAINT_HEADERS);
      sComplaints.getRange(1, 1, 1, this.COMPLAINT_HEADERS.length).setBackground('#0359a1').setFontColor('#ffffff').setFontWeight('bold');
      sComplaints.setFrozenRows(1);
    }

    // 2. Admins Sheet (Single Default Chief Proctor Account)
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
      defaultCats.forEach(function (row) { sCategories.appendRow(row); });
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
      defaultLocs.forEach(function (row) { sLocations.appendRow(row); });
    }

    // 5. Activity_Log Sheet
    let sActivity = ss.getSheetByName(this.SHEETS.ACTIVITY_LOG) || ss.insertSheet(this.SHEETS.ACTIVITY_LOG);
    if (sActivity.getLastRow() === 0) {
      sActivity.appendRow(this.ACTIVITY_LOG_HEADERS);
      sActivity.getRange(1, 1, 1, this.ACTIVITY_LOG_HEADERS.length).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
      sActivity.setFrozenRows(1);
    }

    try {
      let sheet1 = ss.getSheetByName('Sheet1');
      if (sheet1 && ss.getSheets().length > 1) {
        ss.deleteSheet(sheet1);
      }
    } catch (e) {}

    return {
      success: true,
      message: 'College QR Complaint Box Database initialization completed successfully!',
    };
  },
};

// ==========================================
// 3. ACTIVITY LOG SERVICE
// ==========================================
const ActivityLogService = {
  logActivity: function (adminId, complaintId, action, oldValue, newValue, remarks) {
    try {
      const logId = 'LOG-' + Math.floor(100000 + Math.random() * 900000);
      const timestamp = new Date().toISOString();
      const rowObj = {
        log_id: logId,
        timestamp: timestamp,
        admin_id: adminId || 'SYSTEM',
        complaint_id: complaintId || '',
        action: action || 'MODIFIED',
        old_value: oldValue || '',
        new_value: newValue || '',
        remarks: remarks || '',
      };
      Database.appendRow(Database.SHEETS.ACTIVITY_LOG, Database.ACTIVITY_LOG_HEADERS, rowObj);
      return true;
    } catch (e) {
      Logger.log('Error writing activity log: ' + e.toString());
      return false;
    }
  },

  getActivityLogs: function () {
    const logs = Database.readAll(Database.SHEETS.ACTIVITY_LOG);
    logs.sort(function (a, b) {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    return { success: true, data: logs };
  },
};

// ==========================================
// 4. CONFIG SERVICE (Categories & Locations CRUD)
// ==========================================
const ConfigService = {
  getCategories: function () {
    const categories = Database.readAll(Database.SHEETS.CATEGORIES);
    return { success: true, data: categories };
  },

  saveCategory: function (payload) {
    const sheetName = Database.SHEETS.CATEGORIES;
    const catId = payload.category_id;
    const existing = Database.readAll(sheetName).find(function (c) { return String(c.category_id).trim() === String(catId).trim(); });

    if (existing) {
      Database.updateRow(sheetName, 'category_id', catId, {
        category_name: Security.sanitizeString(payload.category_name),
        description: Security.sanitizeString(payload.description),
        status: payload.status || 'Active',
      });
      return { success: true, message: 'Category updated successfully.' };
    } else {
      const newId = catId || ('CAT-' + Math.floor(1000 + Math.random() * 9000));
      Database.appendRow(sheetName, Database.CATEGORY_HEADERS, {
        category_id: newId,
        category_name: Security.sanitizeString(payload.category_name),
        description: Security.sanitizeString(payload.description),
        status: payload.status || 'Active',
      });
      return { success: true, message: 'Category created successfully.', data: { category_id: newId } };
    }
  },

  deleteCategory: function (categoryId) {
    const success = Database.deleteRow(Database.SHEETS.CATEGORIES, 'category_id', categoryId);
    return { success: success, message: success ? 'Category deleted.' : 'Category not found.' };
  },

  getLocations: function () {
    const locations = Database.readAll(Database.SHEETS.LOCATIONS);
    return { success: true, data: locations };
  },

  saveLocation: function (payload) {
    const sheetName = Database.SHEETS.LOCATIONS;
    const locId = payload.location_id;
    const existing = Database.readAll(sheetName).find(function (l) { return String(l.location_id).trim() === String(locId).trim(); });

    if (existing) {
      Database.updateRow(sheetName, 'location_id', locId, {
        location_name: Security.sanitizeString(payload.location_name),
        status: payload.status || 'Active',
      });
      return { success: true, message: 'Location updated successfully.' };
    } else {
      const newId = locId || ('LOC-' + Math.floor(1000 + Math.random() * 9000));
      Database.appendRow(sheetName, Database.LOCATION_HEADERS, {
        location_id: newId,
        location_name: Security.sanitizeString(payload.location_name),
        status: payload.status || 'Active',
      });
      return { success: true, message: 'Location created successfully.', data: { location_id: newId } };
    }
  },

  deleteLocation: function (locationId) {
    const success = Database.deleteRow(Database.SHEETS.LOCATIONS, 'location_id', locationId);
    return { success: success, message: success ? 'Location deleted.' : 'Location not found.' };
  },
};

// ==========================================
// 5. COMPLAINT SERVICE
// ==========================================
const ComplaintService = {
  generateComplaintId: function () {
    const now = new Date();
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    const dateSegment = '' + year + month + day;
    const chars = '0123456789ABCDEF';
    let randSegment = '';
    for (let i = 0; i < 4; i++) {
      randSegment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return 'CQB-' + dateSegment + '-' + randSegment;
  },

  submitComplaint: function (payload) {
    if (!payload.category || !payload.title || !payload.description || !payload.location) {
      return {
        success: false,
        message: 'Missing required fields: Category, Location, Title, and Description are mandatory.',
        errorCode: 'VALIDATION_ERROR',
      };
    }

    const complaintId = this.generateComplaintId();
    const nowIso = new Date().toISOString();
    const isAnonymous = payload.is_anonymous === true || payload.is_anonymous === 'true';

    const rowObj = {
      complaint_id: complaintId,
      submitted_at: nowIso,
      updated_at: nowIso,
      is_anonymous: isAnonymous,
      student_name: isAnonymous ? '' : Security.sanitizeString(payload.student_name),
      student_id: isAnonymous ? '' : Security.sanitizeString(payload.student_id),
      department: isAnonymous ? '' : Security.sanitizeString(payload.department),
      semester: isAnonymous ? '' : Security.sanitizeString(payload.semester),
      contact: isAnonymous ? '' : Security.sanitizeString(payload.contact),
      category: Security.sanitizeString(payload.category),
      title: Security.sanitizeString(payload.title),
      description: Security.sanitizeString(payload.description),
      location: Security.sanitizeString(payload.location),
      priority: 'Medium',
      status: 'New',
      admin_remarks: '',
      resolution: '',
      resolved_at: '',
      assigned_to: '',
    };

    Database.appendRow(Database.SHEETS.COMPLAINTS, Database.COMPLAINT_HEADERS, rowObj);

    return {
      success: true,
      message: 'Complaint submitted successfully.',
      data: {
        complaint_id: complaintId,
        complaint: rowObj,
      },
    };
  },

  trackComplaint: function (complaintId) {
    if (!complaintId) {
      return { success: false, message: 'Please provide a valid Complaint Reference ID.', errorCode: 'INVALID_ID' };
    }
    const cleanId = String(complaintId).trim().toUpperCase();
    const complaints = Database.readAll(Database.SHEETS.COMPLAINTS);
    const found = complaints.find(function (c) {
      return String(c.complaint_id).trim().toUpperCase() === cleanId;
    });

    if (!found) {
      return {
        success: false,
        message: 'No complaint found with Reference ID: ' + cleanId,
        errorCode: 'NOT_FOUND',
      };
    }

    return {
      success: true,
      data: Security.filterPublicSafeComplaint(found),
    };
  },

  getComplaints: function (filters) {
    filters = filters || {};
    let list = Database.readAll(Database.SHEETS.COMPLAINTS);

    if (filters.status && filters.status !== 'All') {
      list = list.filter(function (c) { return c.status === filters.status; });
    }
    if (filters.priority && filters.priority !== 'All') {
      list = list.filter(function (c) { return c.priority === filters.priority; });
    }
    if (filters.category && filters.category !== 'All') {
      list = list.filter(function (c) { return c.category === filters.category; });
    }
    if (filters.location && filters.location !== 'All') {
      list = list.filter(function (c) { return c.location === filters.location; });
    }
    if (filters.department && filters.department !== 'All') {
      list = list.filter(function (c) { return c.department === filters.department; });
    }
    if (filters.search && String(filters.search).trim() !== '') {
      const q = String(filters.search).trim().toLowerCase();
      list = list.filter(function (c) {
        return (
          String(c.complaint_id).toLowerCase().indexOf(q) !== -1 ||
          String(c.title).toLowerCase().indexOf(q) !== -1 ||
          String(c.description).toLowerCase().indexOf(q) !== -1 ||
          String(c.student_name).toLowerCase().indexOf(q) !== -1 ||
          String(c.student_id).toLowerCase().indexOf(q) !== -1 ||
          String(c.department).toLowerCase().indexOf(q) !== -1
        );
      });
    }

    list.sort(function (a, b) {
      return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
    });

    return { success: true, data: list };
  },

  getComplaint: function (complaintId) {
    if (!complaintId) return { success: false, message: 'ID required.', errorCode: 'INVALID_ID' };
    const cleanId = String(complaintId).trim().toUpperCase();
    const complaints = Database.readAll(Database.SHEETS.COMPLAINTS);
    const found = complaints.find(function (c) {
      return String(c.complaint_id).trim().toUpperCase() === cleanId;
    });

    if (!found) return { success: false, message: 'Complaint record not found.', errorCode: 'NOT_FOUND' };
    return { success: true, data: found };
  },

  updateComplaint: function (payload) {
    if (!payload.complaint_id) {
      return { success: false, message: 'Complaint ID is required for update.', errorCode: 'INVALID_ID' };
    }

    const cleanId = String(payload.complaint_id).trim().toUpperCase();
    const complaints = Database.readAll(Database.SHEETS.COMPLAINTS);
    const current = complaints.find(function (c) {
      return String(c.complaint_id).trim().toUpperCase() === cleanId;
    });

    if (!current) {
      return { success: false, message: 'Complaint record not found.', errorCode: 'NOT_FOUND' };
    }

    const nowIso = new Date().toISOString();
    const oldStatus = current.status;
    const oldPriority = current.priority;

    const updatedFields = { updated_at: nowIso };

    if (payload.status && Security.VALID_STATUSES.indexOf(payload.status) !== -1) {
      updatedFields.status = payload.status;
      if (payload.status === 'Resolved' && !current.resolved_at) {
        updatedFields.resolved_at = nowIso;
      }
    }

    if (payload.priority && Security.VALID_PRIORITIES.indexOf(payload.priority) !== -1) {
      updatedFields.priority = payload.priority;
    }

    if (payload.assigned_to !== undefined) {
      updatedFields.assigned_to = Security.sanitizeString(payload.assigned_to);
    }
    if (payload.admin_remarks !== undefined) {
      updatedFields.admin_remarks = Security.sanitizeString(payload.admin_remarks);
    }
    if (payload.resolution !== undefined) {
      updatedFields.resolution = Security.sanitizeString(payload.resolution);
    }

    const updateSuccess = Database.updateRow(Database.SHEETS.COMPLAINTS, 'complaint_id', cleanId, updatedFields);
    if (!updateSuccess) {
      return { success: false, message: 'Failed to write updates to spreadsheet.', errorCode: 'WRITE_ERROR' };
    }

    let actionType = 'ADMIN_UPDATE';
    let oldVal = '';
    let newVal = '';

    if (updatedFields.status && updatedFields.status !== oldStatus) {
      actionType = 'STATUS_CHANGE';
      oldVal = oldStatus;
      newVal = updatedFields.status;
    } else if (updatedFields.priority && updatedFields.priority !== oldPriority) {
      actionType = 'PRIORITY_CHANGE';
      oldVal = oldPriority;
      newVal = updatedFields.priority;
    }

    ActivityLogService.logActivity(
      payload.admin_id || 'ADM-001',
      cleanId,
      actionType,
      oldVal,
      newVal,
      payload.admin_remarks || payload.resolution || 'Admin updated complaint details.'
    );

    return {
      success: true,
      message: 'Complaint updated successfully.',
      data: Object.assign({}, current, updatedFields),
    };
  },

  deleteComplaint: function (complaintId, adminId, reason) {
    if (!complaintId) {
      return { success: false, message: 'Complaint ID is required.', errorCode: 'INVALID_ID' };
    }

    const cleanId = String(complaintId).trim().toUpperCase();
    const complaints = Database.readAll(Database.SHEETS.COMPLAINTS);
    const found = complaints.find(function (c) {
      return String(c.complaint_id).trim().toUpperCase() === cleanId;
    });

    if (!found) {
      return { success: false, message: 'Complaint record not found.', errorCode: 'NOT_FOUND' };
    }

    const deleteSuccess = Database.deleteRow(Database.SHEETS.COMPLAINTS, 'complaint_id', cleanId);

    if (!deleteSuccess) {
      return { success: false, message: 'Failed to delete row from spreadsheet.', errorCode: 'DELETE_ERROR' };
    }

    ActivityLogService.logActivity(
      adminId || 'ADM-001',
      cleanId,
      'DELETE_COMPLAINT',
      found.status,
      'DELETED',
      reason || 'Chief Proctor permanently deleted complaint ticket.'
    );

    return {
      success: true,
      message: 'Complaint ' + cleanId + ' permanently deleted from database.',
      data: true,
    };
  },
};

// ==========================================
// 6. ADMIN SERVICE (Auth & Real-Time Stats)
// ==========================================
const AdminService = {
  login: function (email, passkey) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPasskey = String(passkey || '').trim();

    if (!cleanEmail || !cleanPasskey) {
      return { success: false, message: 'Email address and security passkey are required.', errorCode: 'INVALID_INPUT' };
    }

    let admins = Database.readAll(Database.SHEETS.ADMINS);

    // Auto-seed default Chief Proctor if Admins sheet is empty on fresh install
    if (admins.length === 0) {
      const defaultAdmin = {
        admin_id: 'ADM-001',
        name: 'Chief Proctor',
        email: 'chiefproctor@college.edu',
        role: 'Chief Proctor',
        status: 'Active',
        passkey: 'proctor2026',
        created_at: new Date().toISOString(),
        last_login: '',
      };
      Database.appendRow(Database.SHEETS.ADMINS, Database.ADMIN_HEADERS, defaultAdmin);
      admins = [defaultAdmin];
    }

    const admin = admins.find(function (a) {
      return String(a.email).trim().toLowerCase() === cleanEmail && a.status === 'Active';
    });

    if (!admin) {
      return {
        success: false,
        message: 'Invalid email or unauthorized administrative account.',
        errorCode: 'INVALID_CREDENTIALS',
      };
    }

    // Verify security passkey against sheet or default college passkey
    const expectedPasskey = admin.passkey ? String(admin.passkey).trim() : 'proctor2026';
    if (cleanPasskey !== expectedPasskey) {
      return {
        success: false,
        message: 'Incorrect security passkey / password. Access denied.',
        errorCode: 'INVALID_PASSWORD',
      };
    }

    Database.updateRow(Database.SHEETS.ADMINS, 'admin_id', admin.admin_id, {
      last_login: new Date().toISOString(),
    });

    const token = Security.generateToken(admin.admin_id);

    return {
      success: true,
      message: 'Login successful.',
      data: {
        token: token,
        admin: admin,
      },
    };
  },

  changePassword: function (adminId, currentPassword, newPassword) {
    if (!adminId || !currentPassword || !newPassword) {
      return { success: false, message: 'All password fields are mandatory.', errorCode: 'INVALID_INPUT' };
    }

    const cleanCurrent = String(currentPassword).trim();
    const cleanNew = String(newPassword).trim();

    if (cleanNew.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters.', errorCode: 'WEAK_PASSWORD' };
    }

    const admins = Database.readAll(Database.SHEETS.ADMINS);
    const admin = admins.find(function (a) {
      return String(a.admin_id).trim() === String(adminId).trim();
    });

    if (!admin) {
      return { success: false, message: 'Admin account not found.', errorCode: 'NOT_FOUND' };
    }

    const expectedPasskey = admin.passkey ? String(admin.passkey).trim() : 'proctor2026';
    if (cleanCurrent !== expectedPasskey) {
      return { success: false, message: 'Current password is incorrect. Please try again.', errorCode: 'INVALID_PASSWORD' };
    }

    const updateSuccess = Database.updateRow(Database.SHEETS.ADMINS, 'admin_id', adminId, {
      passkey: cleanNew,
    });

    if (!updateSuccess) {
      return { success: false, message: 'Failed to update passkey in spreadsheet.', errorCode: 'WRITE_ERROR' };
    }

    ActivityLogService.logActivity(adminId, '', 'PASSWORD_CHANGE', '***', '***', 'Proctor updated account security password.');

    return {
      success: true,
      message: 'Password changed successfully and updated in Google Sheets.',
    };
  },

  getDashboardStats: function () {
    const complaints = Database.readAll(Database.SHEETS.COMPLAINTS);
    const todayStr = new Date().toISOString().slice(0, 10);

    let newCount = 0, underReviewCount = 0, assignedCount = 0, inProgressCount = 0;
    let resolvedCount = 0, rejectedCount = 0, closedCount = 0, criticalCount = 0;
    let highCount = 0, todayCount = 0;

    complaints.forEach(function (c) {
      if (c.status === 'New') newCount++;
      else if (c.status === 'Under Review') underReviewCount++;
      else if (c.status === 'Assigned') assignedCount++;
      else if (c.status === 'In Progress') inProgressCount++;
      else if (c.status === 'Resolved') resolvedCount++;
      else if (c.status === 'Rejected') rejectedCount++;
      else if (c.status === 'Closed') closedCount++;

      if (c.priority === 'Critical') criticalCount++;
      else if (c.priority === 'High') highCount++;

      if (c.submitted_at && String(c.submitted_at).indexOf(todayStr) === 0) {
        todayCount++;
      }
    });

    const sorted = complaints.slice().sort(function (a, b) {
      return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
    });

    return {
      success: true,
      data: {
        total: complaints.length,
        new: newCount,
        underReview: underReviewCount,
        assigned: assignedCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
        rejected: rejectedCount,
        closed: closedCount,
        critical: criticalCount,
        highPriority: highCount,
        todayCount: todayCount,
        recentComplaints: sorted.slice(0, 10),
      },
    };
  },

  getAdmins: function () {
    const admins = Database.readAll(Database.SHEETS.ADMINS);
    return { success: true, data: admins };
  },
};

// ==========================================
// 7. DISPATCHER & HTTP HANDLERS
// ==========================================
function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = String(params.action || 'ping').trim();

    // 1. Public Endpoints
    switch (action) {
      case 'ping':
        return createJsonResponse({
          success: true,
          message: 'College QR Complaint Box Apps Script API is operational.',
          version: '1.0.0',
          timestamp: new Date().toISOString(),
        });
      case 'trackComplaint':
        return createJsonResponse(ComplaintService.trackComplaint(params.complaint_id));
      case 'getCategories':
        return createJsonResponse(ConfigService.getCategories());
      case 'getLocations':
        return createJsonResponse(ConfigService.getLocations());
      case 'adminLogin':
        return createJsonResponse(AdminService.login(params.email, params.passkey || params.password));

      // 2. Protected Admin Endpoints
      case 'getDashboardStats':
        if (!Security.validateToken(params.token)) {
          return createJsonResponse({ success: false, message: 'Unauthorized: Valid administrator session token required.', errorCode: 'UNAUTHORIZED' });
        }
        return createJsonResponse(AdminService.getDashboardStats());

      case 'getComplaints':
        if (!Security.validateToken(params.token)) {
          return createJsonResponse({ success: false, message: 'Unauthorized: Valid administrator session token required.', errorCode: 'UNAUTHORIZED' });
        }
        return createJsonResponse(ComplaintService.getComplaints(params));

      case 'getComplaint':
        if (!Security.validateToken(params.token)) {
          return createJsonResponse({ success: false, message: 'Unauthorized: Valid administrator session token required.', errorCode: 'UNAUTHORIZED' });
        }
        return createJsonResponse(ComplaintService.getComplaint(params.complaint_id));

      case 'getAdmins':
        if (!Security.validateToken(params.token)) {
          return createJsonResponse({ success: false, message: 'Unauthorized: Valid administrator session token required.', errorCode: 'UNAUTHORIZED' });
        }
        return createJsonResponse(AdminService.getAdmins());

      case 'getActivityLogs':
        if (!Security.validateToken(params.token)) {
          return createJsonResponse({ success: false, message: 'Unauthorized: Valid administrator session token required.', errorCode: 'UNAUTHORIZED' });
        }
        return createJsonResponse(ActivityLogService.getActivityLogs());

      default:
        return createJsonResponse({ success: false, message: 'Unknown GET action: ' + action, errorCode: 'UNKNOWN_ACTION' });
    }
  } catch (error) {
    return createJsonResponse({
      success: false,
      message: 'Server error processing GET request: ' + error.toString(),
      errorCode: 'SERVER_ERROR',
    });
  }
}

function doPost(e) {
  try {
    let body = {};
    if (e && e.postData && e.postData.contents) {
      try {
        body = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        body = e.parameter || {};
      }
    } else if (e && e.parameter) {
      body = e.parameter;
    }

    const action = String(body.action || (e && e.parameter && e.parameter.action) || '').trim();
    const payload = body.data !== undefined ? body.data : body;
    const token = body.token || (e && e.parameter && e.parameter.token) || (payload && payload.token);

    // Public POST
    if (action === 'submitComplaint') {
      return createJsonResponse(ComplaintService.submitComplaint(payload));
    }
    if (action === 'adminLogin') {
      return createJsonResponse(AdminService.login(payload.email, payload.passkey || payload.password));
    }

    // Protected Admin POST: Update Complaint
    if (action === 'updateComplaint') {
      if (!Security.validateToken(token)) {
        return createJsonResponse({ success: false, message: 'Unauthorized: Valid administrator session token required.', errorCode: 'UNAUTHORIZED' });
      }
      return createJsonResponse(ComplaintService.updateComplaint(payload));
    }

    // Protected Admin POST: Delete Complaint
    if (action === 'deleteComplaint') {
      if (!Security.validateToken(token)) {
        return createJsonResponse({ success: false, message: 'Unauthorized: Valid administrator session token required.', errorCode: 'UNAUTHORIZED' });
      }
      return createJsonResponse(ComplaintService.deleteComplaint(payload.complaint_id || payload, payload.admin_id, payload.reason));
    }

    // Protected Admin POST: Categories CRUD
    if (action === 'saveCategory') {
      if (!Security.validateToken(token)) {
        return createJsonResponse({ success: false, message: 'Unauthorized: Valid administrator session token required.', errorCode: 'UNAUTHORIZED' });
      }
      return createJsonResponse(ConfigService.saveCategory(payload));
    }

    if (action === 'deleteCategory') {
      if (!Security.validateToken(token)) {
        return createJsonResponse({ success: false, message: 'Unauthorized: Valid administrator session token required.', errorCode: 'UNAUTHORIZED' });
      }
      return createJsonResponse(ConfigService.deleteCategory(payload.category_id || payload));
    }

    // Protected Admin POST: Locations CRUD
    if (action === 'saveLocation') {
      if (!Security.validateToken(token)) {
        return createJsonResponse({ success: false, message: 'Unauthorized: Valid administrator session token required.', errorCode: 'UNAUTHORIZED' });
      }
      return createJsonResponse(ConfigService.saveLocation(payload));
    }

    if (action === 'deleteLocation') {
      if (!Security.validateToken(token)) {
        return createJsonResponse({ success: false, message: 'Unauthorized: Valid administrator session token required.', errorCode: 'UNAUTHORIZED' });
      }
      return createJsonResponse(ConfigService.deleteLocation(payload.location_id || payload));
    }

    // Protected Admin POST: Change Password
    if (action === 'changePassword') {
      if (!Security.validateToken(token)) {
        return createJsonResponse({ success: false, message: 'Unauthorized: Valid administrator session token required.', errorCode: 'UNAUTHORIZED' });
      }
      return createJsonResponse(AdminService.changePassword(payload.admin_id, payload.current_password, payload.new_password));
    }

    return createJsonResponse({
      success: false,
      message: 'Unknown POST action: ' + action,
      errorCode: 'UNKNOWN_ACTION',
      receivedAction: action,
      availableActions: ['submitComplaint', 'adminLogin', 'updateComplaint', 'deleteComplaint', 'saveCategory', 'deleteCategory', 'saveLocation', 'deleteLocation', 'changePassword']
    });
  } catch (error) {
    return createJsonResponse({
      success: false,
      message: 'Server error processing POST request: ' + error.toString(),
      errorCode: 'SERVER_ERROR',
    });
  }
}

function createJsonResponse(data) {
  const jsonString = JSON.stringify(data);
  return ContentService.createTextOutput(jsonString).setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
// 8. ONE-CLICK INITIALIZER & AUDIT RUNNER
// ==========================================
function setupDatabase() {
  Logger.log('Starting College QR Complaint Box Database initialization...');
  const result = Database.setupDatabase();
  Logger.log('Result: ' + JSON.stringify(result));
  return result;
}

function runFullSecurityAndFunctionalAudit() {
  Logger.log('=== RUNNING BACKEND AUDIT SUITE ===');
  let passed = 0, failed = 0;
  function assert(name, cond) {
    if (cond) { Logger.log(' [PASS] ' + name); passed++; }
    else { Logger.log(' [FAIL] ' + name); failed++; }
  }

  const categories = ConfigService.getCategories();
  assert('Categories Sheet populated', categories.success && categories.data.length >= 15);

  const locations = ConfigService.getLocations();
  assert('Locations Sheet populated', locations.success && locations.data.length >= 15);

  const admins = AdminService.getAdmins();
  assert('Admins Sheet populated', admins.success && admins.data.length >= 1);

  const submitRes = ComplaintService.submitComplaint({
    is_anonymous: true,
    category: 'Electricity',
    title: 'Audit Test: Power issue in Lab 1',
    description: 'Testing automated insertion into Google Sheets.',
    location: 'Computer Lab 1 & 2',
    student_name: 'Should Be Stripped',
  });
  assert('submitComplaint returns success and CQB- ID', submitRes.success && submitRes.data.complaint_id.indexOf('CQB-') === 0);

  const newId = submitRes.data ? submitRes.data.complaint_id : '';
  const trackRes = ComplaintService.trackComplaint(newId);
  assert('trackComplaint is public-safe', trackRes.success && trackRes.data.complaint_id === newId && trackRes.data.admin_remarks === undefined);

  const validLogin = AdminService.login('chiefproctor@college.edu', 'proctor2026');
  assert('Valid admin login returns HMAC token', validLogin.success && validLogin.data.token.indexOf('CQB_AUTH_') === 0);

  const token = validLogin.data ? validLogin.data.token : '';
  assert('Token validation passes', Security.validateToken(token));
  assert('Invalid token rejected', !Security.validateToken('FAKE_TOKEN'));

  Logger.log('AUDIT RESULT: ' + passed + ' PASSED, ' + failed + ' FAILED');
  return { passed: passed, failed: failed };
}
