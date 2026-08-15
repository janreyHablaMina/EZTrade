"use client";

import { useState, useMemo } from "react";
import {
  Crown,
  Percent,
  Users,
  Wallet,
  Coins,
  Plus,
  Download,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { initialVipPlans } from "@/components/admin/vip-plans/vipPlansData";
import type { VipPlan } from "@/components/admin/vip-plans/vipPlansData";
import { VipPlansFilters } from "@/components/admin/vip-plans/VipPlansFilters";
import { VipPlansTable } from "@/components/admin/vip-plans/VipPlansTable";

export default function VipPlansPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  // Applied filters state
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Apply filters logic
  const filteredPlans = useMemo(() => {
    return initialVipPlans.filter((plan) => {
      const matchSearch =
        !filters.search ||
        plan.planName.toLowerCase().includes(filters.search.toLowerCase()) ||
        plan.level.toLowerCase().includes(filters.search.toLowerCase());

      const matchStatus = filters.status === "all" || plan.status === filters.status;

      return matchSearch && matchStatus;
    });
  }, [filters]);

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
          value="10"
          subtext="Active VIP Plans"
          icon={Crown}
        />
        <KpiCard
          label="Active Plans"
          value="10"
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
        totalCount={initialVipPlans.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        onEdit={(plan) => console.log("Edit plan:", plan.id, plan.planName)}
        onDuplicate={(plan) => console.log("Duplicate plan:", plan.id, plan.planName)}
        onDelete={(plan) => console.log("Delete plan:", plan.id, plan.planName)}
      />
    </AdminShell>
  );
}
