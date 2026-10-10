import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Inbox,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
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
    <div className="space-y-5 sm:space-y-8 animate-fade-in">
      {/* 1. Welcome Executive Banner */}
      <div className="rounded-2xl p-4 sm:p-7 text-white relative overflow-hidden border border-white/10 shadow-md bg-gradient-to-br from-[#0c1427] via-[#101b38] to-[#162548]">
        {/* Subtle decorative grid & ambient lighting */}
        <div className="absolute inset-0 bg-dots-pattern opacity-10 pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-registrar-blue/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <SectionEyebrow rulePosition="left" className="text-seal-gold text-[10px] sm:text-xs">
                CHIEF PROCTOR OVERVIEW
              </SectionEyebrow>

              <button
                type="button"
                onClick={refetch}
                disabled={isLoading}
                title="Refresh dashboard metrics"
                className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-2 py-0.5 rounded-md border border-white/10 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden xs:inline">Sync</span>
              </button>
            </div>

            <h2 className="font-serif text-lg sm:text-2xl font-normal text-white tracking-tight leading-snug">
              Welcome back, {admin?.name || 'Chief Proctor'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Real-time complaint monitoring for {ENV.COLLEGE_NAME || 'Campus Departments'}. Monitor incoming reports, assign proctors, and post resolutions.
            </p>
          </div>

          {/* Inflow Capsule */}
          <div className="relative z-10 flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t border-white/10 sm:border-t-0">
            <div className="w-full sm:w-auto p-3 sm:p-3.5 rounded-xl bg-white/[0.08] border border-white/15 flex items-center justify-between sm:justify-end gap-3 backdrop-blur-xs shadow-inner">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-seal-gold/15 border border-seal-gold/30 flex items-center justify-center text-seal-gold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-left sm:text-right">
                  <span className="block text-[9px] sm:text-[10px] font-mono text-seal-gold uppercase tracking-wider font-medium">
                    Today's Inflow
                  </span>
                  <span className="font-serif text-base sm:text-xl font-normal text-white">
                    {stats?.todayCount || 0} New Today
                  </span>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" title="Active inflow stream" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Stat Cards Row (2 columns on mobile, 5 on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4">
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

        {/* 5th Card spans 2 cols on mobile for balanced grid */}
        <div className="col-span-2 lg:col-span-1">
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
      </div>

      {/* 3. Quick Actions */}
      <QuickActionCard />

      {/* 4. Recent Complaint Submissions Table */}
      <RecentComplaints complaints={stats?.recentComplaints || []} isLoading={isLoading} />
    </div>
  );
};
