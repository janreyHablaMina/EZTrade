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
import { GenericFilters, FilterConfig } from "@/components/admin/GenericFilters";
import { DepositsTable } from "@/components/admin/deposits/DepositsTable";
import { DepositDetailsModal } from "@/components/admin/deposits/DepositDetailsModal";
import { GenericFloatingActions } from "@/components/admin/GenericFloatingActions";
import { usePagination } from "@/hooks/usePagination";
import { useTableSelection } from "@/hooks/useTableSelection";
import { webApi } from "@/lib/api";
import { useApi } from "@/hooks/useApi";

export default function DepositsPage() {
  const [params, setParams] = useState<Record<string, string>>({
    search: '', status: 'all', network: 'all', currency: 'all', dateFrom: '', dateTo: ''
  });
  const { data: depositsData, isLoading, mutate: mutateDeposits } = useApi('/deposits');
  const [selectedDepositForDetails, setSelectedDepositForDetails] = useState<any | null>(null);

  const handleResetFilters = () => {
    setParams({ search: '', status: 'all', network: 'all', currency: 'all', dateFrom: '', dateTo: '' });
  };

  const deposits = useMemo<any[]>(() => {
    if (!depositsData) return [];
    return depositsData.map((d: any) => ({
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
        hour: '2-digit', minute: '2-digit',
        timeZone: 'UTC'
      }),
      createdAt: d.created_at,
    }));
  }, [depositsData]);

  // Apply filters live on state change
  const filteredDeposits = useMemo(() => {
    return deposits.filter((deposit) => {
      const search = params.search?.toLowerCase() || '';
      const matchSearch =
        !search ||
        deposit.userName?.toLowerCase().includes(search) ||
        deposit.userEmail?.toLowerCase().includes(search) ||
        deposit.id?.toLowerCase().includes(search) ||
        deposit.txid?.toLowerCase().includes(search);

      const status = params.status || 'all';
      const network = params.network || 'all';
      const currency = params.currency || 'all';

      const matchStatus = status === "all" || deposit.status === status;
      const matchNetwork = network === "all" || deposit.network === network;
      const matchCurrency = currency === "all" || deposit.currency === currency;

      const dateFrom = params.dateFrom;
      const dateTo = params.dateTo;
      let matchDate = true;
      if (dateFrom || dateTo) {
        const depositDate = new Date(deposit.createdAt).setHours(0, 0, 0, 0);
        if (dateFrom && depositDate < new Date(dateFrom).setHours(0, 0, 0, 0)) matchDate = false;
        if (dateTo && depositDate > new Date(dateTo).setHours(0, 0, 0, 0)) matchDate = false;
      }

      return matchSearch && matchStatus && matchNetwork && matchCurrency && matchDate;
    });
  }, [params, deposits]);

  const updateFilter = (key: string, value: string) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const filterConfig = useMemo<FilterConfig[]>(() => [
    { type: 'search', key: 'search', placeholder: 'Search by user, email, txid...' },
    { 
      type: 'select', 
      key: 'status', 
      defaultLabel: 'All Statuses',
      options: [
        { label: 'Pending', value: 'Pending' },
        { label: 'Approved', value: 'Approved' },
        { label: 'Rejected', value: 'Rejected' }
      ]
    },
    { 
      type: 'select', 
      key: 'network', 
      defaultLabel: 'All Networks',
      options: [
        { label: 'TRC20', value: 'TRC20' },
        { label: 'ERC20', value: 'ERC20' },
        { label: 'BEP20', value: 'BEP20' }
      ]
    },
    { type: 'dateRange', fromKey: 'dateFrom', toKey: 'dateTo' }
  ], []);

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
      await mutateDeposits();
    } catch (e) {
      console.error('Failed to approve deposit', e);
    }
  };

  const handleReject = async (deposit: any) => {
    try {
      await webApi.patch(`/deposits/${deposit.dbId}`, { status: 'Rejected' });
      await mutateDeposits();
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
      await mutateDeposits();
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
      await mutateDeposits();
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

        {/* Filters */}
        <GenericFilters
          config={filterConfig}
          params={params}
          updateFilter={updateFilter}
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
