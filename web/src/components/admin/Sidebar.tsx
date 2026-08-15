"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: boolean;
};

const management: NavItem[] = [
  { label: "Users", href: "/users", icon: Users },
  { label: "VIP Plans", href: "/vip-plans", icon: Crown },
  { label: "Deposits", href: "/deposits", icon: ArrowDownToLine },
  { label: "Withdrawals", href: "/withdrawals", icon: ArrowUpFromLine },
  { label: "Transactions", href: "#transactions", icon: ArrowLeftRight },
  { label: "Earnings", href: "#earnings", icon: Coins },
  { label: "Referrals", href: "#referrals", icon: Share2 },
  { label: "Assets", href: "#assets", icon: Wallet },
];

const support: NavItem[] = [
  { label: "Support Tickets", href: "#support", icon: LifeBuoy },
  { label: "Notifications", href: "#notifications", icon: Bell, badge: true },
];

const settings: NavItem[] = [
  { label: "System Settings", href: "#system-settings", icon: Settings },
  { label: "General Settings", href: "#general-settings", icon: SlidersHorizontal },
];

const admin: NavItem[] = [
  { label: "Admin Users", href: "#admin-users", icon: Shield },
  { label: "Audit Logs", href: "#audit-logs", icon: ScrollText },
];

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
                  ? "bg-purple text-white shadow-[0_8px_24px_rgba(123,44,255,0.35)]"
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
              {item.badge ? (
                <span className="h-2 w-2 rounded-full bg-danger shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
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
  const isDashboard = pathname === "/" || pathname === "/admin";

  return (
    <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-border bg-bg-deep/90 px-3 py-4 lg:flex">
      <div className="mb-6 flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple/20 ring-1 ring-purple-bright/40">
          <Hexagon className="h-5 w-5 text-purple-bright" strokeWidth={2.2} />
        </div>
        <div>
          <p className="text-sm font-bold tracking-[0.18em] text-white">EZTRADE</p>
          <p className="text-[10px] tracking-wide text-muted-2">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto pb-4">
        <Link
          href="/"
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
            isDashboard
              ? "bg-purple text-white shadow-[0_8px_24px_rgba(123,44,255,0.35)]"
              : "text-muted hover:bg-white/[0.04] hover:text-white"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        <NavSection title="Management" items={management} />
        <NavSection title="Support" items={support} />
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
