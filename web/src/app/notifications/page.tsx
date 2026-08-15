"use client";

import { useState, useMemo } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  ArrowDownToLine,
  Crown,
  TrendingUp,
  ShieldAlert,
  ArrowUpFromLine,
  UserPlus,
  Gift,
  Settings,
  Bell,
  ChevronDown,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  initialNotifications,
  categoryBadgeStyles,
  type NotificationRecord,
  type NotificationCategory,
} from "@/components/admin/notifications/notificationsData";

// ── Icon helper ──────────────────────────────────────────────────────────────
function NotifIcon({ type }: { type: NotificationRecord["iconType"] }) {
  const base = "flex h-10 w-10 shrink-0 items-center justify-center rounded-full";
  switch (type) {
    case "deposit":
      return <div className={`${base} bg-emerald-500/20`}><ArrowDownToLine className="h-4.5 w-4.5 text-emerald-400" /></div>;
    case "vip":
      return <div className={`${base} bg-purple/25`}><Crown className="h-4.5 w-4.5 text-purple-bright" /></div>;
    case "earnings":
      return <div className={`${base} bg-amber-500/20`}><TrendingUp className="h-4.5 w-4.5 text-amber-400" /></div>;
    case "security":
      return <div className={`${base} bg-amber-500/20`}><ShieldAlert className="h-4.5 w-4.5 text-amber-400" /></div>;
    case "withdrawal":
      return <div className={`${base} bg-emerald-500/20`}><ArrowUpFromLine className="h-4.5 w-4.5 text-emerald-400" /></div>;
    case "referral-join":
      return <div className={`${base} bg-sky-500/20`}><UserPlus className="h-4.5 w-4.5 text-sky-400" /></div>;
    case "referral-bonus":
      return <div className={`${base} bg-rose-500/20`}><Gift className="h-4.5 w-4.5 text-rose-400" /></div>;
    case "system":
      return <div className={`${base} bg-gray-500/20`}><Settings className="h-4.5 w-4.5 text-gray-400" /></div>;
    default:
      return <div className={`${base} bg-purple/20`}><Bell className="h-4.5 w-4.5 text-purple-bright" /></div>;
  }
}

