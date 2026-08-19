"use client";

import { KpiCard } from "@/components/admin/KpiCard";
import { Users, DollarSign, Activity, Link as LinkIcon, Share2, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { webApi } from "@/lib/api";

export function AmbassadorDashboard({ ambassadorId }: { ambassadorId?: number }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!ambassadorId) return;
    const fetchAmbassador = async () => {
      try {
        const [ambData, downlineData, earningsData] = await Promise.all([
          webApi.get(`/admin/ambassadors/${ambassadorId}`),
          webApi.get(`/admin/ambassadors/${ambassadorId}/downline`),
          webApi.get(`/admin/ambassadors/${ambassadorId}/earnings`)
        ]);
        
        setData({
          name: ambData.name,
          referralCode: ambData.referralCode,
          referralLink: `https://eztrade.app/ref/${ambData.referralCode}`,
          totalDownline: ambData.downlineCount,
          activeDownline: downlineData.filter((d: any) => d.status === 'Active').length,
          downlineAssets: ambData.financials?.activeTradeCapital || 0,
          dailyEarnings: ambData.financials?.grossAssets || 0,
          downlineUsers: downlineData.map((d: any) => ({
            id: `U${d.id}`,
            name: d.name,
            deposits: d.vip_plan ? d.vip_plan.min_deposit : 0,
            joinDate: new Date(d.created_at).toLocaleDateString(),
            level: 1
          }))
        });
      } catch (e) {
        console.error("Failed to fetch ambassador preview data", e);
      }
    };
    fetchAmbassador();
  }, [ambassadorId]);

  // Mock data as fallback for the Ambassador view
  const ambassadorData = data || {
    name: "Alex Johnson",
    referralCode: "ALEX15K",
    referralLink: "https://eztrade.app/ref/ALEX15K",
    totalDownline: 15,
    activeDownline: 12,
    downlineAssets: 15000.0,
    dailyEarnings: 750.0,
    downlineUsers: [
      { id: "U1", name: "David S.", deposits: 5000, joinDate: "May 15, 2024", level: 1 },
      { id: "U2", name: "Sarah M.", deposits: 3000, joinDate: "May 16, 2024", level: 1 },
      { id: "U3", name: "Tom K.", deposits: 2000, joinDate: "May 17, 2024", level: 2 },
      { id: "U4", name: "Emma L.", deposits: 5000, joinDate: "May 18, 2024", level: 3 },
    ]
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Welcome & Link Section */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card-elevated p-6 md:flex-row md:items-center md:justify-between shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-white">Welcome, {ambassadorData.name}</h2>
          <p className="mt-1 text-sm text-muted-2">Ambassador Dashboard</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-2">Your Referral Link</p>
          <div className="flex items-center gap-2 rounded-lg bg-bg-deep px-3 py-2 border border-white/[0.05]">
            <LinkIcon className="h-4 w-4 text-purple-bright" />
            <span className="text-sm font-mono text-white/90 select-all">{ambassadorData.referralLink}</span>
            <button className="ml-2 rounded-md p-1.5 hover:bg-white/10 text-muted-2 hover:text-white transition">
              <Copy className="h-4 w-4" />
            </button>
            <button className="rounded-md bg-purple/20 px-3 py-1.5 text-xs font-semibold text-purple-bright hover:bg-purple/30 transition">
              Share
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Downline Users"
          value={ambassadorData.totalDownline.toString()}
          change="+3 this week"
          positive={true}
          icon={Users}
          iconClassName="text-purple-bright"
        />
        <KpiCard
          label="Active Trading Users"
          value={ambassadorData.activeDownline.toString()}
          change="80% active"
          positive={true}
          icon={Activity}
          iconClassName="text-sky-400"
        />
        <KpiCard
          label="Downline Traded Assets"
          value={`$${ambassadorData.downlineAssets.toLocaleString()}`}
          change="+15% this week"
          positive={true}
          icon={DollarSign}
          iconClassName="text-emerald-400"
        />
        <KpiCard
          label="Daily Distribution (5%)"
          value={`$${ambassadorData.dailyEarnings.toLocaleString()}`}
          change="+$45 today"
          positive={true}
          icon={Share2}
          iconClassName="text-amber-400"
        />
      </div>

      {/* Downline Tree / List */}
      <div className="rounded-xl border border-border bg-card-elevated shadow-sm overflow-hidden">
        <div className="border-b border-white/[0.05] p-5">
          <h3 className="text-sm font-semibold text-white">Your Downline Structure</h3>
          <p className="mt-1 text-xs text-muted-2">Users who registered through your network</p>
        </div>
        <div className="p-0">
          <table className="w-full text-left text-sm text-white">
            <thead className="bg-bg-deep/50 text-xs font-medium text-muted-2">
              <tr>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Level (Tier)</th>
                <th className="px-5 py-3 text-right">Deposited Assets</th>
                <th className="px-5 py-3 text-right">Daily Return (5%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {ambassadorData.downlineUsers.map((user: any, idx: number) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition">
                  <td className="px-5 py-4 flex items-center gap-3">
                     <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-xs font-medium text-sky-400 border border-sky-500/20">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-medium text-white">{user.name}</span>
                      <span className="block text-[11px] text-muted-2">Joined {user.joinDate}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/70 border border-white/10">
                      Level {user.level}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="font-medium text-emerald-400">${user.deposits.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4 text-right font-medium text-amber-400">
                    ${(user.deposits * 0.05).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
