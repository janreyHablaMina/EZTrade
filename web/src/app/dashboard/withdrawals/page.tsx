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
import { WithdrawalsTable } from "@/components/admin/withdrawals/WithdrawalsTable";
import { GenericFloatingActions } from "@/components/admin/GenericFloatingActions";
import { usePagination } from "@/hooks/usePagination";
import { useTableSelection } from "@/hooks/useTableSelection";
import { webApi } from "@/lib/api";
import { useApi } from "@/hooks/useApi";

export default function WithdrawalsPage() {
  const [params, setParams] = useState<Record<string, string>>({
    search: '', status: 'all', network: 'all', currency: 'all', dateFrom: '', dateTo: ''
  });
  const { data: withdrawalsData, isLoading, mutate: mutateWithdrawals } = useApi('/withdrawals');

  const withdrawals = useMemo<any[]>(() => {
    if (!withdrawalsData) return [];
    return withdrawalsData.map((w: any) => ({
      id: `WDL-${w.id.toString().padStart(6, '0')}`,
      dbId: w.id,
      userName: w.user ? w.user.name : 'Unknown',
      userEmail: w.user ? w.user.email : 'Unknown',
      userId: w.user ? `EZT-${w.user.id.toString().padStart(4, '0')}` : 'N/A',
      amount: parseFloat(w.amount),
      fee: parseFloat(w.amount) * 0.02,
      receiveAmount: parseFloat(w.amount) * 0.98,
      currency: 'USDT',
      network: w.network,
      walletAddress: w.wallet_address || 'Pending',
      status: w.status,
      submittedAt: new Date(w.created_at).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }),
      createdAt: w.created_at,
    }));
  }, [withdrawalsData]);

  // Apply filters logic
  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter((withdrawal) => {
      const search = params.search?.toLowerCase() || '';
      const matchSearch =
        !search ||
        withdrawal.userName.toLowerCase().includes(search) ||
        withdrawal.userEmail.toLowerCase().includes(search) ||
        withdrawal.id.toLowerCase().includes(search) ||
        withdrawal.walletAddress.toLowerCase().includes(search);

      const status = params.status || 'all';
      const network = params.network || 'all';
      const currency = params.currency || 'all';

      const matchStatus = status === "all" || withdrawal.status === status;
      const matchNetwork = network === "all" || withdrawal.network === network;
      const matchCurrency = currency === "all" || withdrawal.currency === currency;

      const dateFrom = params.dateFrom;
      const dateTo = params.dateTo;
      let matchDate = true;
      if (dateFrom || dateTo) {
        const withdrawalDate = new Date(withdrawal.createdAt).setHours(0, 0, 0, 0);
        if (dateFrom && withdrawalDate < new Date(dateFrom).setHours(0, 0, 0, 0)) matchDate = false;
        if (dateTo && withdrawalDate > new Date(dateTo).setHours(0, 0, 0, 0)) matchDate = false;
      }

      return matchSearch && matchStatus && matchNetwork && matchCurrency && matchDate;
    });
  }, [params, withdrawals]);

  const updateFilter = (key: string, value: string) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setParams({ search: '', status: 'all', network: 'all', currency: 'all', dateFrom: '', dateTo: '' });
  };

  const filterConfig = useMemo<FilterConfig[]>(() => [
    { type: 'search', key: 'search', placeholder: 'Search by user, email, txid...' },
    { 
      type: 'select', 
      key: 'status', 
      defaultLabel: 'All Statuses',
      options: [
        { label: 'Pending', value: 'Pending' },
        { label: 'Completed', value: 'Completed' },
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

  const handleApprove = async (withdrawal: any) => {
    try {
      await webApi.patch(`/withdrawals/${withdrawal.dbId}`, { status: 'Completed' });
      await mutateWithdrawals();
    } catch (e) {
      console.error('Failed to approve withdrawal', e);
    }
  };

  const handleReject = async (withdrawal: any) => {
    try {
      await webApi.patch(`/withdrawals/${withdrawal.dbId}`, { status: 'Rejected' });
      await mutateWithdrawals();
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
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-7">
        <KpiCard
          label="Total Withdrawals"
          value={withdrawals.length.toLocaleString()}
          change=""
          icon={Download}
        />
        <KpiCard
          label="Total Amount"
          value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
            withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0)
          )}
          change=""
          icon={Coins}
        />
        <KpiCard
          label="Total Fees"
          value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
            withdrawals.reduce((sum, w) => sum + ((w.amount || 0) * 0.02), 0)
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

      {/* Filters */}
      <GenericFilters
        config={filterConfig}
        params={params}
        updateFilter={updateFilter}
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
