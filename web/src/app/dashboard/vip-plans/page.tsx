"use client";

import { useState, useMemo, useEffect } from "react";
import { webApi } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import {
  Crown,
  Percent,
  Users,
  Wallet,
  Coins,
  Plus,
  Download,
  CheckCircle2,
  X,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import type { VipPlan } from "@/types/admin";
import { VipPlansFilters } from "@/components/admin/vip-plans/VipPlansFilters";
import { VipPlansTable } from "@/components/admin/vip-plans/VipPlansTable";
import { AddPlanModal } from "@/components/admin/vip-plans/AddPlanModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ViewPlanModal } from "@/components/admin/vip-plans/ViewPlanModal";
import { useTableSelection } from "@/hooks/useTableSelection";
import { GenericFloatingActions } from "@/components/admin/GenericFloatingActions";

export default function VipPlansPage() {
  const { data: plansData, isLoading: isLoadingPlans, mutate: mutatePlans } = useApi("/vip-plans");
  const { data: statsData, mutate: mutateStats } = useApi("/vip-plans/stats");

  const plansList = useMemo<VipPlan[]>(() => {
    if (!plansData) return [];
    return plansData.map((p: any) => ({
      id: `VP${p.id}`,
      level: p.level,
      minDeposit: Number(p.min_deposit),
      dailyProfitPercent: Number(p.daily_profit_percent),
      dailyProfitUsdtMin: Number(p.min_deposit) * (Number(p.daily_profit_percent) / 100),
      durationDays: Number(p.duration_days),
      totalUsers: p.users_count || 0,
      status: p.status,
    })).sort((a: VipPlan, b: VipPlan) => a.minDeposit - b.minDeposit);
  }, [plansData]);

  const stats = useMemo(() => {
    if (!statsData) return { investors: 0, deposited: 0, earnings: 0 };
    return {
      investors: statsData.total_investors || 0,
      deposited: statsData.total_deposited || 0,
      earnings: statsData.total_earnings_paid || 0
    };
  }, [statsData]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [editingPlan, setEditingPlan] = useState<VipPlan | null>(null);
  
  // View state
  const [viewingPlan, setViewingPlan] = useState<VipPlan | null>(null);

  // Deletion states
  const [planToDelete, setPlanToDelete] = useState<VipPlan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Apply filters logic
  const filteredPlans = useMemo(() => {
    return plansList.filter((plan) => {
      const matchSearch =
        !search ||
        plan.level.toString().toLowerCase().includes(search.toLowerCase());

      const matchStatus = status === "all" || plan.status === status;

      return matchSearch && matchStatus;
    });
  }, [plansList, search, status]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Paginated plans
  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredPlans.slice(start, end);
  }, [filteredPlans, currentPage, pageSize]);

  // Table selection
  const {
    selectedIds,
    toggleSelectAll,
    toggleSelectRow,
    clearSelection,
  } = useTableSelection(paginatedPlans);

  const handleClear = () => {
    setSearch("");
    setStatus("all");
    setCurrentPage(1);
  };

  const handleSavePlan = (data: any) => {
    if (editingPlan) {
      const dbId = parseInt(editingPlan.id.replace('VP', ''));
      webApi.patch(`/vip-plans/${dbId}`, {
        level: data.level || editingPlan.level,
        min_deposit: Number(data.minDeposit),
        daily_profit_percent: Number(data.dailyProfitPercent),
        duration_days: Number(data.durationDays),
      }).then(async () => {
        await mutatePlans();
        setToastMessage("VIP Plan edited successfully");
      }).catch(err => {
        console.error("Failed to edit VIP plan:", err);
        setToastMessage("Error editing plan");
      });
    } else {
      // Create new plan via API
      webApi.post("/vip-plans", {
        level: data.level || `VIP ${plansList.length + 1}`,
        min_deposit: Number(data.minDeposit),
        daily_profit_percent: Number(data.dailyProfitPercent),
        duration_days: Number(data.durationDays),
        status: "Active"
      }).then(async () => {
        await mutatePlans();
        setToastMessage("VIP Plan successfully created");
      }).catch(err => {
        console.error(err);
        setToastMessage("Error creating plan");
      });
    }
    setEditingPlan(null);
  };

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setIsAddPlanOpen(true);
  };

  const handleOpenEdit = (plan: VipPlan) => {
    setEditingPlan(plan);
  };

  const handleToggleStatus = async (plan: VipPlan) => {
    try {
      const realId = parseInt(plan.id.replace('VP', ''));
      const newStatus = plan.status === "Active" ? "Inactive" : "Active";
      await webApi.patch(`/vip-plans/${realId}`, { status: newStatus });
      await mutatePlans();
      setToastMessage(`Plan ${newStatus === "Active" ? "activated" : "deactivated"} successfully`);
    } catch (err) {
      console.error("Failed to toggle plan status:", err);
      setToastMessage("Failed to update status");
    }
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;
    setIsDeleting(true);
    
    try {
      const realId = parseInt(planToDelete.id.replace('VP', ''));
      await webApi.delete(`/vip-plans/${realId}`);
      
      await mutatePlans();
      await mutateStats();
      setToastMessage("Deleted successfully");
    } catch (err) {
      console.error("Failed to delete plan", err);
      setToastMessage("Failed to delete plan");
    } finally {
      setIsDeleting(false);
      setPlanToDelete(null);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) return;
    
    try {
      const realIds = selectedIds.map(id => parseInt(id.replace('VP', '')));
      
      switch (action) {
        case 'delete':
          await Promise.all(realIds.map(id => webApi.delete(`/vip-plans/${id}`)));
          setToastMessage(`Successfully deleted ${selectedIds.length} plans`);
          break;
        case 'activate':
          await Promise.all(realIds.map(id => webApi.patch(`/vip-plans/${id}`, { status: 'Active' })));
          setToastMessage(`Successfully activated ${selectedIds.length} plans`);
          break;
        case 'deactivate':
          await Promise.all(realIds.map(id => webApi.patch(`/vip-plans/${id}`, { status: 'Inactive' })));
          setToastMessage(`Successfully deactivated ${selectedIds.length} plans`);
          break;
      }
      
      await mutatePlans();
      await mutateStats();
      clearSelection();
    } catch (err) {
      console.error("Bulk action failed:", err);
      setToastMessage("Failed to perform bulk action");
    }
  };

  return (
    <AdminShell>
      {/* Top Header section */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            VIP Plans
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-2">
            <span>Dashboard</span>
            <span className="text-[10px] text-muted-2/65">&gt;</span>
            <span className="text-muted">VIP Plans</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-xl bg-purple hover:bg-purple-bright px-3.5 py-2 text-xs font-semibold text-white transition shadow-[0_8px_20px_rgba(123,44,255,0.3)] hover:shadow-[0_8px_20px_rgba(123,44,255,0.45)] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add New Plan
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <KpiCard
          label="Total Plans"
          value={plansList.length.toString()}
          subtext="Active VIP Plans"
          icon={Crown}
        />
        <KpiCard
          label="Active Plans"
          value={plansList.filter(p => p.status === 'Active').length.toString()}
          subtext="100% of total plans"
          icon={Percent}
          iconClassName="text-success"
        />
        <KpiCard
          label="Total Investors"
          value={stats.investors.toLocaleString()}
          subtext="Across all VIP plans"
          icon={Users}
        />
        <KpiCard
          label="Total Deposited"
          value={`$${stats.deposited.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext="From all VIP plans"
          icon={Wallet}
        />
        <KpiCard
          label="Total Earnings Paid"
          value={`$${stats.earnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext="Across all VIP plans"
          icon={Coins}
        />
      </div>

      {/* Filters Card */}
      <VipPlansFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        onClear={handleClear}
      />

      <GenericFloatingActions
        selectedCount={selectedIds.length}
        onClearSelection={clearSelection}
      >
        <button
          type="button"
          onClick={() => handleBulkAction("activate")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white/[0.05] hover:bg-white/[0.08] transition cursor-pointer text-xs font-medium"
        >
          <span>✓</span> Activate Selected
        </button>
        <button
          type="button"
          onClick={() => handleBulkAction("deactivate")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white/[0.05] hover:bg-white/[0.08] transition cursor-pointer text-xs font-medium"
        >
          <span>⏸</span> Deactivate Selected
        </button>
        <button
          type="button"
          onClick={() => handleBulkAction("delete")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-danger/10 text-danger hover:bg-danger/20 transition cursor-pointer text-xs font-medium"
        >
          <span>🗑️</span> Delete Selected
        </button>
      </GenericFloatingActions>

      {/* VIP Plans Table Card */}
      {isLoadingPlans ? (
        <div className="py-8 text-center text-muted-2">Loading plans...</div>
      ) : (
        <VipPlansTable
          plans={filteredPlans}
          paginatedPlans={paginatedPlans}
          totalCount={filteredPlans.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          onEdit={handleOpenEdit}
          onView={(plan) => setViewingPlan(plan)}
          onDelete={(plan) => setPlanToDelete(plan)}
          onToggleStatus={handleToggleStatus}
          selectedIds={selectedIds}
          onSelectAll={toggleSelectAll}
          onSelectOne={toggleSelectRow}
        />
      )}

      <AddPlanModal 
        isOpen={isAddPlanOpen || !!editingPlan} 
        onClose={() => {
          setIsAddPlanOpen(false);
          setEditingPlan(null);
        }} 
        onSave={handleSavePlan}
        initialData={editingPlan}
      />

      <ViewPlanModal
        isOpen={!!viewingPlan}
        onClose={() => setViewingPlan(null)}
        plan={viewingPlan}
      />
      
      <ConfirmModal 
        isOpen={!!planToDelete}
        onClose={() => setPlanToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete VIP Plan"
        description={`Are you sure you want to delete ${planToDelete?.level}? This action cannot be undone.`}
        confirmText="Delete Plan"
        isDestructive={true}
        isLoading={isDeleting}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-center gap-3 rounded-xl border border-success/20 bg-card p-4 shadow-[0_10px_40px_rgba(34,197,94,0.15)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Success</p>
              <p className="text-xs text-muted-2">{toastMessage}</p>
            </div>
            <button 
              onClick={() => setToastMessage("")}
              className="ml-4 text-muted hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
