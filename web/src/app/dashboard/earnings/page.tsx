"use client";

import { useState, useMemo, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { Wallet, Users, Coins, Download, Calendar, User, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import type { EarningRecord } from "@/types/admin";
import { EarningsFilters } from "@/components/admin/earnings/EarningsFilters";
import { EarningsTable } from "@/components/admin/earnings/EarningsTable";
import { webApi } from "@/lib/api";

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<EarningRecord[]>([]);
  const [financials, setFinancials] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [vipLevel, setVipLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("");

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
        type: e.type,
        source: `Deposit ($${e.deposit_amount})`,
        amount: parseFloat(e.amount_earned) || 0,
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
      const matchesSearch =
        search === "" ||
        er.userName.toLowerCase().includes(search.toLowerCase()) ||
        er.userEmail.toLowerCase().includes(search.toLowerCase()) ||
        er.id.toLowerCase().includes(search.toLowerCase());

      const matchesType = type === "all" || er.type === type;
      const matchesVip = vipLevel === "all" || er.vipLevel.toString() === vipLevel;
      const matchesStatus = status === "all" || er.status.toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesType && matchesVip && matchesStatus;
    });
  }, [earnings, search, type, vipLevel, status]);

  const handleReset = () => {
    setSearch("");
    setType("all");
    setVipLevel("all");
    setStatus("all");
    setDateRange("");
  };

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
      <div className="mx-auto max-w-7xl">
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
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-purple/10 px-4 py-2.5 text-xs font-semibold text-purple-bright border border-purple/20 transition hover:bg-purple/20">
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-2 pointer-events-none" />
              <input
                type="text"
                placeholder="May 11, 2024 - May 18, 2024"
                className="w-56 rounded-xl border border-border bg-card-elevated py-2.5 pl-10 pr-4 text-xs text-white placeholder-muted-2 outline-none focus:border-border-strong transition cursor-pointer"
              />
            </div>
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
        <EarningsFilters
          search={search}
          setSearch={setSearch}
          type={type}
          setType={setType}
          vipLevel={vipLevel}
          setVipLevel={setVipLevel}
          status={status}
          setStatus={setStatus}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onFilter={() => {}}
          onReset={handleReset}
        />

        {/* Table */}
        <div className="mt-5">
          <EarningsTable earnings={filteredEarnings} />
        </div>
      </div>
    </AdminShell>
  );
}
