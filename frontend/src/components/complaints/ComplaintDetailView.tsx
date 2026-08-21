import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  User,
  MapPin,
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
  Tag,
  GraduationCap,
  MessageSquareQuote,
  Flame,
  Zap,
  Trash2,
  Edit3,
} from 'lucide-react';
import { Admin, Complaint, ComplaintPriority, ComplaintStatus, UpdateComplaintDTO } from '../../types';
import { Pill } from '../ui/Pill';
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

function mapStatusToPillVariant(status: string) {
  const s = status.toLowerCase();
  if (s === 'new') return 'new';
  if (s === 'in progress' || s === 'in-progress' || s === 'under review' || s === 'assigned') return 'in-progress';
  if (s === 'resolved') return 'resolved';
  if (s === 'rejected') return 'rejected';
  if (s === 'closed') return 'closed';
  return 'new';
}

function mapPriorityToPillVariant(priority: string) {
  switch (priority) {
    case 'Critical':
      return 'critical';
    case 'High':
      return 'in-progress';
    case 'Medium':
      return 'new';
    case 'Low':
    default:
      return 'neutral';
  }
}

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
      {/* 1. Header Card (ink-navy, rounded-2xl with TicketStub signature divider) */}
      <div className="relative overflow-hidden rounded-2xl bg-ink-navy text-white p-6 sm:p-8 border border-ink-navy shadow-md">
        {/* Top Meta Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Reference ID Chip */}
            <button
              onClick={handleCopyId}
              className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-white bg-white/10 hover:bg-white/15 px-3 py-1 rounded-lg border border-white/20 transition-colors"
              title="Click to copy Reference ID"
            >
              <span>{complaint.complaint_id}</span>
              {copiedId ? (
                <Check className="w-3.5 h-3.5 text-ledger-green" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-300" />
              )}
            </button>

            <Pill
              variant={mapPriorityToPillVariant(complaint.priority) as any}
              size="sm"
              label={complaint.priority}
            />

            <Pill
              variant={mapStatusToPillVariant(complaint.status) as any}
              size="sm"
              label={complaint.status}
            />

            {complaint.is_anonymous ? (
              <Pill variant="resolved" size="sm" label="Anonymous Report" />
            ) : (
              <Pill variant="new" size="sm" label="Identified Student" />
            )}
          </div>

          {/* Top-Right Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
              title="Print Official Complaint Record"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span>Print Slip</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-case-red hover:bg-case-red/10 border border-case-red/40 transition-colors"
              title="Permanently Delete Complaint"
            >
              <Trash2 className="w-3.5 h-3.5 text-case-red" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Complaint Title */}
        <h1 className="font-serif text-xl sm:text-3xl font-normal text-white leading-tight mt-4 mb-2 tracking-tight">
          {complaint.title}
        </h1>

        {/* Category & Location Sub-meta */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-300">
          <span className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-seal-gold" />
            <span className="font-medium text-white">{complaint.category}</span>
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-seal-gold" />
            <span className="font-medium text-white">{complaint.location}</span>
          </span>
          {complaint.department && (
            <>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span>{complaint.department}</span>
              </span>
            </>
          )}
        </div>

        {/* Dashed Ticket-Stub Divider with Cut Notches */}
        <div className="relative flex items-center w-full my-6 select-none" aria-hidden="true">
          <div className="absolute -left-9 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-paper border border-hairline z-10" />
          <div className="w-full border-b border-dashed border-white/20" />
          <div className="absolute -right-9 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-paper border border-hairline z-10" />
        </div>

        {/* 3-Step Progress Tracker (Logged → In Progress → Resolved) */}
        {complaint.status !== 'Rejected' ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="grid grid-cols-3 gap-3 sm:gap-6 flex-1 max-w-xl">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = currentStep > idx;
                const isCurrent = currentStep === idx;

                return (
                  <div key={step.status} className="flex flex-col items-center text-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-semibold transition-colors ${
                        isCurrent
                          ? 'bg-seal-gold text-white ring-4 ring-seal-gold/20'
                          : isPassed
                          ? 'bg-registrar-blue text-white'
                          : 'bg-white/5 text-slate-400 border border-white/20'
                      }`}
                    >
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span
                      className={`mt-1.5 text-xs font-medium ${
                        isCurrent
                          ? 'text-seal-gold font-semibold'
                          : isPassed
                          ? 'text-white'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Timestamps */}
            <div className="font-mono text-[11px] text-slate-400 space-y-0.5 sm:text-right flex-shrink-0">
              <div>Logged: {formatDateTime(complaint.submitted_at)}</div>
              <div>Last Modified: {formatDateTime(complaint.updated_at)}</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-case-red font-medium">
            <AlertTriangle className="w-4 h-4" />
            <span>This complaint was marked as Rejected / Closed by the Proctorial Committee.</span>
          </div>
        )}
      </div>

      {/* 2. Two-Column Body Grid (7 cols / 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Narrative & Student Verification (7 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Student Complaint Statement Card */}
          <Card>
            <CardHeader
              title={
                <div className="flex items-center gap-2 text-ink-navy font-semibold text-base">
                  <MessageSquareQuote className="w-4.5 h-4.5 text-registrar-blue" />
                  <span>Student Complaint Statement</span>
                </div>
              }
              subtitle="Full grievance narrative reported from campus QR node."
            />

            {/* Category / Location 2-Up Info Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-xl bg-paper border border-hairline">
                <span className="text-[10px] font-mono font-medium text-ink-muted uppercase tracking-wider block mb-0.5">
                  Category
                </span>
                <p className="font-semibold text-ink-navy text-sm truncate">{complaint.category}</p>
                <Link
                  to={`/admin/complaints?category=${encodeURIComponent(complaint.category)}`}
                  className="text-[11px] font-medium text-registrar-blue hover:underline inline-flex items-center gap-0.5 mt-1"
                >
                  <span>View same category</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </Link>
              </div>

              <div className="p-3.5 rounded-xl bg-paper border border-hairline">
                <span className="text-[10px] font-mono font-medium text-ink-muted uppercase tracking-wider block mb-0.5">
                  Incident Location
                </span>
                <p className="font-semibold text-ink-navy text-sm truncate">{complaint.location}</p>
                <Link
                  to={`/admin/complaints?location=${encodeURIComponent(complaint.location)}`}
                  className="text-[11px] font-medium text-registrar-blue hover:underline inline-flex items-center gap-0.5 mt-1"
                >
                  <span>View same location</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </Link>
              </div>
            </div>

            {/* Detailed Description Block */}
            <div className="p-4 sm:p-5 rounded-lg bg-paper border border-hairline">
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted block mb-2 font-medium">
                Detailed Description
              </span>
              <p className="text-ink-navy text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {complaint.description}
              </p>
            </div>
          </Card>

          {/* Student Identity & Verification Card */}
          <Card>
            <CardHeader
              title={
                <div className="flex items-center gap-2 text-ink-navy font-semibold text-base">
                  <User className="w-4.5 h-4.5 text-ink-navy" />
                  <span>Student Identity &amp; Verification</span>
                </div>
              }
              subtitle="Complainant profile details and contact verification."
            />

            {complaint.is_anonymous ? (
              <div className="p-5 rounded-xl bg-ledger-green/10 border border-ledger-green/20 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-ledger-green text-white flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-ink-navy text-sm sm:text-base">
                      100% Anonymous &amp; Confidential
                    </h4>
                    <Pill variant="resolved" size="sm" label="Protected" />
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    The student submitted this complaint without personal identifiers to ensure unbiased reporting. Student rights and privacy are strictly safeguarded under the Proctorial Grievance Policy.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                {/* Student Bio Capsule */}
                <div className="p-3.5 rounded-xl bg-paper border border-hairline flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-registrar-blue text-white flex items-center justify-center font-mono font-semibold text-sm flex-shrink-0">
                    {complaint.student_name ? complaint.student_name.slice(0, 2).toUpperCase() : 'ST'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-ink-navy text-sm">{complaint.student_name}</h4>
                    <p className="text-xs font-mono text-ink-muted">
                      Roll / ID: <span className="font-semibold text-ink-navy">{complaint.student_id || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                {/* Key-Value Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-paper border border-hairline">
                    <span className="text-[10px] font-mono text-ink-muted uppercase block mb-0.5">
                      Department
                    </span>
                    <p className="font-semibold text-ink-navy flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-registrar-blue" />
                      <span>{complaint.department || 'Not Specified'}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-paper border border-hairline">
                    <span className="text-[10px] font-mono text-ink-muted uppercase block mb-0.5">
                      Semester / Batch
                    </span>
                    <p className="font-semibold text-ink-navy flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-registrar-blue" />
                      <span>{complaint.semester || 'Regular Semester'}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-paper border border-hairline sm:col-span-2">
                    <span className="text-[10px] font-mono text-ink-muted uppercase block mb-0.5">
                      Contact Phone / Email
                    </span>
                    <p className="font-semibold text-ink-navy flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-registrar-blue" />
                      <span>{complaint.contact || 'No direct phone recorded'}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Proctor Action & Resolution (5 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-hairline shadow-sm">
            <CardHeader
              title={
                <div className="flex items-center gap-2 text-ink-navy font-semibold text-base">
                  <Edit3 className="w-4.5 h-4.5 text-registrar-blue" />
                  <span>Proctor Action &amp; Resolution</span>
                </div>
              }
              subtitle="Update ticket status, urgency level, and post official resolution note."
            />

            <form onSubmit={(e) => handleSave(e)} className="space-y-5">
              {/* 1. Complaint Status: 2x2 Button-Group */}
              <div>
                <label className="block text-xs font-mono font-medium text-ink-navy uppercase tracking-wider mb-2">
                  Complaint Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['New', 'In Progress', 'Resolved', 'Rejected'] as ComplaintStatus[]).map((st) => {
                    const isSelected = status === st;
                    let selectedStyle = 'bg-registrar-blue text-white border-registrar-blue shadow-sm';
                    if (st === 'In Progress') selectedStyle = 'bg-seal-gold text-white border-seal-gold shadow-sm';
                    if (st === 'Resolved') selectedStyle = 'bg-ledger-green text-white border-ledger-green shadow-sm';
                    if (st === 'Rejected') selectedStyle = 'bg-case-red text-white border-case-red shadow-sm';

                    return (
                      <button
                        type="button"
                        key={st}
                        onClick={() => setStatus(st)}
                        className={`px-3 py-2.5 rounded-lg text-xs font-medium border transition-colors flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? selectedStyle
                            : 'bg-paper text-ink-navy border-hairline hover:bg-paper-card'
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

              {/* 2. Priority Urgency Level: 4-Across Button Group */}
              <div>
                <label className="block text-xs font-mono font-medium text-ink-navy uppercase tracking-wider mb-2">
                  Priority Urgency Level
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Low', 'Medium', 'High', 'Critical'] as ComplaintPriority[]).map((pr) => {
                    const isSelected = priority === pr;
                    let selectedStyle = 'bg-ink-muted text-white border-ink-muted';
                    if (pr === 'Medium') selectedStyle = 'bg-registrar-blue text-white border-registrar-blue';
                    if (pr === 'High') selectedStyle = 'bg-seal-gold text-white border-seal-gold';
                    if (pr === 'Critical') selectedStyle = 'bg-case-red text-white border-case-red';

                    return (
                      <button
                        type="button"
                        key={pr}
                        onClick={() => setPriority(pr)}
                        className={`py-2 px-1 rounded-lg text-[11px] font-medium border transition-colors text-center ${
                          isSelected
                            ? selectedStyle
                            : 'bg-paper text-ink-muted border-hairline hover:bg-paper-card'
                        }`}
                      >
                        {pr === 'Critical' && <Flame className="w-3 h-3 inline mr-1 text-seal-gold" />}
                        {pr}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Action Taken / Resolution Note Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-medium text-ink-navy uppercase tracking-wider">
                    Action Taken / Resolution Note
                  </label>
                  <span className="text-[10px] font-mono text-ink-muted">Publicly visible on tracking</span>
                </div>

                <textarea
                  rows={4}
                  placeholder="Describe investigative findings, department work order numbers, or corrective actions taken..."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full text-xs sm:text-sm leading-relaxed p-3.5 rounded-lg border border-hairline bg-paper-card text-ink-navy placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-registrar-blue focus:border-registrar-blue min-h-[110px]"
                />

                {/* Quick Response Presets */}
                <div className="mt-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted flex items-center gap-1 mb-1.5 font-medium">
                    <Zap className="w-3 h-3 text-seal-gold" />
                    <span>Quick Response Presets</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {RESOLUTION_TEMPLATES.map((tmpl, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleApplyTemplate(tmpl)}
                        className="text-[10px] text-ink-muted bg-paper hover:bg-registrar-blue/5 hover:text-registrar-blue hover:border-registrar-blue/30 px-2.5 py-1 rounded-lg border border-hairline transition-colors text-left"
                      >
                        + {tmpl.slice(0, 36)}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Primary Action Row */}
              <div className="pt-3 space-y-2 border-t border-hairline">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3 text-sm font-medium"
                  isLoading={isUpdating}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save &amp; Update Ticket
                </Button>

                {status !== 'Resolved' && (
                  <button
                    type="button"
                    onClick={handleQuickResolve}
                    disabled={isUpdating}
                    className="w-full py-2.5 px-3 rounded-lg text-xs font-medium text-ledger-green bg-ledger-green/10 hover:bg-ledger-green/20 border border-ledger-green/30 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-ledger-green" />
                    <span>1-Click Mark as Resolved &amp; Close</span>
                  </button>
                )}
              </div>
            </form>
          </Card>

          {/* 5. Danger Zone: Isolated and Case-Red Tinted */}
          <div className="p-4 rounded-xl bg-case-red/5 border border-case-red/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-case-red flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Ticket</span>
              </span>
            </div>
            <p className="text-[11px] text-ink-muted leading-relaxed">
              Permanently erase this complaint and its resolution log from the database.
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="w-full mt-1 py-2.5 px-3 rounded-lg text-xs font-medium text-white bg-case-red hover:bg-case-red/90 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
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
