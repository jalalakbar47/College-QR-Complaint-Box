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
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: () => fetchStats(false) };
}
