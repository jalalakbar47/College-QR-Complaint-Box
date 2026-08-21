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
        <div className="h-32 bg-slate-200/80 rounded-3xl animate-pulse" />
        {/* 5 KPI Stat Cards Skeleton */}
        <DashboardStatsSkeleton />
        {/* Recent Complaints Table Skeleton */}
        <div className="space-y-3">
          <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
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
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-800 to-navy-900 rounded-3xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-300">
            Chief Proctor Overview
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold mt-1">
            Welcome back, {admin?.name || 'Administrator'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time complaint monitoring for {ENV.COLLEGE_NAME}. Monitor incoming reports, assign proctors, and post resolutions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-xs text-xs text-slate-200">
            <span className="block text-[10px] text-brand-300 uppercase font-semibold">Today's Inflow</span>
            <span className="text-lg font-bold text-white">{stats?.todayCount || 0} New Today</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Complaints"
          value={stats?.total || 0}
          icon={<Inbox className="w-6 h-6" />}
          color="blue"
          subtitle="All recorded tickets"
          onClick={() => navigate('/admin/complaints')}
        />

        <StatCard
          label="New Tickets"
          value={stats?.new || 0}
          icon={<Clock className="w-6 h-6" />}
          color="blue"
          subtitle="Awaiting initial review"
          onClick={() => navigate('/admin/complaints?status=New')}
        />

        <StatCard
          label="In Progress"
          value={stats?.inProgress || 0}
          icon={<PlayCircle className="w-6 h-6" />}
          color="amber"
          subtitle="Action actively underway"
          onClick={() => navigate('/admin/complaints?status=In%20Progress')}
        />

        <StatCard
          label="Resolved"
          value={stats?.resolved || 0}
          icon={<CheckCircle2 className="w-6 h-6" />}
          color="emerald"
          subtitle="Successfully closed"
          onClick={() => navigate('/admin/complaints?status=Resolved')}
        />

        <StatCard
          label="Critical Alert"
          value={stats?.critical || 0}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="rose"
          subtitle="High-priority complaints"
          onClick={() => navigate('/admin/complaints?priority=Critical')}
        />
      </div>

      {/* Quick Action Shortcuts */}
      <QuickActionCard />

      {/* Recent 10 Complaints Table */}
      <RecentComplaints complaints={stats?.recentComplaints || []} isLoading={isLoading} />
    </div>
  );
};
