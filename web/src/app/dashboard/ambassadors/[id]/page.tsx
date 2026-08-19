"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ArrowLeft, Wallet, TrendingUp, AlertCircle, CheckCircle2, Users, Network, Mail, Phone, Calendar, ShieldAlert, Copy, Banknote, Clock, X, ChevronRight } from "lucide-react";
import { KpiCard } from "@/components/admin/KpiCard";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { UsersFilters } from "@/components/admin/users/UsersFilters";
import { ViewUserModal } from "@/components/admin/users/ViewUserModal";
import { EarningsTable } from "@/components/admin/earnings/EarningsTable";
import { usePagination } from "@/hooks/usePagination";
import { useTableSelection } from "@/hooks/useTableSelection";
import { webApi } from "@/lib/api";
import { type UserRecord } from "@/types/admin";

export default function AmbassadorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const ambassadorId = params.id as string;
  const [ambassador, setAmbassador] = useState<any>(null);
  const [downlineUsers, setDownlineUsers] = useState<UserRecord[]>([]);
  const [earningsLog, setEarningsLog] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Table Filters State
  const [search, setSearch] = useState("");
  const [vipLevel, setVipLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("");
  const [viewingUser, setViewingUser] = useState<UserRecord | null>(null);

  useEffect(() => {
    const fetchAmbassadorAndDownline = async () => {
      try {
        const realId = parseInt(ambassadorId.replace(/\D/g, ''));
        const [ambData, downlineData, earningsData] = await Promise.all([
          webApi.get(`/admin/ambassadors/${realId}`),
          webApi.get(`/admin/ambassadors/${realId}/downline`),
          webApi.get(`/admin/ambassadors/${realId}/earnings`)
        ]);
        
        setAmbassador(ambData);

        const mappedUsers: UserRecord[] = downlineData.map((u: any) => ({
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
        }));
        setDownlineUsers(mappedUsers);

        const mappedEarnings = earningsData.map((e: any) => {
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
        setEarningsLog(mappedEarnings);

      } catch (err) {
        console.error("Failed to fetch ambassador details", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAmbassadorAndDownline();
  }, [ambassadorId]);

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

      return matchSearch && matchVip && matchStatus;
    });
  }, [search, vipLevel, status, downlineUsers]);

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

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const realId = parseInt(ambassadorId.replace(/\D/g, ''));
      const res = await webApi.post(`/admin/ambassadors/${realId}/simulate`, {});
      
      // Update UI state interactively without DB fetch
      setAmbassador((prev: any) => ({
        ...prev,
        balance: res.new_balance,
        financials: {
          ...prev.financials,
          grossAssets: prev.financials.grossAssets + res.amb_bonus,
          netBalance: res.new_balance
        }
      }));
    } catch (e) {
      console.error(e);
      alert("Failed to run simulation");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleReset = () => {
    setSearch("");
    setVipLevel("all");
    setStatus("all");
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
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
                <button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition disabled:opacity-50"
                >
                  <Clock className="h-4 w-4" />
                  {isSimulating ? "Simulating..." : "Clock"}
                </button>
              </div>
              <p className="mt-1 text-xs text-muted-2">
                UID: {ambassador?.id || ambassadorId}
              </p>
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

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Contact Info */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card-elevated p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-2 border-b border-border/50 pb-2 mb-1">
              Contact Information
            </h4>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-muted-2 shrink-0">
                <Mail className="h-4 w-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-muted-2">Email Address</p>
                <p className="text-sm font-medium text-white truncate">{ambassador?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-muted-2 shrink-0">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-2">Phone Number</p>
                <p className="text-sm font-medium text-white">{ambassador?.phone || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-muted-2 shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-2">Joined Date</p>
                <p className="text-sm font-medium text-white">{ambassador?.registeredAt}</p>
              </div>
            </div>
          </div>

          {/* Security & Verification */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card-elevated p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-2 border-b border-border/50 pb-2 mb-1">
              Security & Verification
            </h4>
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${
                ambassador?.kycStatus === "Verified" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
              }`}>
                {ambassador?.kycStatus === "Verified" ? <CheckCircle2 className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-[10px] text-muted-2">KYC Status</p>
                <p className={`text-sm font-medium ${ambassador?.kycStatus === "Verified" ? "text-white" : "text-warning"}`}>
                  {ambassador?.kycStatus}
                </p>
              </div>
            </div>
            <div className="mt-auto">
              <button className="w-full rounded-lg border border-border bg-white/[0.02] px-3 py-2 text-xs font-medium text-white transition hover:bg-white/[0.04]">
                Request Additional Docs
              </button>
            </div>
          </div>

          {/* Network Details */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card-elevated p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-2 border-b border-border/50 pb-2 mb-1">
              Network & Referrals
            </h4>
            <div className="flex flex-col gap-4 mt-1">
              <div>
                <p className="text-[10px] text-muted-2 mb-1">Referral Code</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white font-mono">{ambassador?.referralCode || "N/A"}</p>
                  {ambassador?.referralCode && ambassador.referralCode !== "N/A" && (
                    <button 
                      onClick={handleCopyReferral}
                      className="flex items-center gap-1 text-[10px] text-purple-bright hover:text-white transition cursor-pointer"
                    >
                      {copied ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-2 mb-1">Total Team Size</p>
                <p className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-muted-2" />
                  {ambassador?.teamSize?.toLocaleString() || 0} Members
                </p>
              </div>
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card-elevated p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-2 border-b border-border/50 pb-2 mb-1">
              Wallet & Funds
            </h4>
            <div className="flex flex-col gap-4 mt-1">
              <div>
                <p className="text-[10px] text-muted-2 mb-1">Available Balance</p>
                <p className="text-2xl font-bold text-emerald-400">
                  ${parseFloat(ambassador?.balance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="mt-auto">
                <button className="w-full rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20">
                  Manage Funds
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Downline Network Table */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-4">
             <h3 className="text-sm font-semibold text-white flex items-center gap-2">
               <Network className="h-4 w-4 text-purple-bright" /> Downline Network
             </h3>
          </div>
          
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
          />

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
          />
        </div>

        {/* Ambassador Earnings Ledger */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-4">
             <h3 className="text-sm font-semibold text-white flex items-center gap-2">
               <Banknote className="h-4 w-4 text-emerald-400" /> Deposit Cut Ledger
             </h3>
             <p className="text-xs text-muted-2">Log of earnings from downline deposits</p>
          </div>
          
          <div className="mt-2">
            <EarningsTable earnings={earningsLog} />
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
