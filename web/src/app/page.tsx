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

const depositRows = [
  {
    name: "Alex Rivera",
    id: "USR-10421",
    amount: "100 USDT",
    network: "TRC20",
    txid: "0x8f2a…91c4",
    status: "Completed" as const,
    date: "May 17, 09:24",
  },
  {
    name: "Mia Chen",
    id: "USR-10288",
    amount: "500 USDT",
    network: "ERC20",
    txid: "0x3bc1…77ae",
    status: "Pending" as const,
    date: "May 17, 08:51",
  },
  {
    name: "Noah Park",
    id: "USR-10014",
    amount: "250 USDT",
    network: "BEP20",
    txid: "0xad91…2f10",
    status: "Failed" as const,
    date: "May 16, 22:13",
  },
  {
    name: "Sara Kim",
    id: "USR-10903",
    amount: "1,000 USDT",
    network: "TRC20",
    txid: "0x71ee…c8b2",
    status: "Completed" as const,
    date: "May 16, 19:40",
  },
];

const withdrawalRows = [
  {
    name: "Jordan Lee",
    id: "USR-10811",
    amount: "200 USDT",
    network: "TRC20",
    txid: "0x9aa2…44d1",
    status: "Completed" as const,
    date: "May 17, 10:02",
  },
  {
    name: "Emily Ross",
    id: "USR-10644",
    amount: "75 USDT",
    network: "ERC20",
    txid: "0x12cd…90ff",
    status: "Pending" as const,
    date: "May 17, 07:18",
  },
  {
    name: "Chris Wong",
    id: "USR-10155",
    amount: "320 USDT",
    network: "BEP20",
    txid: "0x55b0…a1e9",
    status: "Rejected" as const,
    date: "May 16, 21:05",
  },
  {
    name: "Ava Torres",
    id: "USR-10772",
    amount: "150 USDT",
    network: "TRC20",
    txid: "0xee41…6c33",
    status: "Completed" as const,
    date: "May 16, 18:27",
  },
];

export default function Home() {
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
          value="100,254"
          change="+12.5%"
          icon={Users}
        />
        <KpiCard
          label="Total Deposits"
          value="$1,234,567.89"
          change="+18.7%"
          icon={ArrowDownToLine}
        />
        <KpiCard
          label="Total Withdrawals"
          value="$657,890.20"
          change="+8.3%"
          icon={ArrowUpFromLine}
        />
        <KpiCard
          label="Total Earnings Paid"
          value="$345,678.90"
          change="+15.2%"
          icon={Coins}
        />
        <KpiCard
          label="Active VIP Users"
          value="12,364"
          change="+11.4%"
          icon={Crown}
        />
        <KpiCard
          label="Pending Deposits"
          value="234"
          change="-4.3%"
          positive={false}
          icon={Hourglass}
          iconClassName="text-warning"
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <OverviewChart />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:col-span-5 xl:grid-cols-1">
          <StatusDonut
            title="Deposits by Status"
            total="1,234"
            slices={[
              { label: "Completed", value: 890, color: "#22c55e" },
              { label: "Pending", value: 234, color: "#f59e0b" },
              { label: "Failed", value: 110, color: "#ef4444" },
            ]}
          />
          <StatusDonut
            title="Withdrawals by Status"
            total="980"
            slices={[
              { label: "Completed", value: 720, color: "#22c55e" },
              { label: "Pending", value: 180, color: "#f59e0b" },
              { label: "Rejected", value: 80, color: "#ef4444" },
            ]}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <RecentTable title="Recent Deposits" rows={depositRows} />
        </div>
        <div className="xl:col-span-4">
          <RecentTable title="Recent Withdrawals" rows={withdrawalRows} />
        </div>
        <div className="grid gap-4 xl:col-span-4">
          <VipLevels />
          <SystemStats />
        </div>
      </div>
    </AdminShell>
  );
}
