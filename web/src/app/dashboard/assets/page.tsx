"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { Wallet, UserCheck, ArrowDownCircle, ArrowUpCircle, Download, ArrowRightLeft } from "lucide-react";
import { AssetsTable } from "@/components/admin/assets/AssetsTable";
import { webApi } from "@/lib/api";

export default function AssetsPage() {
  const [search, setSearch] = useState("");
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const data = await webApi.get('/admin/assets');
      setAssets(data);
    } catch (e) {
      console.error('Failed to fetch assets:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const totalPlatformBalance = assets.reduce((sum, a) => sum + parseFloat(a.balance), 0);
  const usersWithBalance = assets.filter(a => parseFloat(a.balance) > 0).length;
  const totalPlatformDeposits = assets.reduce((sum, a) => sum + parseFloat(a.totalDeposited), 0);
  const totalPlatformWithdrawals = assets.reduce((sum, a) => sum + parseFloat(a.totalWithdrawn), 0);

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl">
        {/* Header Options */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              User Assets
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-5">
          <KpiCard
            label="Total Platform Assets"
            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPlatformBalance)}
            change=""
            positive={true}
            icon={Wallet}
            iconClassName="text-purple-bright"
            subtext="Sum of all user balances"
          />
          <KpiCard
            label="Users Holding Assets"
            value={usersWithBalance.toLocaleString()}
            change=""
            positive={true}
            icon={UserCheck}
            iconClassName="text-sky-400"
          />
          <KpiCard
            label="Lifetime User Deposits"
            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPlatformDeposits)}
            change=""
            positive={true}
            icon={ArrowDownCircle}
            iconClassName="text-emerald-400"
          />
          <KpiCard
            label="Lifetime User Withdrawals"
            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPlatformWithdrawals)}
            change=""
            positive={true}
            icon={ArrowUpCircle}
            iconClassName="text-amber-400"
          />
        </div>

        {/* Bottom Section: Table Only */}
        <div className="h-auto mt-5">
          <AssetsTable 
            assets={assets} 
            search={search} 
            setSearch={setSearch} 
          />
        </div>
      </div>
    </AdminShell>
  );
}
