"use client";

import { useState, useMemo, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { Wallet, Users, Coins, Download, Calendar, User, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import type { EarningRecord } from "@/types/admin";
import { GenericFilters, FilterConfig } from "@/components/admin/GenericFilters";
import { EarningsTable } from "@/components/admin/earnings/EarningsTable";
import { EarningDetailsModal } from "@/components/admin/earnings/EarningDetailsModal";
import { webApi } from "@/lib/api";
import { useApi } from "@/hooks/useApi";

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<EarningRecord[]>([]);
  const [financials, setFinancials] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [params, setParams] = useState<Record<string, string>>({ search: '', vipLevel: 'all', dateFrom: '', dateTo: '' });
  const { data: vipPlansData } = useApi('/vip-plans');
  const [viewingEarning, setViewingEarning] = useState<EarningRecord | null>(null);

  const fetchEarnings = async () => {
    setIsLoading(true);
    try {
      const res = await webApi.get('/earnings');
      setFinancials(res.financials);
      
      const mapped = res.earnings.map((e: any) => ({
        id: `AE-${e.id.toString().padStart(5, '0')}`,
        userName: e.user ? e.user.name : 'Unknown',
        userEmail: e.user ? e.user.email : 'Unknown',
        vipLevel: e.user ? e.user.vip_plan_id : 1,
        type: 'Daily Trading Profit',
        source: `$${parseFloat(e.deposit_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        amount: parseFloat(e.gross_amount),
        userCut: parseFloat(e.user_cut || 0),
        adminCut: parseFloat(e.admin_cut),
        ambassadorCut: parseFloat(e.ambassador_cut),
        currency: 'USDT',
        network: 'N/A',
        status: 'Completed',
        dateTime: new Date(e.created_at).toLocaleString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        description: e.deduction > 0 ? `Gross $${e.gross_cut} - $${e.deduction} Bonus Deduction` : `Gross $${e.gross_cut} (No Deduction)`
      }));
      setEarnings(mapped);
    } catch (e) {
      console.error('Failed to fetch earnings:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const filteredEarnings = useMemo(() => {
    return earnings.filter((er) => {
      const search = params.search?.toLowerCase() || "";
      const vipLevel = params.vipLevel || "all";
      const dateFrom = params.dateFrom;
      const dateTo = params.dateTo;

      const matchesSearch =
        search === "" ||
        er.userName.toLowerCase().includes(search) ||
        er.userEmail.toLowerCase().includes(search) ||
        er.id.toLowerCase().includes(search);

      const matchesVip = vipLevel === "all" || er.vipLevel.toString() === vipLevel;

      let matchesDate = true;
      if (dateFrom || dateTo) {
        const erDate = new Date(er.dateTime);
        if (dateFrom) {
          const from = new Date(dateFrom);
          from.setHours(0, 0, 0, 0);
          matchesDate = matchesDate && erDate >= from;
        }
        if (dateTo) {
          const to = new Date(dateTo);
          to.setHours(23, 59, 59, 999);
          matchesDate = matchesDate && erDate <= to;
        }
      }

      return matchesSearch && matchesVip && matchesDate;
    });
  }, [earnings, params]);

  const updateFilter = (key: string, value: string) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setParams({ search: '', vipLevel: 'all', dateFrom: '', dateTo: '' });
  };

  const filterConfig = useMemo<FilterConfig[]>(() => {
    const sortedPlans = vipPlansData ? [...vipPlansData].sort((a, b) => a.level.localeCompare(b.level)) : [];
    return [
      { type: 'search', key: 'search', placeholder: 'Search by user, email, or txid...' },
      { 
        type: 'select', 
        key: 'vipLevel', 
        defaultLabel: 'All Levels',
        options: sortedPlans.map((p: any) => ({ label: p.level, value: p.id.toString() }))
      },
      { type: 'dateRange', fromKey: 'dateFrom', toKey: 'dateTo' }
    ];
  }, [vipPlansData]);

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
  const uniqueUsers = new Set(earnings.map(e => e.userEmail)).size;
  const avgEarnings = uniqueUsers > 0 ? totalEarnings / uniqueUsers : 0;

  // Find top earner
  const userEarningsMap = new Map<string, {name: string, total: number}>();
  earnings.forEach(e => {
    const current = userEarningsMap.get(e.userEmail) || {name: e.userName, total: 0};
    current.total += e.amount;
    userEarningsMap.set(e.userEmail, current);
  });
  let topEarner = { name: "N/A", total: 0 };
  userEarningsMap.forEach((val) => {
    if (val.total > topEarner.total) {
      topEarner = val;
    }
  });

  return (
    <AdminShell>
      <div className="w-full">
        {/* Header Options */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Earnings Overview
            </h1>
            <p className="mt-1.5 text-xs text-muted-2">
              Dashboard <span className="mx-1">&gt;</span> Earnings
            </p>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard
            label="Total Platform Deposits"
            value={`$${(financials?.totalPlatformDeposits || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            subtext="Global deposit volume"
            icon={Wallet}
          />
          <KpiCard
            label="Global Active Trade Capital"
            value={`$${(financials?.activeTradeCapital || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            subtext="Platform-wide VIP plan capital"
            icon={TrendingUp}
            iconClassName="text-white"
          />
          <KpiCard
            label="Gross Assets (Earnings)"
            value={`+$${(financials?.grossAssets || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            subtext="Calculated daily at 12 AM midnight"
            icon={TrendingUp}
            iconClassName="text-white"
          />
          <KpiCard
            label="Total Ambassador Earnings"
            value={`$${(financials?.minusBonuses || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            subtext="Total bonuses paid to ambassadors"
            icon={Users}
            iconClassName="text-success"
          />
          <KpiCard
            label="Total Admin Earnings"
            value={`$${(financials?.netBalance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            subtext="Net platform profit after bonuses"
            icon={Coins}
            iconClassName="text-purple-bright"
          />
        </div>

        {/* Filters */}
        <GenericFilters
          config={filterConfig}
          params={params}
          updateFilter={updateFilter}
          onReset={handleReset}
        />

        {/* Table */}
        <div className="mt-5">
          <EarningsTable 
            earnings={filteredEarnings} 
            vipPlans={vipPlansData || []} 
            onViewDetails={setViewingEarning} 
          />
        </div>
      </div>

      {viewingEarning && (
        <EarningDetailsModal
          earning={viewingEarning}
          onClose={() => setViewingEarning(null)}
        />
      )}
    </AdminShell>
  );
}
