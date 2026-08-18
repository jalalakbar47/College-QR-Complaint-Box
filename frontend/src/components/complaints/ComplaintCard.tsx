import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, User, Eye, AlertCircle } from 'lucide-react';
import { Complaint } from '../../types';
import { ComplaintStatusBadge } from './ComplaintStatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { formatDateTime } from '../../utils/dateFormatter';

export interface ComplaintCardProps {
  complaint: Complaint;
  isAdmin?: boolean;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, isAdmin = false }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between gap-3.5">
      <div>
        {/* Header with Reference ID & Badges */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200/60">
            {complaint.complaint_id}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <PriorityBadge priority={complaint.priority} />
            <ComplaintStatusBadge status={complaint.status} />
          </div>
        </div>

        {/* Title */}
        <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug mb-1.5">
          {complaint.title}
        </h4>

        {/* Category & Location */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-2.5">
          <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
            {complaint.category}
          </span>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{complaint.location}</span>
          </div>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {complaint.description}
        </p>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDateTime(complaint.submitted_at)}</span>
        </div>

        {isAdmin ? (
          <div className="flex items-center gap-2">
            {complaint.is_anonymous ? (
              <span className="text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Anonymous</span>
            ) : (
              <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium truncate max-w-[110px]">
                <User className="w-3 h-3 text-slate-400" />
                <span className="truncate">{complaint.student_name}</span>
              </div>
            )}
            <Link
              to={`/admin/complaints/${complaint.complaint_id}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View</span>
            </Link>
          </div>
        ) : (
          complaint.resolution && (
            <div className="flex items-center gap-1 text-emerald-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Resolution Posted</span>
            </div>
          )
        )}
      </div>
    </div>
  );
};
