"use client";

import { useState, useMemo } from "react";
import { Download, ArrowLeftRight, ArrowDownToLine, ArrowUpFromLine, RefreshCw, Coins } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { TransactionsFilters } from "@/components/admin/transactions/TransactionsFilters";
import { TransactionsTable } from "@/components/admin/transactions/TransactionsTable";
import { TransactionDetailsModal } from "@/components/admin/transactions/TransactionDetailsModal";
import { webApi } from "@/lib/api";
import { useEffect } from "react";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [currency, setCurrency] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedTransactionForDetails, setSelectedTransactionForDetails] = useState<any | null>(null);
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
        createdAt: d.created_at,
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
        createdAt: w.created_at,
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

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Apply filters logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch =
        !search ||
        tx.userName?.toLowerCase().includes(search.toLowerCase()) ||
        tx.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
        tx.id?.toLowerCase().includes(search.toLowerCase()) ||
        tx.referenceTxid?.toLowerCase().includes(search.toLowerCase()) ||
        tx.description?.toLowerCase().includes(search.toLowerCase());

      const matchType = type === "all" || tx.type === type;
      const matchStatus = status === "all" || tx.status.toLowerCase() === status.toLowerCase();
      const matchCurrency = currency === "all" || tx.currency === currency;

      let matchDate = true;
      if (dateFrom || dateTo) {
        const txDate = new Date(tx.createdAt).setHours(0, 0, 0, 0);
        if (dateFrom && txDate < new Date(dateFrom).setHours(0, 0, 0, 0)) matchDate = false;
        if (dateTo && txDate > new Date(dateTo).setHours(0, 0, 0, 0)) matchDate = false;
      }

      return matchSearch && matchType && matchStatus && matchCurrency && matchDate;
    });
  }, [search, type, status, currency, dateFrom, dateTo, transactions]);

  // Paginated transactions
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  const handleReset = () => {
    setSearch("");
    setType("all");
    setStatus("all");
    setCurrency("all");
    setDateFrom("");
    setDateTo("");
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
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
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
          label="Total Amount"
          value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
            transactions.filter(t => t.status === 'Completed').reduce((sum, t) => sum + (t.amount || 0), 0)
          )}
          change=""
          icon={Coins}
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
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
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
        onViewDetails={(tx) => setSelectedTransactionForDetails(tx)}
      />

      <TransactionDetailsModal
        isOpen={!!selectedTransactionForDetails}
        onClose={() => setSelectedTransactionForDetails(null)}
        transaction={selectedTransactionForDetails}
      />
    </AdminShell>
  );
}
