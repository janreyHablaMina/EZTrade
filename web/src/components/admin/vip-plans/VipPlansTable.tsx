import {
  Edit2,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import type { VipPlan } from "./vipPlansData";
import { vipPlanBadgeStyles } from "./vipPlansData";

type VipPlansTableProps = {
  plans: VipPlan[];
  paginatedPlans: VipPlan[];
  totalCount: number;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  pageSize: number;
  setPageSize: (s: number) => void;
  onEdit?: (plan: VipPlan) => void;
  onDuplicate?: (plan: VipPlan) => void;
  onDelete?: (plan: VipPlan) => void;
};

export function VipPlansTable({
  plans,
  paginatedPlans,
  totalCount,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  onEdit,
  onDuplicate,
  onDelete,
}: VipPlansTableProps) {
  const totalPages = Math.max(1, Math.ceil(plans.length / pageSize));

  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-2">
              <th className="pb-3.5 pl-1 font-medium">Level</th>
              <th className="pb-3.5 font-medium">Plan Name</th>
              <th className="pb-3.5 font-medium">Min Deposit (USDT)</th>
              <th className="pb-3.5 font-medium">Max Deposit (USDT)</th>
              <th className="pb-3.5 font-medium">Daily Profit (%)</th>
              <th className="pb-3.5 font-medium">Daily Profit (USDT)</th>
              <th className="pb-3.5 font-medium">Duration (Days)</th>
              <th className="pb-3.5 font-medium">Total Users</th>
              <th className="pb-3.5 font-medium">Status</th>
              <th className="pb-3.5 font-medium text-right pr-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPlans.length > 0 ? (
              paginatedPlans.map((plan) => {
                return (
                  <tr
                    key={plan.id}
                    className="border-b border-border/45 last:border-0 hover:bg-white/[0.01] transition"
                  >
                    <td className="py-3.5 pl-1">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-[9px] font-semibold tracking-wider ${
                          vipPlanBadgeStyles[plan.level] || ""
                        }`}
                      >
                        {plan.level}
                      </span>
                    </td>
                    <td className="py-3.5 font-semibold text-white">
                      {plan.planName}
                    </td>
                    <td className="py-3.5 text-muted-2">
                      {plan.minDeposit.toLocaleString("en-US")}
                    </td>
                    <td className="py-3.5 text-muted-2">
                      {typeof plan.maxDeposit === "number"
                        ? plan.maxDeposit.toLocaleString("en-US")
                        : plan.maxDeposit}
                    </td>
                    <td className="py-3.5 font-semibold text-success">
                      {plan.dailyProfitPercent.toFixed(2)}%
                    </td>
                    <td className="py-3.5 text-muted-2">
                      {typeof plan.dailyProfitUsdtMax === "number"
                        ? `${plan.dailyProfitUsdtMin.toFixed(2)} - ${plan.dailyProfitUsdtMax.toFixed(2)}`
                        : `${plan.dailyProfitUsdtMin.toLocaleString("en-US", { minimumFractionDigits: 2 })}+`}
                    </td>
                    <td className="py-3.5 text-muted-2">
                      {plan.durationDays}
                    </td>
                    <td className="py-3.5 text-muted-2">
                      {plan.totalUsers.toLocaleString("en-US")}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex rounded-md px-2.5 py-0.5 text-[10px] font-semibold ${
                          plan.status === "Active"
                            ? "bg-success/15 text-success"
                            : "bg-white/[0.06] text-muted-2"
                        }`}
                      >
                        {plan.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-1">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={() => onEdit?.(plan)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card-elevated text-purple-bright hover:bg-purple/10 hover:border-purple-bright/35 transition cursor-pointer"
                          aria-label="Edit Plan"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDuplicate?.(plan)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card-elevated text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer"
                          aria-label="Duplicate Plan"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete?.(plan)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-danger/25 bg-card-elevated text-danger hover:bg-danger/10 hover:border-danger/45 transition cursor-pointer"
                          aria-label="Delete Plan"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="py-8 text-center text-muted-2">
                  No plans found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Pagination */}
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-2 border-t border-border/45 pt-4">
        <div>
          Showing {plans.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(currentPage * pageSize, plans.length)} of{" "}
          <span className="text-white font-medium">
            {plans.length}
          </span>{" "}
          plans
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card-elevated text-muted hover:text-white transition disabled:opacity-40 disabled:hover:text-muted cursor-pointer disabled:cursor-not-allowed"
              aria-label="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-purple border-purple-bright/35 text-white shadow-[0_4px_12px_rgba(123,44,255,0.3)]"
                      : "border-border bg-card-elevated text-muted hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card-elevated text-muted hover:text-white transition disabled:opacity-40 disabled:hover:text-muted cursor-pointer disabled:cursor-not-allowed"
              aria-label="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 rounded-lg border border-border bg-card-elevated pl-2.5 pr-8 text-xs text-white outline-none focus:border-border-strong transition appearance-none cursor-pointer"
              >
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2 h-4 w-4 text-muted-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
