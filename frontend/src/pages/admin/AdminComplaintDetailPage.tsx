import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Admin, Complaint, UpdateComplaintDTO } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ComplaintDetailView } from '../../components/complaints/ComplaintDetailView';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';

export const AdminComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();

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
  }, [fetchData]);

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

  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingSpinner size="lg" label="Loading grievance details from database..." />
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
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/admin/complaints"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Back to Complaints</span>
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          disabled={isLoading || isUpdating}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          Refresh Record
        </Button>
      </div>

      {/* Main Detail View */}
      <ComplaintDetailView
        complaint={complaint}
        admins={admins}
        onUpdate={handleUpdate}
        isUpdating={isUpdating}
      />
    </div>
  );
};
