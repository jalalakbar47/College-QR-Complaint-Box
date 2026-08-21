import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Admin, Complaint, UpdateComplaintDTO } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ComplaintDetailView } from '../../components/complaints/ComplaintDetailView';
import { ComplaintDetailSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';

export const AdminComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, admin } = useAuth();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isInitial: boolean = false) => {
    if (!id) return;
    if (isInitial) {
      setIsLoading(true);
    }
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
    fetchData(true);
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

  const handleDelete = async (complaintId: string): Promise<boolean> => {
    try {
      const res = await apiService.deleteComplaint(
        complaintId,
        token || undefined,
        admin?.admin_id,
        'Permanently deleted by Chief Proctor from Detail Page'
      );
      if (res.success) {
        navigate('/admin/complaints', { replace: true });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  if (isLoading && !complaint) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between gap-4">
          <Link to="/admin/complaints">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Complaints
            </Button>
          </Link>
        </div>
        <ComplaintDetailSkeleton />
      </div>
    );
  }

  if (error && !complaint) {
    return (
      <div className="py-8 space-y-4">
        <Link to="/admin/complaints">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Complaints
          </Button>
        </Link>
        <ErrorState
          title="Complaint Record Not Found"
          message={error || `Could not locate record with ID: "${id}"`}
          onRetry={() => fetchData(true)}
        />
      </div>
    );
  }

  if (!complaint) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Navigation Breadcrumb Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link to="/admin/complaints">
          <Button
            variant="ghost"
            size="sm"
            className="text-ink-muted hover:text-ink-navy"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Complaints
          </Button>
        </Link>

        <div className="flex items-center gap-2 font-mono text-xs text-ink-muted">
          <span className="w-2 h-2 rounded-full bg-ledger-green" />
          <span className="hidden sm:inline font-medium">Synced</span>
        </div>
      </div>

      {/* Main Redesigned Detail View */}
      <ComplaintDetailView
        complaint={complaint}
        admins={admins}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isUpdating={isUpdating}
      />
    </div>
  );
};
