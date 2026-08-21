import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  User,
  MapPin,
  Calendar,
  Clock,
  Save,
  Building,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Printer,
  Sparkles,
  ArrowRight,
  UserCheck,
  Tag,
  GraduationCap,
  MessageSquareQuote,
  Flame,
  Zap,
  Trash2,
} from 'lucide-react';
import { Admin, Complaint, ComplaintPriority, ComplaintStatus, UpdateComplaintDTO } from '../../types';
import { ComplaintStatusBadge } from './ComplaintStatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { formatDateTime } from '../../utils/dateFormatter';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { apiService } from '../../services/api';

export interface ComplaintDetailViewProps {
  complaint: Complaint;
  admins?: Admin[];
  onUpdate: (dto: UpdateComplaintDTO) => Promise<boolean>;
  isUpdating: boolean;
}

const RESOLUTION_TEMPLATES = [
  'Inspected on-site; corrective maintenance completed successfully.',
  'Work order issued to infrastructure department; repairs underway.',
  'Referred to Department Head and Academic Committee for review.',
  'Laboratory equipment serviced, tested, and restored to active use.',
  'Administrative inquiry completed and appropriate measures taken.',
  'Spoke directly with student and resolved complaint to satisfaction.',
];

const STATUS_STEPS: { status: ComplaintStatus; label: string; desc: string }[] = [
  { status: 'New', label: 'Logged', desc: 'Ticket registered' },
  { status: 'In Progress', label: 'In Progress', desc: 'Action underway' },
  { status: 'Resolved', label: 'Resolved', desc: 'Solution deployed' },
];

