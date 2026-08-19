"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { webApi } from "@/lib/api";
import { Calendar } from "lucide-react";
import { useState, useEffect } from "react";

export default function VisualizePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [ambassadorStats, setAmbassadorStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [adminRes, ambRes] = await Promise.all([
          webApi.get('/admin/visualize-stats'),
          webApi.get('/admin/ambassadors/10')
        ]);
        setAdminStats(adminRes);
        setAmbassadorStats(ambRes);
      } catch (e) {
        console.error("Failed to fetch visualization stats", e);
      }
    };
    fetchStats();
  }, [refreshKey]);

  const simulateMidnight = async () => {
    try {
      await webApi.post('/admin/simulate-midnight');
      setRefreshKey(prev => prev + 1);
      alert("Midnight simulation complete!");
    } catch (e) {
      alert("Failed to simulate midnight.");
    }
  };

  return (
    <AdminShell>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Visualize Sandbox
          </h1>
          <p className="mt-1.5 text-xs text-muted-2">
            Dashboard <span className="mx-1">&gt;</span> Visualize
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={simulateMidnight}
            className="flex items-center gap-2 rounded-xl bg-orange-500/10 px-4 py-2.5 text-xs font-semibold text-orange-400 border border-orange-500/20 transition hover:bg-orange-500/20">
            <Calendar className="h-4 w-4" />
            Simulate 12 AM
          </button>
        </div>
      </div>
      
      {adminStats && ambassadorStats && (
        <div className="mb-8 rounded-xl border border-border bg-card-elevated p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-white mb-4">Global vs Downline Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            
            {/* Total Deposit */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-2">Total Deposit</h3>
              <div className="flex flex-col gap-2 rounded-lg bg-bg-deep p-4 border border-white/[0.05]">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-2">Global (Admin)</span>
                  <span className="text-sm font-bold text-white">${adminStats.total_deposit.toLocaleString("en-US", {minimumFractionDigits: 2})}</span>
                </div>
                <div className="h-px w-full bg-white/[0.05]"></div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-2">Downline (Ambassador)</span>
                  <span className="text-sm font-bold text-white">${(ambassadorStats.financials?.totalDownlineDeposits || 0).toLocaleString("en-US", {minimumFractionDigits: 2})}</span>
                </div>
              </div>
            </div>

            {/* Trading Capital */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-2">Trading Capital</h3>
              <div className="flex flex-col gap-2 rounded-lg bg-bg-deep p-4 border border-white/[0.05]">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-2">Global Active Capital</span>
                  <span className="text-sm font-bold text-white">${adminStats.active_capital.toLocaleString("en-US", {minimumFractionDigits: 2})}</span>
                </div>
                <div className="h-px w-full bg-white/[0.05]"></div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-2">Downline Active Capital</span>
                  <span className="text-sm font-bold text-white">${(ambassadorStats.financials?.activeTradeCapital || 0).toLocaleString("en-US", {minimumFractionDigits: 2})}</span>
                </div>
              </div>
            </div>

            {/* Gross Income */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-2">Gross Income</h3>
              <div className="flex flex-col gap-2 rounded-lg bg-bg-deep p-4 border border-white/[0.05]">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-2">Admin Gross Income</span>
                  <span className="text-sm font-bold text-white">${(Number(adminStats.net_balance) + Number(adminStats.minus_bonuses)).toLocaleString("en-US", {minimumFractionDigits: 2})}</span>
                </div>
                <div className="h-px w-full bg-white/[0.05]"></div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-2">Ambassador Gross Income</span>
                  <span className="text-sm font-bold text-white">${(ambassadorStats.financials?.grossAssets || 0).toLocaleString("en-US", {minimumFractionDigits: 2})}</span>
                </div>
              </div>
            </div>

            {/* Minus Bonuses */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-2">Minus Bonuses</h3>
              <div className="flex flex-col gap-2 rounded-lg bg-bg-deep p-4 border border-white/[0.05]">
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${adminStats.minus_bonuses > 0 ? "text-danger" : "text-emerald-400"}`}>Global Minus Bonuses</span>
                  <span className={`text-sm font-bold ${adminStats.minus_bonuses > 0 ? "text-danger" : "text-emerald-400"}`}>
                    {adminStats.minus_bonuses > 0 ? "-" : ""}${adminStats.minus_bonuses.toLocaleString("en-US", {minimumFractionDigits: 2})}
                  </span>
                </div>
                <div className="h-px w-full bg-white/[0.05]"></div>
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${(ambassadorStats.financials?.minusBonuses || 0) > 0 ? "text-danger" : "text-emerald-400"}`}>Ambassador Minus Bonuses</span>
                  <span className={`text-sm font-bold ${(ambassadorStats.financials?.minusBonuses || 0) > 0 ? "text-danger" : "text-emerald-400"}`}>
                    {(ambassadorStats.financials?.minusBonuses || 0) > 0 ? "-" : ""}${(ambassadorStats.financials?.minusBonuses || 0).toLocaleString("en-US", {minimumFractionDigits: 2})}
                  </span>
                </div>
              </div>
            </div>

            {/* Net Income */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-2">Net Income</h3>
              <div className="flex flex-col gap-2 rounded-lg bg-bg-deep p-4 border border-white/[0.05]">
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${adminStats.net_balance < 0 ? "text-danger" : "text-emerald-400"}`}>Admin Net Balance</span>
                  <span className={`text-sm font-bold ${adminStats.net_balance < 0 ? "text-danger" : "text-emerald-400"}`}>
                    {adminStats.net_balance < 0 ? "-" : ""}${Math.abs(adminStats.net_balance).toLocaleString("en-US", {minimumFractionDigits: 2})}
                  </span>
                </div>
                <div className="h-px w-full bg-white/[0.05]"></div>
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${(ambassadorStats.financials?.netBalance || 0) < 0 ? "text-danger" : "text-emerald-400"}`}>Ambassador Net Balance</span>
                  <span className={`text-sm font-bold ${(ambassadorStats.financials?.netBalance || 0) < 0 ? "text-danger" : "text-emerald-400"}`}>
                    {(ambassadorStats.financials?.netBalance || 0) < 0 ? "-" : ""}${Math.abs(ambassadorStats.financials?.netBalance || 0).toLocaleString("en-US", {minimumFractionDigits: 2})}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </AdminShell>
  );
}
