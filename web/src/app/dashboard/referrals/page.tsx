"use client";

import { useState, useMemo, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { Users, UserCheck, DollarSign, TrendingUp, BadgePercent, Download, Calendar, Wallet, Coins } from "lucide-react";
import type { ReferralRecord } from "@/types/admin";
import { GenericFilters, FilterConfig } from "@/components/admin/GenericFilters";
import { ReferralsTable } from "@/components/admin/referrals/ReferralsTable";
import { useApi } from "@/hooks/useApi";
import { useAdminFilters } from "@/hooks/useAdminFilters";

export default function ReferralsPage() {
  const { data: vipPlansData } = useApi('/vip-plans');

  const { data: rawReferrals, isLoading, params, updateFilter, resetFilters } = useAdminFilters('/admin/referrals', {
    search: '',
    vipLevel: 'all',
    dateFrom: '',
    dateTo: ''
  });

  const referrals = useMemo(() => {
    if (!rawReferrals) return [];
    return rawReferrals.map((r: any) => ({
      ...r,
      registeredAt: new Date(r.registeredAt).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }),
    }));
  }, [rawReferrals]);

  const filterConfig = useMemo<FilterConfig[]>(() => {
    const sortedPlans = vipPlansData ? [...vipPlansData].sort((a, b) => a.level.localeCompare(b.level)) : [];
    return [
      { type: 'search', key: 'search', placeholder: 'Search by user, email or phone...' },
      { 
        type: 'select', 
        key: 'vipLevel', 
        defaultLabel: 'All Levels',
        options: sortedPlans.map((p: any) => ({ label: p.level, value: p.id.toString() }))
      },
      { type: 'dateRange', fromKey: 'dateFrom', toKey: 'dateTo' }
    ];
  }, [vipPlansData]);

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
        <GenericFilters
          config={filterConfig}
          params={params}
          updateFilter={updateFilter}
          onReset={resetFilters}
        />

        {/* Table */}
        <div className="mt-5">
          <ReferralsTable referrals={referrals} vipPlans={vipPlansData || []} />
        </div>
      </div>
    </AdminShell>
  );
}
