"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { webApi } from "@/lib/api";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Crown,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Coins,
  Share2,
  Wallet,
  LifeBuoy,
  Bell,
  Settings,
  SlidersHorizontal,
  Shield,
  ScrollText,
  ExternalLink,
  Hexagon,
  Activity,
  MessageCircle,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: boolean | number;
};

function NavSection({ title, items }: { title: string; items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <div className="mt-5">
      <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.14em] text-muted-2 uppercase">
        {title}
      </p>
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                isActive
                  ? "bg-purple text-white"
                  : "text-muted hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition ${
                  isActive
                    ? "text-white"
                    : "text-purple-bright/80 group-hover:text-purple-bright"
                }`}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge === true ? (
                <span className="h-2 w-2 rounded-full bg-danger" />
              ) : typeof item.badge === 'number' && item.badge > 0 ? (
                <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard" || pathname === "/dashboard/";
  const [pendingDeposits, setPendingDeposits] = useState(0);
  const [pendingWithdrawals, setPendingWithdrawals] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0); 
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [deposits, withdrawals, messages] = await Promise.all([
          webApi.get('/deposits').catch(() => []),
          webApi.get('/withdrawals').catch(() => []),
          webApi.get('/messages/unread').catch(() => ({ count: 0 }))
        ]);
        const depCount = Array.isArray(deposits) ? deposits.filter((d: any) => d.status === 'Pending').length : 0;
        const withCount = Array.isArray(withdrawals) ? withdrawals.filter((w: any) => w.status === 'Pending').length : 0;
        setPendingDeposits(depCount);
        setPendingWithdrawals(withCount);
        if (messages?.count !== undefined) {
          setUnreadMessages(messages.count);
        }
      } catch (err) {
        console.error("Failed to fetch pending counts:", err);
      }
    };
    fetchCounts();
    // Refresh counts periodically
    const interval = setInterval(fetchCounts, 15000);
    return () => clearInterval(interval);
  }, []);

  const management: NavItem[] = [
    { label: "Users", href: "/dashboard/users", icon: Users },
    { label: "VIP Plans", href: "/dashboard/vip-plans", icon: Crown },
    { label: "Deposits", href: "/dashboard/deposits", icon: ArrowDownToLine, badge: pendingDeposits },
    { label: "Withdrawals", href: "/dashboard/withdrawals", icon: ArrowUpFromLine, badge: pendingWithdrawals },
    { label: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
    { label: "Earnings", href: "/dashboard/earnings", icon: Coins },
    { label: "Referrals", href: "/dashboard/referrals", icon: Share2 },
    { label: "Messages", href: "/dashboard/messages", icon: MessageCircle, badge: unreadMessages },
    { label: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: unreadNotifications },
  ];

  const settings: NavItem[] = [
    { label: "System Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const admin: NavItem[] = [
    { label: "Visualize", href: "/dashboard/visualize", icon: Activity },
  ];

  return (
    <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-border bg-bg-deep/90 px-3 py-4 lg:flex">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/[0.05]">
        <BrandLogo size={32} className="drop-shadow-[0_0_15px_rgba(123,44,255,0.4)]" />
        <div>
          <span className="text-sm font-bold tracking-[0.18em] text-white">EZTRADE</span>
          <span className="block text-[9px] font-semibold text-purple-bright tracking-widest uppercase mt-0.5">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto pb-4 pr-4">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
            isDashboard
              ? "bg-purple text-white"
              : "text-muted hover:bg-white/[0.04] hover:text-white"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        <NavSection title="Management" items={management} />
        <NavSection title="Settings" items={settings} />
        <NavSection title="Admin" items={admin} />
      </nav>

      <a
        href="#"
        className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-purple-bright/40 bg-purple/10 px-3 py-2.5 text-sm font-medium text-purple-bright transition hover:bg-purple/20"
      >
        View Website
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </aside>
  );
}
