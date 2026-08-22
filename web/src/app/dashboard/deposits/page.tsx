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
import { DepositsFilters } from "@/components/admin/deposits/DepositsFilters";
import { DepositsTable } from "@/components/admin/deposits/DepositsTable";
import { DepositDetailsModal } from "@/components/admin/deposits/DepositDetailsModal";
import { GenericFloatingActions } from "@/components/admin/GenericFloatingActions";
import { usePagination } from "@/hooks/usePagination";
import { useTableSelection } from "@/hooks/useTableSelection";
import { webApi } from "@/lib/api";

export default function DepositsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [network, setNetwork] = useState("all");
  const [currency, setCurrency] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [deposits, setDeposits] = useState<any[]>([]);
  const [selectedDepositForDetails, setSelectedDepositForDetails] = useState<any | null>(null);

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setNetwork("all");
    setCurrency("all");
    setDateFrom("");
    setDateTo("");
  };

  const fetchDeposits = async () => {
    try {
      const data = await webApi.get('/deposits');
      const mapped = data.map((d: any) => ({
        id: `DEP-${d.id.toString().padStart(6, '0')}`,
        dbId: d.id,
        userName: d.user ? d.user.name : 'Unknown',
        userEmail: d.user ? d.user.email : 'Unknown',
        userId: d.user ? `EZT-${d.user.id.toString().padStart(4, '0')}` : 'N/A',
        amount: parseFloat(d.amount),
        currency: 'USDT',
        network: d.network,
        txid: d.txid,
        status: d.status,
        submittedAt: new Date(d.created_at).toLocaleString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        createdAt: d.created_at,
      }));
      setDeposits(mapped);
    } catch (e) {
      console.error('Failed to fetch deposits:', e);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  // Apply filters live on state change
  const filteredDeposits = useMemo(() => {
    return deposits.filter((deposit) => {
      const matchSearch =
        !search ||
        deposit.userName?.toLowerCase().includes(search.toLowerCase()) ||
        deposit.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
        deposit.id?.toLowerCase().includes(search.toLowerCase()) ||
        deposit.txid?.toLowerCase().includes(search.toLowerCase());

      const matchStatus = status === "all" || deposit.status === status;
      const matchNetwork = network === "all" || deposit.network === network;
      const matchCurrency = currency === "all" || deposit.currency === currency;

      let matchDate = true;
      if (dateFrom || dateTo) {
        const depositDate = new Date(deposit.createdAt).setHours(0, 0, 0, 0);
        if (dateFrom && depositDate < new Date(dateFrom).setHours(0, 0, 0, 0)) matchDate = false;
        if (dateTo && depositDate > new Date(dateTo).setHours(0, 0, 0, 0)) matchDate = false;
      }

      return matchSearch && matchStatus && matchNetwork && matchCurrency && matchDate;
    });
  }, [search, status, network, currency, dateFrom, dateTo, deposits]);

  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    paginatedItems: paginatedDeposits,
    totalCount
  } = usePagination(filteredDeposits, 10);

  const {
    selectedIds,
    setSelectedIds,
    toggleSelectAll,
    toggleSelectRow,
    clearSelection
  } = useTableSelection(paginatedDeposits);



  const handleVerify = async (deposit: any) => {
    try {
      await webApi.patch(`/deposits/${deposit.dbId}`, { status: 'Approved' });
      fetchDeposits();
    } catch (e) {
      console.error('Failed to approve deposit', e);
    }
  };

  const handleReject = async (deposit: any) => {
    try {
      await webApi.patch(`/deposits/${deposit.dbId}`, { status: 'Rejected' });
      fetchDeposits();
    } catch (e) {
      console.error('Failed to reject deposit', e);
    }
  };

  const handleBulkVerify = async () => {
    const depositsToProcess = deposits.filter(
      (d) => selectedIds.includes(d.id) && d.status === "Pending"
    );

    if (depositsToProcess.length === 0) {
      clearSelection();
      return;
    }

    try {
      await Promise.all(
        depositsToProcess.map((d) =>
          webApi.patch(`/deposits/${d.dbId}`, { status: 'Approved' })
        )
      );
      fetchDeposits();
      clearSelection();
    } catch (e) {
      console.error('Failed to bulk verify deposits', e);
    }
  };

  const handleBulkReject = async () => {
    const depositsToProcess = deposits.filter(
      (d) => selectedIds.includes(d.id) && d.status === "Pending"
    );

    if (depositsToProcess.length === 0) {
      clearSelection();
      return;
    }

    try {
      await Promise.all(
        depositsToProcess.map((d) =>
          webApi.patch(`/deposits/${d.dbId}`, { status: 'Rejected' })
        )
      );
      fetchDeposits();
      clearSelection();
    } catch (e) {
      console.error('Failed to bulk reject deposits', e);
    }
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
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard
          label="Total Deposits"
          value={deposits.length.toLocaleString()}
          change=""
          icon={Download}
        />
        <KpiCard
          label="Total Amount"
          value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
            deposits.filter(d => d.status === 'Approved').reduce((sum, d) => sum + (d.amount || 0), 0)
          )}
          change=""
          icon={Coins}
        />
        <KpiCard
          label="Completed"
          value={deposits.filter(d => d.status === 'Approved').length.toLocaleString()}
          change=""
          icon={CheckCircle2}
          iconClassName="text-success"
        />
        <KpiCard
          label="Pending"
          value={deposits.filter(d => d.status === 'Pending').length.toLocaleString()}
          change=""
          positive={false}
          icon={Clock}
          iconClassName="text-warning"
        />
        <KpiCard
          label="Failed"
          value={deposits.filter(d => d.status === 'Rejected').length.toLocaleString()}
          change=""
          positive={true}
          icon={XCircle}
          iconClassName="text-danger"
        />
        <KpiCard
          label="Success Rate"
          value={
            deposits.length > 0 
              ? ((deposits.filter(d => d.status === 'Approved').length / deposits.length) * 100).toFixed(2) + '%'
              : '0.00%'
          }
          change=""
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
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        onReset={handleResetFilters}
      />

      {/* Deposits Table Card */}
      <DepositsTable
        deposits={filteredDeposits}
        paginatedDeposits={paginatedDeposits}
        totalCount={filteredDeposits.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        selectedIds={selectedIds}
        toggleSelectAll={toggleSelectAll}
        toggleSelectRow={toggleSelectRow}
        onViewDetails={(dep) => setSelectedDepositForDetails(dep)}
        onVerify={handleVerify}
        onReject={handleReject}
      />

      <GenericFloatingActions
        selectedCount={selectedIds.length}
        onClear={clearSelection}
      >
        <button
          type="button"
          onClick={handleBulkVerify}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-success/30 bg-success/10 text-success hover:bg-success/20 transition cursor-pointer text-xs font-medium"
        >
          <CheckCircle2 className="h-3.5 w-3.5" /> Verify Selected
        </button>
        <button
          type="button"
          onClick={handleBulkReject}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-danger/30 bg-danger/10 text-danger hover:bg-danger/20 transition cursor-pointer text-xs font-medium"
        >
          <XCircle className="h-3.5 w-3.5" /> Reject Selected
        </button>
      </GenericFloatingActions>

      <DepositDetailsModal
        isOpen={!!selectedDepositForDetails}
        onClose={() => setSelectedDepositForDetails(null)}
        deposit={selectedDepositForDetails}
      />
    </AdminShell>
  );
}
