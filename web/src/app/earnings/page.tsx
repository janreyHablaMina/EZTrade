"use client";

import { useState, useMemo } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { Wallet, Users, Coins, Download, Calendar, User } from "lucide-react";
import { initialEarnings, type EarningRecord } from "@/components/admin/earnings/earningsData";
import { EarningsFilters } from "@/components/admin/earnings/EarningsFilters";
import { EarningsTable } from "@/components/admin/earnings/EarningsTable";

export default function EarningsPage() {
  const [earnings] = useState<EarningRecord[]>(initialEarnings);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [vipLevel, setVipLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("");

  const filteredEarnings = useMemo(() => {
    return earnings.filter((er) => {
      const matchesSearch =
        search === "" ||
        er.userName.toLowerCase().includes(search.toLowerCase()) ||
        er.userEmail.toLowerCase().includes(search.toLowerCase()) ||
        er.id.toLowerCase().includes(search.toLowerCase());

      const matchesType = type === "all" || er.type === type;
      const matchesVip = vipLevel === "all" || er.vipLevel.toString() === vipLevel;
      const matchesStatus = status === "all" || er.status === status;

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
            label="Total Earnings"
            value="$123,456.78"
            change="+18.6%"
            positive={true}
            icon={Wallet}
            iconClassName="text-purple-bright"
            subtext=""
          />
          <KpiCard
            label="Total Users Earned"
            value="4,562"
            change="+15.2%"
            positive={true}
            icon={Users}
            iconClassName="text-emerald-400"
            subtext=""
          />
          <KpiCard
            label="Average Daily Earnings"
            value="$17,636.68"
            change="+12.7%"
            positive={true}
            icon={Coins}
            iconClassName="text-amber-400"
            subtext=""
          />

          {/* Custom Card: Top Earner */}
          <div className="rounded-2xl border border-border bg-card p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 ring-1 ring-sky-500/25">
                <User className="h-4 w-4 text-sky-400" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-muted">Top Earner</p>
                <p className="mt-0.5 text-base font-semibold tracking-tight text-white">John Smith</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-lg font-bold text-white">$2,456.78</p>
              <p className="text-[11px] text-muted-2">Total Earnings</p>
            </div>
          </div>

          {/* Custom Card: Profit Distribution */}
          <div className="rounded-2xl border border-border bg-card p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple/15 ring-1 ring-purple-bright/25">
                <div className="h-4 w-4 rounded-full border-2 border-purple-bright border-t-transparent animate-spin-slow"></div>
              </div>
              <p className="text-[11px] text-muted">Profit Distribution</p>
            </div>
            
            <div className="flex flex-col gap-2 mt-auto">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-muted-2">Trading Profit</span>
                  <span className="text-white font-medium">85.4%</span>
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: "85.4%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-muted-2">Referral Bonus</span>
                  <span className="text-white font-medium">14.6%</span>
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-purple-bright rounded-full" style={{ width: "14.6%" }}></div>
                </div>
              </div>
            </div>
          </div>
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
