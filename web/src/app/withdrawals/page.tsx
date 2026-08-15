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
import { initialWithdrawalRequests } from "@/components/admin/withdrawals/withdrawalsData";
import type { WithdrawalRequest } from "@/components/admin/withdrawals/withdrawalsData";
import { WithdrawalsFilters } from "@/components/admin/withdrawals/WithdrawalsFilters";
import { WithdrawalsTable } from "@/components/admin/withdrawals/WithdrawalsTable";
import { FloatingWithdrawalActions } from "@/components/admin/withdrawals/FloatingWithdrawalActions";

export default function WithdrawalsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [network, setNetwork] = useState("all");
  const [currency, setCurrency] = useState("all");
  const [dateRange, setDateRange] = useState("");

  // Applied filters state
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    network: "all",
    currency: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Apply filters logic
  const filteredWithdrawals = useMemo(() => {
    return initialWithdrawalRequests.filter((withdrawal) => {
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
  }, [filters]);

  // Paginated withdrawals
  const paginatedWithdrawals = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredWithdrawals.slice(start, start + pageSize);
  }, [filteredWithdrawals, currentPage, pageSize]);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedWithdrawals.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedWithdrawals.map((w) => w.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Reset selection when parameters change
  useEffect(() => {
    setSelectedIds([]);
  }, [currentPage, pageSize, filters]);

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
          value="956"
          change="+16.4%"
          icon={Download}
        />
        <KpiCard
          label="Total Amount"
          value="$98,765.43"
          change="+14.8%"
          icon={Coins}
        />
        <KpiCard
          label="Completed"
          value="662"
          change="+15.7%"
          icon={CheckCircle2}
          iconClassName="text-success"
        />
        <KpiCard
          label="Pending"
          value="164"
          change="+8.3%"
          positive={true}
          icon={Clock}
          iconClassName="text-warning"
        />
        <KpiCard
          label="Rejected"
          value="78"
          change="-12.6%"
          positive={true} // Going down in rejections is positive!
          icon={XCircle}
          iconClassName="text-danger"
        />
        <KpiCard
          label="Success Rate"
          value="84.7%"
          change="+5.1%"
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
        totalCount={initialWithdrawalRequests.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        selectedIds={selectedIds}
        toggleSelectAll={toggleSelectAll}
        toggleSelectRow={toggleSelectRow}
        onViewDetails={(w) => console.log("View details for:", w.id)}
        onApprove={(w) => console.log("Approve withdrawal:", w.id)}
        onReject={(w) => console.log("Reject withdrawal:", w.id)}
        onHistory={(w) => console.log("History logs for:", w.id)}
      />

      {selectedIds.length > 0 && (
        <FloatingWithdrawalActions
          selectedCount={selectedIds.length}
          onClear={() => setSelectedIds([])}
          onApprove={() => {
            console.log("Bulk approve withdrawals:", selectedIds);
            setSelectedIds([]);
          }}
          onReject={() => {
            console.log("Bulk reject withdrawals:", selectedIds);
            setSelectedIds([]);
          }}
        />
      )}
    </AdminShell>
  );
}
