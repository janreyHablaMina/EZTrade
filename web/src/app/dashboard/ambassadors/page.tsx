"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { Users, UserCheck, DollarSign, TrendingUp, Download, Calendar, UserPlus } from "lucide-react";
import type { AmbassadorRecord } from "@/lib/mock-data/ambassadorsData";
import { AmbassadorsTable } from "@/components/admin/ambassadors/AmbassadorsTable";
import { webApi } from "@/lib/api";

export default function AmbassadorsPage() {
  const [ambassadors, setAmbassadors] = useState<AmbassadorRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAmbassadors = async () => {
    setIsLoading(true);
    try {
      const data = await webApi.get('/admin/ambassadors');
      const mapped = data.map((a: any) => ({
        ...a,
        registeredAt: new Date(a.registeredAt).toLocaleString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
      }));
      setAmbassadors(mapped);
    } catch (e) {
      console.error('Failed to fetch ambassadors:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbassadors();
  }, []);

  const totalDownlineSize = ambassadors.reduce((acc, curr) => acc + curr.downlineCount, 0);
  const totalAssets = ambassadors.reduce((acc, curr) => acc + curr.totalDownlineAssets, 0);
  const totalAdminEarnings = ambassadors.reduce((acc, curr) => acc + curr.dailyEarnings, 0);

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl">
        {/* Header Options */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Ambassadors
            </h1>
            <p className="mt-1.5 text-xs text-muted-2">
              Dashboard <span className="mx-1">&gt;</span> Ambassadors
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-purple px-4 py-2.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(123,44,255,0.3)] transition hover:bg-purple-hover hover:shadow-[0_6px_16px_rgba(123,44,255,0.4)]">
              <UserPlus className="h-3.5 w-3.5" />
              Register Ambassador
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
            label="Total Ambassadors"
            value={ambassadors.length.toString()}
            change=""
            positive={true}
            icon={Users}
            iconClassName="text-purple-bright"
            subtext="Active & Inactive"
          />
          <KpiCard
            label="Total Downline Users"
            value={totalDownlineSize.toLocaleString()}
            change=""
            positive={true}
            icon={UserCheck}
            iconClassName="text-sky-400"
          />
          <KpiCard
            label="Total Downline Assets"
            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAssets)}
            change=""
            positive={true}
            icon={DollarSign}
            iconClassName="text-emerald-400"
          />
          <KpiCard
            label="Daily Admin Earnings (5%)"
            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAdminEarnings)}
            change=""
            positive={true}
            icon={TrendingUp}
            iconClassName="text-amber-400"
            subtext="Total across all downlines"
          />
        </div>

        {/* Table */}
        <div className="mt-5">
          <AmbassadorsTable ambassadors={ambassadors} />
        </div>
      </div>
    </AdminShell>
  );
}
