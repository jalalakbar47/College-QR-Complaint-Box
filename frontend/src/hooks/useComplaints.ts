import { useState, useEffect, useCallback } from 'react';
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

  const fetchComplaints = useCallback(async () => {
    setIsLoading(true);
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
    if (options.autoFetch !== false) {
      fetchComplaints();
    }
  }, [fetchComplaints, options.autoFetch]);

  return {
    complaints,
    isLoading,
    error,
    refetch: fetchComplaints,
  };
}
