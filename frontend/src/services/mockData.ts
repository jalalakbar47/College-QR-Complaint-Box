import { INITIAL_CATEGORIES, INITIAL_LOCATIONS } from '../config/constants';
import { ActivityLog, Admin, Complaint } from '../types';

export const INITIAL_ADMINS: Admin[] = [
  {
    admin_id: 'ADM-001',
    name: 'Chief Proctor',
    email: 'chiefproctor@college.edu',
    role: 'Chief Proctor',
    status: 'Active',
    passkey: 'proctor2026',
    created_at: '2026-01-10T09:00:00.000Z',
    last_login: '2026-08-18T08:15:00.000Z',
  },
];

export const INITIAL_COMPLAINTS: Complaint[] = [];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [];

export { INITIAL_CATEGORIES, INITIAL_LOCATIONS };
