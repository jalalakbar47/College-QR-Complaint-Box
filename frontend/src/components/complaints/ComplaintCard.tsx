import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, User, Eye, Trash2 } from 'lucide-react';
import { Complaint } from '../../types';
import { Pill } from '../ui/Pill';
import { PriorityBadge } from './PriorityBadge';
import { formatDateTime } from '../../utils/dateFormatter';

export interface ComplaintCardProps {
  complaint: Complaint;
  isAdmin?: boolean;
  onDelete?: (complaintId: string) => void;
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

export const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  isAdmin = false,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card navigation if clicking delete button
    if ((e.target as HTMLElement).closest('button')) return;
    if (isAdmin) {
      navigate(`/admin/complaints/${complaint.complaint_id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative bg-paper-card rounded-xl border border-hairline overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-150 cursor-pointer"
    >
      {/* Top Part: ID + Status Pill */}
      <div className="p-3.5 sm:p-4 flex items-center justify-between gap-2">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted block">
            REFERENCE ID
          </span>
          <span className="font-mono text-xs font-semibold text-ink-navy">
            {complaint.complaint_id}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <PriorityBadge priority={complaint.priority} />
          <Pill
            variant={mapStatusToPillVariant(complaint.status) as any}
            size="sm"
            label={complaint.status}
          />
        </div>
      </div>

      {/* TicketStub Divider */}
      <div className="relative flex items-center w-full select-none" aria-hidden="true">
        <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-paper border border-hairline z-10" />
        <div className="w-full border-b border-dashed border-hairline mx-2.5" />
        <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-paper border border-hairline z-10" />
      </div>

      {/* Bottom Part: Details */}
      <div className="p-3.5 sm:p-4 space-y-2.5">
        {/* Title */}
        <h4 className="font-semibold text-ink-navy text-sm leading-snug">
          {complaint.title}
        </h4>

        {/* Category & Location */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink-muted">
          <span className="font-medium text-ink-navy bg-paper px-2 py-0.5 rounded border border-hairline">
            {complaint.category}
          </span>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-ink-muted" />
            <span className="truncate max-w-[140px]">{complaint.location}</span>
          </div>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
          {complaint.description}
        </p>

        {/* Card Footer */}
        <div className="pt-2.5 border-t border-hairline flex items-center justify-between gap-2 text-xs text-ink-muted">
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDateTime(complaint.submitted_at)}</span>
          </div>

          <div className="flex items-center gap-2">
            {complaint.is_anonymous ? (
              <Pill variant="neutral" size="sm" label="Anonymous" />
            ) : (
              <div className="flex items-center gap-1 text-[11px] text-ink-navy font-medium truncate max-w-[100px]">
                <User className="w-3 h-3 text-ink-muted" />
                <span className="truncate">{complaint.student_name}</span>
              </div>
            )}

            {isAdmin && (
              <div className="flex items-center gap-1">
                <Link
                  to={`/admin/complaints/${complaint.complaint_id}`}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-registrar-blue hover:bg-registrar-blue/10 border border-registrar-blue/20 transition-colors"
                  title="View Details"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </Link>
                {onDelete && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(complaint.complaint_id);
                    }}
                    className="p-1 rounded-lg text-ink-muted hover:text-case-red hover:bg-case-red/10 border border-transparent hover:border-case-red/20 transition-colors"
                    title="Delete Complaint"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
