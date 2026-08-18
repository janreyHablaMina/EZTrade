"use client";

import { useState, useMemo } from "react";
import { Download, ArrowLeftRight, ArrowDownToLine, ArrowUpFromLine, RefreshCw, Coins } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { TransactionsFilters } from "@/components/admin/transactions/TransactionsFilters";
import { TransactionsTable } from "@/components/admin/transactions/TransactionsTable";
import { webApi } from "@/lib/api";
import { useEffect } from "react";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [currency, setCurrency] = useState("all");
  const [dateRange, setDateRange] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const [depositsData, withdrawalsData] = await Promise.all([
        webApi.get('/deposits'),
        webApi.get('/withdrawals')
      ]);

      const mappedDeposits = depositsData.map((d: any) => ({
        id: `TX-D${d.id.toString().padStart(5, '0')}`,
        dbId: d.id,
        type: 'Deposit',
        amount: parseFloat(d.amount),
        currency: 'USDT',
        network: d.network,
        status: d.status === 'Approved' ? 'Completed' : d.status, // Normalize status
        userName: d.user ? d.user.name : 'Unknown',
        userEmail: d.user ? d.user.email : 'Unknown',
        userId: d.user ? `EZT-${d.user.id.toString().padStart(4, '0')}` : 'N/A',
        dateTime: new Date(d.created_at).toLocaleString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        timestamp: new Date(d.created_at).getTime(),
        referenceTxid: d.txid || 'N/A',
        description: 'Wallet funding'
      }));

      const mappedWithdrawals = withdrawalsData.map((w: any) => ({
        id: `TX-W${w.id.toString().padStart(5, '0')}`,
        dbId: w.id,
        type: 'Withdrawal',
        amount: parseFloat(w.amount),
        currency: 'USDT',
        network: w.network,
        status: w.status,
        userName: w.user ? w.user.name : 'Unknown',
        userEmail: w.user ? w.user.email : 'Unknown',
        userId: w.user ? `EZT-${w.user.id.toString().padStart(4, '0')}` : 'N/A',
        dateTime: new Date(w.created_at).toLocaleString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        timestamp: new Date(w.created_at).getTime(),
        referenceTxid: w.txid || 'N/A',
        description: 'Funds withdrawal'
      }));

      const allTransactions = [...mappedDeposits, ...mappedWithdrawals].sort((a, b) => b.timestamp - a.timestamp);
      setTransactions(allTransactions);
    } catch (e) {
      console.error('Failed to fetch transactions:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter application state
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    status: "all",
    currency: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Apply filters logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch =
        !filters.search ||
        tx.userName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        tx.userEmail?.toLowerCase().includes(filters.search.toLowerCase()) ||
        tx.id?.toLowerCase().includes(filters.search.toLowerCase()) ||
        tx.referenceTxid?.toLowerCase().includes(filters.search.toLowerCase()) ||
        tx.description?.toLowerCase().includes(filters.search.toLowerCase());

      const matchType = filters.type === "all" || tx.type === filters.type;
      const matchStatus = filters.status === "all" || tx.status.toLowerCase() === filters.status.toLowerCase();
      const matchCurrency = filters.currency === "all" || tx.currency === filters.currency;

      return matchSearch && matchType && matchStatus && matchCurrency;
    });
  }, [filters, transactions]);

  // Paginated transactions
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  const handleFilter = () => {
    setFilters({
      search,
      type,
      status,
      currency,
    });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setType("all");
    setStatus("all");
    setCurrency("all");
    setDateRange("");
    setFilters({
      search: "",
      type: "all",
      status: "all",
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
            Transaction History
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-2">
            <span>Dashboard</span>
            <span className="text-[10px] text-muted-2/65">&gt;</span>
            <span className="text-muted">Transactions</span>
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
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard
          label="Total Transactions"
          value={transactions.length.toLocaleString()}
          change=""
          icon={ArrowLeftRight}
        />
        <KpiCard
          label="Total Deposits"
          value={transactions.filter(t => t.type === 'Deposit').length.toLocaleString()}
          change=""
          icon={ArrowDownToLine}
        />
        <KpiCard
          label="Total Withdrawals"
          value={transactions.filter(t => t.type === 'Withdrawal').length.toLocaleString()}
          change=""
          icon={ArrowUpFromLine}
        />
        <KpiCard
          label="Total Transfers"
          value="0"
          change=""
          icon={RefreshCw}
        />
        <KpiCard
          label="Total Amount"
          value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
            transactions.filter(t => t.status === 'Completed').reduce((sum, t) => sum + (t.amount || 0), 0)
          )}
          change=""
          icon={Coins}
        />
        <KpiCard
          label="Total Fees"
          value="$0.00"
          change=""
          icon={Coins}
          iconClassName="text-warning"
        />
      </div>

      {/* Filters Card */}
      <TransactionsFilters
        search={search}
        setSearch={setSearch}
        type={type}
        setType={setType}
        status={status}
        setStatus={setStatus}
        currency={currency}
        setCurrency={setCurrency}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onFilter={handleFilter}
        onReset={handleReset}
      />

      {/* Transactions Table Card */}
      <TransactionsTable
        transactions={filteredTransactions}
        paginatedTransactions={paginatedTransactions}
        totalCount={filteredTransactions.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        onRefresh={fetchTransactions}
        onViewDetails={(tx) => console.log("View details for:", tx.id)}
        onPrint={(tx) => console.log("Print receipt for:", tx.id)}
        onHistory={(tx) => console.log("History log for:", tx.id)}
      />
    </AdminShell>
  );
}
