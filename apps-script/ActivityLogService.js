/**
 * ==============================================================================
 * College QR Complaint Box - Activity & Audit Log Service
 * ==============================================================================
 */

const ActivityLogService = {
  /**
   * Records an audit log entry in the Activity_Log sheet
   */
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

  /**
   * Retrieve all activity logs, newest first
   */
  getActivityLogs: function () {
    const logs = Database.readAll(Database.SHEETS.ACTIVITY_LOG);
    logs.sort(function (a, b) {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return {
      success: true,
      data: logs,
    };
  },
};
