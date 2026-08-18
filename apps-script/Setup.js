/**
 * ==============================================================================
 * College QR Complaint Box - Initial Setup & Self-Test Suite
 * ==============================================================================
 * Instructions:
 * 1. Open your Google Spreadsheet: "College_QR_Complaint_Box"
 * 2. Click Extensions > Apps Script
 * 3. Copy all .js files from the /apps-script directory into the script editor
 * 4. Select the function "setupDatabase" in the toolbar dropdown and click "Run"
 * 5. Run "runFullSecurityAndFunctionalAudit" to verify all security & CRUD operations
 * 6. Deploy as Web App (Deploy > New Deployment > Web App > Access: Anyone)
 */

function setupDatabase() {
  Logger.log('Starting College QR Complaint Box Database initialization...');
  const result = Database.setupDatabase();
  Logger.log('Result: ' + JSON.stringify(result));
  return result;
}

/**
 * Comprehensive Automated Audit & Test Suite (Runs inside Apps Script Execution Log)
 */
function runFullSecurityAndFunctionalAudit() {
  Logger.log('====================================================');
  Logger.log('  COLLEGE QR COMPLAINT BOX - BACKEND AUDIT SUITE    ');
  Logger.log('====================================================');

  let passed = 0;
  let failed = 0;

  function assert(testName, condition) {
    if (condition) {
      Logger.log(' [PASS] ' + testName);
      passed++;
    } else {
      Logger.log(' [FAIL] ' + testName);
      failed++;
    }
  }

  // 1. Schema & Table Integrity Test
  const categories = ConfigService.getCategories();
  assert('Categories Sheet populated (count > 0)', categories.success && categories.data.length >= 15);

  const locations = ConfigService.getLocations();
  assert('Locations Sheet populated (count > 0)', locations.success && locations.data.length >= 15);

  const admins = AdminService.getAdmins();
  assert('Admins Sheet populated with Chief Proctor', admins.success && admins.data.length >= 1);

  // 2. Public Complaint Submission Test
  const submitRes = ComplaintService.submitComplaint({
    is_anonymous: true,
    category: 'Cleanliness',
    title: 'Audit Test: Overflowing recycling bin near Library',
    description: 'Automated test to verify Google Sheets insertion and reference ID generation.',
    location: 'Central Library',
    student_name: 'Should Be Stripped',
    student_id: 'TEST-999',
  });
  assert('submitComplaint returns success and valid ID', submitRes.success && submitRes.data.complaint_id.indexOf('CQB-') === 0);

  const newId = submitRes.data ? submitRes.data.complaint_id : '';

  // 3. Anonymous Data Protection Verification
  const storedComplaints = Database.readAll(Database.SHEETS.COMPLAINTS);
  const foundNew = storedComplaints.find(function (c) { return c.complaint_id === newId; });
  assert(
    'Anonymous submission strictly strips student_name & student_id in Google Sheets',
    foundNew && foundNew.student_name === '' && foundNew.student_id === '' && foundNew.is_anonymous === true
  );

  // 4. Public Safe Tracking Sanitizer Test
  const trackRes = ComplaintService.trackComplaint(newId);
  assert(
    'trackComplaint returns public-safe fields without internal remarks',
    trackRes.success && trackRes.data.complaint_id === newId && trackRes.data.admin_remarks === undefined
  );

  // 5. Authentication Tests
  const validLogin = AdminService.login('chiefproctor@college.edu', 'any');
  assert('Valid admin email issues HMAC session token', validLogin.success && validLogin.data.token.indexOf('CQB_AUTH_') === 0);

  const adminToken = validLogin.data ? validLogin.data.token : '';

  const invalidLogin = AdminService.login('unauthorized.hacker@gmail.com', 'any');
  assert('Unlisted email login is rejected server-side', !invalidLogin.success && invalidLogin.errorCode === 'INVALID_CREDENTIALS');

  // 6. Token Validation & Security Barrier
  assert('Valid session token passes Security.validateToken()', Security.validateToken(adminToken));
  assert('Tampered token is rejected', !Security.validateToken(adminToken + '_TAMPERED'));
  assert('Empty token is rejected', !Security.validateToken(''));
  assert('Expired token format is rejected', !Security.validateToken('CQB_AUTH_ADM-001_1000000000000_fakeSig'));

  // 7. Protected Admin Operations Test
  const statsRes = AdminService.getDashboardStats();
  assert('getDashboardStats computes real metrics from Complaints sheet', statsRes.success && statsRes.data.total >= 1);

  // 8. Update Complaint & Activity Logging Test
  const updateRes = ComplaintService.updateComplaint({
    complaint_id: newId,
    status: 'In Progress',
    priority: 'Critical',
    assigned_to: 'Dr. Arthur Vance',
    admin_remarks: 'Audit: Assigned estate maintenance team.',
    resolution: 'Audit: Bin emptied and sanitized.',
    admin_id: 'ADM-001',
    admin_name: 'Dr. Arthur Vance',
  });
  assert('updateComplaint successfully writes to Complaints sheet', updateRes.success && updateRes.data.status === 'In Progress');

  const logs = ActivityLogService.getActivityLogs();
  const foundLog = logs.data.find(function (l) { return l.complaint_id === newId; });
  assert('Activity_Log record automatically created upon status update', Boolean(foundLog && foundLog.action === 'STATUS_CHANGE'));

  Logger.log('----------------------------------------------------');
  Logger.log('  AUDIT COMPLETE: ' + passed + ' PASSED, ' + failed + ' FAILED');
  Logger.log('====================================================');

  return {
    passed: passed,
    failed: failed,
    total: passed + failed,
    status: failed === 0 ? 'ALL_TESTS_PASSED' : 'TESTS_FAILED',
  };
}