export const ComplaintDetailView: React.FC<ComplaintDetailViewProps> = ({
  complaint,
  onUpdate,
  isUpdating,
}) => {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [status, setStatus] = useState<ComplaintStatus>(complaint.status);
  const [priority, setPriority] = useState<ComplaintPriority>(complaint.priority);
  const [resolutionNote, setResolutionNote] = useState<string>(
    complaint.resolution || complaint.admin_remarks || ''
  );
  const [copiedId, setCopiedId] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync state if complaint prop updates from background
  useEffect(() => {
    setStatus(complaint.status);
    setPriority(complaint.priority);
    setResolutionNote(complaint.resolution || complaint.admin_remarks || '');
  }, [complaint]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(complaint.complaint_id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDeleteComplaint = async () => {
    setIsDeleting(true);
    try {
      const res = await apiService.deleteComplaint(
        complaint.complaint_id,
        undefined,
        admin?.admin_id,
        'Permanently deleted by Chief Proctor from Detail View'
      );
      if (res.success) {
        success(`Complaint ${complaint.complaint_id} has been permanently deleted.`);
        setShowDeleteModal(false);
        navigate('/admin/complaints');
      } else {
        error(res.message || 'Failed to delete complaint.');
      }
    } catch {
      error('An error occurred while deleting the complaint.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApplyTemplate = (templateText: string) => {
    if (resolutionNote.trim() && !resolutionNote.includes(templateText)) {
      setResolutionNote((prev) => `${prev.trim()}\n${templateText}`);
    } else {
      setResolutionNote(templateText);
    }
  };

  const handleSave = async (e?: React.FormEvent, overrideStatus?: ComplaintStatus) => {
    if (e) e.preventDefault();
    if (!admin) return;

    const targetStatus = overrideStatus || status;

    const dto: UpdateComplaintDTO = {
      complaint_id: complaint.complaint_id,
      status: targetStatus,
      priority,
      assigned_to: admin.name || 'Chief Proctor',
      admin_remarks: resolutionNote.trim(),
      resolution: resolutionNote.trim(),
      admin_id: admin.admin_id,
      admin_name: admin.name,
    };

    if (overrideStatus) {
      setStatus(overrideStatus);
    }

    const isSuccess = await onUpdate(dto);
    if (isSuccess) {
      success(`Complaint ${complaint.complaint_id} updated successfully.`);
    } else {
      error('Failed to update complaint. Please try again.');
    }
  };

  const handleQuickResolve = () => {
    if (!resolutionNote.trim()) {
      setResolutionNote('Complaint verified on-site and marked resolved by Chief Proctor.');
    }
    handleSave(undefined, 'Resolved');
  };

  // Determine current lifecycle step index
  const getStepIndex = (currentStatus: ComplaintStatus) => {
    switch (currentStatus) {
      case 'New':
        return 0;
      case 'Under Review':
      case 'Assigned':
      case 'In Progress':
        return 1;
      case 'Resolved':
      case 'Closed':
        return 2;
      case 'Rejected':
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(complaint.status);

  return (
    <div className="space-y-6">
      {/* 1. Hero Ticket Intelligence Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 text-white p-6 sm:p-8 shadow-card border border-slate-700/60">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Complaint ID with Copy Button */}
              <button
                onClick={handleCopyId}
                className="group inline-flex items-center gap-1.5 font-mono text-xs font-bold text-brand-300 bg-brand-500/15 hover:bg-brand-500/25 px-3 py-1 rounded-lg border border-brand-400/30 transition-all active:scale-95"
                title="Click to copy Ticket ID"
              >
                <span>{complaint.complaint_id}</span>
                {copiedId ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-brand-300 group-hover:text-white transition-colors" />
                )}
              </button>

              <PriorityBadge priority={complaint.priority} />
              <ComplaintStatusBadge status={complaint.status} />

              {complaint.is_anonymous ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Anonymous Report</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-300 bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Identified Student</span>
                </span>
              )}
            </div>

            {/* Ticket Subject */}
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {complaint.title}
            </h1>

            {/* Key Metadata Pills */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-brand-400" />
                <span className="font-semibold text-white">{complaint.category}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-white">{complaint.location}</span>
              </span>
              {complaint.department && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{complaint.department}</span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Actions & Date Meta */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 border-slate-700/60 pt-4 lg:pt-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/90 border border-slate-600/60 transition-all shadow-xs"
                title="Print Official Complaint Record"
              >
                <Printer className="w-3.5 h-3.5 text-slate-300" />
                <span>Print Slip</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-700/50 transition-all shadow-xs"
                title="Permanently Delete Complaint"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Delete</span>
              </button>
            </div>

            <div className="space-y-1 text-right text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 sm:justify-end">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>Logged: {formatDateTime(complaint.submitted_at)}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:justify-end">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>Last Modified: {formatDateTime(complaint.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Visual Lifecycle Progress Stepper */}
        {complaint.status !== 'Rejected' ? (
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 relative">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = currentStep > idx;
                const isCurrent = currentStep === idx;

                return (
                  <div key={step.status} className="relative flex flex-col items-center text-center">
                    {/* Circle Node */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                        isPassed
                          ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20'
                          : isCurrent
                          ? 'bg-brand-500 text-white ring-4 ring-brand-500/30 scale-110'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4" /> : idx + 1}
                    </div>

                    {/* Step Labels */}
                    <span
                      className={`mt-2 text-xs font-bold ${
                        isCurrent
                          ? 'text-brand-300'
                          : isPassed
                          ? 'text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-rose-400 font-semibold">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>This complaint was marked as Rejected / Closed by Proctorial Committee.</span>
          </div>
        )}
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Ticket Intelligence, Evidence, Student Identity (7 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Detailed Statement Card */}
          <Card className="shadow-subtle hover:shadow-card transition-shadow">
            <CardHeader
              title={
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base sm:text-lg">
                  <MessageSquareQuote className="w-5 h-5 text-brand-600" />
                  <span>Student Complaint Statement</span>
                </div>
              }
              subtitle="Full grievance narrative reported from campus QR node."
            />

            {/* Quick Context Summary Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Category
                  </span>
                  <p className="font-extrabold text-slate-900 text-sm truncate">{complaint.category}</p>
                  <Link
                    to={`/admin/complaints?category=${encodeURIComponent(complaint.category)}`}
                    className="text-[11px] font-semibold text-brand-600 hover:underline inline-flex items-center gap-0.5 mt-0.5"
                  >
                    <span>View same category</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Incident Location
                  </span>
                  <p className="font-extrabold text-slate-900 text-sm truncate">{complaint.location}</p>
                  <Link
                    to={`/admin/complaints?location=${encodeURIComponent(complaint.location)}`}
                    className="text-[11px] font-semibold text-brand-600 hover:underline inline-flex items-center gap-0.5 mt-0.5"
                  >
                    <span>View same location</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Narrative Box */}
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-50 to-white p-5 sm:p-6 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Detailed Description
              </span>
              <p className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-normal select-text">
                {complaint.description}
              </p>
            </div>
          </Card>

          {/* Student Profile / Security Identification Card */}
          <Card className="shadow-subtle hover:shadow-card transition-shadow">
            <CardHeader
              title={
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                  <User className="w-5 h-5 text-slate-700" />
                  <span>Student Identity & Verification</span>
                </div>
              }
              subtitle="Complainant profile details and contact information."
            />

            {complaint.is_anonymous ? (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-slate-50 border border-emerald-200/80 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0 shadow-xs">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      100% Anonymous & Confidential
                    </h4>
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      Protected
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The student submitted this complaint without personal identifiers to ensure unbiased reporting. Student rights and privacy are strictly safeguarded under the Proctorial Grievance Policy.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Student Bio Header */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white flex items-center justify-center font-extrabold text-lg shadow-sm flex-shrink-0">
                    {complaint.student_name ? complaint.student_name.slice(0, 2).toUpperCase() : 'ST'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{complaint.student_name}</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Roll No / ID: <span className="font-mono text-slate-700 font-bold">{complaint.student_id || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                {/* Academic & Contact Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">
                      Department
                    </span>
                    <p className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                      <Building className="w-3.5 h-3.5 text-brand-600" />
                      <span>{complaint.department || 'Not Specified'}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">
                      Semester / Batch
                    </span>
                    <p className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                      <GraduationCap className="w-3.5 h-3.5 text-brand-600" />
                      <span>{complaint.semester || 'Regular Semester'}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200 sm:col-span-2">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">
                      Contact Phone / Email
                    </span>
                    <p className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                      <Phone className="w-3.5 h-3.5 text-brand-600" />
                      <span>{complaint.contact || 'No direct phone recorded'}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Proctor Action & Resolution Center (5 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-brand-200/90 shadow-elevated bg-gradient-to-b from-white to-slate-50/40">
            <CardHeader
              title={
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base sm:text-lg">
                  <CheckCircle2 className="w-5 h-5 text-brand-600" />
                  <span>Proctor Action & Resolution</span>
                </div>
              }
              subtitle="Update ticket status, assign proctor, and post official resolution."
            />

            <form onSubmit={(e) => handleSave(e)} className="space-y-5">
              {/* 1. Quick Status Selector Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Complaint Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['New', 'In Progress', 'Resolved', 'Rejected'] as ComplaintStatus[]).map((st) => {
                    const isSelected = status === st;
                    let activeStyles = 'bg-brand-600 text-white border-brand-600 shadow-sm';
                    if (st === 'In Progress') activeStyles = 'bg-amber-600 text-white border-amber-600 shadow-sm';
                    if (st === 'Resolved') activeStyles = 'bg-emerald-600 text-white border-emerald-600 shadow-sm';
                    if (st === 'Rejected') activeStyles = 'bg-rose-600 text-white border-rose-600 shadow-sm';

                    return (
                      <button
                        type="button"
                        key={st}
                        onClick={() => setStatus(st)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? activeStyles
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {st === 'Resolved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {st === 'In Progress' && <Clock className="w-3.5 h-3.5" />}
                        {st === 'New' && <Sparkles className="w-3.5 h-3.5" />}
                        {st === 'Rejected' && <AlertTriangle className="w-3.5 h-3.5" />}
                        <span>{st}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Priority Urgency Selector Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Priority Urgency Level
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Low', 'Medium', 'High', 'Critical'] as ComplaintPriority[]).map((pr) => {
                    const isSelected = priority === pr;
                    let selectedClass = 'bg-slate-700 text-white border-slate-700';
                    if (pr === 'Medium') selectedClass = 'bg-blue-600 text-white border-blue-600';
                    if (pr === 'High') selectedClass = 'bg-amber-600 text-white border-amber-600';
                    if (pr === 'Critical') selectedClass = 'bg-rose-600 text-white border-rose-600 animate-pulse';

                    return (
                      <button
                        type="button"
                        key={pr}
                        onClick={() => setPriority(pr)}
                        className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all text-center ${
                          isSelected
                            ? selectedClass
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {pr === 'Critical' && <Flame className="w-3 h-3 inline mr-1 text-amber-300" />}
                        {pr}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Official Resolution Statement & Template Presets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Action Taken / Resolution Note
                  </label>
                  <span className="text-[10px] text-slate-400">Publicly visible on tracking</span>
                </div>

                <textarea
                  rows={4}
                  placeholder="Describe investigative findings, department work order numbers, or corrective actions taken..."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full text-xs leading-relaxed p-3.5 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-inner resize-y min-h-[110px]"
                />

                {/* Quick 1-Click Template Chips */}
                <div className="mt-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>Quick Response Presets</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {RESOLUTION_TEMPLATES.map((tmpl, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleApplyTemplate(tmpl)}
                        className="text-[10px] text-slate-600 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-300 px-2.5 py-1 rounded-lg border border-slate-200/80 transition-colors text-left"
                      >
                        + {tmpl.slice(0, 38)}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2 border-t border-slate-200">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full font-extrabold py-3 rounded-xl shadow-md text-sm transition-transform active:scale-[0.99]"
                  isLoading={isUpdating}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save & Update Ticket
                </Button>

                {status !== 'Resolved' && (
                  <button
                    type="button"
                    onClick={handleQuickResolve}
                    disabled={isUpdating}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>1-Click Mark as Resolved & Close</span>
                  </button>
                )}
              </div>
            </form>
          </Card>

          {/* Danger Zone Card */}
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-rose-900 flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Delete Ticket</span>
              </span>
            </div>
            <p className="text-[11px] text-rose-700 leading-relaxed">
              Permanently erase this complaint and its resolution log from the database.
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="w-full mt-1 py-2 px-3 rounded-xl text-xs font-bold text-rose-700 bg-white hover:bg-rose-100/80 border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Delete Complaint Permanently</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteComplaint}
        title="Permanently Delete Complaint?"
        message={`Are you sure you want to permanently delete complaint ${complaint.complaint_id} ("${complaint.title}")? This will erase the ticket from the database and cannot be undone.`}
        confirmText="Delete Complaint"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
