import { useState, useMemo } from 'react';
import { useApi } from './useApi';

export function useAdminFilters<T = any>(endpoint: string, initialParams: Record<string, string> = {}) {
  const [params, setParams] = useState<Record<string, string>>(initialParams);
  
  const queryString = useMemo(() => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all') {
        searchParams.append(key, value);
      }
    });
    return searchParams.toString();
  }, [params]);

  const { data, isLoading, mutate } = useApi<T>(`${endpoint}?${queryString}`);

  const updateFilter = (key: string, value: string) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setParams(initialParams);
  };

  return { data, isLoading, mutate, params, updateFilter, resetFilters };
}
