import { useState, useEffect, useCallback, useRef } from 'react';
import { Complaint } from '../types';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export interface UseComplaintsOptions {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  location?: string;
  department?: string;
  autoFetch?: boolean;
}

export function useComplaints(options: UseComplaintsOptions = {}) {
  const { token } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef<boolean>(false);

  const fetchComplaints = useCallback(async (isInitial: boolean = false) => {
    if (isInitial || !hasLoadedRef.current) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const response = await apiService.getComplaints({
        search: options.search,
        status: options.status,
        priority: options.priority,
        category: options.category,
        location: options.location,
        department: options.department,
        token: token || undefined,
      });

      if (response.success && response.data) {
        setComplaints(response.data);
        hasLoadedRef.current = true;
      } else {
        setError(response.message || 'Failed to fetch complaints.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [options.search, options.status, options.priority, options.category, options.location, options.department, token]);

  useEffect(() => {
    if (options.autoFetch === false) return;

    fetchComplaints(!hasLoadedRef.current);

    // 1. Cross-tab BroadcastChannel listener for mutations & new complaints
    let bcMutations: BroadcastChannel | null = null;
    let bcNotifs: BroadcastChannel | null = null;

    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bcMutations = new BroadcastChannel('cqb_mutations_channel');
        bcMutations.onmessage = () => {
          fetchComplaints(false);
        };

        bcNotifs = new BroadcastChannel('cqb_notifications_channel');
        bcNotifs.onmessage = () => {
          fetchComplaints(false);
        };
      }
    } catch {
      // BroadcastChannel unsupported fallback
    }

    // 2. In-tab custom window events
    const handleDataChanged = () => fetchComplaints(false);
    const handleComplaintLogged = () => fetchComplaints(false);

    window.addEventListener('cqb_data_changed', handleDataChanged);
    window.addEventListener('cqb_complaint_logged', handleComplaintLogged);

    // 3. Cross-tab storage change fallback
    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === 'cqb_data_mutation_ping' ||
        e.key === 'cqb_last_submitted_ping' ||
        e.key === 'complaints_db'
      ) {
        fetchComplaints(false);
      }
    };
    window.addEventListener('storage', handleStorage);

    // 4. Tab visibility change (refresh immediately when user switches back)
    const handleVisibility = () => {
      if (!document.hidden) {
        fetchComplaints(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // 5. Periodic polling (every 12 seconds)
    const pollInterval = setInterval(() => {
      fetchComplaints(false);
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
  }, [fetchComplaints, options.autoFetch]);

  return {
    complaints,
    isLoading,
    error,
    refetch: () => fetchComplaints(false),
  };
}
