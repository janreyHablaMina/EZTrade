"use client";

import { useState, useMemo, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { Users, UserCheck, DollarSign, TrendingUp, BadgePercent, Download, Calendar, Wallet, Coins } from "lucide-react";
import type { ReferralRecord } from "@/types/admin";
import { ReferralsFilters } from "@/components/admin/referrals/ReferralsFilters";
import { ReferralsTable } from "@/components/admin/referrals/ReferralsTable";
import { webApi } from "@/lib/api";
import { useApi } from "@/hooks/useApi";

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [vipLevel, setVipLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const { data: vipPlansData } = useApi('/vip-plans');

  const fetchReferrals = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (vipLevel !== "all") params.append("vipLevel", vipLevel);
      if (status !== "all") params.append("status", status);
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);

      const data = await webApi.get(`/admin/referrals?${params.toString()}`);
      const mapped = data.map((r: any) => ({
        ...r,
        registeredAt: new Date(r.registeredAt).toLocaleString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
      }));
      setReferrals(mapped);
    } catch (e) {
      console.error('Failed to fetch referrals:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [search, vipLevel, status, dateFrom, dateTo]);

  const handleReset = () => {
    setSearch("");
    setVipLevel("all");
    setStatus("all");
    setDateFrom("");
    setDateTo("");
  };

  const totalReferrals = referrals.length;
  const activeReferrals = referrals.filter(r => r.status === 'Active').length;
  const totalDeposited = referrals.reduce((sum, r) => sum + (r.totalDeposited || 0), 0);
  const totalBonuses = referrals.reduce((sum, r) => sum + (r.totalBonusGiven || 0), 0);
  const totalAmbassadorDeductions = referrals.reduce((sum, r) => sum + (r.ambassadorDeduction || 0), 0);
  const totalAdminDeductions = totalBonuses - totalAmbassadorDeductions;
  const totalAdminEarnings = totalDeposited - totalAdminDeductions;

  return (
    <AdminShell>
      <div className="w-full">
        {/* Header Options */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Referrals
            </h1>
            <p className="mt-1.5 text-xs text-muted-2">
              Dashboard <span className="mx-1">&gt;</span> Referrals
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Total Deposited"
            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalDeposited)}
            change=""
            positive={true}
            icon={Wallet}
            iconClassName="text-amber-400"
          />
          <KpiCard
            label="Total Referral Bonuses Given"
            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalBonuses)}
            change=""
            positive={true}
            icon={TrendingUp}
            iconClassName="text-sky-400"
          />
          <KpiCard
            label="Total Ambassador Deductions"
            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAmbassadorDeductions)}
            change=""
            positive={true}
            icon={Users}
            iconClassName="text-danger"
          />
          <KpiCard
            label="Total Admin Deductions"
            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAdminDeductions)}
            change=""
            positive={true}
            icon={Coins}
            iconClassName="text-danger"
          />
        </div>

        {/* Filters */}
        <ReferralsFilters
          search={search}
          setSearch={setSearch}
          vipLevel={vipLevel}
          setVipLevel={setVipLevel}
          status={status}
          setStatus={setStatus}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          onReset={handleReset}
        />

        {/* Table */}
        <div className="mt-5">
          <ReferralsTable referrals={referrals} vipPlans={vipPlansData || []} />
        </div>
      </div>
    </AdminShell>
  );
}
