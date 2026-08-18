"use client";

import { useState, useMemo, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { Users, UserCheck, DollarSign, TrendingUp, BadgePercent, Download, Calendar } from "lucide-react";
import type { ReferralRecord } from "@/types/admin";
import { ReferralsFilters } from "@/components/admin/referrals/ReferralsFilters";
import { ReferralsTable } from "@/components/admin/referrals/ReferralsTable";
import { webApi } from "@/lib/api";

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [vipLevel, setVipLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("");

  const fetchReferrals = async () => {
    setIsLoading(true);
    try {
      const data = await webApi.get('/admin/referrals');
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
  }, []);

  const filteredReferrals = useMemo(() => {
    return referrals.filter((ref) => {
      const matchesSearch =
        search === "" ||
        ref.userName.toLowerCase().includes(search.toLowerCase()) ||
        ref.userEmail.toLowerCase().includes(search.toLowerCase()) ||
        ref.id.toLowerCase().includes(search.toLowerCase());

      const matchesVip = vipLevel === "all" || ref.vipLevel.toString() === vipLevel;
      const matchesStatus = status === "all" || ref.status.toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesVip && matchesStatus;
    });
  }, [referrals, search, vipLevel, status]);

  const handleReset = () => {
    setSearch("");
    setVipLevel("all");
    setStatus("all");
    setDateRange("");
  };

  const totalReferrals = referrals.length;
  const activeReferrals = referrals.filter(r => r.status === 'Active').length;
  const totalCommission = referrals.reduce((sum, r) => sum + r.yourCommission, 0);

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl">
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard
            label="Total Referrals"
            value={totalReferrals.toLocaleString()}
            change=""
            positive={true}
            icon={Users}
            iconClassName="text-purple-bright"
            subtext=""
          />
          <KpiCard
            label="Active Referrals"
            value={activeReferrals.toLocaleString()}
            change=""
            positive={true}
            icon={UserCheck}
            iconClassName="text-sky-400"
          />
          <KpiCard
            label="Total Commission Earned"
            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalCommission)}
            change=""
            positive={true}
            icon={DollarSign}
            iconClassName="text-emerald-400"
          />
          <KpiCard
            label="Pending Commission"
            value="$0.00"
            change=""
            positive={true}
            icon={TrendingUp}
            iconClassName="text-amber-400"
          />
          <KpiCard
            label="Commission Rate"
            value="10%"
            icon={BadgePercent}
            iconClassName="text-purple-bright"
            subtext="Level 1 Rate"
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
          dateRange={dateRange}
          setDateRange={setDateRange}
          onFilter={() => {}}
          onReset={handleReset}
        />

        {/* Table */}
        <div className="mt-5">
          <ReferralsTable referrals={filteredReferrals} />
        </div>
      </div>
    </AdminShell>
  );
}
