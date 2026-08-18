import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Inbox, MapPin } from 'lucide-react';
import { Complaint } from '../../types';
import { ComplaintStatusBadge } from './ComplaintStatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '../ui/Table';
import { ComplaintCard } from './ComplaintCard';
import { formatDate } from '../../utils/dateFormatter';
import { EmptyState } from '../ui/EmptyState';

export interface ComplaintTableProps {
  complaints: Complaint[];
  isLoading?: boolean;
}

export const ComplaintTable: React.FC<ComplaintTableProps> = ({
  complaints,
  isLoading = false,
}) => {
  if (complaints.length === 0 && !isLoading) {
    return (
      <EmptyState
        icon={<Inbox className="w-8 h-8 text-slate-400" />}
        title="No Grievances Found"
        description="No complaint records match your current filter and search criteria."
      />
    );
  }

  return (
    <>
      {/* Mobile Card Layout (< 768px) */}
      <div className="grid grid-cols-1 gap-3.5 md:hidden">
        {complaints.map((c) => (
          <ComplaintCard key={c.complaint_id} complaint={c} isAdmin={true} />
        ))}
      </div>

      {/* Desktop Table View (>= 768px) - Optimized to fit 100% width with ZERO horizontal scroll */}
      <div className="hidden md:block w-full">
        <Table className="table-auto w-full">
          <TableHead>
            <TableRow>
              <TableHeaderCell className="w-36">ID & Date</TableHeaderCell>
              <TableHeaderCell className="w-44">Category / Location</TableHeaderCell>
              <TableHeaderCell>Grievance Details</TableHeaderCell>
              <TableHeaderCell className="w-32">Student</TableHeaderCell>
              <TableHeaderCell className="w-28">Status</TableHeaderCell>
              <TableHeaderCell className="w-20 text-right">Action</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints.map((c) => (
              <TableRow key={c.complaint_id}>
                {/* ID & Date Combined */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200/60 w-fit">
                      {c.complaint_id}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {formatDate(c.submitted_at)}
                    </span>
                  </div>
                </TableCell>

                {/* Category & Location Combined */}
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-slate-900 text-xs">{c.category}</span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate max-w-[150px]">{c.location}</span>
                    </span>
                  </div>
                </TableCell>

                {/* Grievance Title + Priority Badge */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={c.priority} />
                      <p className="font-semibold text-slate-900 text-xs truncate max-w-xs" title={c.title}>
                        {c.title}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{c.description}</p>
                  </div>
                </TableCell>

                {/* Student Identity */}
                <TableCell>
                  {c.is_anonymous ? (
                    <span className="inline-flex items-center text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Anonymous
                    </span>
                  ) : (
                    <div className="flex flex-col text-xs">
                      <span className="font-medium text-slate-900 truncate max-w-[120px]" title={c.student_name}>
                        {c.student_name}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                        {c.student_id || c.department || ''}
                      </span>
                    </div>
                  )}
                </TableCell>

                {/* Status Badge */}
                <TableCell>
                  <ComplaintStatusBadge status={c.status} />
                </TableCell>

                {/* Action View Button */}
                <TableCell className="text-right">
                  <Link
                    to={`/admin/complaints/${c.complaint_id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
