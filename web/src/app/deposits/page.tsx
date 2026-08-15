"use client";

import { useState, useMemo } from "react";
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
import { initialDepositRequests } from "@/components/admin/deposits/depositsData";
import type { DepositRequest } from "@/components/admin/deposits/depositsData";
import { DepositsFilters } from "@/components/admin/deposits/DepositsFilters";
import { DepositsTable } from "@/components/admin/deposits/DepositsTable";

export default function DepositsPage() {
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

  // Apply filters logic
  const filteredDeposits = useMemo(() => {
    return initialDepositRequests.filter((deposit) => {
      const matchSearch =
        !filters.search ||
        deposit.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
        deposit.userEmail.toLowerCase().includes(filters.search.toLowerCase()) ||
        deposit.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        deposit.txid.toLowerCase().includes(filters.search.toLowerCase());

      const matchStatus = filters.status === "all" || deposit.status === filters.status;
      const matchNetwork = filters.network === "all" || deposit.network === filters.network;
      const matchCurrency = filters.currency === "all" || deposit.currency === filters.currency;

      return matchSearch && matchStatus && matchNetwork && matchCurrency;
    });
  }, [filters]);

  // Paginated deposits
  const paginatedDeposits = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDeposits.slice(start, start + pageSize);
  }, [filteredDeposits, currentPage, pageSize]);

  const handleFilter = () => {
    setFilters({
      search,
      status,
      network,
      currency,
    });
    setCurrentPage(1);
  };

  return (
    <AdminShell>
      {/* Top Header section */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Deposit Requests
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-2">
            <span>Dashboard</span>
            <span className="text-[10px] text-muted-2/65">&gt;</span>
            <span className="text-muted">Deposits</span>
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
            Manual Deposit
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard
          label="Total Deposits"
          value="1,248"
          change="+18.7%"
          icon={Download}
        />
        <KpiCard
          label="Total Amount"
          value="$123,456.78"
          change="+16.3%"
          icon={Coins}
        />
        <KpiCard
          label="Completed"
          value="1,102"
          change="+20.5%"
          icon={CheckCircle2}
          iconClassName="text-success"
        />
        <KpiCard
          label="Pending"
          value="98"
          change="-5.2%"
          positive={false}
          icon={Clock}
          iconClassName="text-warning"
        />
        <KpiCard
          label="Failed"
          value="48"
          change="-12.8%"
          positive={true} // Going down in failures is positive!
          icon={XCircle}
          iconClassName="text-danger"
        />
        <KpiCard
          label="Success Rate"
          value="88.30%"
          change="+6.4%"
          icon={TrendingUp}
          iconClassName="text-success"
        />
      </div>

      {/* Filters Card */}
      <DepositsFilters
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
      />

      {/* Deposits Table Card */}
      <DepositsTable
        deposits={filteredDeposits}
        paginatedDeposits={paginatedDeposits}
        totalCount={initialDepositRequests.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        onViewDetails={(dep) => console.log("View details for:", dep.id)}
        onVerify={(dep) => console.log("Verify deposit:", dep.id)}
        onReject={(dep) => console.log("Reject deposit:", dep.id)}
        onAddManual={(dep) => console.log("Add manual deposit:", dep.id)}
        onNotesHistory={(dep) => console.log("Notes / History for:", dep.id)}
      />
    </AdminShell>
  );
}
