"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Download,
  Coins,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Plus,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { WithdrawalsFilters } from "@/components/admin/withdrawals/WithdrawalsFilters";
import { WithdrawalsTable } from "@/components/admin/withdrawals/WithdrawalsTable";
import { GenericFloatingActions } from "@/components/admin/GenericFloatingActions";
import { usePagination } from "@/hooks/usePagination";
import { useTableSelection } from "@/hooks/useTableSelection";
import { webApi } from "@/lib/api";

export default function WithdrawalsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [network, setNetwork] = useState("all");
  const [currency, setCurrency] = useState("all");
  const [dateRange, setDateRange] = useState("");
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  const fetchWithdrawals = async () => {
    try {
      const data = await webApi.get('/withdrawals');
      const mapped = data.map((w: any) => ({
        id: `WDL-${w.id.toString().padStart(6, '0')}`,
        dbId: w.id,
        userName: w.user ? w.user.name : 'Unknown',
        userEmail: w.user ? w.user.email : 'Unknown',
        userId: w.user ? `EZT-${w.user.id.toString().padStart(4, '0')}` : 'N/A',
        amount: parseFloat(w.amount),
        currency: 'USDT',
        network: w.network,
        walletAddress: w.txid || 'Pending',
        status: w.status,
        submittedAt: new Date(w.created_at).toLocaleString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
      }));
      setWithdrawals(mapped);
    } catch (e) {
      console.error('Failed to fetch withdrawals:', e);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  // Applied filters state
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    network: "all",
    currency: "all",
  });

  // Apply filters logic
  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter((withdrawal) => {
      const matchSearch =
        !filters.search ||
        withdrawal.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
        withdrawal.userEmail.toLowerCase().includes(filters.search.toLowerCase()) ||
        withdrawal.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        withdrawal.walletAddress.toLowerCase().includes(filters.search.toLowerCase());

      const matchStatus = filters.status === "all" || withdrawal.status === filters.status;
      const matchNetwork = filters.network === "all" || withdrawal.network === filters.network;
      const matchCurrency = filters.currency === "all" || withdrawal.currency === filters.currency;

      return matchSearch && matchStatus && matchNetwork && matchCurrency;
    });
  }, [filters, withdrawals]);

  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    paginatedItems: paginatedWithdrawals,
    totalCount
  } = usePagination(filteredWithdrawals, 10);

  const {
    selectedIds,
    setSelectedIds,
    toggleSelectAll,
    toggleSelectRow,
    clearSelection
  } = useTableSelection(paginatedWithdrawals);

  const handleFilter = () => {
    setFilters({
      search,
      status,
      network,
      currency,
    });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setStatus("all");
    setNetwork("all");
    setCurrency("all");
    setDateRange("");
    setFilters({
      search: "",
      status: "all",
      network: "all",
      currency: "all",
    });
    setCurrentPage(1);
  };

  const handleApprove = async (withdrawal: any) => {
    try {
      await webApi.patch(`/withdrawals/${withdrawal.dbId}`, { status: 'Completed' });
      fetchWithdrawals();
    } catch (e) {
      console.error('Failed to approve withdrawal', e);
    }
  };

  const handleReject = async (withdrawal: any) => {
    try {
      await webApi.patch(`/withdrawals/${withdrawal.dbId}`, { status: 'Rejected' });
      fetchWithdrawals();
    } catch (e) {
      console.error('Failed to reject withdrawal', e);
    }
  };

  return (
    <AdminShell>
      {/* Top Header section */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Withdrawal Requests
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-2">
            <span>Dashboard</span>
            <span className="text-[10px] text-muted-2/65">&gt;</span>
            <span className="text-muted">Withdrawals</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.04] cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl bg-purple hover:bg-purple-bright px-3.5 py-2 text-xs font-semibold text-white transition shadow-[0_8px_20px_rgba(123,44,255,0.3)] hover:shadow-[0_8px_20px_rgba(123,44,255,0.45)] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Manual Withdrawal
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard
          label="Total Withdrawals"
          value={withdrawals.length.toLocaleString()}
          change=""
          icon={Download}
        />
        <KpiCard
          label="Total Amount"
          value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
            withdrawals.filter(w => w.status === 'Completed').reduce((sum, w) => sum + (w.amount || 0), 0)
          )}
          change=""
          icon={Coins}
        />
        <KpiCard
          label="Completed"
          value={withdrawals.filter(w => w.status === 'Completed').length.toLocaleString()}
          change=""
          icon={CheckCircle2}
          iconClassName="text-success"
        />
        <KpiCard
          label="Pending"
          value={withdrawals.filter(w => w.status === 'Pending').length.toLocaleString()}
          change=""
          positive={true}
          icon={Clock}
          iconClassName="text-warning"
        />
        <KpiCard
          label="Rejected"
          value={withdrawals.filter(w => w.status === 'Rejected').length.toLocaleString()}
          change=""
          positive={true}
          icon={XCircle}
          iconClassName="text-danger"
        />
        <KpiCard
          label="Success Rate"
          value={
            withdrawals.length > 0 
              ? ((withdrawals.filter(w => w.status === 'Completed').length / withdrawals.length) * 100).toFixed(2) + '%'
              : '0.00%'
          }
          change=""
          icon={TrendingUp}
          iconClassName="text-success"
        />
      </div>

      {/* Filters Card */}
      <WithdrawalsFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        network={network}
        setNetwork={setNetwork}
        currency={currency}
        setCurrency={setCurrency}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onFilter={handleFilter}
        onReset={handleReset}
      />

      {/* Withdrawals Table Card */}
      <WithdrawalsTable
        withdrawals={filteredWithdrawals}
        paginatedWithdrawals={paginatedWithdrawals}
        totalCount={filteredWithdrawals.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        selectedIds={selectedIds}
        toggleSelectAll={toggleSelectAll}
        toggleSelectRow={toggleSelectRow}
        onViewDetails={(w) => console.log("View details for:", w.id)}
        onApprove={handleApprove}
        onReject={handleReject}
        onHistory={(w) => console.log("History logs for:", w.id)}
      />

      <GenericFloatingActions
        selectedCount={selectedIds.length}
        onClear={clearSelection}
      >
        <button
          type="button"
          onClick={() => {
            console.log("Bulk approve withdrawals:", selectedIds);
            clearSelection();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-success/30 bg-success/10 text-success hover:bg-success/20 transition cursor-pointer text-xs font-medium"
        >
          <CheckCircle2 className="h-3.5 w-3.5" /> Approve Selected
        </button>
        <button
          type="button"
          onClick={() => {
            console.log("Bulk reject withdrawals:", selectedIds);
            clearSelection();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-danger/30 bg-danger/10 text-danger hover:bg-danger/20 transition cursor-pointer text-xs font-medium"
        >
          <XCircle className="h-3.5 w-3.5" /> Reject Selected
        </button>
      </GenericFloatingActions>
    </AdminShell>
  );
}
