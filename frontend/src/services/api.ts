import { ENV } from '../config/env';
import {
  ActivityLog,
  Admin,
  ApiResponse,
  Category,
  Complaint,
  DashboardStats,
  LocationItem,
  SubmitComplaintDTO,
  TrackComplaintResponse,
  UpdateComplaintDTO,
} from '../types';
import { generateComplaintId } from '../utils/idGenerator';
import { storage } from '../utils/storage';
import { callGasApi } from './gasClient';
import {
  INITIAL_ACTIVITY_LOGS,
  INITIAL_ADMINS,
  INITIAL_CATEGORIES,
  INITIAL_COMPLAINTS,
  INITIAL_LOCATIONS,
} from './mockData';

// Storage keys for local development simulation mode only
const STORAGE_KEY_COMPLAINTS = 'complaints_db';
const STORAGE_KEY_LOGS = 'activity_logs_db';
const STORAGE_KEY_CATEGORIES = 'categories_db';
const STORAGE_KEY_LOCATIONS = 'locations_db';
const STORAGE_KEY_ADMINS = 'admins_db';

function getLocalComplaints(): Complaint[] {
  return storage.get<Complaint[]>(STORAGE_KEY_COMPLAINTS, INITIAL_COMPLAINTS);
}

function saveLocalComplaints(data: Complaint[]): void {
  storage.set(STORAGE_KEY_COMPLAINTS, data);
}

function getLocalActivityLogs(): ActivityLog[] {
  return storage.get<ActivityLog[]>(STORAGE_KEY_LOGS, INITIAL_ACTIVITY_LOGS);
}

function saveLocalActivityLogs(data: ActivityLog[]): void {
  storage.set(STORAGE_KEY_LOGS, data);
}

