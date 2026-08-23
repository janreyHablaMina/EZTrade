import useSWR from 'swr';
import { webApi } from '@/lib/api';

const fetcher = (url: string) => webApi.get(url);

export function useApi<Data = any>(url: string | null) {
  const { data, error, mutate, isLoading, isValidating } = useSWR<Data>(url, fetcher, {
    revalidateOnFocus: false, // Prevents excessive re-fetching on window focus
    shouldRetryOnError: false,
  });

  return {
    data,
    isLoading,
    error,
    mutate,
    isValidating
  };
}
