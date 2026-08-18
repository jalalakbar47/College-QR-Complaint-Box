import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Complaint } from '../../types';
import { ComplaintTable } from '../complaints/ComplaintTable';
import { Card, CardHeader } from '../ui/Card';

export interface RecentComplaintsProps {
  complaints: Complaint[];
  isLoading?: boolean;
}

export const RecentComplaints: React.FC<RecentComplaintsProps> = ({
  complaints,
  isLoading = false,
}) => {
  return (
    <Card>
      <CardHeader
        title="Recent Grievance Submissions"
        subtitle="Latest 10 logged issues across academic, hostel, and campus infrastructure."
        action={
          <Link
            to="/admin/complaints"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      />
      <ComplaintTable complaints={complaints} isLoading={isLoading} />
    </Card>
  );
};
