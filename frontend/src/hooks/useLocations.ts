import { useState, useEffect, useCallback } from 'react';
import { LocationItem } from '../types';
import { apiService } from '../services/api';
import { INITIAL_LOCATIONS } from '../config/constants';

export function useLocations() {
  const [locations, setLocations] = useState<LocationItem[]>(INITIAL_LOCATIONS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getLocations();
      if (response.success && response.data) {
        setLocations(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load locations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return { locations, isLoading, error, refetch: fetchLocations };
}