// ── Category Summary Card ─────────────────────────────────────────────────────
function CategoryCard({
  label,
  count,
  iconColor,
  active,
  onClick,
}: {
  label: string;
  count: number;
  iconColor: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-4 cursor-pointer transition-all shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col justify-between gap-3 ${
        active
          ? "border-purple-bright bg-purple/10"
          : "border-border bg-card hover:border-border-strong"
      }`}
    >
      <div className="flex items-center gap-2">
        <Bell className={`h-4 w-4 ${iconColor}`} />
        <span className="text-xs font-medium text-muted">{label}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{count}</p>
        {label !== "Total Notifications" && (
          <p className="text-[10px] text-purple-bright font-medium mt-1 flex items-center gap-0.5">
            View all <span>&rarr;</span>
          </p>
        )}
        {label === "Total Notifications" && (
          <p className="text-[10px] text-muted-2 mt-1">All time</p>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationRecord[]>(initialNotifications);
  const [tab, setTab] = useState<"all" | "unread" | "read">("all");
  const [category, setCategory] = useState<"all" | NotificationCategory>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const readCount = notifications.filter((n) => n.isRead).length;

  const categoryCounts: Record<string, number> = {};
  notifications.forEach((n) => {
    categoryCounts[n.category] = (categoryCounts[n.category] ?? 0) + 1;
  });

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const matchesTab =
        tab === "all" || (tab === "unread" && !n.isRead) || (tab === "read" && n.isRead);
      const matchesCategory = category === "all" || n.category === category;
      return matchesTab && matchesCategory;
    });
  }, [notifications, tab, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markOneRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <AdminShell>
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Notifications</h1>
          <p className="mt-1.5 text-xs text-muted-2">
            Dashboard <span className="mx-1">&gt;</span> Notifications
          </p>
        </div>

        {/* Category Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <CategoryCard label="Total Notifications" count={notifications.length} iconColor="text-purple-bright" active={category === "all"} onClick={() => { setCategory("all"); setCurrentPage(1); }} />
          <CategoryCard label="Account" count={categoryCounts["Account"] ?? 0} iconColor="text-sky-400" active={category === "Account"} onClick={() => { setCategory("Account"); setCurrentPage(1); }} />
          <CategoryCard label="Transactions" count={categoryCounts["Transaction"] ?? 0} iconColor="text-teal-400" active={category === "Transaction"} onClick={() => { setCategory("Transaction"); setCurrentPage(1); }} />
          <CategoryCard label="Earnings" count={categoryCounts["Earnings"] ?? 0} iconColor="text-amber-400" active={category === "Earnings"} onClick={() => { setCategory("Earnings"); setCurrentPage(1); }} />
          <CategoryCard label="Promotions" count={categoryCounts["Promotion"] ?? 0} iconColor="text-rose-400" active={category === "Promotion"} onClick={() => { setCategory("Promotion"); setCurrentPage(1); }} />
          <CategoryCard label="System" count={categoryCounts["System"] ?? 0} iconColor="text-gray-400" active={category === "System"} onClick={() => { setCategory("System"); setCurrentPage(1); }} />
        </div>

        {/* Main Panel */}
        <div className="rounded-2xl border border-border bg-card shadow-[0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden">
          {/* Tab Bar + Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 pt-4 pb-3 border-b border-border/50">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-white/[0.04] rounded-xl p-1">
              {(["all", "unread", "read"] as const).map((t) => {
                const count = t === "all" ? notifications.length : t === "unread" ? unreadCount : readCount;
                return (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setCurrentPage(1); }}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      tab === t
                        ? "bg-card text-white shadow"
                        : "text-muted hover:text-white"
                    }`}
                  >
                    <span className="capitalize">{t}</span>
                    <span className={`inline-flex items-center justify-center h-4 min-w-4 rounded-full text-[10px] font-bold px-1 ${tab === t ? "bg-purple text-white" : "bg-white/[0.08] text-muted-2"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value as "all" | NotificationCategory); setCurrentPage(1); }}
                  className="appearance-none rounded-xl border border-border bg-card-elevated py-2 pl-3.5 pr-8 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="Transaction">Transaction</option>
                  <option value="Account">Account</option>
                  <option value="Earnings">Earnings</option>
                  <option value="Security">Security</option>
                  <option value="Referral">Referral</option>
                  <option value="System">System</option>
                  <option value="Promotion">Promotion</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-2" />
              </div>
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 rounded-xl bg-purple hover:bg-purple-bright px-3.5 py-2 text-xs font-semibold text-white transition shadow-[0_8px_20px_rgba(123,44,255,0.2)] cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all as read
              </button>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[1fr_120px_140px_80px] text-[10px] font-medium text-muted uppercase tracking-wider px-5 py-3 border-b border-border/40 bg-white/[0.02]">
            <span>Notification</span>
            <span>Category</span>
            <span>Date &amp; Time</span>
            <span className="text-right">Status</span>
          </div>

          {/* Notification Rows */}
          <div className="divide-y divide-border/30">
            {paginated.length > 0 ? (
              paginated.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markOneRead(notif.id)}
                  className={`grid grid-cols-[1fr_120px_140px_80px] items-center px-5 py-4 cursor-pointer transition-colors group ${
                    !notif.isRead ? "bg-purple/[0.04] hover:bg-purple/[0.07]" : "hover:bg-white/[0.025]"
                  }`}
                >
                  {/* Notification */}
                  <div className="flex items-start gap-3.5 min-w-0 pr-4">
                    {/* Unread dot */}
                    <div className="flex items-center h-10 pt-1">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${!notif.isRead ? "bg-purple-bright" : "bg-transparent"}`} />
                    </div>
                    <NotifIcon type={notif.iconType} />
                    <div className="min-w-0">
                      <p className={`text-[12px] font-semibold truncate ${!notif.isRead ? "text-white" : "text-muted"}`}>
                        {notif.title}
                      </p>
                      <p className="text-[11px] text-muted-2 leading-relaxed line-clamp-2 mt-0.5">
                        {notif.description}
                      </p>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${categoryBadgeStyles[notif.category]}`}>
                      {notif.category}
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="text-[10px] text-muted-2 leading-snug">
                    {notif.dateTime}
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-end gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${!notif.isRead ? "bg-purple-bright" : "bg-gray-600"}`} />
                    <span className={`text-[11px] font-medium ${!notif.isRead ? "text-purple-bright" : "text-muted-2"}`}>
                      {notif.isRead ? "Read" : "Unread"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-muted-2 text-sm">No notifications found.</div>
            )}
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between border-t border-border/50 px-5 py-4 text-xs text-muted-2">
            <div>Showing 1 to {Math.min(pageSize, filtered.length)} of {filtered.length} notifications</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border hover:bg-white/[0.04] disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-purple-bright bg-purple/20 text-purple-bright text-[11px] font-medium">
                {currentPage}
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border hover:bg-white/[0.04] disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <span className="ml-2 text-[11px] text-muted-2">10 per page</span>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
