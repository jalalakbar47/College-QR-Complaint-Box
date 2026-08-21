/**
 * ==============================================================================
 * College QR Complaint Box - Complaint Management Service
 * ==============================================================================
 */

const ComplaintService = {
  /**
   * Generates unique standardized reference ID in format: CQB-YYYYMMDD-XXXX
   * Example: CQB-20260818-A7F2
   */
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

  /**
   * Submit a new student grievance
   */
  submitComplaint: function (payload) {
    // 1. Validation
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
      priority: 'Medium', // Default priority
      status: 'New',      // Default status
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

  /**
   * Public tracking lookup (Sanitized - strips private and internal info)
   */
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

  /**
   * Get all complaints with filtering (Admin only)
   * Supports filtering by status, priority, category, location, department, and keyword search
   */
  getComplaints: function (filters) {
    filters = filters || {};
    let list = Database.readAll(Database.SHEETS.COMPLAINTS);

    // Apply filters
    if (filters.status && filters.status !== 'All') {
      list = list.filter(function (c) {
        return c.status === filters.status;
      });
    }

    if (filters.priority && filters.priority !== 'All') {
      list = list.filter(function (c) {
        return c.priority === filters.priority;
      });
    }

    if (filters.category && filters.category !== 'All') {
      list = list.filter(function (c) {
        return c.category === filters.category;
      });
    }

    if (filters.location && filters.location !== 'All') {
      list = list.filter(function (c) {
        return c.location === filters.location;
      });
    }

    if (filters.department && filters.department !== 'All') {
      list = list.filter(function (c) {
        return c.department === filters.department;
      });
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

    // Sort newest first
    list.sort(function (a, b) {
      return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
    });

    return {
      success: true,
      data: list,
    };
  },

  /**
   * Get single complaint by ID (Admin only)
   */
  getComplaint: function (complaintId) {
    if (!complaintId) return { success: false, message: 'ID required.', errorCode: 'INVALID_ID' };

    const cleanId = String(complaintId).trim().toUpperCase();
    const complaints = Database.readAll(Database.SHEETS.COMPLAINTS);
    const found = complaints.find(function (c) {
      return String(c.complaint_id).trim().toUpperCase() === cleanId;
    });

    if (!found) {
      return { success: false, message: 'Complaint record not found.', errorCode: 'NOT_FOUND' };
    }

    return {
      success: true,
      data: found,
    };
  },

  /**
   * Update complaint fields & write activity audit log (Admin only)
   */
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

    const updatedFields = {
      updated_at: nowIso,
    };

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

    // Write Activity Log
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

  /**
   * Delete complaint permanently (Admin only)
   */
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

    // Write Activity Log
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
