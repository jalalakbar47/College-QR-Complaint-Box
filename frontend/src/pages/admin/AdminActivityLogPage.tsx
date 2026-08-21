import React, { useState, useEffect, useCallback } from 'react';
import { History, User, RefreshCw } from 'lucide-react';
import { ActivityLog } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { formatDateTime } from '../../utils/dateFormatter';
import { Card } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '../../components/ui/Table';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import { useRefresh } from '../../contexts/RefreshContext';

export const AdminActivityLogPage: React.FC = () => {
  const { token } = useAuth();
  const { registerRefreshHandler, refreshKey } = useRefresh();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiService.getActivityLogs(token || undefined);
      if (res.success && res.data) {
        setLogs(res.data);
      } else {
        setError(res.message || 'Failed to retrieve activity log records.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs, refreshKey]);

  useEffect(() => {
    const unregister = registerRefreshHandler('activity_logs', fetchLogs);
    return unregister;
  }, [registerRefreshHandler, fetchLogs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Compliance & Audit Trail</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Immutable log of all proctor actions, status modifications, and ticket updates.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchLogs}
          disabled={isLoading}
          leftIcon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          Refresh Audit Trail
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={7} />
      ) : error ? (
        <ErrorState
          title="Error retrieving audit trail"
          message={error}
          onRetry={fetchLogs}
        />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={<History className="w-8 h-8 text-slate-400" />}
          title="No Activity Recorded"
          description="Administrative actions and status changes will automatically be logged here."
        />
      ) : (
        <Card padding="none">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Log ID</TableHeaderCell>
                <TableHeaderCell>Timestamp</TableHeaderCell>
                <TableHeaderCell>Proctor / Admin</TableHeaderCell>
                <TableHeaderCell>Complaint ID</TableHeaderCell>
                <TableHeaderCell>Action Type</TableHeaderCell>
                <TableHeaderCell>Change (Old → New)</TableHeaderCell>
                <TableHeaderCell>Remarks / Notes</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.log_id}>
                  <TableCell>
                    <span className="font-mono text-xs text-slate-500 font-medium">
                      {log.log_id}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 whitespace-nowrap">
                    {formatDateTime(log.timestamp)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{log.admin_name || log.admin_id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      {log.complaint_id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs">
                    {log.old_value || log.new_value ? (
                      <div className="flex items-center gap-1 font-medium">
                        <span className="text-slate-500">{log.old_value || 'None'}</span>
                        <span className="text-slate-400">→</span>
                        <span className="text-slate-900 font-semibold">{log.new_value || 'None'}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 max-w-xs truncate" title={log.remarks}>
                    {log.remarks || '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};
