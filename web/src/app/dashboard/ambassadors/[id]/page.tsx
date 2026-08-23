"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ArrowLeft, Wallet, TrendingUp, AlertCircle, CheckCircle2, Users, Network, Mail, Phone, Calendar, ShieldAlert, Copy, Banknote, Clock, X, ChevronRight, User } from "lucide-react";
import { KpiCard } from "@/components/admin/KpiCard";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { UsersFilters } from "@/components/admin/users/UsersFilters";
import { ViewUserModal } from "@/components/admin/users/ViewUserModal";
import { EarningsTable } from "@/components/admin/earnings/EarningsTable";
import { usePagination } from "@/hooks/usePagination";
import { useTableSelection } from "@/hooks/useTableSelection";
import { useApi } from "@/hooks/useApi";
import { webApi } from "@/lib/api";
import { type UserRecord, vipBadgeStyles } from "@/types/admin";

export default function AmbassadorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const ambassadorId = params.id as string;
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const [vipLevel, setVipLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("");
  const [cutPercent, setCutPercent] = useState("all");
  const [viewingUser, setViewingUser] = useState<UserRecord | null>(null);

  const realId = parseInt(ambassadorId.replace(/\D/g, ''));
  const { data: ambassador, isLoading: isLoadingAmb } = useApi(`/admin/ambassadors/${realId}`);
  const { data: downlineData, isLoading: isLoadingDownline } = useApi(`/admin/ambassadors/${realId}/downline`);
  const { data: earningsData, isLoading: isLoadingEarnings } = useApi(`/admin/ambassadors/${realId}/earnings`);

  const isLoading = isLoadingAmb || isLoadingDownline || isLoadingEarnings;

  const downlineUsers = useMemo<UserRecord[]>(() => {
    if (!downlineData) return [];
    return downlineData.map((u: any) => {
      const num = (u.id.toString().charCodeAt(u.id.toString().length - 1) % 3);
      const cut = num === 0 ? 10 : num === 1 ? 5 : 3;
      return {
        id: `EZT-${u.id.toString().padStart(4, '0')}`,
        dbId: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || "N/A",
        vipLevel: u.vip_plan ? u.vip_plan.level : "None",
        role: u.role || "User",
        deposited: parseFloat(u.balance) || 0,
        withdrawn: 0,
        earnings: 0,
        kycStatus: u.kyc_status || "Not Verified",
        status: u.status || "Active",
        teamSize: u.team_size || 0,
        referralCode: u.referral_code || null,
        registeredAt: new Date(u.created_at).toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        cutPercent: cut,
      };
    });
  }, [downlineData]);

  const earningsLog = useMemo<any[]>(() => {
    if (!earningsData) return [];
    return earningsData.map((e: any) => {
      const descParts = [`Gross $${e.gross_cut}`];
      if (e.deduction > 0) descParts.push(`-$${e.deduction} Pool Deduction`);
      if (e.direct_bonus > 0) descParts.push(`+$${e.direct_bonus} Direct Bonus`);
      
      return {
        id: `AMB-${e.id.toString().padStart(5, '0')}`,
        userName: e.user ? e.user.name : 'Unknown',
        userEmail: e.user ? e.user.email : 'Unknown',
        vipLevel: e.user ? e.user.vip_plan_id : 1,
        type: e.direct_bonus > 0 ? 'Direct Referral' : 'Network Deposit',
        source: `Deposit ($${e.deposit_amount})`,
        amount: parseFloat(e.net_earnings) || 0,
        currency: 'USDT',
        network: 'N/A',
        status: 'Completed',
        dateTime: new Date(e.created_at).toLocaleString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        description: descParts.join(' | ')
      };
    });
  }, [earningsData]);

  const handleCopyReferral = () => {
    if (ambassador?.referralCode && ambassador.referralCode !== 'N/A') {
      navigator.clipboard.writeText(ambassador.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Filter Logic
  const filteredUsers = useMemo(() => {
    return downlineUsers.filter((user) => {
      const matchSearch =
        !search ||
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.phone.includes(search) ||
        user.id.toLowerCase().includes(search.toLowerCase());

      const matchVip = 
        vipLevel === "all" || 
        (vipLevel === "Ambassador" ? user.role === "Ambassador" : user.vipLevel === vipLevel);
      const matchStatus = status === "all" || user.status === status;
      const matchCut = cutPercent === "all" || String(user.cutPercent) === cutPercent;

      return matchSearch && matchVip && matchStatus && matchCut;
    });
  }, [search, vipLevel, status, cutPercent, downlineUsers]);

  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    paginatedItems: paginatedUsers,
  } = usePagination(filteredUsers, 10);

  const {
    selectedIds,
    setSelectedIds,
    toggleSelectAll,
    toggleSelectRow,
  } = useTableSelection(paginatedUsers);

  const handleReset = () => {
    setSearch("");
    setVipLevel("all");
    setStatus("all");
    setCutPercent("all");
    setDateRange("");
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <AdminShell>
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-2">Loading ambassador details...</p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="mx-auto flex flex-col gap-6">
        {/* Header & Back Button */}
        <div>
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-xs font-medium text-muted hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Users
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple/15 text-lg font-semibold text-purple-bright ring-1 ring-purple-bright/20 shrink-0">
                {ambassador?.name?.split(" ").map((p: string) => p[0]).join("").slice(0, 2) || "A"}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                    {ambassador?.name || "Ambassador Details"}
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Ambassador
                    </span>
                  </h1>
                </div>
                <p className="mt-1 text-xs text-muted-2">
                  UID: {ambassador?.id || ambassadorId}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial KPI Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard
            label="Total Downline Deposit"
            value={`$${(ambassador.financials?.totalDownlineDeposits || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            subtext="Total deposit of the downline"
            icon={Wallet}
          />
          <KpiCard
            label="Active Trade Capital"
            value={`$${(ambassador.financials?.activeTradeCapital || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            subtext="Total VIP plan capital from network"
            icon={TrendingUp}
            iconClassName="text-white"
          />
          <KpiCard
            label="Gross Assets (Earnings + Referrals)"
            value={`+$${(ambassador?.financials?.grossAssets || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            subtext="Calculated daily at 12 AM midnight"
            icon={TrendingUp}
            iconClassName="text-white"
          />
          <KpiCard
            label="Minus Bonuses"
            value={`-$${(ambassador?.financials?.minusBonuses || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            subtext="Deductions for downline payouts"
            icon={AlertCircle}
            iconClassName="text-danger"
          />
          <KpiCard
            label="Net Balance"
            value={`$${(ambassador?.financials?.netBalance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            subtext="Available wallet balance"
            icon={CheckCircle2}
            iconClassName="text-purple-bright"
          />
        </div>

        {/* Main Content Area with reduced gaps */}
        <div className="flex flex-col gap-4">
          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {/* Contact Info */}
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card-elevated p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-bright/5 blur-3xl pointer-events-none" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border/50 pb-3 mb-1 flex items-center gap-2">
              <User className="h-4 w-4 text-purple-bright" />
              Contact Information
            </h4>
            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-semibold text-muted-2 uppercase tracking-wider mb-0.5">Email Address</p>
                  <p className="text-sm font-bold text-white truncate">{ambassador?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-muted-2 uppercase tracking-wider mb-0.5">Phone Number</p>
                  <p className="text-sm font-bold text-white">{ambassador?.phone || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-muted-2 uppercase tracking-wider mb-0.5">Joined Date</p>
                  <p className="text-sm font-bold text-white">{ambassador?.registeredAt}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Network Details */}
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card-elevated p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border/50 pb-3 mb-1 flex items-center gap-2">
              <Network className="h-4 w-4 text-emerald-400" />
              Network & Referrals
            </h4>
            <div className="flex flex-col gap-4 relative z-10">
              {ambassador?.referralCode && ambassador.referralCode !== "N/A" && (
                <div className="flex items-center justify-between rounded-lg border border-dashed border-emerald-500/30 bg-emerald-500/5 p-3">
                  <div>
                    <p className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-wider mb-0.5">Referral Code</p>
                    <p className="text-lg font-black text-white font-mono tracking-widest">{ambassador?.referralCode}</p>
                  </div>
                  <button 
                    onClick={handleCopyReferral}
                    className="flex h-8 items-center justify-center rounded-md bg-emerald-500/15 px-3 text-xs font-bold text-emerald-400 hover:bg-emerald-500/25 transition-colors cursor-pointer gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  >
                    {copied ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? "COPIED" : "COPY"}
                  </button>
                </div>
              )}
              <div className="flex items-center gap-3 mt-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple/15 text-purple-bright shrink-0">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-2 mb-0.5">Total Team Size</p>
                  <p className="text-sm font-bold text-white">{ambassador?.teamSize?.toLocaleString() || 0} Active Members</p>
                </div>
              </div>
            </div>
          </div>

          </div>

          <div className="flex flex-col gap-2">
            {/* Downline Network Filters */}
            <UsersFilters
              search={search}
              setSearch={setSearch}
              vipLevel={vipLevel}
              setVipLevel={setVipLevel}
              status={status}
              setStatus={setStatus}
              dateRange={dateRange}
              setDateRange={setDateRange}
              onReset={handleReset}
              cutPercent={cutPercent}
              setCutPercent={setCutPercent}
              showCutFilter={true}
            />

            {/* Downline Network Table */}
            <UsersTable
              users={filteredUsers}
              paginatedUsers={paginatedUsers}
              totalCount={filteredUsers.length}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              toggleSelectAll={toggleSelectAll}
              toggleSelectRow={toggleSelectRow}
              onViewUser={setViewingUser}
              isDownlineView={true}
            />
          </div>
        </div>
      </div>

      <ViewUserModal 
        isOpen={!!viewingUser} 
        onClose={() => setViewingUser(null)} 
        user={viewingUser} 
      />
    </AdminShell>
  );
}
