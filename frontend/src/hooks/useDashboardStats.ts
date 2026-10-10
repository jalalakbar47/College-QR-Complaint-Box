import { useState, useEffect, useCallback, useRef } from 'react';
import { DashboardStats } from '../types';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export function useDashboardStats() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef<boolean>(false);

  const fetchStats = useCallback(async (isInitial: boolean = false) => {
    if (isInitial || !hasLoadedRef.current) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const response = await apiService.getDashboardStats(token || undefined);
      if (response.success && response.data) {
        setStats(response.data);
        hasLoadedRef.current = true;
      } else {
        setError(response.message || 'Failed to fetch dashboard statistics.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStats(!hasLoadedRef.current);

    // 1. Cross-tab BroadcastChannel listener for mutations & new complaints
    let bcMutations: BroadcastChannel | null = null;
    let bcNotifs: BroadcastChannel | null = null;

    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bcMutations = new BroadcastChannel('cqb_mutations_channel');
        bcMutations.onmessage = () => {
          fetchStats(false);
        };

        bcNotifs = new BroadcastChannel('cqb_notifications_channel');
        bcNotifs.onmessage = () => {
          fetchStats(false);
        };
      }
    } catch {
      // BroadcastChannel unsupported fallback
    }

    // 2. In-tab custom window events
    const handleDataChanged = () => fetchStats(false);
    const handleComplaintLogged = () => fetchStats(false);

    window.addEventListener('cqb_data_changed', handleDataChanged);
    window.addEventListener('cqb_complaint_logged', handleComplaintLogged);

    // 3. Cross-tab storage change fallback
    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === 'cqb_data_mutation_ping' ||
        e.key === 'cqb_last_submitted_ping' ||
        e.key === 'complaints_db'
      ) {
        fetchStats(false);
      }
    };
    window.addEventListener('storage', handleStorage);

    // 4. Tab visibility change (refresh immediately when user switches back)
    const handleVisibility = () => {
      if (!document.hidden) {
        fetchStats(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // 5. Periodic polling (every 12 seconds)
    const pollInterval = setInterval(() => {
      fetchStats(false);
    }, 12000);

    return () => {
      if (bcMutations) bcMutations.close();
      if (bcNotifs) bcNotifs.close();
      window.removeEventListener('cqb_data_changed', handleDataChanged);
      window.removeEventListener('cqb_complaint_logged', handleComplaintLogged);
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(pollInterval);
    };
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: () => fetchStats(false) };
}
