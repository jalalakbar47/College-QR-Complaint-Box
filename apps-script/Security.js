/**
 * ==============================================================================
 * College QR Complaint Box - Security, Token Validation & Sanitization
 * ==============================================================================
 */

const Security = {
  VALID_STATUSES: [
    'New',
    'Under Review',
    'Assigned',
    'In Progress',
    'Resolved',
    'Rejected',
    'Closed',
  ],

  VALID_PRIORITIES: ['Low', 'Medium', 'High', 'Critical'],

  /**
   * Sanitizes string input to prevent XSS / malicious injection
   */
  sanitizeString: function (str) {
    if (!str) return '';
    return String(str)
      .replace(/<[^>]*>/g, '') // Strip HTML tags
      .trim();
  },

  /**
   * Generates a secure HMAC session token for an authorized administrator
   */
  generateToken: function (adminId) {
    const timestamp = Date.now();
    const raw = adminId + '_' + timestamp;
    const signature = Utilities.base64Encode(
      Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw + '_CQB_PROCTOR_SECRET_SALT_2026')
    ).substring(0, 20);
    return 'CQB_AUTH_' + adminId + '_' + timestamp + '_' + signature;
  },

  /**
   * Strictly validates a session token on the server:
   * 1. Validates token format
   * 2. Checks cryptographic SHA-256 signature
   * 3. Verifies 12-hour expiration timestamp
   * 4. Confirms that the adminId exists and has 'Active' status in the Admins sheet
   */
  validateToken: function (token) {
    if (!token || typeof token !== 'string') return false;
    if (!token.startsWith('CQB_AUTH_')) return false;

    const parts = token.split('_');
    if (parts.length < 5) return false;

    const adminId = parts[2];
    const timestamp = parseInt(parts[3], 10);
    const providedSig = parts[4];

    // Check expiry (12 hours = 43,200,000 ms)
    if (isNaN(timestamp) || Date.now() - timestamp > 43200000 || timestamp > Date.now() + 60000) {
      return false;
    }

    // Verify cryptographic signature
    const expectedSig = Utilities.base64Encode(
      Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, adminId + '_' + timestamp + '_CQB_PROCTOR_SECRET_SALT_2026')
    ).substring(0, 20);

    if (providedSig !== expectedSig) {
      return false;
    }

    // Verify admin account exists and is Active in Admins sheet
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

  /**
   * Strips all internal and student identity fields from complaint before returning to student
   */
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
