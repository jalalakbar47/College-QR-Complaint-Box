import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  RefreshCw,
  RotateCcw,
  User,
  ChevronDown,
} from 'lucide-react';
import { ActivityLog } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';

const PAGE_SIZE = 15;

function getActionColor(action: string): { dot: string; ring: string } {
  const a = action.toLowerCase();
  if (a.includes('resolve') || a.includes('closed')) {
    return { dot: 'bg-ledger-green', ring: 'ring-ledger-green/20' };
  }
  if (a.includes('delete') || a.includes('reject') || a.includes('danger')) {
    return { dot: 'bg-case-red', ring: 'ring-case-red/20' };
  }
  if (a.includes('note') || a.includes('remark') || a.includes('comment')) {
    return { dot: 'bg-seal-gold', ring: 'ring-seal-gold/20' };
  }
  if (a.includes('status') || a.includes('assign') || a.includes('review') || a.includes('progress')) {
    return { dot: 'bg-registrar-blue', ring: 'ring-registrar-blue/20' };
  }
  return { dot: 'bg-ink-muted', ring: 'ring-ink-muted/20' };
}

function formatSystemDescription(log: ActivityLog): { main: string; hasLink: boolean } {
  const a = log.action.toLowerCase();
  const ticketId = log.complaint_id || '';

  if (a.includes('resolve')) {
    return {
      main: `Complaint marked as Resolved on`,
      hasLink: true,
    };
  }
  if (a.includes('delete')) {
    return {
      main: `Complaint record permanently deleted for`,
      hasLink: false,
    };
  }
  if (a.includes('status')) {
    const targetState = log.new_value ? log.new_value : 'updated status';
    return {
      main: `Status changed to ${targetState} on`,
      hasLink: true,
    };
  }
  if (a.includes('note') || a.includes('remark')) {
    return {
      main: `Administrative resolution note recorded on`,
      hasLink: true,
    };
  }
  if (a.includes('category') || a.includes('location')) {
    return {
      main: `Category / Location metadata updated on`,
      hasLink: true,
    };
  }

  return {
    main: `${log.action} recorded on`,
    hasLink: Boolean(ticketId),
  };
}

function formatGroupDate(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'RECENT ACTIVITY';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
      .format(date)
      .toUpperCase();
  } catch {
    return 'RECENT ACTIVITY';
  }
}

function formatLogTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return timestamp;
  }
}

