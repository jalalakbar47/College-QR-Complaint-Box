import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Inbox,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { StatCard } from '../../components/dashboard/StatCard';
import { RecentComplaints } from '../../components/dashboard/RecentComplaints';
import { QuickActionCard } from '../../components/dashboard/QuickActionCard';
import { SectionEyebrow } from '../../components/ui/SectionEyebrow';
import { DashboardStatsSkeleton, TableSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { useAuth } from '../../contexts/AuthContext';
import { ENV } from '../../config/env';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { admin } = useAuth();
  const { stats, isLoading, error, refetch } = useDashboardStats();

  if (isLoading && !stats) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-fade-in">
        {/* Banner Skeleton */}
        <div className="h-32 bg-paper-card border border-hairline rounded-2xl animate-pulse" />
        {/* 5 KPI Stat Cards Skeleton */}
        <DashboardStatsSkeleton />
        {/* Recent Complaints Table Skeleton */}
        <div className="space-y-3">
          <div className="h-6 w-48 bg-paper-card border border-hairline rounded animate-pulse" />
          <TableSkeleton rows={5} />
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="py-8">
        <ErrorState
          title="Failed to load dashboard metrics"
          message={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* 1. Welcome Banner */}
      <div className="bg-ink-navy rounded-2xl p-6 sm:p-7 text-white relative overflow-hidden border border-ink-navy shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Subtle dot grid */}
        <div className="absolute inset-0 bg-dots-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 space-y-1.5 max-w-xl">
          <SectionEyebrow rulePosition="left" className="text-seal-gold">
            CHIEF PROCTOR OVERVIEW
          </SectionEyebrow>
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-white tracking-tight">
            Welcome back, {admin?.name || 'Chief Proctor'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Real-time complaint monitoring for {ENV.COLLEGE_NAME || 'GPGC Khar District Bajaur'}. Monitor incoming reports, assign proctors, and post resolutions.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 flex-shrink-0">
          <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-center sm:text-right backdrop-blur-xs">
            <span className="block text-[10px] font-mono text-seal-gold uppercase tracking-wider font-medium">
              Today's Inflow
            </span>
            <span className="font-serif text-lg sm:text-xl font-normal text-white">
              {stats?.todayCount || 0} New Today
            </span>
          </div>
        </div>
      </div>

      {/* 2. Stat Cards Row (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <StatCard
          label="Total Complaints"
          value={stats?.total || 0}
          icon={<Inbox className="w-5 h-5" />}
          color="blue"
          subtitle="All recorded tickets"
          onClick={() => navigate('/admin/complaints')}
        />

        <StatCard
          label="New Tickets"
          value={stats?.new || 0}
          icon={<Clock className="w-5 h-5" />}
          color="blue"
          subtitle="Awaiting initial review"
          onClick={() => navigate('/admin/complaints?status=New')}
        />

        <StatCard
          label="In Progress"
          value={stats?.inProgress || 0}
          icon={<PlayCircle className="w-5 h-5" />}
          color="gold"
          subtitle="Action underway"
          onClick={() => navigate('/admin/complaints?status=In%20Progress')}
        />

        <StatCard
          label="Resolved"
          value={stats?.resolved || 0}
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="green"
          subtitle="Successfully closed"
          onClick={() => navigate('/admin/complaints?status=Resolved')}
        />

        <StatCard
          label="Critical Alert"
          value={stats?.critical || 0}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="red"
          isCritical={true}
          subtitle="High-priority reports"
          onClick={() => navigate('/admin/complaints?priority=Critical')}
        />
      </div>

      {/* 3. Quick Actions */}
      <QuickActionCard />

      {/* 4. Recent Complaint Submissions Table */}
      <RecentComplaints complaints={stats?.recentComplaints || []} isLoading={isLoading} />
    </div>
  );
};
