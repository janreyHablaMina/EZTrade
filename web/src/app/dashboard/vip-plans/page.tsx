"use client";

import { useState, useMemo, useEffect } from "react";
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
import { initialVipPlans } from "@/components/admin/vip-plans/vipPlansData";
import type { VipPlan } from "@/components/admin/vip-plans/vipPlansData";
import { VipPlansFilters } from "@/components/admin/vip-plans/VipPlansFilters";
import { VipPlansTable } from "@/components/admin/vip-plans/VipPlansTable";
import { AddPlanModal } from "@/components/admin/vip-plans/AddPlanModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ViewPlanModal } from "@/components/admin/vip-plans/ViewPlanModal";

export default function VipPlansPage() {
  const [plansList, setPlansList] = useState<VipPlan[]>(initialVipPlans);
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

  // Applied filters state
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Apply filters logic
  const filteredPlans = useMemo(() => {
    return plansList.filter((plan) => {
      const matchSearch =
        !filters.search ||
        plan.level.toLowerCase().includes(filters.search.toLowerCase());

      const matchStatus = filters.status === "all" || plan.status === filters.status;

      return matchSearch && matchStatus;
    });
  }, [plansList, filters]);

  // Paginated plans
  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPlans.slice(start, start + pageSize);
  }, [filteredPlans, currentPage, pageSize]);

  const handleFilter = () => {
    setFilters({
      search,
      status,
    });
    setCurrentPage(1);
  };

  const handleSavePlan = (data: any) => {
    if (editingPlan) {
      const updatedPlans = plansList.map(plan => {
        if (plan.id === editingPlan.id) {
          return {
            ...plan,
            level: data.level || plan.level,
            minDeposit: Number(data.minDeposit),
            maxDeposit: Number(data.maxDeposit),
            dailyProfitPercent: Number(data.dailyProfitPercent),
            dailyProfitUsdtMin: Number(data.minDeposit) * (Number(data.dailyProfitPercent) / 100),
            dailyProfitUsdtMax: Number(data.maxDeposit) * (Number(data.dailyProfitPercent) / 100),
            durationDays: Number(data.durationDays),
          };
        }
        return plan;
      });
      setPlansList(updatedPlans);
      setToastMessage("Edited successfully");
    } else {
      const newPlan: VipPlan = {
        id: `VP${plansList.length + 1}`,
        level: data.level || `VIP ${plansList.length + 1}`,
        minDeposit: Number(data.minDeposit),
        maxDeposit: Number(data.maxDeposit),
        dailyProfitPercent: Number(data.dailyProfitPercent),
        dailyProfitUsdtMin: Number(data.minDeposit) * (Number(data.dailyProfitPercent) / 100),
        dailyProfitUsdtMax: Number(data.maxDeposit) * (Number(data.dailyProfitPercent) / 100),
        durationDays: Number(data.durationDays),
        totalUsers: 0,
        status: "Active",
      } as VipPlan; // forcefully cast to ignore missing planName if we completely stripped it in VipPlan type
      setPlansList([newPlan, ...plansList]);
      setToastMessage("VIP Plan successfully created");
    }
    setEditingPlan(null);
  };

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setIsAddPlanOpen(true);
  };

  const handleOpenEdit = (plan: VipPlan) => {
    setEditingPlan(plan);
    setIsAddPlanOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!planToDelete) return;
    setIsDeleting(true);
    
    // Simulate network delay
    setTimeout(() => {
      setPlansList(plansList.filter(p => p.id !== planToDelete.id));
      setToastMessage("Deleted successfully");
      setIsDeleting(false);
      setPlanToDelete(null);
    }, 600);
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
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.04] cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
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
          value="12,364"
          subtext="Across all VIP plans"
          icon={Users}
        />
        <KpiCard
          label="Total Deposited"
          value="$1,234,567.89"
          subtext="From all VIP plans"
          icon={Wallet}
        />
        <KpiCard
          label="Total Earnings Paid"
          value="$345,678.90"
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
        onFilter={handleFilter}
      />

      {/* VIP Plans Table Card */}
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
      />

      <AddPlanModal 
        isOpen={isAddPlanOpen} 
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
