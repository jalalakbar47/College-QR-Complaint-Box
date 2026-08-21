import { useState, useEffect, useCallback, useRef } from 'react';
import { Category } from '../types';
import { apiService } from '../services/api';
import { INITIAL_CATEGORIES } from '../config/constants';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef<boolean>(false);

  const fetchCategories = useCallback(async () => {
    if (!hasFetchedRef.current && categories.length === 0) {
      setIsLoading(true);
    }
    try {
      const response = await apiService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
        hasFetchedRef.current = true;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  }, [categories.length]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, isLoading, error, refetch: fetchCategories };
}
