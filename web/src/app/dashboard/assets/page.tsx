"use client";

import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { Wallet, UserCheck, DollarSign, ArrowLeftRight, Download, ArrowRightLeft } from "lucide-react";
import { initialAssets, recentActivities } from "@/lib/mock-data/assetsData";
import { AssetsCharts } from "@/components/admin/assets/AssetsCharts";
import { AssetsTable } from "@/components/admin/assets/AssetsTable";
import { RecentActivities } from "@/components/admin/assets/RecentActivities";

export default function AssetsPage() {
  const [search, setSearch] = useState("");

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl">
        {/* Header Options */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Assets Overview
            </h1>
            <p className="mt-1.5 text-xs text-muted-2">
              Dashboard <span className="mx-1">&gt;</span> Assets
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-border bg-card-elevated hover:bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white transition">
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-purple hover:bg-purple-bright px-4 py-2.5 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(123,44,255,0.25)] transition">
              <ArrowRightLeft className="h-3.5 w-3.5" />
              Transfer Assets
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-5">
          <KpiCard
            label="Total Assets Value"
            value="$245,678.90"
            change="+18.6%"
            positive={true}
            icon={Wallet}
            iconClassName="text-purple-bright"
          />
          <div className="rounded-2xl border border-border bg-card p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/15 ring-1 ring-teal-500/25">
              <span className="text-[13px] font-bold text-teal-400">T</span>
            </div>
            <p className="text-[11px] text-muted">Total Assets (USDT)</p>
            <p className="mt-0.5 text-base font-semibold tracking-tight text-white sm:text-lg">
              245,678.90 USDT
            </p>
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-success">
              <TrendingUpIcon />
              <span>+16.8%</span>
              <span className="font-normal text-muted-2">vs last 7 days</span>
            </div>
          </div>
          <KpiCard
            label="Total Users Holding Assets"
            value="1,256"
            change="+14.2%"
            positive={true}
            icon={UserCheck}
            iconClassName="text-sky-400"
          />
          <KpiCard
            label="Total Profit Earned"
            value="$123,456.78"
            change="+17.3%"
            positive={true}
            icon={DollarSign}
            iconClassName="text-amber-400"
          />
          <KpiCard
            label="Total Transfers (All)"
            value="2,845"
            change="+20.1%"
            positive={true}
            icon={ArrowLeftRight}
            iconClassName="text-purple-bright"
          />
        </div>

        {/* Charts Middle Section */}
        <AssetsCharts />

        {/* Bottom Section: Table + Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_350px] gap-5 h-auto lg:h-[600px]">
          <AssetsTable 
            assets={initialAssets} 
            search={search} 
            setSearch={setSearch} 
          />
          <RecentActivities activities={recentActivities} />
        </div>
      </div>
    </AdminShell>
  );
}

function TrendingUpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
      <polyline points="16 7 22 7 22 13"></polyline>
    </svg>
  );
}
