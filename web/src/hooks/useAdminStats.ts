import { useState, useEffect } from 'react';

const API_BASE = 'http://127.0.0.1:8000/api';

export type DashboardStats = {
  total_users: number;
  active_vips: number;
  total_earnings: number;
  total_deposits: number;
  admin_trade_capital?: number;
  admin_gross_income?: number;
  admin_total_deduction?: number;
  admin_net_income?: number;
  deposits_by_status: {
    Completed: number;
    Pending: number;
    Failed: number;
  };
  pending_deposits: number;
  total_withdrawals: number;
  withdrawals_by_status: {
    Completed: number;
    Pending: number;
    Rejected: number;
  };
  recent_deposits: any[];
  recent_withdrawals: any[];
  vip_levels: { label: string; users: number; pct: number }[];
  system_stats: {
    total_trades: number;
  };
};

export function useAdminStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/admin/dashboard-stats`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch dashboard stats');
        return res.json();
      })
      .then(data => {
        setStats(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err);
        setIsLoading(false);
      });
  }, []);

  return { stats, isLoading, error };
}
