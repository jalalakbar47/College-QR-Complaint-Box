export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || '',
  COLLEGE_NAME: import.meta.env.VITE_COLLEGE_NAME || 'Apex Institute of Engineering & Technology',
  COLLEGE_SHORT_NAME: import.meta.env.VITE_COLLEGE_SHORT_NAME || 'AIET',
  PORTAL_TITLE: import.meta.env.VITE_PORTAL_TITLE || 'College QR Complaint Box',
  CAMPUS_PORTAL_URL: import.meta.env.VITE_CAMPUS_PORTAL_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
  IS_LIVE_API_CONFIGURED: Boolean(import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== ''),
};
