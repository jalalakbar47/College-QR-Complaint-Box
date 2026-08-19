/**
 * ==============================================================================
 * College QR Complaint Box - Google Apps Script Backend (API Layer)
 * ==============================================================================
 * Serves as the REST/JSON API endpoint for the React frontend.
 * Interacts directly with Google Sheets as the database.
 * 
 * Strict separation between PUBLIC and PROTECTED ADMIN endpoints.
 */

/**
 * Handle GET Requests
 */
function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = params.action || 'ping';

    let result = { success: false, message: 'Invalid action requested.' };

    // ==========================================
    // 1. PUBLIC ENDPOINTS (No token required)
    // ==========================================
    switch (action) {
      case 'ping':
        return createJsonResponse({
          success: true,
          message: 'College QR Complaint Box Apps Script API is operational.',
          version: '1.0.0',
          timestamp: new Date().toISOString(),
        });

      case 'trackComplaint':
        // Returns strictly sanitized public-safe fields
        return createJsonResponse(ComplaintService.trackComplaint(params.complaint_id));

      case 'getCategories':
        return createJsonResponse(ConfigService.getCategories());

      case 'getLocations':
        return createJsonResponse(ConfigService.getLocations());

      // ==========================================
      // 2. PROTECTED ADMIN ENDPOINTS (Token required)
      // ==========================================
      case 'getDashboardStats':
        if (!Security.validateToken(params.token)) {
          return createJsonResponse({
            success: false,
            message: 'Unauthorized: Valid administrator session token required.',
            errorCode: 'UNAUTHORIZED',
          });
        }
        return createJsonResponse(AdminService.getDashboardStats());

      case 'getComplaints':
        if (!Security.validateToken(params.token)) {
          return createJsonResponse({
            success: false,
            message: 'Unauthorized: Valid administrator session token required.',
            errorCode: 'UNAUTHORIZED',
          });
        }
        return createJsonResponse(ComplaintService.getComplaints(params));

      case 'getComplaint':
        if (!Security.validateToken(params.token)) {
          return createJsonResponse({
            success: false,
            message: 'Unauthorized: Valid administrator session token required.',
            errorCode: 'UNAUTHORIZED',
          });
        }
        return createJsonResponse(ComplaintService.getComplaint(params.complaint_id));

      case 'getAdmins':
        if (!Security.validateToken(params.token)) {
          return createJsonResponse({
            success: false,
            message: 'Unauthorized: Valid administrator session token required.',
            errorCode: 'UNAUTHORIZED',
          });
        }
        return createJsonResponse(AdminService.getAdmins());

      case 'getActivityLogs':
        if (!Security.validateToken(params.token)) {
          return createJsonResponse({
            success: false,
            message: 'Unauthorized: Valid administrator session token required.',
            errorCode: 'UNAUTHORIZED',
          });
        }
        return createJsonResponse(ActivityLogService.getActivityLogs());

      default:
        return createJsonResponse({
          success: false,
          message: 'Unknown GET action: ' + action,
          errorCode: 'UNKNOWN_ACTION',
        });
    }
  } catch (error) {
    return createJsonResponse({
      success: false,
      message: 'Server error processing GET request: ' + error.toString(),
      errorCode: 'SERVER_ERROR',
    });
  }
}

/**
 * Handle POST Requests
 */
function doPost(e) {
  try {
    let body = {};
    if (e && e.postData && e.postData.contents) {
      try {
        body = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        body = e.parameter || {};
      }
    } else {
      body = e.parameter || {};
    }

    const action = body.action || '';
    const payload = body.data || body;
    const token = body.token || payload.token;

    // ==========================================
    // 1. PUBLIC POST ENDPOINTS
    // ==========================================
    if (action === 'submitComplaint') {
      return createJsonResponse(ComplaintService.submitComplaint(payload));
    }

    if (action === 'adminLogin') {
      return createJsonResponse(AdminService.login(payload.email, payload.passkey || payload.password));
    }

    // ==========================================
    // 2. PROTECTED ADMIN POST ENDPOINTS
    // ==========================================
    if (action === 'updateComplaint') {
      if (!Security.validateToken(token)) {
        return createJsonResponse({
          success: false,
          message: 'Unauthorized: Valid administrator session token required.',
          errorCode: 'UNAUTHORIZED',
        });
      }
      return createJsonResponse(ComplaintService.updateComplaint(payload));
    }

    if (action === 'saveCategory') {
      if (!Security.validateToken(token)) {
        return createJsonResponse({
          success: false,
          message: 'Unauthorized: Valid administrator session token required.',
          errorCode: 'UNAUTHORIZED',
        });
      }
      return createJsonResponse(ConfigService.saveCategory(payload));
    }

    if (action === 'deleteCategory') {
      if (!Security.validateToken(token)) {
        return createJsonResponse({
          success: false,
          message: 'Unauthorized: Valid administrator session token required.',
          errorCode: 'UNAUTHORIZED',
        });
      }
      return createJsonResponse(ConfigService.deleteCategory(payload.category_id || payload));
    }

    if (action === 'saveLocation') {
      if (!Security.validateToken(token)) {
        return createJsonResponse({
          success: false,
          message: 'Unauthorized: Valid administrator session token required.',
          errorCode: 'UNAUTHORIZED',
        });
      }
      return createJsonResponse(ConfigService.saveLocation(payload));
    }

    if (action === 'deleteLocation') {
      if (!Security.validateToken(token)) {
        return createJsonResponse({
          success: false,
          message: 'Unauthorized: Valid administrator session token required.',
          errorCode: 'UNAUTHORIZED',
        });
      }
      return createJsonResponse(ConfigService.deleteLocation(payload.location_id || payload));
    }

    if (action === 'changePassword') {
      if (!Security.validateToken(token)) {
        return createJsonResponse({
          success: false,
          message: 'Unauthorized: Valid administrator session token required.',
          errorCode: 'UNAUTHORIZED',
        });
      }
      return createJsonResponse(AdminService.changePassword(payload.admin_id, payload.current_password, payload.new_password));
    }

    return createJsonResponse({
      success: false,
      message: 'Unknown POST action: ' + action,
      errorCode: 'UNKNOWN_ACTION',
    });
  } catch (error) {
    return createJsonResponse({
      success: false,
      message: 'Server error processing POST request: ' + error.toString(),
      errorCode: 'SERVER_ERROR',
    });
  }
}

/**
 * Creates a CORS-compliant JSON Output for browser callers
 */
function createJsonResponse(data) {
  const jsonString = JSON.stringify(data);
  return ContentService.createTextOutput(jsonString).setMimeType(ContentService.MimeType.JSON);
}
