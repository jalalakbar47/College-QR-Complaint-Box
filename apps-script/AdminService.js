/**
 * ==============================================================================
 * College QR Complaint Box - Admin Service & Dashboard Stats
 * ==============================================================================
 */

const AdminService = {
  /**
   * Admin Authentication against Admins sheet
   */
  login: function (email, passkey) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPasskey = String(passkey || '').trim();

    if (!cleanEmail || !cleanPasskey) {
      return { success: false, message: 'Email address and security passkey are required.', errorCode: 'INVALID_INPUT' };
    }

    const admins = Database.readAll(Database.SHEETS.ADMINS);

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

    // Update last_login timestamp
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

  /**
   * Calculate real-time dashboard KPI metrics from Complaints sheet
   */
  getDashboardStats: function () {
    const complaints = Database.readAll(Database.SHEETS.COMPLAINTS);
    const todayStr = new Date().toISOString().slice(0, 10);

    let newCount = 0;
    let underReviewCount = 0;
    let assignedCount = 0;
    let inProgressCount = 0;
    let resolvedCount = 0;
    let rejectedCount = 0;
    let closedCount = 0;
    let criticalCount = 0;
    let highCount = 0;
    let todayCount = 0;

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

    // Recent 10 complaints sorted newest first
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

  /**
   * Get list of active administrators
   */
  getAdmins: function () {
    const admins = Database.readAll(Database.SHEETS.ADMINS);
    return {
      success: true,
      data: admins,
    };
  },
};