export const apiService = {
  /**
   * Submit a new complaint (Student)
   */
  async submitComplaint(dto: SubmitComplaintDTO): Promise<ApiResponse<{ complaint_id: string; complaint: Complaint }>> {
    if (ENV.IS_LIVE_API_CONFIGURED) {
      return callGasApi(ENV.API_URL, {
        method: 'POST',
        action: 'submitComplaint',
        data: dto,
      });
    }

    // Local Development / Mock Mode
    await new Promise((r) => setTimeout(r, 600));
    const complaintId = generateComplaintId();
    const nowIso = new Date().toISOString();

    const newComplaint: Complaint = {
      complaint_id: complaintId,
      submitted_at: nowIso,
      updated_at: nowIso,
      is_anonymous: dto.is_anonymous,
      student_name: dto.is_anonymous ? undefined : dto.student_name?.trim(),
      student_id: dto.is_anonymous ? undefined : dto.student_id?.trim(),
      department: dto.is_anonymous ? undefined : dto.department,
      semester: dto.is_anonymous ? undefined : dto.semester,
      contact: dto.is_anonymous ? undefined : dto.contact?.trim(),
      category: dto.category,
      title: dto.title.trim(),
      description: dto.description.trim(),
      location: dto.location,
      priority: 'Medium',
      status: 'New',
    };

    const currentList = getLocalComplaints();
    saveLocalComplaints([newComplaint, ...currentList]);

    return {
      success: true,
      message: 'Complaint submitted successfully.',
      data: {
        complaint_id: complaintId,
        complaint: newComplaint,
      },
    };
  },

  /**
   * Track an existing complaint (Public-safe student lookup)
   */
  async trackComplaint(complaintId: string): Promise<ApiResponse<TrackComplaintResponse>> {
    const cleanId = complaintId.trim().toUpperCase();

    if (ENV.IS_LIVE_API_CONFIGURED) {
      return callGasApi(ENV.API_URL, {
        method: 'GET',
        action: 'trackComplaint',
        data: { complaint_id: cleanId },
      });
    }

    await new Promise((r) => setTimeout(r, 450));
    const complaints = getLocalComplaints();
    const found = complaints.find((c) => c.complaint_id.toUpperCase() === cleanId);

    if (!found) {
      return {
        success: false,
        message: `No complaint found with Reference ID: "${cleanId}". Please check the ID and try again.`,
        errorCode: 'NOT_FOUND',
      };
    }

    const publicSafeData: TrackComplaintResponse = {
      complaint_id: found.complaint_id,
      submitted_at: found.submitted_at,
      updated_at: found.updated_at,
      category: found.category,
      title: found.title,
      description: found.description,
      location: found.location,
      status: found.status,
      resolution: found.resolution,
      resolved_at: found.resolved_at,
    };

    return {
      success: true,
      data: publicSafeData,
    };
  },

  /**
   * Admin Authentication
   */
  async adminLogin(email: string, passkey: string): Promise<ApiResponse<{ token: string; admin: Admin }>> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPasskey = passkey.trim();

    if (!cleanEmail || !cleanPasskey) {
      return {
        success: false,
        message: 'Email address and security passkey are required.',
        errorCode: 'INVALID_INPUT',
      };
    }

    if (ENV.IS_LIVE_API_CONFIGURED) {
      return callGasApi(ENV.API_URL, {
        method: 'POST',
        action: 'adminLogin',
        data: { email: cleanEmail, passkey: cleanPasskey },
      });
    }

    await new Promise((r) => setTimeout(r, 500));
    const admins = storage.get<Admin[]>(STORAGE_KEY_ADMINS, INITIAL_ADMINS);
    const admin = admins.find((a) => a.email.toLowerCase() === cleanEmail && a.status === 'Active');

    if (!admin) {
      return {
        success: false,
        message: 'Invalid email or unauthorized administrative account.',
        errorCode: 'INVALID_CREDENTIALS',
      };
    }

    const expectedPass = admin.passkey || 'proctor2026';
    if (cleanPasskey !== expectedPass) {
      return {
        success: false,
        message: 'Incorrect security passkey / password. Access denied.',
        errorCode: 'INVALID_PASSWORD',
      };
    }

    const token = `GAS_SESSION_${Date.now()}_${admin.admin_id}`;
    return {
      success: true,
      message: 'Authentication successful.',
      data: {
        token,
        admin,
      },
    };
  },

  /**
   * Fetch Dashboard Statistics
   */
  async getDashboardStats(token?: string): Promise<ApiResponse<DashboardStats>> {
    if (ENV.IS_LIVE_API_CONFIGURED) {
      return callGasApi(ENV.API_URL, {
        method: 'GET',
        action: 'getDashboardStats',
        token,
      });
    }

    await new Promise((r) => setTimeout(r, 400));
    const complaints = getLocalComplaints();

    const todayStr = new Date().toISOString().slice(0, 10);
    const stats: DashboardStats = {
      total: complaints.length,
      new: complaints.filter((c) => c.status === 'New').length,
      underReview: complaints.filter((c) => c.status === 'Under Review').length,
      assigned: complaints.filter((c) => c.status === 'Assigned').length,
      inProgress: complaints.filter((c) => c.status === 'In Progress').length,
      resolved: complaints.filter((c) => c.status === 'Resolved').length,
      rejected: complaints.filter((c) => c.status === 'Rejected').length,
      closed: complaints.filter((c) => c.status === 'Closed').length,
      critical: complaints.filter((c) => c.priority === 'Critical').length,
      highPriority: complaints.filter((c) => c.priority === 'High').length,
      todayCount: complaints.filter((c) => c.submitted_at.startsWith(todayStr)).length,
      recentComplaints: complaints.slice(0, 10),
    };

    return {
      success: true,
      data: stats,
    };
  },

  /**
   * Fetch Complaints List (Admin)
   */
  async getComplaints(filters?: {
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
    location?: string;
    department?: string;
    token?: string;
  }): Promise<ApiResponse<Complaint[]>> {
    if (ENV.IS_LIVE_API_CONFIGURED) {
      return callGasApi(ENV.API_URL, {
        method: 'GET',
        action: 'getComplaints',
        data: filters,
        token: filters?.token,
      });
    }

    await new Promise((r) => setTimeout(r, 400));
    let list = getLocalComplaints();

    if (filters?.status && filters.status !== 'All') {
      list = list.filter((c) => c.status === filters.status);
    }
    if (filters?.priority && filters.priority !== 'All') {
      list = list.filter((c) => c.priority === filters.priority);
    }
    if (filters?.category && filters.category !== 'All') {
      list = list.filter((c) => c.category === filters.category);
    }
    if (filters?.location && filters.location !== 'All') {
      list = list.filter((c) => c.location === filters.location);
    }
    if (filters?.department && filters.department !== 'All') {
      list = list.filter((c) => c.department === filters.department);
    }
    if (filters?.search && filters.search.trim() !== '') {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.complaint_id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.student_id && c.student_id.toLowerCase().includes(q)) ||
          (c.student_name && c.student_name.toLowerCase().includes(q)) ||
          (c.department && c.department.toLowerCase().includes(q))
      );
    }

    return {
      success: true,
      data: list,
    };
  },

  /**
   * Fetch Single Complaint Details (Admin)
   */
  async getComplaint(id: string, token?: string): Promise<ApiResponse<Complaint>> {
    const cleanId = id.trim().toUpperCase();

    if (ENV.IS_LIVE_API_CONFIGURED) {
      return callGasApi(ENV.API_URL, {
        method: 'GET',
        action: 'getComplaint',
        data: { complaint_id: cleanId },
        token,
      });
    }

    await new Promise((r) => setTimeout(r, 350));
    const complaints = getLocalComplaints();
    const found = complaints.find((c) => c.complaint_id.toUpperCase() === cleanId);

    if (!found) {
      return {
        success: false,
        message: 'Complaint record not found.',
        errorCode: 'NOT_FOUND',
      };
    }

    return {
      success: true,
      data: found,
    };
  },

  /**
   * Update Complaint (Admin Action)
   */
  async updateComplaint(dto: UpdateComplaintDTO, token?: string): Promise<ApiResponse<Complaint>> {
    if (ENV.IS_LIVE_API_CONFIGURED) {
      return callGasApi(ENV.API_URL, {
        method: 'POST',
        action: 'updateComplaint',
        data: dto,
        token,
      });
    }

    await new Promise((r) => setTimeout(r, 500));
    const list = getLocalComplaints();
    const index = list.findIndex((c) => c.complaint_id === dto.complaint_id);

    if (index === -1) {
      return {
        success: false,
        message: 'Complaint record not found for update.',
        errorCode: 'NOT_FOUND',
      };
    }

    const current = list[index];
    const nowIso = new Date().toISOString();
    const oldStatus = current.status;
    const oldPriority = current.priority;

    const updated: Complaint = {
      ...current,
      status: dto.status ?? current.status,
      priority: dto.priority ?? current.priority,
      assigned_to: dto.assigned_to !== undefined ? dto.assigned_to : current.assigned_to,
      admin_remarks: dto.admin_remarks !== undefined ? dto.admin_remarks : current.admin_remarks,
      resolution: dto.resolution !== undefined ? dto.resolution : current.resolution,
      resolved_at: dto.status === 'Resolved' && !current.resolved_at ? nowIso : current.resolved_at,
      updated_at: nowIso,
    };

    list[index] = updated;
    saveLocalComplaints(list);

    const logs = getLocalActivityLogs();
    const actionDesc =
      dto.status && dto.status !== oldStatus
        ? 'STATUS_CHANGE'
        : dto.priority && dto.priority !== oldPriority
        ? 'PRIORITY_CHANGE'
        : 'ADMIN_UPDATE';

    const newLog: ActivityLog = {
      log_id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: nowIso,
      admin_id: dto.admin_id,
      admin_name: dto.admin_name,
      complaint_id: dto.complaint_id,
      action: actionDesc,
      old_value: oldStatus !== updated.status ? oldStatus : oldPriority,
      new_value: oldStatus !== updated.status ? updated.status : updated.priority,
      remarks: dto.admin_remarks || dto.resolution || 'Admin updated complaint details.',
    };

    saveLocalActivityLogs([newLog, ...logs]);

    return {
      success: true,
      message: 'Complaint updated successfully.',
      data: updated,
    };
  },

  /**
   * Delete Complaint
   */
  async deleteComplaint(complaintId: string): Promise<ApiResponse<boolean>> {
    const list = getLocalComplaints();
    const filtered = list.filter((c) => c.complaint_id !== complaintId);
    saveLocalComplaints(filtered);
    return { success: true, message: 'Complaint deleted successfully.', data: true };
  },

  /**
   * Categories CRUD
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    if (ENV.IS_LIVE_API_CONFIGURED) {
      return callGasApi(ENV.API_URL, {
        method: 'GET',
        action: 'getCategories',
      });
    }

    const categories = storage.get<Category[]>(STORAGE_KEY_CATEGORIES, INITIAL_CATEGORIES);
    return { success: true, data: categories };
  },

  async saveCategory(category: Category, isNew = false, token?: string): Promise<ApiResponse<Category>> {
    if (ENV.IS_LIVE_API_CONFIGURED) {
      const sessionToken = token || storage.get<{ token: string } | null>('admin_session', null)?.token;
      return callGasApi(ENV.API_URL, {
        method: 'POST',
        action: 'saveCategory',
        data: category,
        token: sessionToken,
      });
    }

    const categories = storage.get<Category[]>(STORAGE_KEY_CATEGORIES, INITIAL_CATEGORIES);
    if (isNew) {
      const newCat: Category = {
        ...category,
        category_id: category.category_id || `CAT-${String(categories.length + 1).padStart(2, '0')}`,
      };
      const updated = [...categories, newCat];
      storage.set(STORAGE_KEY_CATEGORIES, updated);
      return { success: true, message: 'Category created successfully.', data: newCat };
    } else {
      const index = categories.findIndex((c) => c.category_id === category.category_id);
      if (index !== -1) {
        categories[index] = category;
        storage.set(STORAGE_KEY_CATEGORIES, categories);
      }
      return { success: true, message: 'Category updated successfully.', data: category };
    }
  },

  async deleteCategory(categoryId: string, token?: string): Promise<ApiResponse<boolean>> {
    if (ENV.IS_LIVE_API_CONFIGURED) {
      const sessionToken = token || storage.get<{ token: string } | null>('admin_session', null)?.token;
      return callGasApi(ENV.API_URL, {
        method: 'POST',
        action: 'deleteCategory',
        data: { category_id: categoryId },
        token: sessionToken,
      });
    }

    const categories = storage.get<Category[]>(STORAGE_KEY_CATEGORIES, INITIAL_CATEGORIES);
    const filtered = categories.filter((c) => c.category_id !== categoryId);
    storage.set(STORAGE_KEY_CATEGORIES, filtered);
    return { success: true, message: 'Category removed successfully.', data: true };
  },

  /**
   * Locations CRUD
   */
  async getLocations(): Promise<ApiResponse<LocationItem[]>> {
    if (ENV.IS_LIVE_API_CONFIGURED) {
      return callGasApi(ENV.API_URL, {
        method: 'GET',
        action: 'getLocations',
      });
    }

    const locations = storage.get<LocationItem[]>(STORAGE_KEY_LOCATIONS, INITIAL_LOCATIONS);
    return { success: true, data: locations };
  },

  async saveLocation(location: LocationItem, isNew = false, token?: string): Promise<ApiResponse<LocationItem>> {
    if (ENV.IS_LIVE_API_CONFIGURED) {
      const sessionToken = token || storage.get<{ token: string } | null>('admin_session', null)?.token;
      return callGasApi(ENV.API_URL, {
        method: 'POST',
        action: 'saveLocation',
        data: location,
        token: sessionToken,
      });
    }

    const locations = storage.get<LocationItem[]>(STORAGE_KEY_LOCATIONS, INITIAL_LOCATIONS);
    if (isNew) {
      const newLoc: LocationItem = {
        ...location,
        location_id: location.location_id || `LOC-${String(locations.length + 1).padStart(2, '0')}`,
      };
      const updated = [...locations, newLoc];
      storage.set(STORAGE_KEY_LOCATIONS, updated);
      return { success: true, message: 'Location created successfully.', data: newLoc };
    } else {
      const index = locations.findIndex((l) => l.location_id === location.location_id);
      if (index !== -1) {
        locations[index] = location;
        storage.set(STORAGE_KEY_LOCATIONS, locations);
      }
      return { success: true, message: 'Location updated successfully.', data: location };
    }
  },

  async deleteLocation(locationId: string, token?: string): Promise<ApiResponse<boolean>> {
    if (ENV.IS_LIVE_API_CONFIGURED) {
      const sessionToken = token || storage.get<{ token: string } | null>('admin_session', null)?.token;
      return callGasApi(ENV.API_URL, {
        method: 'POST',
        action: 'deleteLocation',
        data: { location_id: locationId },
        token: sessionToken,
      });
    }

    const locations = storage.get<LocationItem[]>(STORAGE_KEY_LOCATIONS, INITIAL_LOCATIONS);
    const filtered = locations.filter((l) => l.location_id !== locationId);
    storage.set(STORAGE_KEY_LOCATIONS, filtered);
    return { success: true, message: 'Location removed successfully.', data: true };
  },

  /**
   * Change Administrator Password / Passkey
   */
  async changePassword(
    adminId: string,
    currentPassword: string,
    newPassword: string,
    token?: string
  ): Promise<ApiResponse<boolean>> {
    if (ENV.IS_LIVE_API_CONFIGURED) {
      const sessionToken = token || storage.get<{ token: string } | null>('admin_session', null)?.token;
      return callGasApi(ENV.API_URL, {
        method: 'POST',
        action: 'changePassword',
        data: {
          admin_id: adminId,
          current_password: currentPassword,
          new_password: newPassword,
        },
        token: sessionToken,
      });
    }

    await new Promise((r) => setTimeout(r, 400));
    const admins = storage.get<Admin[]>(STORAGE_KEY_ADMINS, INITIAL_ADMINS);
    const index = admins.findIndex((a) => a.admin_id === adminId);

    if (index === -1) {
      return { success: false, message: 'Admin account not found.', errorCode: 'NOT_FOUND' };
    }

    const admin = admins[index];
    const expected = admin.passkey || 'proctor2026';
    if (currentPassword.trim() !== expected) {
      return { success: false, message: 'Current password is incorrect. Please try again.', errorCode: 'INVALID_PASSWORD' };
    }

    if (newPassword.trim().length < 6) {
      return { success: false, message: 'New password must be at least 6 characters.', errorCode: 'WEAK_PASSWORD' };
    }

    admins[index] = { ...admin, passkey: newPassword.trim() };
    storage.set(STORAGE_KEY_ADMINS, admins);

    const logs = getLocalActivityLogs();
    const newLog: ActivityLog = {
      log_id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      admin_id: adminId,
      admin_name: admin.name,
      complaint_id: '',
      action: 'PASSWORD_CHANGE',
      old_value: '***',
      new_value: '***',
      remarks: 'Proctor updated account password.',
    };
    saveLocalActivityLogs([newLog, ...logs]);

    return { success: true, message: 'Password changed successfully and saved.', data: true };
  },

  /**
   * Administrators
   */
  async getAdmins(token?: string): Promise<ApiResponse<Admin[]>> {
    if (ENV.IS_LIVE_API_CONFIGURED) {
      return callGasApi(ENV.API_URL, {
        method: 'GET',
        action: 'getAdmins',
        token,
      });
    }

    const admins = storage.get<Admin[]>(STORAGE_KEY_ADMINS, INITIAL_ADMINS);
    return { success: true, data: admins };
  },

  /**
   * Activity Logs (Admin Audit Trail)
   */
  async getActivityLogs(token?: string): Promise<ApiResponse<ActivityLog[]>> {
    if (ENV.IS_LIVE_API_CONFIGURED) {
      return callGasApi(ENV.API_URL, {
        method: 'GET',
        action: 'getActivityLogs',
        token,
      });
    }

    const logs = getLocalActivityLogs();
    return { success: true, data: logs };
  },

  /**
   * Reset local test database to initial seed data (Local dev only)
   */
  resetLocalDatabase(): void {
    saveLocalComplaints(INITIAL_COMPLAINTS);
    saveLocalActivityLogs(INITIAL_ACTIVITY_LOGS);
    storage.set(STORAGE_KEY_CATEGORIES, INITIAL_CATEGORIES);
    storage.set(STORAGE_KEY_LOCATIONS, INITIAL_LOCATIONS);
    storage.set(STORAGE_KEY_ADMINS, INITIAL_ADMINS);
  },
};
