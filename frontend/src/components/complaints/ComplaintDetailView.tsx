import React, { useState } from 'react';
import {
  ShieldAlert,
  User,
  MapPin,
  Calendar,
  Clock,
  Save,
  FileText,
  Building,
  Phone,
  Hash,
  CheckCircle2,
} from 'lucide-react';
import { Admin, Complaint, ComplaintPriority, ComplaintStatus, UpdateComplaintDTO } from '../../types';
import { ComplaintStatusBadge } from './ComplaintStatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { formatDateTime } from '../../utils/dateFormatter';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export interface ComplaintDetailViewProps {
  complaint: Complaint;
  admins: Admin[];
  onUpdate: (dto: UpdateComplaintDTO) => Promise<boolean>;
  isUpdating: boolean;
}

export const ComplaintDetailView: React.FC<ComplaintDetailViewProps> = ({
  complaint,
  onUpdate,
  isUpdating,
}) => {
  const { admin } = useAuth();
  const { success, error } = useToast();

  const [status, setStatus] = useState<ComplaintStatus>(complaint.status);
  const [priority, setPriority] = useState<ComplaintPriority>(complaint.priority);
  const [resolutionNote, setResolutionNote] = useState<string>(
    complaint.resolution || complaint.admin_remarks || ''
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin) return;

    const dto: UpdateComplaintDTO = {
      complaint_id: complaint.complaint_id,
      status,
      priority,
      assigned_to: admin.name || 'Chief Proctor',
      admin_remarks: resolutionNote,
      resolution: resolutionNote,
      admin_id: admin.admin_id,
      admin_name: admin.name,
    };

    const isSuccess = await onUpdate(dto);
    if (isSuccess) {
      success('Complaint updated successfully.');
    } else {
      error('Failed to update complaint. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
              {complaint.complaint_id}
            </span>
            <PriorityBadge priority={complaint.priority} />
            <ComplaintStatusBadge status={complaint.status} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            {complaint.title}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Submitted: {formatDateTime(complaint.submitted_at)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Updated: {formatDateTime(complaint.updated_at)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Complaint Information (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Issue Statement */}
          <Card>
            <CardHeader
              title={
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-600" />
                  <span>Student Complaint Details</span>
                </div>
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 font-medium block mb-0.5">Category</span>
                <span className="font-bold text-slate-800 text-sm">{complaint.category}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block mb-0.5">Location</span>
                <div className="flex items-center gap-1 font-bold text-slate-800 text-sm">
                  <MapPin className="w-4 h-4 text-brand-600" />
                  <span>{complaint.location}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
              {complaint.description}
            </div>
          </Card>

          {/* Student Info Card */}
          <Card>
            <CardHeader
              title={
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-slate-700" />
                  <span>Student Details</span>
                </div>
              }
            />

            {complaint.is_anonymous ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Anonymous Complaint</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Student submitted anonymously. No roll number or personal details recorded.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Student Name</span>
                  <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {complaint.student_name || '—'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Roll No / ID</span>
                  <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    {complaint.student_id || '—'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Department</span>
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {complaint.department || '—'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Contact</span>
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {complaint.contact || complaint.semester || '—'}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right: Simplified Proctor Action Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-brand-200 shadow-card">
            <CardHeader
              title={
                <div className="flex items-center gap-2 text-brand-900">
                  <CheckCircle2 className="w-5 h-5 text-brand-600" />
                  <span>Proctor Action & Resolution</span>
                </div>
              }
              subtitle="Update status and write action taken."
            />

            <form onSubmit={handleSave} className="space-y-4">
              {/* Status */}
              <div>
                <Select
                  label="Complaint Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
                  options={[
                    { value: 'New', label: 'New' },
                    { value: 'In Progress', label: 'In Progress (Action Underway)' },
                    { value: 'Resolved', label: 'Resolved (Fixed)' },
                    { value: 'Rejected', label: 'Rejected (Invalid / Duplicate)' },
                  ]}
                />
              </div>

              {/* Priority */}
              <div>
                <Select
                  label="Priority Level"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                  options={[
                    { value: 'Low', label: 'Low' },
                    { value: 'Medium', label: 'Normal / Medium' },
                    { value: 'High', label: 'High Priority' },
                    { value: 'Critical', label: 'Critical / Urgent' },
                  ]}
                />
              </div>

              {/* Single Simple Action / Resolution Note */}
              <div>
                <Textarea
                  label="Action Taken / Resolution Note"
                  placeholder="e.g. Called electrician to replace capacitor / Spoke with Head of Dept and rescheduled the session..."
                  helperText="Visible to student on tracking page so they know what action was taken."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="min-h-[110px]"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full font-bold py-3 shadow-md"
                isLoading={isUpdating}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