export const AdminActivityLogPage: React.FC = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef<boolean>(false);

  // Filters State
  const [searchId, setSearchId] = useState<string>('');
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const fetchLogs = useCallback(
    async (isManual: boolean = false) => {
      if (!hasLoadedRef.current || isManual) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const res = await apiService.getActivityLogs(token || undefined);
        if (res.success && res.data) {
          setLogs(res.data);
          hasLoadedRef.current = true;
        } else {
          setError(res.message || 'Failed to retrieve activity log records.');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchLogs(false);
  }, [fetchLogs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // 1. Search ID filter
      if (searchId.trim()) {
        const q = searchId.trim().toLowerCase();
        const matchId = log.complaint_id?.toLowerCase().includes(q);
        const matchAdmin = (log.admin_name || log.admin_id)?.toLowerCase().includes(q);
        const matchAction = log.action?.toLowerCase().includes(q);
        if (!matchId && !matchAdmin && !matchAction) return false;
      }

      // 2. Action Type filter
      if (actionTypeFilter !== 'All') {
        const a = log.action.toLowerCase();
        if (actionTypeFilter === 'Status Changed' && !a.includes('status')) return false;
        if (actionTypeFilter === 'Note Added' && !a.includes('note') && !a.includes('remark'))
          return false;
        if (actionTypeFilter === 'Ticket Resolved' && !a.includes('resolve')) return false;
        if (actionTypeFilter === 'Ticket Deleted' && !a.includes('delete')) return false;
        if (
          actionTypeFilter === 'Category or Location Updated' &&
          !a.includes('category') &&
          !a.includes('location')
        )
          return false;
      }

      // 3. Date filter
      if (dateFilter) {
        try {
          const logDate = new Date(log.timestamp).toISOString().split('T')[0];
          if (logDate !== dateFilter) return false;
        } catch {
          // keep if invalid date
        }
      }

      return true;
    });
  }, [logs, searchId, actionTypeFilter, dateFilter]);

  // Group filtered logs by day
  const groupedLogs = useMemo(() => {
    const visible = filteredLogs.slice(0, visibleCount);
    const groups: { dateKey: string; items: ActivityLog[] }[] = [];

    visible.forEach((log) => {
      const dateKey = formatGroupDate(log.timestamp);
      const existingGroup = groups.find((g) => g.dateKey === dateKey);
      if (existingGroup) {
        existingGroup.items.push(log);
      } else {
        groups.push({ dateKey, items: [log] });
      }
    });

    return groups;
  }, [filteredLogs, visibleCount]);

  const isFiltered = searchId !== '' || actionTypeFilter !== 'All' || dateFilter !== '';

  const handleResetFilters = () => {
    setSearchId('');
    setActionTypeFilter('All');
    setDateFilter('');
    setVisibleCount(PAGE_SIZE);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-normal text-ink-navy tracking-tight">
            Activity Log
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5 font-sans">
            A record of every action taken on complaint tickets by the Proctor Office.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => fetchLogs(true)}
          disabled={isLoading}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
          className="text-xs font-medium"
        >
          Refresh Audit Trail
        </Button>
      </div>

      {/* 2. Filter Row (Surface-1 Card) */}
      <Card className="bg-paper-card border border-hairline p-4 sm:p-5 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-ink-navy font-semibold text-xs uppercase tracking-wider font-mono">
            <Filter className="w-3.5 h-3.5 text-registrar-blue" />
            <span>Filter Audit Trail</span>
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs text-case-red hover:underline font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1. Date Picker */}
          <div className="relative">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-ink-muted mb-1 font-medium">
              Filter by Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full text-xs font-sans px-3 py-2 rounded-lg border border-hairline bg-paper-recessed text-ink-navy focus:outline-none focus:ring-2 focus:ring-registrar-blue min-h-[38px]"
              />
            </div>
          </div>

          {/* 2. Action Type Select */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-ink-muted mb-1 font-medium">
              Action Type
            </label>
            <Select
              value={actionTypeFilter}
              onChange={(e) => setActionTypeFilter(e.target.value)}
              options={[
                { value: 'All', label: 'All Action Types' },
                { value: 'Status Changed', label: 'Status Changed' },
                { value: 'Note Added', label: 'Note Added' },
                { value: 'Ticket Resolved', label: 'Ticket Resolved' },
                { value: 'Ticket Deleted', label: 'Ticket Deleted' },
                { value: 'Category or Location Updated', label: 'Category or Location Updated' },
              ]}
            />
          </div>

          {/* 3. Search by Ticket ID */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-ink-muted mb-1 font-medium">
              Search by Ticket ID / Proctor
            </label>
            <Input
              placeholder="e.g. CQB-20260819-04B1"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-ink-muted" />}
              className="font-mono text-xs uppercase"
            />
          </div>
        </div>
      </Card>

      {/* 3. Timeline / Results */}
      {isLoading && logs.length === 0 ? (
        <div className="bg-paper-card rounded-xl border border-hairline p-6 shadow-sm">
          <TableSkeleton rows={7} />
        </div>
      ) : error && logs.length === 0 ? (
        <ErrorState
          title="Error retrieving audit trail"
          message={error}
          onRetry={() => fetchLogs(true)}
        />
      ) : filteredLogs.length === 0 ? (
        /* Empty State */
        <div className="p-8 sm:p-12 rounded-xl bg-paper-card border border-hairline text-center text-ink-muted shadow-sm space-y-3 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-paper-recessed border border-hairline flex items-center justify-center mx-auto text-ink-muted shadow-2xs">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-normal text-ink-navy">No activity recorded yet</h3>
            <p className="text-xs sm:text-sm text-ink-muted max-w-sm mx-auto mt-1 leading-relaxed font-sans">
              Actions performed on complaint tickets and system settings will appear here in chronological order.
            </p>
          </div>
          {isFiltered && (
            <div className="pt-2">
              <Button variant="secondary" size="sm" onClick={handleResetFilters}>
                Clear Filter Criteria
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Timeline Container */
        <div className="space-y-6">
          {groupedLogs.map((group) => (
            <div key={group.dateKey} className="space-y-3">
              {/* Date Eyebrow Heading */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted bg-paper px-2.5 py-0.5 rounded border border-hairline">
                  {group.dateKey}
                </span>
                <div className="flex-1 h-px bg-hairline" />
              </div>

              {/* Day's Entries in a Surface-1 Card with Vertical Hairline Connector */}
              <div className="bg-paper-card rounded-xl border border-hairline p-4 sm:p-5 shadow-sm relative overflow-hidden">
                <div className="relative pl-6 sm:pl-7 space-y-4">
                  {/* Vertical Hairline down the left edge */}
                  <div
                    className="absolute left-2.5 top-2 bottom-2 w-px bg-hairline"
                    aria-hidden="true"
                  />

                  {group.items.map((log) => {
                    const color = getActionColor(log.action);
                    const desc = formatSystemDescription(log);
                    const actor = log.admin_name || log.admin_id || 'Chief Proctor';

                    return (
                      <div key={log.log_id} className="relative group">
                        {/* Dot on the hairline */}
                        <div
                          className={`absolute -left-6 sm:-left-7 top-1 w-3 h-3 rounded-full ${color.dot} ring-4 ${color.ring} transition-transform group-hover:scale-110`}
                          aria-hidden="true"
                        />

                        {/* Content Block */}
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                          {/* Left Description */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-ink-navy leading-relaxed font-sans">
                              <span>{desc.main} </span>
                              {log.complaint_id && (
                                <>
                                  {desc.hasLink ? (
                                    <Link
                                      to={`/admin/complaints/${log.complaint_id}`}
                                      className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-ink-navy bg-paper-recessed hover:bg-registrar-blue/10 hover:text-registrar-blue px-2 py-0.5 rounded border border-hairline transition-colors ml-1"
                                    >
                                      <span>{log.complaint_id}</span>
                                    </Link>
                                  ) : (
                                    <span className="inline-flex items-center font-mono text-xs font-semibold text-ink-navy bg-paper-recessed px-2 py-0.5 rounded border border-hairline ml-1">
                                      {log.complaint_id}
                                    </span>
                                  )}
                                </>
                              )}
                            </p>

                            {/* Actor Pill & Remarks / Changes Sub-block */}
                            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-ink-muted">
                              <span className="inline-flex items-center gap-1 font-sans text-[11px] text-ink-muted">
                                <User className="w-3 h-3 text-ink-muted" />
                                <span>{actor}</span>
                              </span>

                              {log.old_value && log.new_value && (
                                <span className="font-mono text-[10px] bg-paper-recessed px-2 py-0.5 rounded border border-hairline text-ink-muted">
                                  {log.old_value} → {log.new_value}
                                </span>
                              )}
                            </div>

                            {log.remarks && (
                              <div className="mt-1.5 p-2.5 rounded-lg bg-paper-recessed border border-hairline text-xs text-ink-muted leading-relaxed font-sans">
                                {log.remarks}
                              </div>
                            )}
                          </div>

                          {/* Right Timestamp */}
                          <div className="font-mono text-[11px] text-ink-muted flex-shrink-0 whitespace-nowrap">
                            {formatLogTime(log.timestamp)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* 4. Pagination / Load More Button */}
          {filteredLogs.length > visibleCount && (
            <div className="pt-4 flex justify-center">
              <Button
                variant="secondary"
                size="md"
                onClick={handleLoadMore}
                leftIcon={<ChevronDown className="w-4 h-4" />}
                className="text-xs font-medium px-6 shadow-sm"
              >
                Load More Activity ({filteredLogs.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
