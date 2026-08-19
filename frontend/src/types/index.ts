// ==============================================================================
// College QR Complaint Box - Type Definitions
// ==============================================================================

export type ComplaintStatus =
  | 'New'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected'
  | 'Closed';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type AdminRole = 'Chief Proctor' | 'Admin';
export type AdminStatus = 'Active' | 'Inactive';

export interface Complaint {
  complaint_id: string;        // e.g. "CQB-20260818-A7F2"
  submitted_at: string;        // ISO 8601 string or formatted date
  updated_at: string;
  is_anonymous: boolean;
  student_name?: string;
  student_id?: string;
  department?: string;
  semester?: string;
  contact?: string;
  category: string;
  title: string;
  description: string;
  location: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  admin_remarks?: string;
  resolution?: string;
  resolved_at?: string;
  assigned_to?: string;
}

export interface Admin {
  admin_id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  passkey?: string;
  created_at: string;
  last_login?: string;
}

export interface Category {
  category_id: string;
  category_name: string;
  description?: string;
  status: 'Active' | 'Inactive';
}

export interface LocationItem {
  location_id: string;
  location_name: string;
  status: 'Active' | 'Inactive';
}

export interface ActivityLog {
  log_id: string;
  timestamp: string;
  admin_id: string;
  admin_name?: string;
  complaint_id: string;
  action: string;
  old_value?: string;
  new_value?: string;
  remarks?: string;
}

export interface DashboardStats {
  total: number;
  new: number;
  underReview: number;
  assigned: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  closed: number;
  critical: number;
  highPriority: number;
  todayCount: number;
  recentComplaints: Complaint[];
}

export interface SubmitComplaintDTO {
  is_anonymous: boolean;
  student_name?: string;
  student_id?: string;
  department?: string;
  semester?: string;
  contact?: string;
  category: string;
  title: string;
  description: string;
  location: string;
}

export interface UpdateComplaintDTO {
  complaint_id: string;
  status?: ComplaintStatus;
  priority?: ComplaintPriority;
  assigned_to?: string;
  admin_remarks?: string;
  resolution?: string;
  admin_id: string;
  admin_name: string;
}

export interface TrackComplaintResponse {
  complaint_id: string;
  submitted_at: string;
  updated_at: string;
  category: string;
  title: string;
  description: string;
  location: string;
  status: ComplaintStatus;
  resolution?: string;
  resolved_at?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errorCode?: string;
}

export interface AuthSession {
  token: string;
  admin: Admin;
  expiresAt: number;
}
