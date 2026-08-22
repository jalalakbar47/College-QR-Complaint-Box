import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Inbox, MapPin, Trash2 } from 'lucide-react';
import { Complaint } from '../../types';
import { Pill } from '../ui/Pill';
import { PriorityBadge } from './PriorityBadge';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '../ui/Table';
import { ComplaintCard } from './ComplaintCard';
import { formatDate } from '../../utils/dateFormatter';
import { EmptyState } from '../ui/EmptyState';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { apiService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  createStaggerContainer,
  staggerItemVariants,
} from '../../lib/motion';

export interface ComplaintTableProps {
  complaints: Complaint[];
  isLoading?: boolean;
  onDeleted?: () => void;
}

function mapStatusToPillVariant(status: string) {
  const s = status.toLowerCase();
  if (s === 'new') return 'new';
  if (s === 'in progress' || s === 'in-progress' || s === 'under review' || s === 'assigned') return 'in-progress';
  if (s === 'resolved') return 'resolved';
  if (s === 'rejected') return 'rejected';
  if (s === 'closed') return 'closed';
  return 'new';
}

export const ComplaintTable: React.FC<ComplaintTableProps> = ({
  complaints,
  isLoading = false,
  onDeleted,
}) => {
  const navigate = useNavigate();
  const { admin } = useAuth();
  const { success, error } = useToast();

  const [deletingComplaint, setDeletingComplaint] = useState<Complaint | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!deletingComplaint) return;
    setIsDeleting(true);
    try {
      const res = await apiService.deleteComplaint(
        deletingComplaint.complaint_id,
        undefined,
        admin?.admin_id,
        'Permanently deleted by Chief Proctor from Complaint Table'
      );
      if (res.success) {
        success(`Complaint ${deletingComplaint.complaint_id} permanently deleted.`);
        setDeletingComplaint(null);
        if (onDeleted) onDeleted();
      } else {
        error(res.message || 'Failed to delete complaint.');
      }
    } catch {
      error('An error occurred while deleting the complaint.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (complaints.length === 0 && !isLoading) {
    return (
      <EmptyState
        icon={<Inbox className="w-8 h-8 text-ink-muted" />}
        title="No Complaints Found"
        description="No complaint records match your current filter and search criteria."
      />
    );
  }

  return (
    <>
      {/* Mobile Card Layout (< 768px): Compact TicketStub cards with Stagger */}
      <motion.div
        variants={createStaggerContainer(0.04)}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 gap-3.5 md:hidden"
      >
        {complaints.map((c) => (
          <motion.div key={c.complaint_id} variants={staggerItemVariants}>
            <ComplaintCard
              complaint={c}
              isAdmin={true}
              onDelete={() => setDeletingComplaint(c)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Desktop Table View (>= 768px) with 3-Level Elevation & Distinct Borders */}
      <div className="hidden md:block w-full overflow-x-auto rounded-xl border border-hairline bg-paper-card shadow-sm">
        <Table className="table-auto w-full">
          <TableHead>
            <TableRow className="border-b border-hairline bg-paper-recessed">
              <TableHeaderCell className="w-36 font-mono text-[11px] uppercase tracking-wider text-ink-muted py-3">
                ID &amp; Date
              </TableHeaderCell>
              <TableHeaderCell className="w-44 font-mono text-[11px] uppercase tracking-wider text-ink-muted py-3">
                Category / Location
              </TableHeaderCell>
              <TableHeaderCell className="font-mono text-[11px] uppercase tracking-wider text-ink-muted py-3">
                Complaint Details
              </TableHeaderCell>
              <TableHeaderCell className="w-32 font-mono text-[11px] uppercase tracking-wider text-ink-muted py-3">
                Student
              </TableHeaderCell>
              <TableHeaderCell className="w-28 font-mono text-[11px] uppercase tracking-wider text-ink-muted py-3">
                Status
              </TableHeaderCell>
              <TableHeaderCell className="w-24 text-right font-mono text-[11px] uppercase tracking-wider text-ink-muted py-3">
                Actions
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints.map((c, index) => {
              const isEven = index % 2 === 0;
              return (
                <TableRow
                  key={c.complaint_id}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('button, a')) return;
                    navigate(`/admin/complaints/${c.complaint_id}`);
                  }}
                  className={`border-b border-hairline transition-colors duration-150 hover:bg-registrar-blue/5 cursor-pointer ${
                    isEven ? 'bg-paper-card' : 'bg-paper-recessed/60'
                  }`}
                >
                  {/* ID & Date (Mono ticket code style) */}
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-xs font-semibold text-ink-navy">
                        {c.complaint_id}
                      </span>
                      <span className="text-[11px] font-mono text-ink-muted">
                        {formatDate(c.submitted_at)}
                      </span>
                    </div>
                  </TableCell>

                  {/* Category & Location Combined */}
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-ink-navy text-xs">{c.category}</span>
                      <span className="text-[11px] text-ink-muted flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-ink-muted flex-shrink-0" />
                        <span className="truncate max-w-[150px]">{c.location}</span>
                      </span>
                    </div>
                  </TableCell>

                  {/* Complaint Title + Priority Badge */}
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={c.priority} />
                        <p className="font-semibold text-ink-navy text-xs truncate max-w-xs" title={c.title}>
                          {c.title}
                        </p>
                      </div>
                      <p className="text-[11px] text-ink-muted line-clamp-1 font-sans">{c.description}</p>
                    </div>
                  </TableCell>

                  {/* Student Identity */}
                  <TableCell className="py-4">
                    {c.is_anonymous ? (
                      <Pill variant="neutral" size="sm" label="Anonymous" />
                    ) : (
                      <div className="flex flex-col text-xs">
                        <span className="font-semibold text-ink-navy truncate max-w-[120px]" title={c.student_name}>
                          {c.student_name}
                        </span>
                        <span className="text-[10px] font-mono text-ink-muted truncate max-w-[120px]">
                          {c.student_id || c.department || ''}
                        </span>
                      </div>
                    )}
                  </TableCell>

                  {/* Status Badge / Pill */}
                  <TableCell className="py-4">
                    <Pill
                      variant={mapStatusToPillVariant(c.status) as any}
                      size="sm"
                      label={c.status}
                    />
                  </TableCell>

                  {/* Action Buttons: View & Delete */}
                  <TableCell className="text-right py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/admin/complaints/${c.complaint_id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-registrar-blue hover:bg-registrar-blue/10 border border-registrar-blue/20 transition-colors"
                        title="View Complaint Details"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>

                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingComplaint(c);
                        }}
                        className="p-1 rounded-lg text-ink-muted hover:text-case-red hover:bg-case-red/10 border border-transparent hover:border-case-red/20 transition-colors"
                        title="Delete Complaint"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deletingComplaint)}
        onClose={() => setDeletingComplaint(null)}
        onConfirm={handleDelete}
        title="Permanently Delete Complaint?"
        message={`Are you sure you want to permanently delete complaint ${deletingComplaint?.complaint_id} ("${deletingComplaint?.title}")? This will erase the record from the database.`}
        confirmText="Delete Complaint"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
};
