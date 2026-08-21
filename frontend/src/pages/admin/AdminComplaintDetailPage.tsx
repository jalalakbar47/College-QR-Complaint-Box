import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Admin, Complaint, UpdateComplaintDTO } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useRefresh } from '../../contexts/RefreshContext';
import { ComplaintDetailView } from '../../components/complaints/ComplaintDetailView';
import { ComplaintDetailSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';

export const AdminComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const { registerRefreshHandler, refreshKey } = useRefresh();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const [compRes, adminRes] = await Promise.all([
        apiService.getComplaint(id, token || undefined),
        apiService.getAdmins(token || undefined),
      ]);

      if (compRes.success && compRes.data) {
        setComplaint(compRes.data);
      } else {
        setError(compRes.message || 'Complaint record not found.');
      }

      if (adminRes.success && adminRes.data) {
        setAdmins(adminRes.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch complaint details.');
    } finally {
      setIsLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  useEffect(() => {
    const unregister = registerRefreshHandler(`complaint_detail_${id}`, fetchData);
    return unregister;
  }, [registerRefreshHandler, fetchData, id]);

  const handleUpdate = async (dto: UpdateComplaintDTO): Promise<boolean> => {
    setIsUpdating(true);
    try {
      const res = await apiService.updateComplaint(dto, token || undefined);
      if (res.success && res.data) {
        setComplaint(res.data);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading && !complaint) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between gap-4">
          <Link to="/admin/complaints" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Complaints</span>
          </Link>
        </div>
        <ComplaintDetailSkeleton />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="py-8 space-y-4">
        <Link to="/admin/complaints" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complaints</span>
        </Link>
        <ErrorState
          title="Complaint Record Not Found"
          message={error || `Could not locate record with ID: "${id}"`}
          onRetry={fetchData}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/admin/complaints"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-brand-600" />
          <span>Back to Complaints</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline font-medium">Real-time sync active</span>
        </div>
      </div>

      {/* Main Redesigned Detail View */}
      <ComplaintDetailView
        complaint={complaint}
        admins={admins}
        onUpdate={handleUpdate}
        isUpdating={isUpdating}
      />
    </div>
  );
};
