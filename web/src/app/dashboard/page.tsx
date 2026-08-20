"use client";

import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Coins,
  Crown,
  Hourglass,
  Users,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { OverviewChart } from "@/components/admin/OverviewChart";
import { RecentTable } from "@/components/admin/RecentTable";
import { StatusDonut } from "@/components/admin/StatusDonut";
import { SystemStats } from "@/components/admin/SystemStats";
import { VipLevels } from "@/components/admin/VipLevels";
import { useAdminStats } from "@/hooks/useAdminStats";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function formatDate(dateString: string) {
  const d = new Date(dateString);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function Home() {
  const { stats, isLoading } = useAdminStats();

  if (isLoading || !stats) {
    return (
      <AdminShell>
        <div className="flex h-64 items-center justify-center">
          <p className="text-white">Loading dashboard stats...</p>
        </div>
      </AdminShell>
    );
  }

  const depositRows = stats.recent_deposits.map((d: any) => ({
    name: d.user?.name || "Unknown",
    id: `USR-${d.user_id}`,
    amount: `${d.amount} USDT`,
    network: d.network,
    txid: d.txid ? `${d.txid.slice(0, 6)}…${d.txid.slice(-4)}` : "Pending",
    status: d.status,
    date: formatDate(d.created_at),
  }));

  const withdrawalRows = stats.recent_withdrawals.map((w: any) => ({
    name: w.user?.name || "Unknown",
    id: `USR-${w.user_id}`,
    amount: `${w.amount} USDT`,
    network: w.network,
    txid: w.txid ? `${w.txid.slice(0, 6)}…${w.txid.slice(-4)}` : "Pending",
    status: w.status,
    date: formatDate(w.created_at),
  }));

  return (
    <AdminShell>
      <div className="mb-5">
        <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          Overview of users, cashflow, VIP activity, and system health.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard
          label="Total Users"
          value={stats.total_users.toLocaleString()}
          change=""
          icon={Users}
        />
        <KpiCard
          label="Total Deposits"
          value={formatCurrency(stats.total_deposits)}
          change=""
          icon={ArrowDownToLine}
        />
        <KpiCard
          label="Total Trade Capital"
          value={formatCurrency(stats.admin_trade_capital || 0)}
          change=""
          icon={Crown}
        />
        <KpiCard
          label="Gross Income"
          value={formatCurrency(stats.admin_gross_income || 0)}
          change=""
          icon={Coins}
        />
        <KpiCard
          label="Total Deduction"
          value={formatCurrency(stats.admin_total_deduction || 0)}
          change=""
          positive={false}
          icon={ArrowUpFromLine}
          iconClassName="text-danger"
        />
        <KpiCard
          label="Net Income"
          value={formatCurrency(stats.admin_net_income || 0)}
          change=""
          positive={(stats.admin_net_income || 0) >= 0}
          icon={Coins}
          iconClassName={(stats.admin_net_income || 0) >= 0 ? "text-emerald-400" : "text-danger"}
        />
      </div>

      <div className="mt-4 grid items-stretch gap-4 xl:grid-cols-12">
        <div className="h-full xl:col-span-7">
          <OverviewChart />
        </div>
        <div className="grid h-full gap-4 sm:grid-cols-2 xl:col-span-5 xl:grid-cols-1 xl:grid-rows-2">
          <StatusDonut
            title="Deposits by Status"
            total={Object.values(stats.deposits_by_status).reduce((a, b) => a + b, 0).toLocaleString()}
            slices={[
              { label: "Completed", value: stats.deposits_by_status.Completed, color: "#22c55e" },
              { label: "Pending", value: stats.deposits_by_status.Pending, color: "#f59e0b" },
              { label: "Failed", value: stats.deposits_by_status.Failed, color: "#ef4444" },
            ]}
          />
          <StatusDonut
            title="Withdrawals by Status"
            total={Object.values(stats.withdrawals_by_status).reduce((a, b) => a + b, 0).toLocaleString()}
            slices={[
              { label: "Completed", value: stats.withdrawals_by_status.Completed, color: "#22c55e" },
              { label: "Pending", value: stats.withdrawals_by_status.Pending, color: "#f59e0b" },
              { label: "Rejected", value: stats.withdrawals_by_status.Rejected, color: "#ef4444" },
            ]}
          />
        </div>
      </div>

      <div className="mt-4 grid items-stretch gap-4 md:grid-cols-2">
        <RecentTable title="Recent Deposits" rows={depositRows} />
        <RecentTable title="Recent Withdrawals" rows={withdrawalRows} />
        <VipLevels levels={stats.vip_levels} />
        <SystemStats totalTrades={stats.system_stats.total_trades} />
      </div>
    </AdminShell>
  );
}
