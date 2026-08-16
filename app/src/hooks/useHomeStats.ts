import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/api';

interface HomeStats {
  total_profit: number;
  today_profit: number;
  today_percent: number;
  daily_profit: number;
  balance: number;
}

const DEFAULT_STATS: HomeStats = {
  total_profit: 0,
  today_profit: 0,
  today_percent: 0,
  daily_profit: 0,
  balance: 0,
};

export function useHomeStats(user: any) {
  const [userData, setUserData] = useState<any>(user);
  const [stats, setStats] = useState<HomeStats>(DEFAULT_STATS);
  const [hasUnread, setHasUnread] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [profile, statsData, notifications] = await Promise.all([
        apiClient.get(`/users/${user.id}`),
        apiClient.get(`/users/${user.id}/stats`),
        apiClient.get(`/notifications?user_id=${user.id}`),
      ]);
      setUserData(profile);
      setStats(statsData);
      setHasUnread(notifications?.some((n: any) => !n.is_read) ?? false);
    } catch (err) {
      console.error('[useHomeStats]', err);
    }
  }, [user?.id]);

  useEffect(() => {
    setLoading(true);
    fetchAll().finally(() => setLoading(false));
  }, [fetchAll]);

  return { userData, stats, hasUnread, loading, reload: fetchAll };
}
