import { useState, useEffect, useCallback, useRef } from 'react';
import { LocationItem } from '../types';
import { apiService } from '../services/api';
import { INITIAL_LOCATIONS } from '../config/constants';

export function useLocations() {
  const [locations, setLocations] = useState<LocationItem[]>(INITIAL_LOCATIONS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef<boolean>(false);

  const fetchLocations = useCallback(async () => {
    if (!hasFetchedRef.current && locations.length === 0) {
      setIsLoading(true);
    }
    try {
      const response = await apiService.getLocations();
      if (response.success && response.data) {
        setLocations(response.data);
        hasFetchedRef.current = true;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load locations');
    } finally {
      setIsLoading(false);
    }
  }, [locations.length]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return { locations, isLoading, error, refetch: fetchLocations };
}
